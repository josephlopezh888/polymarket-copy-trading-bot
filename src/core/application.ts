/**
 * Application Bootstrap
 * Handles application initialization and lifecycle
 */

import { AppConfig } from '../config';
import { MarketApiClient } from '../clients/market-api-client';
import { PositionTracker } from '../tracking/position-tracker';
import { StrategyExecutor } from '../execution/strategy-executor';
import { TradingStatus, CopyTradingStatus } from '../types';
import { logger } from '../utils/logger';

/**
 * Application class that manages the bot lifecycle
 */
export class Application {
  private monitor?: PositionTracker | StrategyExecutor;
  private client: MarketApiClient;
  private config: AppConfig;
  private shutdownHandlers: Array<() => void> = [];

  constructor(config: AppConfig) {
    this.config = config;
    this.client = new MarketApiClient({
      apiKey: config.api.apiKey,
      baseUrl: config.api.baseUrl,
      dataApiUrl: config.api.dataApiUrl,
      gammaApiUrl: config.api.gammaApiUrl,
      clobApiUrl: config.api.clobApiUrl,
    });
  }

  /**
   * Initialize and start the application
   */
  async start(): Promise<void> {
    try {
      logger.info('🚀 Starting Polymarket Copy Trading Bot...');
      logger.info(`📊 Target address: ${this.config.targetAddress}`);

      if (this.config.copyTrading.enabled) {
        await this.startCopyTrading();
      } else {
        await this.startMonitoring();
      }

      this.setupShutdownHandlers();
      logger.info('✅ Application started successfully');
    } catch (error) {
      logger.error('❌ Failed to start application', error);
      throw error;
    }
  }

  /**
   * Start copy trading mode
   */
  private async startCopyTrading(): Promise<void> {
    const { copyTrading, monitoring } = this.config;

    logger.info(`🔍 Dry run mode: ${copyTrading.dryRun ? 'ENABLED' : 'DISABLED'}`);
    logger.info(`💰 Position size multiplier: ${copyTrading.positionSizeMultiplier}x`);

    const strategyExecutor = new StrategyExecutor(
      this.client,
      {
        targetAddress: this.config.targetAddress,
        pollInterval: monitoring.pollInterval,
        enableWebSocket: monitoring.enableWebSocket,
        onUpdate: (status: TradingStatus) => {
          const tracker = strategyExecutor.getPositionTracker();
          logger.info(tracker.getFormattedStatus(status));
        },
        onError: (error: Error) => {
          logger.error('Monitor error', error);
        },
      },
      {
        enabled: true,
        privateKey: copyTrading.privateKey,
        dryRun: copyTrading.dryRun,
        positionSizeMultiplier: copyTrading.positionSizeMultiplier,
        maxPositionSize: copyTrading.maxPositionSize,
        maxTradeSize: copyTrading.maxTradeSize,
        minTradeSize: copyTrading.minTradeSize,
        slippageTolerance: copyTrading.slippageTolerance,
        chainId: this.config.chain.chainId,
        clobHost: this.config.chain.clobHost,
        onTradeExecuted: (result) => {
          this.handleTradeExecuted(result);
        },
        onTradeError: (error, position) => {
          logger.error(
            `Trade error for position ${position.id}`,
            error,
            { market: position.market.question }
          );
        },
      }
    );

    this.monitor = strategyExecutor;
    await strategyExecutor.start();
  }

  /**
   * Start monitoring only mode
   */
  private async startMonitoring(): Promise<void> {
    logger.info('📊 Starting Account Monitor (copy trading disabled)...');
    logger.info(`⏱️  Polling interval: ${this.config.monitoring.pollInterval / 1000} seconds`);

    const tracker = new PositionTracker(this.client, {
      targetAddress: this.config.targetAddress,
      pollInterval: this.config.monitoring.pollInterval,
      enableWebSocket: this.config.monitoring.enableWebSocket,
      onUpdate: (status: TradingStatus) => {
        logger.info(tracker.getFormattedStatus(status));
      },
      onError: (error: Error) => {
        logger.error('Monitor error', error);
      },
    });

    this.monitor = tracker;
    await tracker.start();
  }

  /**
   * Handle trade execution result
   */
  private handleTradeExecuted(result: {
    success: boolean;
    dryRun: boolean;
    orderId?: string;
    executedQuantity?: string;
    executedPrice?: string;
    position: { market: { question: string } };
  }): void {
    if (result.dryRun) {
      logger.info('✅ [DRY RUN] Trade would be executed:', {
        success: result.success,
        quantity: result.executedQuantity,
        price: result.executedPrice,
        market: result.position.market.question.substring(0, 50) + '...',
        note: 'No order ID - this is a simulation (no real order placed)',
      });
    } else {
      logger.info('✅ Trade executed successfully:', {
        success: result.success,
        orderId: result.orderId,
        quantity: result.executedQuantity,
        price: result.executedPrice,
        market: result.position.market.question.substring(0, 50) + '...',
      });
    }
  }

  /**
   * Setup graceful shutdown handlers
   */
  private setupShutdownHandlers(): void {
    const shutdown = (signal: string) => {
      logger.info(`\n🛑 Received ${signal}, shutting down gracefully...`);
      
      if (this.monitor instanceof StrategyExecutor) {
        const stats = this.monitor.getStats();
        logger.info('\n📊 Final Statistics:');
        logger.info(`   Total trades executed: ${stats.totalTradesExecuted}`);
        logger.info(`   Total trades failed: ${stats.totalTradesFailed}`);
        logger.info(`   Total volume: $${stats.totalVolume}`);
      }

      this.stop();
      process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    // Handle uncaught errors
    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught exception', error);
      this.stop();
      process.exit(1);
    });

    process.on('unhandledRejection', (reason: unknown) => {
      logger.error('Unhandled rejection', reason);
      this.stop();
      process.exit(1);
    });
  }

  /**
   * Stop the application
   */
  stop(): void {
    logger.info('Stopping application...');
    
    if (this.monitor) {
      this.monitor.stop();
    }

    // Execute all shutdown handlers
    this.shutdownHandlers.forEach(handler => {
      try {
        handler();
      } catch (error) {
        logger.error('Error in shutdown handler', error);
      }
    });

    logger.info('Application stopped');
  }

  /**
   * Register a shutdown handler
   */
  onShutdown(handler: () => void): void {
    this.shutdownHandlers.push(handler);
  }
}


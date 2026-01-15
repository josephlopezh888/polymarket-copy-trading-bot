/**
 * Application Main Entry Point
 * Handles CLI execution and error handling
 */

import { loadConfig, validateConfig } from '../config';
import { Application } from './application';
import { ConfigurationError } from '../utils/errors';
import { logger } from '../utils/logger';
import { initializeAesCipher } from '../utils/aes_cipher';

/**
 * Main application entry point
 */
export async function main(): Promise<void> {
  try {
    // Load and validate configuration
    const config = loadConfig();
    validateConfig(config);
    initializeAesCipher();

    // Create and start application
    const app = new Application(config);
    await app.start();

    // Keep process alive
    // The application will handle shutdown signals
  } catch (error) {
    if (error instanceof ConfigurationError) {
      logger.error('Configuration error', error);
      console.error(`\n❌ ${error.message}\n`);
    } else if (error instanceof Error) {
      logger.error('Application error', error);
      console.error(`\n❌ ${error.message}\n`);
    } else {
      logger.error('Unknown error', error);
      console.error('\n❌ An unknown error occurred\n');
    }
    
    process.exit(1);
  }
}


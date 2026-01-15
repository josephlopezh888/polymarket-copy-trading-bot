<div align="center">

# 🤖 Polymarket Copy Trading Bot

**Professional automated trading solution for Polymarket prediction markets**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Apache%202.0-yellow?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)](https://github.com/josephlopezh888/polymarket-copy-trading-bot)

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Support](#-support)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [How It Works](#-how-it-works)
- [Advanced Features](#-advanced-features)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [Support](#-support)
- [Disclaimer](#-disclaimer)

---

## 🎯 Overview

The **Polymarket Copy Trading Bot** is a production-ready, TypeScript-based automated trading solution designed for Polymarket prediction markets. It enables traders to automatically replicate successful trading strategies, monitor mempool activity, and execute trades with comprehensive risk management.

### Why Choose This Bot?

✨ **Enterprise-Grade** - Built with production-ready features including health monitoring, persistence, and graceful shutdown  
🛡️ **Risk Management** - Built-in position tracking, slippage protection, and exposure limits  
⚡ **Real-Time** - Hybrid monitoring using both mempool and Polymarket API for instant trade detection  
🔒 **Type-Safe** - Full TypeScript support with comprehensive type definitions  
🚀 **Easy Setup** - Get started in minutes with clear documentation and examples

---

## ✨ Features

### 🚀 Trading Capabilities

<table>
<tr>
<td width="50%">

**Automatic Copy Trading**
- Mirror trades from profitable traders
- Real-time trade detection
- Configurable position multipliers

</td>
<td width="50%">

**Mempool Monitoring**
- Detect pending transactions
- Frontrun with optimized gas prices
- Hybrid API + mempool approach

</td>
</tr>
<tr>
<td>

**Gas Optimization**
- Automatic gas price extraction
- Multiplier-based priority execution
- Cost-efficient trading

</td>
<td>

**Real-Time Updates**
- Poll-based monitoring
- Configurable intervals
- WebSocket support (coming soon)

</td>
</tr>
</table>

### 🛡️ Risk Management

- ✅ **Position Tracking** - Monitor all open positions with entry prices and sizes
- ✅ **Slippage Protection** - Configurable maximum slippage thresholds
- ✅ **Exposure Limits** - Per-market and total exposure limits
- ✅ **Size Controls** - Frontrun size multiplier (default: 50% of target)
- ✅ **Dry-Run Mode** - Test strategies without real trades

### 🔧 Production Features

- 📊 **Health Monitoring** - HTTP endpoints for metrics and health checks
- 💾 **MongoDB Persistence** - Prevents duplicate trades after restarts
- ⚡ **Rate Limiting** - Protects against API bans
- 🔄 **Connection Pooling** - Optimized HTTP connections
- 📦 **Order Book Caching** - Reduces API calls and improves latency
- 🛑 **Graceful Shutdown** - Proper cleanup on termination

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **Polygon Wallet** with USDC balance for trading
- **POL/MATIC** for gas fees (recommended: 0.5+ POL)
- **MongoDB** (Optional, but recommended for production)

### Installation

```bash
# Clone the repository
git clone https://github.com/josephlopezh888/polymarket-copy-trading-bot.git
cd polymarket-copy-trading-bot

# Install dependencies
npm install

# Build the project
npm run build
```

### Configuration

1. **Create environment file:**

```bash
cp .env.example .env
```

2. **Edit `.env` with your settings:**

```env
# Required: Basic Configuration
TARGET_ADDRESS=0x1234567890123456789012345678901234567890
PRIVATE_KEY=0x0000000000000000000000000000000000000000000000000000000000000000

# Copy Trading Configuration
COPY_TRADING_ENABLED=true
DRY_RUN=true                        # ⚠️ ALWAYS test with true first!
POSITION_SIZE_MULTIPLIER=1.0        # 0.5 = 50%, 1.0 = 100%, 2.0 = 200%
MAX_POSITION_SIZE=10000
MAX_TRADE_SIZE=5000
MIN_TRADE_SIZE=1
SLIPPAGE_TOLERANCE=1.0

# Monitoring Configuration
POLL_INTERVAL=30000                  # 30 seconds
```

3. **Run the bot:**

```bash
# Development mode
npm run dev

# Production mode
npm start
```

---

## ⚙️ Configuration

### Required Environment Variables

| Variable | Description | Example |
|:---------|:------------|:--------|
| `TARGET_ADDRESSES` | Comma-separated addresses to monitor | `0xabc...,0xdef...` |
| `PUBLIC_KEY` | Your Polygon wallet address | `0xYourWalletAddress` |
| `PRIVATE_KEY` | Your wallet private key | `0xYourPrivateKey` |
| `RPC_URL` | Polygon RPC endpoint (must support pending tx) | `https://polygon-mainnet.infura.io/v3/...` |

### Optional Configuration

<details>
<summary><b>Trading Parameters</b></summary>

```env
FETCH_INTERVAL=1                    # API polling interval (seconds)
MIN_TRADE_SIZE_USD=100              # Minimum trade size to frontrun (USD)
FRONTRUN_SIZE_MULTIPLIER=0.5        # Frontrun size as % of target (0.0-1.0)
GAS_PRICE_MULTIPLIER=1.2            # Gas price multiplier (1.2 = 20% higher)
USDC_CONTRACT_ADDRESS=0x2791...     # USDC contract (default: Polygon mainnet)
RETRY_LIMIT=3                       # Maximum retry attempts for failed orders
```

</details>

<details>
<summary><b>Risk Management</b></summary>

```env
MAX_SLIPPAGE_PERCENT=2.0            # Maximum acceptable slippage (default: 2.0%)
MAX_POSITION_SIZE_USD=10000         # Maximum position size per market (USD)
MAX_TOTAL_EXPOSURE_USD=50000        # Maximum total exposure across all positions (USD)
```

</details>

<details>
<summary><b>Infrastructure</b></summary>

```env
MONGO_URI=mongodb://localhost:27017/polymarket-bot
HEALTH_CHECK_PORT=3000
TRADE_AGGREGATION_ENABLED=false
TRADE_AGGREGATION_WINDOW_SECONDS=300
```

</details>

---

## 📖 How It Works

### Copy Trading Flow

```mermaid
graph LR
    A[Monitor Addresses] --> B[Detect Trades]
    B --> C[Extract Details]
    C --> D[Risk Validation]
    D --> E[Execute Trade]
    E --> F[Track Position]
```

1. **Address Monitoring** - Bot monitors specified Polymarket trader addresses
2. **Trade Detection** - Detects trades in real-time via API polling
3. **Signal Processing** - Extracts trade details (market, outcome, side, size, price)
4. **Risk Validation** - Validates minimum trade size, position limits, exposure limits, balance, and slippage
5. **Order Execution** - Submits market order with configured position multiplier
6. **Position Tracking** - Records position for ongoing management

### Frontrunning Flow

1. **Mempool Detection** - Monitor Polygon mempool for pending transactions
2. **API Monitoring** - Poll Polymarket API for recent trades
3. **Signal Generation** - Extract trade details, gas price, and transaction hash
4. **Gas Calculation** - Calculate frontrun gas: `target_gas × GAS_PRICE_MULTIPLIER`
5. **Risk Checks** - Validate all risk parameters
6. **Order Execution** - Submit market order with priority gas price
7. **Position Tracking** - Record position for management

---

## 🔍 Advanced Features

### Health Monitoring

Access real-time bot metrics via HTTP endpoints:

```bash
# Health check
curl http://localhost:3000/health

# Detailed metrics
curl http://localhost:3000/metrics
```

**Available Metrics:**
- ⏱️ Uptime
- 📊 Trades executed/failed
- 🕐 Last trade timestamp
- 💰 Wallet balances (POL and USDC)
- ❌ Error history
- ✅ Health status

### MongoDB Setup

MongoDB is **highly recommended for production** to prevent duplicate trade execution.

**Quick Setup:**

```bash
# Option 1: Local MongoDB
mongod --dbpath /path/to/data

# Option 2: MongoDB Atlas (Cloud)
# Create free cluster at https://www.mongodb.com/cloud/atlas
```

**Connection String:**

```env
MONGO_URI=mongodb://localhost:27017/polymarket-bot
# or
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/polymarket-bot
```

### RPC Endpoint Providers

**Recommended Providers:**

| Provider | Free Tier | WebSocket Support |
|:---------|:----------|:------------------|
| [Infura](https://infura.io) | ✅ Yes | ✅ Yes |
| [Alchemy](https://alchemy.com) | ✅ Yes | ✅ Yes |
| [QuickNode](https://quicknode.com) | ✅ Yes | ✅ Yes |
| [Ankr](https://www.ankr.com) | ✅ Yes | ⚠️ Limited |

> **Note:** Free tier providers may have rate limits. For production, consider premium providers with WebSocket support.

---



### Recommended Settings

<details>
<summary><b>For Fast Detection</b></summary>

```env
FETCH_INTERVAL=0.5              # Faster polling (higher API load)
GAS_PRICE_MULTIPLIER=1.5        # Higher gas = better frontrun success
```

</details>

<details>
<summary><b>For Cost Efficiency</b></summary>

```env
MIN_TRADE_SIZE_USD=500          # Only frontrun larger trades
FRONTRUN_SIZE_MULTIPLIER=0.3    # Smaller position sizes
GAS_PRICE_MULTIPLIER=1.1        # Lower gas costs
```

</details>

<details>
<summary><b>For Risk Management</b></summary>

```env
MAX_SLIPPAGE_PERCENT=1.0        # Stricter slippage control
MAX_POSITION_SIZE_USD=5000      # Smaller position limits
MAX_TOTAL_EXPOSURE_USD=25000    # Lower total exposure
```

</details>

---

## 🛠️ Troubleshooting

<details>
<summary><b>Bot not detecting trades</b></summary>

- ✅ Verify `TARGET_ADDRESSES` are correct and active
- ✅ Check RPC URL supports pending transaction monitoring
- ✅ Increase `FETCH_INTERVAL` if network is slow
- ✅ Verify `MIN_TRADE_SIZE_USD` threshold

</details>

<details>
<summary><b>Orders failing</b></summary>

- ✅ Check USDC balance
- ✅ Verify POL/MATIC balance for gas (>0.2 POL recommended)
- ✅ Confirm RPC endpoint is accessible
- ✅ Check market is still active

</details>

<details>
<summary><b>High gas costs</b></summary>

- ✅ Lower `GAS_PRICE_MULTIPLIER` (e.g., 1.1 instead of 1.2)
- ✅ Increase `MIN_TRADE_SIZE_USD` to only frontrun larger trades
- ✅ Monitor network congestion

</details>

<details>
<summary><b>MongoDB connection errors</b></summary>

- ✅ Verify MongoDB is running
- ✅ Check connection string format
- ✅ Ensure network access if using cloud MongoDB
- ℹ️ Bot will continue without MongoDB (in-memory only)

</details>

---

## 📦 Available Scripts

| Command | Description |
|:--------|:------------|
| `npm run dev` | Development mode with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Production mode |
| `npm run lint` | Run ESLint linter |
| `npm run lint:fix` | Automatically fix linting errors |
| `npm run check-allowance` | Check token allowance for USDC |
| `npm run set-token-allowance` | Set token allowance for trading |
| `npm run manual-sell` | Manually sell positions |
| `npm run simulate` | Run simulation/backtesting |

---

## 🔐 Security Best Practices

- 🔒 **Never commit `.env` file** - Add to `.gitignore`
- 🔑 **Use environment variables** - Store secrets securely
- 🔄 **Rotate private keys** - Regularly update credentials
- 📊 **Monitor balances** - Set up alerts for unusual activity
- 💼 **Use hardware wallets** - For production deployments
- 🛡️ **Limit permissions** - Use minimum required wallet permissions

---

## 📚 Documentation

- 📖 [Complete Setup Guide](./docs/GUIDE.md) - Detailed setup and configuration
- 💡 [Example Transactions](#-example-transactions) - View successful trades
- 🐛 [Troubleshooting](#-troubleshooting) - Common issues and solutions

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. 🍴 Fork the repository
2. 🌿 Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🔀 Open a Pull Request

---

## 📞 Support & Contact

<div align="center">

[![Telegram](https://img.shields.io/badge/Telegram-@josephlopezh888-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/josephlopezh888)
[![GitHub Issues](https://img.shields.io/badge/GitHub-Issues-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/josephlopezh888/polymarket-copy-trading-bot/issues)

</div>

---

## 📈 Roadmap

- [ ] 🔌 WebSocket mempool monitoring
- [ ] 📊 Advanced strategy backtesting
- [ ] 🖥️ Web dashboard UI
- [ ] 📱 Telegram notifications
- [ ] 👛 Multi-wallet support
- [ ] 📈 Advanced position management
- [ ] 💰 PnL tracking and reporting

---

## ⚠️ Disclaimer

<div align="center">

**IMPORTANT LEGAL DISCLAIMER**

</div>

This software is provided **"as-is"** for educational and research purposes only. Trading cryptocurrencies and prediction markets involves substantial risk of loss.

| ⚠️ | **Warning** |
|:---|:------------|
| 🚫 | **No Warranty** - The software is provided without any warranties |
| ⚡ | **Use at Your Own Risk** - You are solely responsible for any losses incurred |
| 📚 | **Not Financial Advice** - This is not investment or trading advice |
| ⚖️ | **Compliance** - Ensure compliance with local laws and regulations |
| 🧪 | **Testing** - Always test with small amounts first |
| ⚖️ | **Legal** - Frontrunning may have legal and ethical implications in some jurisdictions |

**The authors and contributors are not responsible for any financial losses, damages, or legal issues arising from the use of this software.**

---

<div align="center">

**Made with ❤️ for the Polymarket trading community**

[⬆ Back to Top](#-polymarket-copy-trading-bot)

</div>

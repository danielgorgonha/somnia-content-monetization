# Scripts Guide - Somnia Content Monetization

## 🚀 Available Scripts

### 📦 Deployment Scripts

#### `deploy.js`
Main deployment script for smart contracts.

```bash
# Deploy to local network
pnpm run test:deploy

# Deploy to testnet
pnpm run deploy:testnet

# Deploy to mainnet
pnpm run deploy:mainnet
```

**Features:**
- ✅ Validates deployer balance
- ✅ Deploys CreatorRegistry and MicroPayVault
- ✅ Verifies contract deployment
- ✅ Saves deployment info to JSON file
- ✅ Provides network-specific instructions
- ✅ Error handling and rollback support

**Output:**
- Deployment summary with contract addresses
- JSON file with deployment details
- Explorer links for verification

#### `verify.js`
Contract verification script for block explorers.

```bash
# Verify on local network
pnpm run test:verify

# Verify on testnet
pnpm run verify:testnet

# Verify on mainnet
pnpm run verify:mainnet
```

**Features:**
- ✅ Loads deployment info automatically
- ✅ Verifies contracts on block explorer
- ✅ Tests contract interactions
- ✅ Generates verification report
- ✅ Provides explorer links

### 🧪 Testing Scripts

#### `test-setup.js`
Comprehensive test environment setup.

```bash
# Setup test environment
pnpm run test:setup
```

**Features:**
- ✅ Deploys contracts for testing
- ✅ Creates test accounts and balances
- ✅ Registers sample content
- ✅ Sends test micropayments
- ✅ Generates comprehensive test data
- ✅ Exports test configuration

**Test Data Created:**
- 3 types of content (video, article, live stream)
- 5 test users with different balances
- 7 test micropayments
- Complete contract state

### 🧹 Maintenance Scripts

#### `clean.js`
Development environment cleanup.

```bash
# Basic cleanup
pnpm run clean

# Full cleanup (including node_modules)
pnpm run clean:all

# Docker cleanup
pnpm run clean:docker
```

**Features:**
- ✅ Removes Hardhat artifacts (cache, artifacts)
- ✅ Cleans test coverage files
- ✅ Removes deployment files
- ✅ Cleans IDE and OS files
- ✅ Optional node_modules removal
- ✅ Optional Docker volume cleanup

## 📊 Script Output Examples

### Deployment Output
```
🚀 Deploying Somnia Content Monetization contracts...
📋 Deployment Info:
- Deployer: 0x1234...5678
- Balance: 1.5 ETH
- Network: somnia-testnet
- Chain ID: 80085

📦 Deploying CreatorRegistry...
✅ CreatorRegistry deployed to: 0xabcd...efgh

📦 Deploying MicroPayVault...
✅ MicroPayVault deployed to: 0x9876...5432

🔍 Verifying deployment...
✅ All contracts deployed and verified successfully!

📄 Deployment info saved to: deployment-somnia-testnet-1692400000.json

🎉 Deployment Summary:
=====================
- CreatorRegistry: 0xabcd...efgh
- MicroPayVault: 0x9876...5432
- MeteredAccess: TBD (Phase 2)
- Network: somnia-testnet
- Deployer: 0x1234...5678

🔗 Next Steps:
1. Verify contracts on explorer:
   - CreatorRegistry: https://testnet-explorer.somnia.zone/address/0xabcd...efgh
   - MicroPayVault: https://testnet-explorer.somnia.zone/address/0x9876...5432
2. Update frontend configuration
3. Test micropayment functionality
```

### Test Setup Output
```
🚀 Setting up Somnia Content Monetization test environment...
📡 Network: localhost
🔗 Chain ID: 31337

📋 Test Accounts:
=================
👑 Owner:     0x1234...5678
👤 User1:     0xabcd...efgh
👤 User2:     0x9876...5432
🎨 Creator1:  0x1111...2222
🎨 Creator2:  0x3333...4444
👤 User3:     0x5555...6666
👤 User4:     0x7777...8888
👤 User5:     0x9999...aaaa

📦 Deploying contracts...
=======================
✅ CreatorRegistry deployed to: 0xbbbb...cccc
✅ MicroPayVault deployed to: 0xdddd...eeee

🎭 Setting up test data...
========================
✅ Content registered: Introduction to Somnia
✅ Content registered: Micropayments Guide
✅ Content registered: Live Coding Session

💰 Setting up user accounts...
=============================
✅ 0xabcd... setup: 10.0 SOM deposit, 5.0 SOM limit
✅ 0x9876... setup: 15.0 SOM deposit, 8.0 SOM limit
✅ 0x5555... setup: 5.0 SOM deposit, 3.0 SOM limit
✅ 0x7777... setup: 20.0 SOM deposit, 10.0 SOM limit
✅ 0x9999... setup: 8.0 SOM deposit, 4.0 SOM limit

💸 Sending test micropayments...
================================
✅ Micropayment: 0.001 SOM from 0xabcd... to 0x1111...
✅ Micropayment: 0.01 SOM from 0xabcd... to 0x3333...
✅ Micropayment: 0.002 SOM from 0x9876... to 0x1111...
✅ Micropayment: 0.02 SOM from 0x9876... to 0x3333...
✅ Micropayment: 0.003 SOM from 0x5555... to 0x1111...
✅ Micropayment: 0.015 SOM from 0x7777... to 0x3333...
✅ Micropayment: 0.001 SOM from 0x9999... to 0x1111...

📊 Test Environment Report
==========================
🏗️  CreatorRegistry: 0xbbbb...cccc
🏦 MicroPayVault: 0xdddd...eeee
💰 Total vault balance: 58.0 SOM
📈 Total micropayments: 7
📝 Content registered: 3
👥 Users setup: 5

🎨 Creator Earnings:
- Creator1: 0.007 SOM total, 0.007 SOM pending
- Creator2: 0.045 SOM total, 0.045 SOM pending

📄 Test data exported to: test-setup-localhost-1692400000.json

🎉 Test environment setup completed successfully!

🔗 Next Steps:
1. Run tests: pnpm run test:contracts
2. Run integration tests: pnpm run test:local
3. Check gas usage: pnpm run test:gas
```

## 🔧 Script Configuration

### Environment Variables
```bash
# Required for deployment
PRIVATE_KEY=your_private_key_here

# Optional for verification
SOMNIA_API_KEY=your_api_key_here
COINMARKETCAP_API_KEY=your_api_key_here

# Optional for gas reporting
REPORT_GAS=true
```

### Network Configuration
Scripts automatically detect the network from Hardhat configuration:

- **localhost**: Local development
- **anvil**: Docker Anvil network
- **somnia-testnet**: Somnia testnet
- **somnia-mainnet**: Somnia mainnet

## 🚨 Error Handling

### Common Issues

#### 1. Insufficient Balance
```
❌ Deployment failed: Insufficient deployer balance. Need at least 0.1 ETH for deployment.
```
**Solution:** Add more funds to deployer account

#### 2. Network Connection
```
❌ Deployment failed: Network connection failed
```
**Solution:** Check network RPC URL and connectivity

#### 3. Contract Verification
```
❌ CreatorRegistry verification failed: Contract not found
```
**Solution:** Wait for deployment confirmation before verification

### Debug Mode
Enable verbose logging:
```bash
# Set debug environment variable
DEBUG=true pnpm run deploy:testnet

# Or use Hardhat verbose mode
npx hardhat run scripts/deploy.js --network somnia-testnet --verbose
```

## 📈 Performance Monitoring

### Gas Usage Tracking
```bash
# Run with gas reporting
pnpm run test:gas

# Monitor specific operations
npx hardhat test --gas --grep "Micropayment"
```

### Deployment Metrics
Scripts automatically track:
- Deployment gas costs
- Contract sizes
- Transaction times
- Success rates

## 🔄 Script Workflow

### Typical Development Workflow
```bash
# 1. Clean environment
pnpm run clean

# 2. Install dependencies
pnpm install

# 3. Compile contracts
pnpm run compile

# 4. Setup test environment
pnpm run test:setup

# 5. Run tests
pnpm run test:contracts

# 6. Deploy to testnet
pnpm run deploy:testnet

# 7. Verify contracts
pnpm run verify:testnet
```

### CI/CD Integration
Scripts are designed for CI/CD pipelines:
- Exit codes for automation
- Structured JSON output
- Error handling for automation
- Network-specific configurations

## 📚 Additional Resources

- [Hardhat Scripts](https://hardhat.org/tutorial/scripts)
- [Ethers.js Deployment](https://docs.ethers.org/v6/contracts/)
- [OpenZeppelin Verification](https://docs.openzeppelin.com/upgrades-plugins/1.x/api-hardhat-upgrades)
- [Gas Optimization](https://ethereum.org/en/developers/docs/gas/)

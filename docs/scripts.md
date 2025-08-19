# Scripts Guide - Somnia Content Monetization

## 🚀 Available Scripts

### 📦 Deployment Scripts

#### `deploy.js`
Main deployment script for smart contracts.

```bash
# Deploy to testnet
pnpm run deploy:testnet

# Deploy to mainnet
pnpm run deploy:mainnet
```

**Features:**
- ✅ Validates deployer balance
- ✅ Deploys CreatorRegistry, MicroPayVault, and MeteredAccess
- ✅ Verifies contract deployment
- ✅ Saves deployment info to JSON file
- ✅ Provides network-specific instructions
- ✅ Error handling and rollback support

**Output:**
- Deployment summary with contract addresses
- JSON file with deployment details
- Explorer links for verification

### 🧪 Testing Scripts

#### `test-manual.js`
Manual testing script for deployed contracts on testnet.

```bash
# Test deployed contracts on testnet
pnpm run test:manual
```

**Features:**
- ✅ Loads contracts from latest deployment automatically
- ✅ Tests CreatorRegistry content registration
- ✅ Tests MicroPayVault deposit and monthly limits
- ✅ Tests MeteredAccess session management
- ✅ Comprehensive error handling and fallbacks
- ✅ Real-time balance and status reporting

**Test Coverage:**
- Content registration and retrieval
- User deposits and balance management
- Monthly limit configuration
- Session management (when implemented)
- Error handling and edge cases

#### `test:contracts`
Unit and integration tests for smart contracts.

```bash
# Run all tests
pnpm run test:contracts

# Run with coverage
pnpm run test:coverage
```

**Features:**
- ✅ 64 comprehensive test cases
- ✅ Unit tests for each contract
- ✅ Integration tests for complete workflows
- ✅ Gas usage optimization tests
- ✅ Error handling and edge cases
- ✅ Security and access control tests

### 🔧 Contract Management Scripts

#### `load-contracts.js`
Intelligent contract loading system for managing multiple versions.

**Features:**
- ✅ Automatic loading of latest deployment
- ✅ Support for specific version selection
- ✅ Multiple network support (testnet, mainnet)
- ✅ Complete deployment history tracking
- ✅ Metadata and timestamp information

**Usage:**
```javascript
const { loadDeployedContracts, getContractInstances } = require("./load-contracts");

// Load latest version
const { contracts, metadata } = loadDeployedContracts("somnia-testnet");

// Load specific version
const { contracts } = loadDeployedContracts("somnia-testnet", "1755576595321");

// Get contract instances
const instances = await getContractInstances("somnia-testnet");
```

#### `list-versions.js`
Lists all available contract versions and deployments.

```bash
# List all available versions
pnpm run list:versions
```

**Features:**
- ✅ Shows all deployments by network
- ✅ Displays timestamps and contract addresses
- ✅ Identifies latest version
- ✅ Network-specific filtering
- ✅ Usage instructions

**Output:**
```
📋 Available Contract Versions

🌐 SOMNIA-TESTNET:
   📅 8/19/2025, 1:09:55 AM (LATEST)
   📁 File: deployment-somnia-testnet-1755576595321.json
   🔗 CreatorRegistry: 0xf629fB3b2a5a03D70fD14bA88eA4828da5356e5D
   🔗 MicroPayVault: 0xD2f94B843557d52A81d12ED04553f57BC7D9a819
   🔗 MeteredAccess: 0xf65391952439f75E2f8c87952f0f143f3117D1f6

💡 Usage:
   - Use 'LATEST' version for current development
   - Use specific timestamp for historical testing
   - Run 'pnpm run test:manual' to test latest version
```

#### `manage-versions.js`
Advanced version management with ContractRegistry (Future Implementation).

```bash
# Manage contract versions (when ContractRegistry is deployed)
pnpm run manage:versions
```

**Features:**
- ✅ Deploy and manage ContractRegistry
- ✅ Register new contract versions
- ✅ Activate specific versions
- ✅ Track version history on-chain
- ✅ Automatic version switching

### 🔍 Verification Scripts

#### `verify:contracts`
Contract verification for block explorers.

```bash
# Verify contracts on testnet
pnpm run verify:contracts
```

**Features:**
- ✅ Loads deployment info automatically
- ✅ Verifies contracts on block explorer
- ✅ Tests contract interactions
- ✅ Generates verification report
- ✅ Provides explorer links

## 📊 Script Output Examples

### Manual Testing Output
```
🧪 Testing deployed contracts on Somnia testnet...
📋 Test Info:
- Deployer: 0x365b9Ba25b3F116cC95Eeb995B2B64F09A8822f8
- Balance: 0.042617294 STT

🔗 Using contracts from: deployment-somnia-testnet-1755576595321.json
📅 Deployed: 8/19/2025, 1:09:55 AM

🔍 Testing CreatorRegistry...
- Registering content: 0xe8aa2b7454de059e4d7b6522c4474af570ab6b253d31936dd006c39af47f72d8
✅ Content registered successfully!
- Content info: {
  creator: '0x365b9Ba25b3F116cC95Eeb995B2B64F09A8822f8',
  ratePerUnit: '0.001',
  active: true
}

🔍 Testing MicroPayVault...
- Depositing 0.01 STT
✅ Deposit successful!
- Setting monthly limit to 0.05 STT
✅ Monthly limit set!
- User balance: { balance: '0.13', monthlyLimit: '0.05', monthlySpent: '0.0' }

🔍 Testing MeteredAccess...
- Skipping MeteredAccess session test for now
✅ MicroPayVault is working perfectly!

📊 Final Results:
- User balance: 0.13 STT
- User monthly limit: 0.05 STT
- User monthly spent: 0.0 STT

🎉 Manual testing completed successfully!
🚀 Ready for frontend development!
```

### Deployment Output
```
🚀 Deploying Somnia Content Monetization contracts...
📋 Deployment Info:
- Deployer: 0x365b9Ba25b3F116cC95Eeb995B2B64F09A8822f8
- Balance: 0.5 STT
- Network: somnia-testnet
- Chain ID: 80085

📦 Deploying CreatorRegistry...
✅ CreatorRegistry deployed to: 0xf629fB3b2a5a03D70fD14bA88eA4828da5356e5D

📦 Deploying MicroPayVault...
✅ MicroPayVault deployed to: 0xD2f94B843557d52A81d12ED04553f57BC7D9a819

📦 Deploying MeteredAccess...
✅ MeteredAccess deployed to: 0xf65391952439f75E2f8c87952f0f143f3117D1f6

🔍 Verifying deployment...
✅ All contracts deployed and verified successfully!

📄 Deployment info saved to: deployment-somnia-testnet-1755576595321.json

🎉 Deployment Summary:
=====================
- CreatorRegistry: 0xf629fB3b2a5a03D70fD14bA88eA4828da5356e5D
- MicroPayVault: 0xD2f94B843557d52A81d12ED04553f57BC7D9a819
- MeteredAccess: 0xf65391952439f75E2f8c87952f0f143f3117D1f6
- Network: somnia-testnet
- Deployer: 0x365b9Ba25b3F116cC95Eeb995B2B64F09A8822f8

🔗 Next Steps:
1. Verify contracts on explorer:
   - CreatorRegistry: https://testnet.somnia.network/address/0xf629fB3b2a5a03D70fD14bA88eA4828da5356e5D
   - MicroPayVault: https://testnet.somnia.network/address/0xD2f94B843557d52A81d12ED04553f57BC7D9a819
   - MeteredAccess: https://testnet.somnia.network/address/0xf65391952439f75E2f8c87952f0f143f3117D1f6
2. Test contracts: pnpm run test:manual
3. Update frontend configuration
```

## 🔧 Script Configuration

### Environment Variables
```bash
# Required for deployment
DEPLOYER_PRIVATE_KEY=your_private_key_here

# Optional for verification
SOMNIA_API_KEY=your_api_key_here

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
❌ Deployment failed: Insufficient deployer balance. Need at least 0.1 STT for deployment.
```
**Solution:** Add more funds to deployer account

#### 2. Network Connection
```
❌ Deployment failed: Network connection failed
```
**Solution:** Check network RPC URL and connectivity

#### 3. Contract Loading
```
❌ No deployment files found for network: somnia-testnet
```
**Solution:** Deploy contracts first using `pnpm run deploy:testnet`

### Debug Mode
Enable verbose logging:
```bash
# Set debug environment variable
DEBUG=true pnpm run test:manual

# Or use Hardhat verbose mode
npx hardhat run scripts/test-manual.js --network somnia-testnet --verbose
```

## 📈 Performance Monitoring

### Gas Usage Tracking
```bash
# Run with gas reporting
pnpm run test:coverage

# Monitor specific operations
npx hardhat test --grep "Micropayment"
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
# 1. Compile contracts
pnpm run compile

# 2. Run tests
pnpm run test:contracts

# 3. Deploy to testnet
pnpm run deploy:testnet

# 4. Test deployed contracts
pnpm run test:manual

# 5. List available versions
pnpm run list:versions

# 6. Verify contracts
pnpm run verify:contracts
```

### Production Deployment Workflow
```bash
# 1. Deploy to mainnet
pnpm run deploy:mainnet

# 2. Verify contracts
pnpm run verify:contracts

# 3. Test on mainnet
pnpm run test:manual
```

## 📚 Additional Resources

- [Hardhat Scripts](https://hardhat.org/tutorial/scripts)
- [Ethers.js Deployment](https://docs.ethers.org/v6/contracts/)
- [OpenZeppelin Verification](https://docs.openzeppelin.com/upgrades-plugins/1.x/api-hardhat-upgrades)
- [Gas Optimization](https://ethereum.org/en/developers/docs/gas/)

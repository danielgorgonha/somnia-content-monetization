# Contract Versioning System - Somnia Content Monetization

## 🎯 Overview

The contract versioning system provides a robust way to manage multiple deployments of smart contracts across different networks and versions. This system ensures that developers and users can always access the correct contract addresses and understand the deployment history.

## 🏗️ Architecture

### File-Based Versioning
```
deployments/
├── deployment-somnia-testnet-1755576595321.json    # Latest testnet
├── deployment-somnia-testnet-1755576000000.json    # Previous testnet
├── deployment-somnia-mainnet-1755577000000.json    # Mainnet deployment
└── deployment-localhost-1755578000000.json         # Local development
```

### Contract Registry (Future)
- On-chain version management
- Automatic version switching
- Historical version tracking
- Multi-signature governance

## 📋 Available Scripts

### `load-contracts.js`
Intelligent contract loading system that automatically detects and loads the appropriate contract versions.

**Key Functions:**
- `loadDeployedContracts(network, version)` - Load contract addresses
- `getContractInstances(network, version)` - Get contract instances
- `listAvailableVersions(network)` - List all versions

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

### `list-versions.js`
Lists all available contract versions with detailed information.

```bash
pnpm run list:versions
```

**Output:**
```
📋 Available Contract Versions

🌐 SOMNIA-TESTNET:
   📅 8/19/2025, 1:09:55 AM (LATEST)
   📁 File: deployment-somnia-testnet-1755576595321.json
   🔗 CreatorRegistry: 0xf629fB3b2a5a03D70fD14bA88eA4828da5356e5D
   🔗 MicroPayVault: 0xD2f94B843557d52A81d12ED04553f57BC7D9a819
   🔗 MeteredAccess: 0xf65391952439f75E2f8c87952f0f143f3117D1f6

🌐 SOMNIA-MAINNET:
   ❌ No deployments found
```

### `manage-versions.js`
Advanced version management with on-chain ContractRegistry (Future Implementation).

```bash
pnpm run manage:versions
```

**Features:**
- Deploy ContractRegistry
- Register new versions
- Activate specific versions
- Track version history on-chain

## 🔄 Version Management Workflow

### 1. New Deployment
```bash
# Deploy new version
pnpm run deploy:testnet

# This creates a new deployment file with timestamp
# deployments/deployment-somnia-testnet-1755576595321.json
```

### 2. Version Registration
```bash
# Register version in ContractRegistry (when implemented)
pnpm run manage:versions
```

### 3. Testing
```bash
# Test latest version
pnpm run test:manual

# List all versions
pnpm run list:versions
```

### 4. Activation
```bash
# Activate new version (when ContractRegistry is deployed)
pnpm run manage:versions
```

## 📊 Deployment File Structure

### Standard Format
```json
{
  "timestamp": 1755576595321,
  "network": "somnia-testnet",
  "deployer": "0x365b9Ba25b3F116cC95Eeb995B2B64F09A8822f8",
  "chainId": 80085,
  "gasUsed": 2500000,
  "contracts": {
    "CreatorRegistry": "0xf629fB3b2a5a03D70fD14bA88eA4828da5356e5D",
    "MicroPayVault": "0xD2f94B843557d52A81d12ED04553f57BC7D9a819",
    "MeteredAccess": "0xf65391952439f75E2f8c87952f0f143f3117D1f6"
  },
  "metadata": {
    "version": "1.0.0",
    "description": "Initial deployment with all core contracts",
    "features": ["content-registration", "micropayments", "session-management"]
  }
}
```

### Naming Convention
```
deployment-{network}-{timestamp}.json
```

**Examples:**
- `deployment-somnia-testnet-1755576595321.json`
- `deployment-somnia-mainnet-1755577000000.json`
- `deployment-localhost-1755578000000.json`

## 🎯 Best Practices

### 1. Always Use Latest Version
```javascript
// ✅ Good - Always uses latest
const { contracts } = loadDeployedContracts("somnia-testnet");

// ❌ Bad - Hardcoded addresses
const CREATOR_REGISTRY = "0xf629fB3b2a5a03D70fD14bA88eA4828da5356e5D";
```

### 2. Version-Specific Testing
```javascript
// Test specific version for regression testing
const { contracts } = loadDeployedContracts("somnia-testnet", "1755576000000");
```

### 3. Network-Specific Loading
```javascript
// Load based on current network
const network = hre.network.name;
const { contracts } = loadDeployedContracts(network);
```

### 4. Error Handling
```javascript
try {
  const { contracts } = loadDeployedContracts("somnia-testnet");
} catch (error) {
  if (error.message.includes("No deployment files found")) {
    console.log("No deployments found. Run 'pnpm run deploy:testnet' first.");
  }
}
```

## 🔍 Version Discovery

### List All Versions
```bash
pnpm run list:versions
```

### Programmatic Discovery
```javascript
const { listAvailableVersions } = require("./load-contracts");

const versions = listAvailableVersions("somnia-testnet");
versions.forEach(version => {
  console.log(`${version.date}: ${version.file}`);
});
```

### Network-Specific Discovery
```javascript
const networks = ["somnia-testnet", "somnia-mainnet"];

networks.forEach(network => {
  const versions = listAvailableVersions(network);
  console.log(`${network}: ${versions.length} versions`);
});
```

## 🚨 Troubleshooting

### Common Issues

#### 1. No Deployment Files Found
```
❌ No deployment files found for network: somnia-testnet
```
**Solution:** Deploy contracts first using `pnpm run deploy:testnet`

#### 2. Version Not Found
```
❌ Version 1755576000000 not found for network somnia-testnet
```
**Solution:** Check available versions with `pnpm run list:versions`

#### 3. Network Mismatch
```
❌ Network configuration mismatch
```
**Solution:** Ensure network name matches deployment files

### Debug Mode
```bash
# Enable debug logging
DEBUG=true pnpm run list:versions

# Verbose Hardhat output
npx hardhat run scripts/list-versions.js --verbose
```

## 🔮 Future Enhancements

### ContractRegistry Implementation
- On-chain version management
- Multi-signature governance
- Automatic version switching
- Historical version tracking

### Advanced Features
- Version comparison tools
- Migration scripts
- Rollback capabilities
- A/B testing support

### Integration
- CI/CD pipeline integration
- Automated testing
- Deployment monitoring
- Performance tracking

## 📚 Related Documentation

- [Scripts Guide](./scripts.md) - Complete script documentation
- [Testing Guide](./testing.md) - Testing strategies
- [Architecture](./architecture.md) - System architecture
- [Deployment](./deployment.md) - Deployment procedures

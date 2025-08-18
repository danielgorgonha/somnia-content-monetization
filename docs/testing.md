# Testing Guide - Somnia Content Monetization

## 🧪 Testing Strategy

Our testing approach focuses on **comprehensive coverage** with multiple layers:

### 📊 Test Coverage Goals
- **Smart Contracts**: 100% coverage
- **Integration Tests**: Complete user journeys
- **Gas Optimization**: Monitor and optimize gas usage
- **Edge Cases**: Handle all error scenarios

## 🚀 Quick Start

### 1. Local Development Environment

```bash
# Start Docker services (Anvil, IPFS, Redis, PostgreSQL)
pnpm run docker:up

# Setup test environment
pnpm run test:setup

# Run all tests
pnpm run test:contracts

# Run with gas reporting
pnpm run test:gas

# Run integration tests
pnpm run test:local
```

### 2. Test Networks

```bash
# Test on local Anvil network
pnpm run test:anvil

# Test on Somnia testnet
pnpm run test:testnet

# Deploy to testnet
pnpm run deploy:testnet
```

## 📁 Test Structure

```
test/
├── CreatorRegistry.test.js      # Creator registry tests
├── MicroPayVault.test.js        # Vault and micropayment tests
├── integration.test.js          # Complete user journey tests
└── fixtures/                    # Test data and helpers
    ├── test-data.json
    └── helpers.js
```

## 🎯 Test Categories

### 1. Unit Tests
- **Contract Deployment**: Verify correct initialization
- **Function Testing**: Test individual contract functions
- **Event Emission**: Verify events are emitted correctly
- **Access Control**: Test owner and user permissions

### 2. Integration Tests
- **Complete User Journey**: End-to-end content monetization
- **Multiple Users**: Concurrent micropayments
- **Creator Workflows**: Content registration to earnings withdrawal
- **Cross-Contract Interaction**: Registry + Vault integration

### 3. Gas Optimization Tests
- **Gas Measurement**: Track gas usage per operation
- **Optimization Targets**: Ensure micropayments are cost-effective
- **Batch Operations**: Test multiple operations efficiency

### 4. Edge Cases
- **Invalid Inputs**: Test error handling
- **Boundary Conditions**: Test limits and constraints
- **Failure Scenarios**: Test revert conditions
- **Security**: Test access control and reentrancy

## 🐳 Docker Environment

### Services Available

| Service | Port | Purpose |
|---------|------|---------|
| **Anvil** | 8545 | Local blockchain node |
| **IPFS** | 8080 | Content metadata storage |
| **Redis** | 6379 | Session management |
| **PostgreSQL** | 5432 | Analytics and metrics |
| **Grafana** | 3000 | Monitoring dashboard |

### Docker Commands

```bash
# Start all services
pnpm run docker:up

# View logs
pnpm run docker:logs

# Stop services
pnpm run docker:down

# Restart services
pnpm run docker:restart
```

## 📊 Test Commands

### Basic Testing
```bash
# Run all tests
pnpm run test:contracts

# Run specific test file
npx hardhat test test/CreatorRegistry.test.js

# Run with verbose output
npx hardhat test --verbose
```

### Coverage Testing
```bash
# Generate coverage report
pnpm run test:coverage

# View coverage in browser
open coverage/index.html
```

### Gas Testing
```bash
# Run tests with gas reporting
pnpm run test:gas

# Gas optimization analysis
npx hardhat test --gas
```

### Network Testing
```bash
# Test on local network
pnpm run test:local

# Test on Anvil network
pnpm run test:anvil

# Test on testnet
pnpm run test:testnet
```

## 🎭 Test Data

### Sample Test Scenarios

#### 1. Video Content Monetization
```javascript
const videoContent = {
    contentId: "video_001",
    title: "Somnia Tutorial",
    contentType: 0, // VIDEO
    consumptionType: 0, // TIME_BASED
    ratePerUnit: ethers.parseEther("0.001") // 0.001 SOM per second
};
```

#### 2. Article Content Monetization
```javascript
const articleContent = {
    contentId: "article_001",
    title: "DeFi Guide",
    contentType: 2, // TEXT
    consumptionType: 1, // VOLUME_BASED
    ratePerUnit: ethers.parseEther("0.01") // 0.01 SOM per 100 words
};
```

#### 3. Live Streaming
```javascript
const liveStream = {
    contentId: "live_001",
    title: "Live Coding Session",
    contentType: 0, // VIDEO
    consumptionType: 0, // TIME_BASED
    ratePerUnit: ethers.parseEther("0.002") // 0.002 SOM per second
};
```

## 🔍 Test Monitoring

### Gas Usage Targets

| Operation | Target Gas | Current |
|-----------|------------|---------|
| Content Registration | < 150k | TBD |
| Micropayment | < 100k | TBD |
| Deposit | < 50k | TBD |
| Withdrawal | < 80k | TBD |

### Performance Benchmarks

| Metric | Target | Current |
|--------|--------|---------|
| Transactions per Second | > 1000 | TBD |
| Micropayment Cost | < $0.001 | TBD |
| Setup Time | < 2 minutes | TBD |

## 🚨 Common Test Issues

### 1. Network Connection
```bash
# If Anvil is not responding
pnpm run docker:restart

# Check network status
curl http://localhost:8545
```

### 2. Gas Estimation
```bash
# If gas estimation fails
npx hardhat test --gas-price 1000000000
```

### 3. Test Timeouts
```bash
# Increase timeout for slow tests
npx hardhat test --timeout 120000
```

## 📈 Continuous Testing

### GitHub Actions
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm run test:contracts
      - run: pnpm run test:coverage
```

### Pre-commit Hooks
```bash
# Install pre-commit hooks
npx husky install

# Add test hook
npx husky add .husky/pre-commit "pnpm run test:contracts"
```

## 🎯 Testing Best Practices

### 1. Test Organization
- Group related tests in describe blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Test Data Management
- Use fixtures for common test data
- Clean up state between tests
- Use unique identifiers for each test

### 3. Error Testing
- Test all revert conditions
- Verify error messages
- Test boundary conditions

### 4. Gas Optimization
- Monitor gas usage in CI/CD
- Set gas limits for operations
- Optimize for micropayment efficiency

## 📚 Additional Resources

- [Hardhat Testing Guide](https://hardhat.org/tutorial/testing-contracts)
- [OpenZeppelin Test Helpers](https://docs.openzeppelin.com/test-helpers/)
- [Ethers.js Testing](https://docs.ethers.org/v6/testing/)
- [Gas Optimization](https://ethereum.org/en/developers/docs/gas/)

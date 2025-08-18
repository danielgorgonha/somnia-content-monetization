# Somnia Content Monetization

Universal micropayment platform for digital content creators, built on Somnia Network.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8+
- MetaMask or compatible wallet

### Installation

```bash
# Clone repository
git clone <repository-url>
cd somnia-content-monetization

# Install dependencies
pnpm install

# Setup environment
cp env.example .env
# Edit .env with your configuration

# Start development
pnpm run dev
```

## 📁 Project Structure

```
somnia-content-monetization/
├── contracts/          # Smart contracts
├── frontend/           # React application
├── docs/              # Documentation
├── scripts/           # Deployment scripts
└── tests/             # Test files
```

## 🛠️ Development

### Smart Contracts
```bash
# Compile contracts
pnpm run compile

# Run tests
pnpm run test:contracts

# Run tests with gas reporting
pnpm run test:gas

# Deploy to testnet
pnpm run deploy:testnet

# Verify contracts
pnpm run verify:testnet
```

### Frontend
```bash
# Start development server
pnpm run dev

# Build for production
pnpm run build
```

### Testing & Environment
```bash
# Setup test environment
pnpm run test:setup

# Run all tests
pnpm run test:contracts

# Run integration tests
pnpm run test:local

# Clean development environment
pnpm run clean

# Start Docker services
pnpm run docker:up
```

## 🧪 Testing

```bash
# Setup test environment
pnpm run test:setup

# Run all tests
pnpm run test:contracts

# Run tests with gas reporting
pnpm run test:gas

# Run integration tests
pnpm run test:local

# Coverage report
pnpm run test:coverage

# Run frontend tests
pnpm run test:frontend
```

## 📚 Documentation

- [Proposal](./docs/proposal.md) - Project proposal and overview
- [MVP](./docs/mvp.md) - Technical specifications
- [Roadmap](./docs/roadmap.md) - Development timeline
- [Architecture](./docs/architecture.md) - System architecture
- [Testing](./docs/testing.md) - Testing guide and strategies
- [Scripts](./docs/scripts.md) - Development scripts guide

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feat/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feat/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Hackathon

This project is being developed for the Somnia DeFi Hackathon (August 13 - September 12, 2025).

# Somnia Content Monetization

Universal micropayment platform for digital content creators, built on Somnia Network.

## 📊 Project Status

**Current Phase**: Smart Contract Development (Phase 1) ✅ **COMPLETED**  
**Progress**: All core contracts implemented, tested, and fully functional  
**Test Coverage**: 64/64 tests passing  
**Next Milestone**: Frontend MVP development

> 📋 See [Roadmap](./docs/roadmap.md) for detailed timeline and [MVP](./docs/mvp.md) for technical specifications.

## ✨ Key Features

Universal micropayment platform for digital content creators, built on Somnia Network.

> 📖 See [Proposal](./docs/proposal.md) for detailed overview and [Architecture](./docs/architecture.md) for technical details.

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

# Start Docker environment (recommended)
pnpm run docker:up

# Setup test environment
pnpm run test:setup

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

```bash
# Compile contracts
pnpm run compile

# Run tests
pnpm run test:contracts

# Start development
pnpm run dev
```

> 🔧 See [Scripts](./docs/scripts.md) for all available commands and [Testing](./docs/testing.md) for testing strategies.

## 🧪 Testing

```bash
# Run all tests
pnpm run test:contracts
```

> 🧪 See [Testing](./docs/testing.md) for comprehensive testing guide and strategies.

## 📚 Documentation

- [Proposal](./docs/proposal.md) - Project proposal and overview
- [MVP](./docs/mvp.md) - Technical specifications
- [Roadmap](./docs/roadmap.md) - Development timeline
- [Architecture](./docs/architecture.md) - System architecture
- [Testing](./docs/testing.md) - Testing guide and strategies
- [Scripts](./docs/scripts.md) - Development scripts guide
- [ADRs](./docs/adr/README.md) - Architecture Decision Records

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

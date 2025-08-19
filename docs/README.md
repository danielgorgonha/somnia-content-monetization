# Documentation Index - Somnia Content Monetization

## 📚 Core Documentation

### 🎯 Project Overview
- **[Proposal](./proposal.md)** - Project proposal and overview
- **[MVP](./mvp.md)** - Technical specifications and requirements
- **[Roadmap](./roadmap.md)** - Development timeline and milestones

### 🏗️ Technical Architecture
- **[Architecture](./architecture.md)** - System architecture and design
- **[ADRs](./adr/README.md)** - Architecture Decision Records

### 🧪 Testing & Quality
- **[Testing](./testing.md)** - Testing strategies and procedures
- **[Scripts](./scripts.md)** - Development scripts and automation
- **[Versioning](./versioning.md)** - Contract versioning system

## 🚀 Quick Reference

### Essential Commands
```bash
# Development
pnpm run compile          # Compile contracts
pnpm run test:contracts   # Run unit tests
pnpm run deploy:testnet   # Deploy to testnet
pnpm run test:manual      # Test deployed contracts
pnpm run list:versions    # List contract versions
```

### Documentation Structure
```
docs/
├── README.md              # This index
├── proposal.md            # Project overview
├── mvp.md                 # Technical specifications
├── roadmap.md             # Development timeline
├── architecture.md        # System architecture
├── testing.md             # Testing guide
├── scripts.md             # Scripts documentation
├── versioning.md          # Versioning system
└── adr/                   # Architecture Decision Records
    ├── README.md          # ADR index
    ├── 007-micropayment-precision.md
    └── 008-micropayment-user-parameter-fix.md
```

## 📊 Current Status

### ✅ Completed
- **Smart Contracts**: All core contracts implemented and tested
- **Test Coverage**: 64/64 tests passing
- **Testnet Deployment**: Contracts deployed and validated
- **Documentation**: Comprehensive documentation suite
- **Versioning System**: File-based versioning implemented

### 🔄 In Progress
- **Frontend MVP**: Ready to start development
- **Contract Registry**: Advanced versioning system (future)

### 📋 Next Steps
- **Phase 2**: Frontend MVP development
- **Phase 3**: User experience refinement
- **Phase 4**: Demo and documentation
- **Phase 5**: Hackathon submission

## 🔗 Quick Links

### Deployed Contracts (Somnia Testnet)
- **CreatorRegistry**: `0xf629fB3b2a5a03D70fD14bA88eA4828da5356e5D`
- **MicroPayVault**: `0xD2f94B843557d52A81d12ED04553f57BC7D9a819`
- **MeteredAccess**: `0xf65391952439f75E2f8c87952f0f143f3117D1f6`

### Useful Resources
- **Testnet Explorer**: [Somnia Blockscout](https://testnet.somnia.network)
- **Repository**: [GitHub](https://github.com/danielgorgonha/somnia-content-monetization)
- **Project Status**: [Roadmap](./roadmap.md)

## 📝 Documentation Standards

### Writing Guidelines
- Use clear, concise language
- Include code examples where relevant
- Maintain consistent formatting
- Update when features change
- Link related documents

### Maintenance
- Review documentation monthly
- Update with new features
- Remove outdated information
- Ensure accuracy of examples
- Validate all links

---

**Last Updated**: August 19, 2025  
**Version**: 1.1.0  
**Status**: Phase 1 Complete - Ready for Frontend Development

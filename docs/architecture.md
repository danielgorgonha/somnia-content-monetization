# Somnia Content Monetization - System Architecture

## 🏗️ Architecture Overview

Somnia Content Monetization is a universal micropayment platform built entirely on-chain using Somnia Network to enable fractional cent transactions with seamless user experience.

### 🎯 Architectural Principles
- **100% On-chain**: All critical transactions on blockchain
- **Seamless UX**: Zero friction in micropayments
- **Scalability**: Support for thousands of simultaneous transactions
- **Transparency**: All transactions visible and auditable
- **Universality**: Support for any digital content type

## 📁 Project Structure

```
somnia-content-monetization/
├── 📁 contracts/                 # Smart Contracts
│   ├── 📄 CreatorRegistry.sol    # Creator and content registration
│   ├── 📄 MicroPayVault.sol      # Escrow system
│   ├── 📄 MeteredAccess.sol      # Session and consumption control
│   ├── 📄 interfaces/            # Contract interfaces
│   │   ├── 📄 ICreatorRegistry.sol
│   │   ├── 📄 IMicroPayVault.sol
│   │   └── 📄 IMeteredAccess.sol
│   └── 📄 libraries/             # Helper libraries
│       ├── 📄 PaymentMath.sol    # Micropayment calculations
│       └── 📄 SessionManager.sol # Session management
├── 📁 frontend/                  # React application
│   ├── 📄 public/               # Static files
│   ├── 📄 src/
│   │   ├── 📄 components/       # React components
│   │   │   ├── 📄 common/       # Reusable components
│   │   │   │   ├── 📄 Header.tsx
│   │   │   │   ├── 📄 Footer.tsx
│   │   │   │   └── 📄 Loading.tsx
│   │   │   ├── 📄 wallet/       # Wallet components
│   │   │   │   ├── 📄 WalletConnect.tsx
│   │   │   │   └── 📄 WalletStatus.tsx
│   │   │   ├── 📄 content/      # Content components
│   │   │   │   ├── 📄 VideoPlayer.tsx
│   │   │   │   ├── 📄 LiveStreamPlayer.tsx
│   │   │   │   ├── 📄 AudioPlayer.tsx
│   │   │   │   ├── 📄 TextReader.tsx
│   │   │   │   ├── 📄 RecipeViewer.tsx
│   │   │   │   ├── 📄 BookReader.tsx
│   │   │   │   └── 📄 PaymentTracker.tsx
│   │   │   └── 📄 dashboard/    # Creator dashboard
│   │   │       ├── 📄 CreatorDashboard.tsx
│   │   │       ├── 📄 RevenueChart.tsx
│   │   │       └── 📄 TransactionList.tsx
│   │   ├── 📄 pages/            # Application pages
│   │   │   ├── 📄 Home.tsx      # Main page
│   │   │   ├── 📄 Creator.tsx   # Creator dashboard
│   │   │   ├── 📄 Content.tsx   # Content page
│   │   │   └── 📄 About.tsx     # About project
│   │   ├── 📄 hooks/            # Custom hooks
│   │   │   ├── 📄 useWallet.ts  # Wallet hook
│   │   │   ├── 📄 useContracts.ts # Contracts hook
│   │   │   └── 📄 useMicropayment.ts # Micropayment hook
│   │   ├── 📄 services/         # Services and APIs
│   │   │   ├── 📄 web3.ts       # Web3 configuration
│   │   │   ├── 📄 contracts.ts  # Contract instances
│   │   │   └── 📄 api.ts        # External APIs
│   │   ├── 📄 utils/            # Utilities
│   │   │   ├── 📄 constants.ts  # Project constants
│   │   │   ├── 📄 helpers.ts    # Helper functions
│   │   │   └── 📄 types.ts      # TypeScript types
│   │   ├── 📄 styles/           # Styles
│   │   │   └── 📄 globals.css   # Global styles
│   │   ├── 📄 App.tsx           # Main component
│   │   └── 📄 index.tsx         # Entry point
│   ├── 📄 package.json          # Frontend dependencies
│   ├── 📄 tailwind.config.js    # Tailwind configuration
│   └── 📄 tsconfig.json         # TypeScript configuration
├── 📁 backend/                  # Backend (optional for MVP)
│   ├── 📄 src/
│   │   ├── 📄 controllers/      # Controllers
│   │   ├── 📄 services/         # Services
│   │   └── 📄 routes/           # API routes
│   └── 📄 package.json
├── 📁 scripts/                  # Deploy and test scripts
│   ├── 📄 deploy.ts             # Deploy script
│   ├── 📄 verify.ts             # Verification script
│   └── 📄 test-setup.ts         # Test setup
├── 📁 docs/                     # Documentation
│   ├── 📄 README.md             # Main documentation
│   ├── 📄 DEPLOY.md             # Deploy guide
│   ├── 📄 API.md                # API documentation
│   └── 📄 diagrams/             # Architecture diagrams
│       ├── 📄 architecture.png  # General diagram
│       ├── 📄 flow.png          # Micropayment flow
│       └── 📄 contracts.png     # Contract diagram
├── 📁 hardhat/                  # Hardhat configuration
│   ├── 📄 hardhat.config.ts     # Main configuration
│   ├── 📄 networks.ts           # Network configuration
│   └── 📄 tasks/                # Custom tasks
├── 📄 package.json              # Main dependencies
├── 📄 hardhat.config.ts         # Hardhat configuration
├── 📄 env.example               # Environment variables
├── 📄 .gitignore                # Ignored files
└── 📄 README.md                 # Main README
```

## 🔧 Technology Stack

### Blockchain
- **Network**: Somnia Testnet (Shannon)
- **Compatibility**: EVM
- **Framework**: Hardhat
- **Language**: Solidity

### Frontend
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Web3**: Ethers.js + Wagmi
- **Wallet**: MetaMask + WalletConnect
- **Build**: Vite

### Backend (Optional for MVP)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (for analytics)
- **Cache**: Redis (for performance)

### DevOps
- **Deploy**: Vercel (frontend) + Railway (backend)
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry
- **Analytics**: Google Analytics

## 🏛️ Smart Contract Architecture

### 1. CreatorRegistry.sol
```solidity
contract CreatorRegistry {
    struct Content {
        address creator;
        address token;
        ContentType contentType;
        uint256 ratePerUnit;
        bool active;
        uint256 totalEarnings;
        uint256 totalViews;
        string metadata;
    }
    
    mapping(bytes32 => Content) public contents;
    mapping(address => bytes32[]) public creatorContents;
    
    event ContentRegistered(bytes32 indexed contentId, address indexed creator);
    event ContentUpdated(bytes32 indexed contentId, uint256 newRate);
}
```

### 2. MicroPayVault.sol
```solidity
contract MicroPayVault {
    IERC20 public token;
    mapping(address => uint256) public balances;
    
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event TransferToCreator(address indexed creator, uint256 amount);
}
```

### 3. MeteredAccess.sol
```solidity
contract MeteredAccess {
    struct Session {
        bytes32 contentId;
        address user;
        uint256 spendCap;
        uint256 accrued;
        uint256 startTime;
        uint256 lastUpdate;
        bool active;
    }
    
    mapping(uint256 => Session) public sessions;
    mapping(address => uint256[]) public userSessions;
    
    event SessionStarted(uint256 indexed sessionId, address indexed user);
    event PaymentAccrued(uint256 indexed sessionId, uint256 amount);
    event SessionSettled(uint256 indexed sessionId, uint256 totalAmount);
}
```

## 🔄 Micropayment Flow

### 1. Initial Setup
```
User → Connect Wallet → Deposit Balance → Set Monthly Limit
```

### 2. Content Registration
```
Creator → Register Content → Set Type and Rate → Content Available
```

### 3. Consumption and Payment
```
User → Choose Content → Start Session → Consume → Automatic Micropayments
```

### 4. Settlement
```
System → Accumulate Payments → Settle Periodically → Creator Receives
```

## 📚 Content Types and Billing Metrics

### 🎥 Time-based Content
- **Videos**: $0.001 per second watched
- **Audio/Podcasts**: $0.0005 per second listened
- **Live Streaming**: $0.001 per second watched
- **Interactive Lives**: $0.002 per second of participation

## 🎥 Live Streaming - Special Use Case

### Unique Characteristics
- **Real-time Micropayments**: Every second of viewing
- **Massive Scalability**: Support for thousands of simultaneous viewers
- **Instant Interaction**: Real-time donations and interactions
- **Complete Transparency**: Creator sees revenue growing live

### Technical Flow
```
1. Streamer starts live → Creates micropayment session
2. Viewers enter → Connect wallets automatically
3. During live → Micropayments every second
4. Real-time → Creator sees revenue growing
5. At end → Automatic settlement to wallet
```

### Advantages vs Twitch/YouTube
- **No Platform Fees**: 100% revenue to creator
- **Instant Payments**: No 30-60 day waiting periods
- **Complete Transparency**: All transactions visible
- **No Intermediaries**: Direct creator-viewer connection

### 📖 Volume-based Content
- **Articles**: $0.01 per 100 words read
- **Books**: $0.05 per page read
- **Recipes**: $0.02 per step completed
- **Courses**: $0.10 per module accessed

### 🔓 One-time Access Content
- **Downloads**: $0.50 per file downloaded
- **Queries**: $0.25 per question answered
- **Reviews**: $1.00 per complete review

### 📊 Practical Examples

#### 10-minute Video
- **Rate**: $0.001/second
- **Total Cost**: $0.60 (600 seconds × $0.001)
- **Revenue for 1,000 views**: $600

#### Live Streaming (2 hours)
- **Rate**: $0.001/second
- **Total Cost**: $7.20 (7,200 seconds × $0.001)
- **Revenue for 1,000 viewers**: $7,200

#### 2,000-word Article
- **Rate**: $0.01/100 words
- **Total Cost**: $0.20 (20 × $0.01)
- **Revenue for 5,000 reads**: $1,000

#### 300-page Book
- **Rate**: $0.05/page
- **Total Cost**: $15.00 (300 × $0.05)
- **Revenue for 100 reads**: $1,500

## 🎨 User Interface

### Main Components

#### 1. WalletConnect
- MetaMask connection
- WalletConnect fallback
- Connection status
- Available balance

#### 2. ContentViewer
- **VideoPlayer**: Video player with time tracking
- **LiveStreamPlayer**: Live streaming player with real-time micropayments
- **AudioPlayer**: Audio/podcast player
- **TextReader**: Article/text reader with word tracking
- **RecipeViewer**: Recipe viewer with step tracking
- **BookReader**: Book reader with page tracking
- Real-time micropayment indicator
- Content-specific controls

#### 3. PaymentTracker
- Real-time balance
- Monthly limit
- Payment history
- Complete transparency

#### 4. CreatorDashboard
- Accumulated revenue
- Transaction list
- Content statistics
- Content management

## 🔐 Security and Account Abstraction

### Session Keys
```typescript
interface SessionKey {
  publicKey: string;
  permissions: string[];
  spendLimit: string;
  validUntil: number;
}
```

### Gasless Transactions
```typescript
interface GaslessConfig {
  relayer: string;
  paymaster: string;
  userOperation: UserOperation;
}
```

### Smart Wallet Setup
```typescript
const smartWallet = await createSmartWallet({
  chain: "somnia-testnet",
  gasless: true,
  sessionKeys: true
});
```

## 📊 Monitoring and Analytics

### On-chain Metrics
- Micropayment volume
- Active user count
- Most popular creators
- Conversion rate

### Off-chain Metrics
- Session duration
- Content engagement
- Application performance
- User experience

## 🚀 Deploy and Distribution

### Contracts
```bash
# Deploy to Somnia Testnet
npx hardhat deploy --network somnia-testnet

# Verify contracts
npx hardhat verify --network somnia-testnet
```

### Frontend
```bash
# Production build
pnpm run build

# Deploy to Vercel
vercel --prod
```

### Backend (Optional)
```bash
# Deploy to Railway
railway up
```

## 🔮 Future Scalability

### Phase 2: SDK & API
- Developer library
- Integration with existing platforms
- Webhooks for events

### Phase 3: DeFi & Gamification
- Automatic yield farming
- Engagement NFTs
- Reward system

### Phase 4: DAO & Governance
- Utility token
- On-chain voting
- Community proposals

## 📋 Implementation Checklist

### MVP (Hackathon)
- [ ] Basic smart contracts
- [ ] Responsive frontend
- [ ] Web3 integration
- [ ] Working micropayments
- [ ] Creator dashboard

### Post-MVP
- [ ] Complete Account Abstraction
- [ ] Advanced analytics
- [ ] Developer SDK
- [ ] DeFi integration
- [ ] NFT system

## 🎯 Conclusion

This architecture ensures a robust and scalable MVP with focus on user experience and technical viability. The modular design allows future evolution and integration with other systems.

# Somnia Content Monetization - MVP Technical Specifications

## 🎯 MVP Objective

Demonstrate that on-chain micropayments are viable, cost-effective, and functional on Somnia Network for any digital content type (video, audio, text, recipes, books, etc.) with seamless user experience and zero friction.

**Status**: ✅ Core contracts implemented and tested

## 📅 Project Status
**Current Date**: August 18, 2025 (Day 1 of hackathon)
**Time Remaining**: 25 days until final delivery

### 🚨 Immediate Priorities
1. **Environment Setup** (Day 1-2) ✅
2. **Basic Smart Contracts** (Day 2-3) 🔄
3. **Minimum Frontend** (Day 4-6) ⏳
4. **Web3 Integration** (Day 6-8) ⏳
5. **Functional Demo** (Day 8-12) ⏳

## 🏗️ Technical Architecture

### Technology Stack

#### Blockchain
- **Network**: Somnia Testnet (Shannon)
- **Compatibility**: EVM
- **Fees**: Ultra-low (enables micropayments)
- **Speed**: 1.05M TPS + sub-second finality

#### Smart Contracts
- **Language**: Solidity
- **Framework**: Hardhat
- **Deploy**: Somnia Testnet
- **Verification**: Blockscout Explorer

#### Frontend
- **Framework**: React + TypeScript
- **Web3**: Ethers.js + Wagmi
- **Wallet**: MetaMask + WalletConnect
- **UI**: Tailwind CSS + Headless UI

#### Seamless UX
- **Account Abstraction**: ERC-4337 (Smart Wallets)
- **Session Keys**: Temporary authorization
- **Gasless**: Relayers for micropayments

## 📋 Smart Contracts

### 1. CreatorRegistry.sol
```solidity
// Content creator and content registration
contract CreatorRegistry {
    enum ContentType {
        VIDEO, AUDIO, TEXT, RECIPE, BOOK, COURSE, PODCAST, ARTICLE
    }
    
    struct Content {
        address creator;
        address token;
        ContentType contentType;
        uint256 ratePerUnit; // rate per second, per word, per page, etc.
        bool active;
        string metadata; // JSON with content details
    }
    
    mapping(bytes32 => Content) public contents;
    
    function registerContent(
        bytes32 contentId, 
        address token, 
        ContentType contentType,
        uint256 ratePerUnit,
        string memory metadata
    ) external;
    
    function getContent(bytes32 contentId) 
        external view returns (Content memory);
}
```

### 2. MicroPayVault.sol
```solidity
// Escrow for pre-loaded balances
contract MicroPayVault {
    mapping(address => uint256) public balances;
    
    function deposit(uint256 amount) external;
    function withdraw(uint256 amount) external;
    function transferToCreator(
        address creator, 
        uint256 amount
    ) external;
}
```

### 3. MeteredAccess.sol
```solidity
// Consumption-based billing system
contract MeteredAccess {
    enum ConsumptionType {
        TIME_BASED,    // Video, Audio, Podcast
        WORD_BASED,    // Text, Articles
        PAGE_BASED,    // Books, PDFs
        RECIPE_BASED,  // Recipes, Instructions
        ACCESS_BASED   // One-time access
    }
    
    struct Session {
        bytes32 contentId;
        address user;
        uint256 spendCap;
        uint256 accrued;
        uint256 startTime;
        bool active;
        ConsumptionType consumptionType;
        uint256 unitsConsumed; // seconds, words, pages, etc.
    }
    
    mapping(uint256 => Session) public sessions;
    
    function startSession(
        bytes32 contentId, 
        uint256 spendCap,
        ConsumptionType consumptionType
    ) external returns (uint256 sessionId);
    
    function consume(
        uint256 sessionId, 
        uint256 unitsConsumed
    ) external;
    
    function settle(uint256 sessionId) external;
    function stopSession(uint256 sessionId) external;
}
```

## 🎮 Micropayment Flow

### 1. Initial Setup
```
User → Connect Wallet → Deposit Balance → Set Monthly Limit
```

### 2. Session Start
```
User → Choose Content → startSession() → Session Key Created
```

### 3. Continuous Consumption
```
Player → Tracking every 10s → consume() → Accumulate Payment
```

### 4. Periodic Settlement
```
Relayer → settle() every 30s → Creator Receives → Balance Updated
```

## 🎨 User Interface

### Main Page
- **Header**: Logo + Connect Wallet
- **Player**: Video/Audio with controls
- **Micropayment Status**: Current balance + Monthly limit
- **Payment Button**: "Pay $0.01 to access"

### Creator Dashboard
- **Total Revenue**: Accumulated balance
- **Transactions**: List of received micropayments
- **Content Management**: Video/audio management
- **Withdrawal**: Button to withdraw funds

### Transparency Panel
- **Real-time Transactions**: Micropayment feed
- **Statistics**: Volume, active users, creators
- **Explorer Links**: Links to Somnia Blockscout

## 🔧 Technical Implementation

### Account Abstraction Setup
```javascript
// Smart Wallet Configuration
const smartWallet = await createSmartWallet({
  chain: "somnia-testnet",
  gasless: true
});

// Session Key for micropayments
const sessionKey = await createSessionKey({
  permissions: ["consume", "settle"],
  spendLimit: "0.50", // $0.50 maximum per session
  validUntil: Date.now() + 3600000 // 1 hour
});
```

### Universal Micropayment Tracking
```javascript
// Player with universal consumption tracking
const contentPlayer = new ContentPlayer({
  contentType: 'VIDEO', // or 'TEXT', 'AUDIO', 'RECIPE', etc.
  onConsumptionUpdate: (unitsConsumed) => {
    if (unitsConsumed % 10 === 0) { // Every 10 units
      consumePayment(sessionId, unitsConsumed);
    }
  }
});

// Specific tracking examples
const videoPlayer = new VideoPlayer({
  onTimeUpdate: (seconds) => consumePayment(sessionId, seconds)
});

const textReader = new TextReader({
  onWordCount: (words) => consumePayment(sessionId, words)
});

const bookReader = new BookReader({
  onPageChange: (pages) => consumePayment(sessionId, pages)
});
```

### Gasless Transactions
```javascript
// Relayer for automatic micropayments
const relayTransaction = async (txData) => {
  const response = await fetch('/api/relay', {
    method: 'POST',
    body: JSON.stringify(txData)
  });
  return response.json();
};
```

## 📊 MVP Metrics

### Functional
- ✅ Deploy on Somnia Testnet
- ✅ Micropayments working
- ✅ Responsive interface
- ✅ Creator dashboard

### Performance
- **Transaction Fee**: < $0.001 per micropayment
- **Confirmation Time**: < 1 second
- **Scalability**: Support for 100+ simultaneous users

### UX
- **Setup**: < 2 minutes for first micropayment
- **Friction**: Zero pop-ups during consumption
- **Transparency**: 100% of transactions visible

## 🧪 Testing

### Contract Tests
```bash
# Run tests
pnpm run test

# Coverage
pnpm run coverage

# Deploy to testnet
pnpm run deploy:testnet
```

### Integration Tests
- Complete micropayment flow
- Multiple simultaneous users
- Error recovery
- Limit validation

### UX Tests
- Wallet connectivity
- Mobile responsiveness
- Accessibility
- Performance

## 📦 Deploy and Distribution

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

# Deploy to Vercel/Netlify
pnpm run deploy
```

### Documentation
- Detailed README
- Architecture diagram
- Installation instructions
- Contract addresses

## 🎯 Success Criteria

### Technical
- ✅ Functional contracts on Somnia
- ✅ Micropayments < $0.001
- ✅ Frictionless UX
- ✅ Documented code

### Functional
- ✅ Real-time micropayment demo
- ✅ Creator dashboard
- ✅ Complete transparency
- ✅ Mobile responsive

### Hackathon
- ✅ Public repository
- ✅ < 5min demo video
- ✅ < 10 slide pitch deck
- ✅ Documented architecture

## 🔮 Next Steps

### Post-MVP
1. **SDK**: Library for integration
2. **Analytics**: Advanced metrics
3. **Gamification**: Engagement NFTs
4. **DeFi**: Automatic yield pools

### Scalability
1. **Multi-chain**: Support for other networks
2. **Fiat On-ramp**: Card payment integration
3. **API**: For third-party developers
4. **DAO**: Decentralized governance

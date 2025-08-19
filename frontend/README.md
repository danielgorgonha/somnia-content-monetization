# Somnia Content Monetization - Frontend

Modern React frontend for the Somnia Content Monetization platform, built with TypeScript, Tailwind CSS, and Web3 integration.

## 🚀 Features

- **Modern UI/UX** - Beautiful, responsive design with Tailwind CSS
- **Web3 Integration** - Seamless wallet connection with RainbowKit
- **Content Player** - Video/audio player with micropayment tracking
- **Creator Dashboard** - Upload and manage content
- **User Dashboard** - Discover and consume content
- **Real-time Payments** - Live micropayment processing

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better DX
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Wagmi** - React hooks for Ethereum
- **RainbowKit** - Wallet connection UI
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

## 📦 Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id
VITE_CONTRACT_ADDRESSES={"CREATOR_REGISTRY":"0x...","MICRO_PAY_VAULT":"0x...","METERED_ACCESS":"0x..."}
VITE_NETWORK_RPC_URL=https://testnet.somnia.network
```

### WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy the Project ID
4. Add it to your `.env` file

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Base UI components
│   ├── layout/         # Layout components (Header, Footer)
│   ├── wallet/         # Wallet-related components
│   ├── player/         # Video/audio player components
│   └── micropayment/   # Micropayment interface components
├── hooks/              # Custom React hooks
├── contracts/          # Contract ABIs and addresses
├── utils/              # Utility functions
├── pages/              # Page components
└── main.tsx           # App entry point
```

## 🎨 Design System

### Colors

- **Primary**: Somnia blue (`#0ea5e9`)
- **Secondary**: Gray scale
- **Success**: Green (`#10b981`)
- **Warning**: Yellow (`#f59e0b`)
- **Error**: Red (`#ef4444`)

### Components

- **Buttons**: `.btn-primary`, `.btn-secondary`
- **Cards**: `.card`
- **Inputs**: `.input-field`
- **Animations**: `.animate-fade-in`, `.animate-slide-up`

## 🔌 Web3 Integration

### Wallet Connection

The app uses RainbowKit for wallet connection, supporting:
- MetaMask
- WalletConnect
- Coinbase Wallet
- And more...

### Contract Interaction

Smart contract interactions are handled through:
- **Wagmi hooks** for reading data
- **Ethers.js** for transactions
- **Custom hooks** for complex operations

## 📱 Responsive Design

The frontend is fully responsive with:
- **Mobile-first** approach
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch-friendly** interactions
- **Optimized** for all screen sizes

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build the project
pnpm build

# Deploy to Netlify
# Upload the dist folder
```

## 🔍 Development

### Code Quality

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🏆 Hackathon

Built for the Somnia DeFi Hackathon (August 13 - September 12, 2025).

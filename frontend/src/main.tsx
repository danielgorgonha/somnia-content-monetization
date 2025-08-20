import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { mainnet, polygon, optimism, arbitrum, base, zora } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

import App from './App.tsx'
import './index.css'

// Configure chains & providers
const { chains, publicClient } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    zora,
    // Hardhat local network for testing (simulating Somnia)
    {
      id: 31337,
      name: 'Somnia Local (Hardhat)',
      network: 'somnia-local',
      nativeCurrency: {
        decimals: 18,
        name: 'Somnia',
        symbol: 'SOM',
      },
      rpcUrls: {
        public: { http: ['http://127.0.0.1:8545'] },
        default: { http: ['http://127.0.0.1:8545'] },
      },
      testnet: true,
    },
    // Somnia testnet configuration
    {
      id: 80085, // Correct Somnia testnet chain ID
      name: 'Somnia Testnet',
      network: 'somnia-testnet',
      nativeCurrency: {
        decimals: 18,
        name: 'Somnia',
        symbol: 'SOM',
      },
      rpcUrls: {
        public: { http: ['https://testnet.somnia.network'] },
        default: { http: ['https://testnet.somnia.network'] },
      },
      blockExplorers: {
        default: {
          name: 'Somnia Blockscout',
          url: 'https://testnet.somnia.network',
        },
      },
      testnet: true,
    },
  ],
  [publicProvider()]
)

// Set up wagmi config
const { connectors } = getDefaultWallets({
  appName: 'Somnia Content Monetization',
  projectId: 'demo', // Temporary for development
  chains,
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  // Completely disable WebSocket
  webSocketPublicClient: undefined,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider 
        chains={chains}
        locale="en-US"
        showRecentTransactions={false}
      >
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
        </BrowserRouter>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
)

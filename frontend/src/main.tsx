import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { mainnet, polygon, optimism, arbitrum, base, zora } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

import App from './App.tsx'
import './index.css'

// Configure chains & providers - only use public provider to avoid WebSocket issues
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
        public: { http: ['https://testnet-rpc.somnia.zone'] },
        default: { http: ['https://testnet-rpc.somnia.zone'] },
      },
      testnet: true,
    },
  ],
  [publicProvider()]
)

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
  ],
  publicClient,
  // Completely disable WebSocket to avoid connection errors
  webSocketPublicClient: undefined,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </BrowserRouter>
    </WagmiConfig>
  </React.StrictMode>,
)

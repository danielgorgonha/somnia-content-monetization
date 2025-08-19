// Contract addresses (Somnia Testnet)
export const CONTRACT_ADDRESSES = {
  CREATOR_REGISTRY: '0xf629fB3b2a5a03D70fD14bA88eA4828da5356e5D',
  MICRO_PAY_VAULT: '0xD2f94B843557d52A81d12ED04553f57BC7D9a819',
  METERED_ACCESS: '0xf65391952439f75E2f8c87952f0f143f3117D1f6',
}

// Network configuration
export const NETWORK_CONFIG = {
  CHAIN_ID: 80001, // Mumbai testnet for now
  CHAIN_NAME: 'Somnia Testnet',
  RPC_URL: 'https://testnet.somnia.network',
  EXPLORER_URL: 'https://testnet.somnia.network',
  CURRENCY_SYMBOL: 'SOM',
  CURRENCY_DECIMALS: 18,
}

// App configuration
export const APP_CONFIG = {
  NAME: 'Somnia Content Monetization',
  DESCRIPTION: 'Universal micropayment platform for digital content creators',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@somnia-content.com',
}

// Micropayment settings
export const MICROPAYMENT_CONFIG = {
  MIN_PAYMENT: 0.001, // 0.001 SOM
  MAX_PAYMENT: 100, // 100 SOM
  DEFAULT_RATE: 0.001, // 0.001 SOM per second
  UPDATE_INTERVAL: 1000, // 1 second
}

// UI constants
export const UI_CONFIG = {
  ANIMATION_DURATION: 200,
  DEBOUNCE_DELAY: 300,
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  SUPPORTED_FORMATS: ['mp4', 'webm', 'ogg', 'mp3', 'wav'],
}

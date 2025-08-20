export interface Session {
  user: string;
  creator: string;
  contentId: string;
  active: boolean;
  startTime: number;
  lastUpdate: number;
  totalConsumption: number;
  totalPaid: number;
}

export interface CreatorProfile {
  address: string;
  name: string;
  description: string;
  contentCount: number;
  totalEarnings: number;
  isVerified: boolean;
}

export interface ContentItem {
  id: string;
  creator: string;
  title: string;
  description: string;
  pricePerSecond: number;
  totalViews: number;
  totalEarnings: number;
  isActive: boolean;
  createdAt: number;
}

export interface MicropaymentEvent {
  user: string;
  creator: string;
  amount: number;
  contentId: string;
  timestamp: number;
}

export interface SessionUpdateEvent {
  sessionId: string;
  consumptionIncrease: number;
  paymentAmount: number;
  timestamp: number;
}

// Contract addresses
export const CONTRACT_ADDRESSES = {
  CREATOR_REGISTRY: '0xf629fB3b2a5a03D70fD14bA88eA4828da5356e5D',
  MICRO_PAY_VAULT: '0xD2f94B843557d52A81d12ED04553f57BC7D9a819',
  METERED_ACCESS: '0xf65391952439f75E2f8c87952f0f143f3117D1f6',
} as const;

// Network configuration
export const NETWORK_CONFIG = {
  chainId: 80085, // Somnia Testnet
  name: 'Somnia Testnet',
  rpcUrl: 'https://testnet.somnia.network',
  explorer: 'https://testnet.somnia.network',
  nativeCurrency: {
    name: 'Somnia',
    symbol: 'SOM',
    decimals: 18,
  },
} as const;

// Contract ABIs (simplified for TypeScript)
export interface IMeteredAccess {
  // Session management
  createSession(creator: string, contentId: string): Promise<string>;
  updateSession(sessionId: string, consumption: number): Promise<void>;
  endSession(sessionId: string): Promise<void>;
  
  // Queries
  getSession(sessionId: string): Promise<Session>;
  getActiveSessions(user: string): Promise<string[]>;
  getSessionConsumption(sessionId: string): Promise<number>;
  
  // Events
  on(event: 'SessionCreated', listener: (sessionId: string, user: string, creator: string, contentId: string) => void): void;
  on(event: 'SessionUpdated', listener: (sessionId: string, consumptionIncrease: number, paymentAmount: number) => void): void;
  on(event: 'SessionEnded', listener: (sessionId: string, totalConsumption: number, totalPaid: number) => void): void;
  on(event: 'MicropaymentProcessed', listener: (user: string, creator: string, amount: number, contentId: string) => void): void;
}

export interface ICreatorRegistry {
  // Creator management
  registerCreator(name: string, description: string): Promise<void>;
  updateCreatorProfile(name: string, description: string): Promise<void>;
  
  // Content management
  registerContent(title: string, description: string, pricePerSecond: number): Promise<string>;
  updateContent(contentId: string, title: string, description: string, pricePerSecond: number): Promise<void>;
  deactivateContent(contentId: string): Promise<void>;
  
  // Queries
  getCreatorProfile(creator: string): Promise<CreatorProfile>;
  getContent(contentId: string): Promise<ContentItem>;
  getCreatorContent(creator: string): Promise<string[]>;
  
  // Events
  on(event: 'CreatorRegistered', listener: (creator: string, name: string, description: string) => void): void;
  on(event: 'ContentRegistered', listener: (contentId: string, creator: string, title: string, pricePerSecond: number) => void): void;
}

export interface IMicroPayVault {
  // Payment management
  deposit(): Promise<void>;
  withdraw(amount: number): Promise<void>;
  
  // Queries
  getBalance(user: string): Promise<number>;
  getTotalDeposits(): Promise<number>;
  
  // Events
  on(event: 'Deposit', listener: (user: string, amount: number) => void): void;
  on(event: 'Withdrawal', listener: (user: string, amount: number) => void): void;
}

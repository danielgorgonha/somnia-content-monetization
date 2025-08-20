// Contract ABIs - Using dynamic imports to avoid JSON parsing issues
// import MeteredAccessABI from '../../../artifacts/contracts/MeteredAccess.sol/MeteredAccess.json';
// import CreatorRegistryABI from '../../../artifacts/contracts/CreatorRegistry.sol/CreatorRegistry.json';
// import MicroPayVaultABI from '../../../artifacts/contracts/MicroPayVault.sol/MicroPayVault.json';

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
  description?: string;
  pricePerSecond: number;
  totalViews: number;
  totalEarnings: number;
  isActive: boolean;
  createdAt: number;
  thumbnail?: string;
  duration?: number;
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
  consumption: number;
  payment: number;
  timestamp: number;
}

export const CONTRACT_ADDRESSES = {
  CREATOR_REGISTRY: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
  MICRO_PAY_VAULT: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
  METERED_ACCESS: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
} as const;

export const NETWORK_CONFIG = {
  chainId: 80085, // Somnia Testnet
  name: 'Somnia Testnet',
  rpcUrl: 'https://testnet.somnia.network',
  blockExplorer: 'https://testnet.somnia.network',
  nativeCurrency: {
    name: 'Somnia',
    symbol: 'SOM',
    decimals: 18,
  },
} as const;

// Contract ABIs - Simplified for now
export const CONTRACT_ABIS = {
  METERED_ACCESS: [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_creatorRegistry",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_microPayVault",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "contentId",
          "type": "bytes32"
        }
      ],
      "name": "startSession",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "sessionId",
          "type": "bytes32"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "sessionId",
          "type": "bytes32"
        }
      ],
      "name": "endSession",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "getActiveSessions",
      "outputs": [
        {
          "internalType": "bytes32[]",
          "name": "",
          "type": "bytes32[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "sessionId",
          "type": "bytes32"
        },
        {
          "internalType": "uint128",
          "name": "consumption",
          "type": "uint128"
        }
      ],
      "name": "updateSession",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "sessionId",
          "type": "bytes32"
        }
      ],
      "name": "getSession",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "bytes32",
              "name": "contentId",
              "type": "bytes32"
            },
            {
              "internalType": "uint32",
              "name": "startTime",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "lastUpdate",
              "type": "uint32"
            },
            {
              "internalType": "uint128",
              "name": "totalConsumption",
              "type": "uint128"
            },
            {
              "internalType": "uint256",
              "name": "totalPayment",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "active",
              "type": "bool"
            }
          ],
          "internalType": "struct IMeteredAccess.Session",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  CREATOR_REGISTRY: [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "rate",
          "type": "uint256"
        }
      ],
      "name": "registerCreator",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "rate",
          "type": "uint256"
        }
      ],
      "name": "updateProfile",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "contentId",
          "type": "bytes32"
        },
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "rate",
          "type": "uint256"
        }
      ],
      "name": "addContent",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "contentId",
          "type": "bytes32"
        }
      ],
      "name": "getContent",
      "outputs": [
        {
          "components": [
            {
              "internalType": "bytes32",
              "name": "id",
              "type": "bytes32"
            },
            {
              "internalType": "address",
              "name": "creator",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "title",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "rate",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "active",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "createdAt",
              "type": "uint256"
            }
          ],
          "internalType": "struct ICreatorRegistry.Content",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  MICRO_PAY_VAULT: [
    {
      "inputs": [],
      "name": "deposit",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
} as const;

// Contract ABIs (simplified for TypeScript)
export interface IMeteredAccess {
  createSession(creator: string, contentId: string): Promise<any>;
  updateSession(sessionId: string, consumption: number): Promise<any>;
  endSession(sessionId: string): Promise<any>;
  getActiveSessions(user: string): Promise<string[]>;
}

export interface ICreatorRegistry {
  registerCreator(name: string, description: string, rate: number): Promise<any>;
  updateProfile(name: string, description: string, rate: number): Promise<any>;
  addContent(contentId: string, title: string, description: string, rate: number): Promise<any>;
}

export interface IMicroPayVault {
  deposit(amount: number): Promise<any>;
  withdraw(amount: number): Promise<any>;
}

// App configuration
export const APP_CONFIG = {
  name: 'Somnia Content Monetization',
  version: '1.0.0',
  description: 'Universal micropayment platform for digital content creators',
} as const;

// Micropayment settings
export const MICROPAYMENT_CONFIG = {
  minSessionDuration: 1, // seconds
  maxSessionDuration: 3600, // 1 hour
  defaultRate: 1000000000000000, // 0.001 ETH/s
  updateInterval: 10, // seconds
} as const;

// UI constants
export const UI_CONFIG = {
  maxContentTitleLength: 100,
  maxDescriptionLength: 500,
  maxCreatorNameLength: 50,
  defaultThumbnailAspectRatio: 16 / 9,
} as const;

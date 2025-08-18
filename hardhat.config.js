require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    "somnia-testnet": {
      url: process.env.SOMNIA_TESTNET_RPC_URL || "https://testnet.somnia.network",
      chainId: parseInt(process.env.SOMNIA_CHAIN_ID) || 1234,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    "somnia-mainnet": {
      url: process.env.SOMNIA_MAINNET_RPC_URL || "https://mainnet.somnia.network",
      chainId: parseInt(process.env.SOMNIA_CHAIN_ID) || 1234,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      "somnia-testnet": process.env.SOMNIA_EXPLORER_API_KEY || "",
      "somnia-mainnet": process.env.SOMNIA_EXPLORER_API_KEY || "",
    },
    customChains: [
      {
        network: "somnia-testnet",
        chainId: parseInt(process.env.SOMNIA_CHAIN_ID) || 1234,
        urls: {
          apiURL: "https://testnet-explorer.somnia.network/api",
          browserURL: "https://testnet-explorer.somnia.network",
        },
      },
      {
        network: "somnia-mainnet",
        chainId: parseInt(process.env.SOMNIA_CHAIN_ID) || 1234,
        urls: {
          apiURL: "https://explorer.somnia.network/api",
          browserURL: "https://explorer.somnia.network",
        },
      },
    ],
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  mocha: {
    timeout: 40000,
  },
};

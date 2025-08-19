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
      viaIR: true,
    },
  },
  networks: {
    // Local development network
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
    // Anvil network (Docker)
    anvil: {
      url: "http://localhost:8545",
      chainId: 31337,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
    // Somnia Testnet (Shannon)
    "somnia-testnet": {
      url: "https://dream-rpc.somnia.network/",
      chainId: 50312,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
    // Somnia Mainnet
    "somnia-mainnet": {
      url: "https://mainnet.somnia.network",
      chainId: 80085,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      gasPrice: 1000000000, // 1 gwei
    },
  },
  etherscan: {
    apiKey: {
      "somnia-testnet": process.env.SOMNIA_API_KEY || "",
      "somnia-mainnet": process.env.SOMNIA_API_KEY || "",
    },
    customChains: [
      {
        network: "somnia-testnet",
        chainId: 80085,
        urls: {
          apiURL: "https://testnet-explorer.somnia.zone/api",
          browserURL: "https://testnet-explorer.somnia.zone",
        },
      },
      {
        network: "somnia-mainnet",
        chainId: 80085,
        urls: {
          apiURL: "https://explorer.somnia.zone/api",
          browserURL: "https://explorer.somnia.zone",
        },
      },
    ],
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    gasPrice: 1,
    gasPriceApi: "https://api.etherscan.io/api?module=proxy&action=eth_gasPrice",
  },
  mocha: {
    timeout: 60000, // 60 seconds
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
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
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    "blockdag-testnet": {
      url: "https://testnet.blockdag.network",
      chainId: 0x1a, // 26 in decimal - BlockDAG testnet chain ID
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 1000000000, // 1 gwei
      gas: 8000000,
    },
  },
  etherscan: {
    apiKey: {
      blockdag: "your-blockdag-api-key",
    },
    customChains: [
      {
        network: "blockdag",
        chainId: 26,
        urls: {
          apiURL: "https://testnet.blockdag.network/api",
          browserURL: "https://testnet.blockdag.network",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

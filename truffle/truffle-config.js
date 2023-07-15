const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
const mnemonic = "recovery phase";

module.exports = {
  contracts_build_directory: "../src/contracts/",
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    sphinx: {
      provider: () => new HDWalletProvider(mnemonic, `https://dapps.shardeum.org/`),
      network_id: 8081,
      confirmations: 2,
      networkCheckTimeout: 10000,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.18", // A version or constraint - Ex. "^0.5.0"
    }
  }
}
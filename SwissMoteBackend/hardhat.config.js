require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.4",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/534d4550f220425da5558298e3acb48c",
      accounts: [
        `0xf9e63b86818101934a40aec6833de8868b5892c67230dc80ba63f62b2d89d045`,
      ],
    },
  },
};

require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.4",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/APikey",
      accounts: [
        `0xPrivate key`,
      ],
    },
  },
};

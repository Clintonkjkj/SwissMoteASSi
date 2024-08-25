// async function main() {
//   // Get the ContractFactory for CoinFlip
//   const CoinFlip = await ethers.getContractFactory("CoinFlip");
//   // Deploy the contract
//   const coinFlip = await CoinFlip.deploy();

//   // Wait for the contract to be mined
//   await coinFlip.deployed();

//   // Log the contract address
//   console.log("CoinFlip deployed to:", coinFlip.address);
// }

// // Run the script
// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error("Error during deployment:", error);
//     process.exit(1);
//   });

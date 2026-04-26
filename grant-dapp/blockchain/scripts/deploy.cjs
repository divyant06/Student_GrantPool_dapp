const hre = require("hardhat");

async function main() {
  console.log("Fetching contract factory...");

  // Access ethers directly through the hardhat runtime environment (hre)
  const GrantPool = await ethers.getContractFactory("GrantPool");
  console.log("Deploying...");

  const grantPool = await GrantPool.deploy(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
    1,
    3,
    200000,
  );

  await grantPool.waitForDeployment(); // This is the standard method for newer ethers versions
  console.log("GrantPool deployed to:", await grantPool.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

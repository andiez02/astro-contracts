import { ethers } from "hardhat";

async function main() {
  const Factory = await ethers.getContractFactory("CollectionFactory");
  const factory = await Factory.deploy();
  await factory.waitForDeployment();

  console.log(
    "CollectionFactory deployed at:",
    await factory.getAddress()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

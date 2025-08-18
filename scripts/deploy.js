const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

    // Deploy CreatorRegistry
    const CreatorRegistry = await ethers.getContractFactory("CreatorRegistry");
    const creatorRegistry = await CreatorRegistry.deploy();
    await creatorRegistry.waitForDeployment();

    const creatorRegistryAddress = await creatorRegistry.getAddress();
    console.log("CreatorRegistry deployed to:", creatorRegistryAddress);

    // TODO: Deploy MicroPayVault (Phase 2)
    console.log("MicroPayVault deployment - Phase 2");
    
    // TODO: Deploy MeteredAccess (Phase 2)
    console.log("MeteredAccess deployment - Phase 2");

    console.log("Deployment completed!");
    console.log("Contract addresses:");
    console.log("- CreatorRegistry:", creatorRegistryAddress);
    console.log("- MicroPayVault: TBD");
    console.log("- MeteredAccess: TBD");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

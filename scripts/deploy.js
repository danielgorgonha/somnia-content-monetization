const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Deploying Somnia Content Monetization contracts...");
    
    const [deployer] = await ethers.getSigners();
    const deployerBalance = await ethers.provider.getBalance(deployer.address);

    console.log("📋 Deployment Info:");
    console.log(`- Deployer: ${deployer.address}`);
    console.log(`- Balance: ${ethers.formatEther(deployerBalance)} ETH`);
    console.log(`- Network: ${network.name}`);
    console.log(`- Chain ID: ${network.config.chainId}`);

    // Validate deployer balance
    if (deployerBalance < ethers.parseEther("0.1")) {
        throw new Error("Insufficient deployer balance. Need at least 0.1 ETH for deployment.");
    }

    const contracts = {};

    try {
        // Deploy CreatorRegistry
        console.log("\n📦 Deploying CreatorRegistry...");
        const CreatorRegistry = await ethers.getContractFactory("CreatorRegistry");
        const creatorRegistry = await CreatorRegistry.deploy();
        await creatorRegistry.waitForDeployment();

        const creatorRegistryAddress = await creatorRegistry.getAddress();
        contracts.creatorRegistry = creatorRegistryAddress;
        console.log(`✅ CreatorRegistry deployed to: ${creatorRegistryAddress}`);

        // Deploy MicroPayVault
        console.log("\n📦 Deploying MicroPayVault...");
        const MicroPayVault = await ethers.getContractFactory("MicroPayVault");
        const microPayVault = await MicroPayVault.deploy();
        await microPayVault.waitForDeployment();

        const microPayVaultAddress = await microPayVault.getAddress();
        contracts.microPayVault = microPayVaultAddress;
        console.log(`✅ MicroPayVault deployed to: ${microPayVaultAddress}`);

        // TODO: Deploy MeteredAccess (Phase 2)
        console.log("\n⏳ MeteredAccess deployment - Phase 2 (Future)");
        contracts.meteredAccess = "TBD";

        // Verify deployment
        console.log("\n🔍 Verifying deployment...");
        const creatorRegistryCode = await ethers.provider.getCode(creatorRegistryAddress);
        const microPayVaultCode = await ethers.provider.getCode(microPayVaultAddress);

        if (creatorRegistryCode === "0x") {
            throw new Error("CreatorRegistry deployment verification failed");
        }
        if (microPayVaultCode === "0x") {
            throw new Error("MicroPayVault deployment verification failed");
        }

        console.log("✅ All contracts deployed and verified successfully!");

        // Save deployment info
        const deploymentInfo = {
            network: network.name,
            chainId: network.config.chainId,
            deployer: deployer.address,
            timestamp: new Date().toISOString(),
            contracts: contracts,
            gasUsed: {
                creatorRegistry: "TBD",
                microPayVault: "TBD"
            }
        };

        const filename = `deployment-${network.name}-${Date.now()}.json`;
        require('fs').writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
        console.log(`📄 Deployment info saved to: ${filename}`);

        // Display summary
        console.log("\n🎉 Deployment Summary:");
        console.log("=====================");
        console.log(`- CreatorRegistry: ${creatorRegistryAddress}`);
        console.log(`- MicroPayVault: ${microPayVaultAddress}`);
        console.log(`- MeteredAccess: TBD (Phase 2)`);
        console.log(`- Network: ${network.name}`);
        console.log(`- Deployer: ${deployer.address}`);

        // Network-specific instructions
        if (network.name === "somnia-testnet") {
            console.log("\n🔗 Next Steps:");
            console.log("1. Verify contracts on explorer:");
            console.log(`   - CreatorRegistry: https://testnet-explorer.somnia.zone/address/${creatorRegistryAddress}`);
            console.log(`   - MicroPayVault: https://testnet-explorer.somnia.zone/address/${microPayVaultAddress}`);
            console.log("2. Update frontend configuration");
            console.log("3. Test micropayment functionality");
        }

    } catch (error) {
        console.error("❌ Deployment failed:", error.message);
        throw error;
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("💥 Deployment failed:", error);
        process.exit(1);
    });

import { ethers, network } from "hardhat";

async function main(): Promise<void> {
    console.log("🚀 Deploying Somnia Content Monetization contracts to local Hardhat...");
    
    // Force use the first Hardhat account (which has 10,000 ETH)
    const signers = await ethers.getSigners();
    const deployer = signers[0]; // This should be 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
    
    const deployerBalance = await ethers.provider.getBalance(deployer.address);

    console.log("📋 Deployment Info:");
    console.log(`- Deployer: ${deployer.address}`);
    console.log(`- Balance: ${ethers.formatEther(deployerBalance)} ETH`);
    console.log(`- Network: ${network.name}`);
    console.log(`- Chain ID: ${network.config.chainId}`);

    // Validate deployer balance
    if (deployerBalance < ethers.parseEther("0.1")) {
        console.error("❌ Available accounts:");
        for (let i = 0; i < Math.min(signers.length, 5); i++) {
            const balance = await ethers.provider.getBalance(signers[i].address);
            console.log(`  Account ${i}: ${signers[i].address} - ${ethers.formatEther(balance)} ETH`);
        }
        throw new Error("Insufficient deployer balance. Need at least 0.1 ETH for deployment.");
    }

    const contracts: Record<string, string> = {};

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

        // Deploy MeteredAccess
        console.log("\n📦 Deploying MeteredAccess...");
        const MeteredAccess = await ethers.getContractFactory("MeteredAccess");
        const meteredAccess = await MeteredAccess.deploy(
            creatorRegistryAddress,
            microPayVaultAddress
        );
        await meteredAccess.waitForDeployment();

        const meteredAccessAddress = await meteredAccess.getAddress();
        contracts.meteredAccess = meteredAccessAddress;
        console.log(`✅ MeteredAccess deployed to: ${meteredAccessAddress}`);

        // Verify deployment
        console.log("\n🔍 Verifying deployment...");
        const creatorRegistryCode = await ethers.provider.getCode(creatorRegistryAddress);
        const microPayVaultCode = await ethers.provider.getCode(microPayVaultAddress);
        const meteredAccessCode = await ethers.provider.getCode(meteredAccessAddress);

        if (creatorRegistryCode === "0x") {
            throw new Error("CreatorRegistry deployment verification failed");
        }
        if (microPayVaultCode === "0x") {
            throw new Error("MicroPayVault deployment verification failed");
        }
        if (meteredAccessCode === "0x") {
            throw new Error("MeteredAccess deployment verification failed");
        }

        console.log("✅ All contracts deployed and verified successfully!");

        // Save deployment info
        const deploymentInfo = {
            network: network.name,
            chainId: network.config.chainId,
            deployer: deployer.address,
            timestamp: new Date().toISOString(),
            contracts: contracts,
        };

        // Create deployments directory if it doesn't exist
        const deploymentsDir = 'deployments';
        if (!require('fs').existsSync(deploymentsDir)) {
            require('fs').mkdirSync(deploymentsDir, { recursive: true });
        }

        const filename = `${deploymentsDir}/deployment-local-${Date.now()}.json`;
        require('fs').writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
        console.log(`📄 Deployment info saved to: ${filename}`);

        // Display summary
        console.log("\n🎉 Deployment Summary:");
        console.log("=====================");
        console.log(`- CreatorRegistry: ${creatorRegistryAddress}`);
        console.log(`- MicroPayVault: ${microPayVaultAddress}`);
        console.log(`- MeteredAccess: ${meteredAccessAddress}`);
        console.log(`- Network: ${network.name}`);
        console.log(`- Deployer: ${deployer.address}`);

        // Update frontend contract addresses
        console.log("\n📝 Updating frontend contract addresses...");
        const frontendContractsPath = "frontend/src/types/contracts.ts";
        let frontendContractsContent = require('fs').readFileSync(frontendContractsPath, 'utf8');
        
        // Update contract addresses
        frontendContractsContent = frontendContractsContent.replace(
            /CREATOR_REGISTRY: '[^']*'/,
            `CREATOR_REGISTRY: '${creatorRegistryAddress}'`
        );
        frontendContractsContent = frontendContractsContent.replace(
            /MICRO_PAY_VAULT: '[^']*'/,
            `MICRO_PAY_VAULT: '${microPayVaultAddress}'`
        );
        frontendContractsContent = frontendContractsContent.replace(
            /METERED_ACCESS: '[^']*'/,
            `METERED_ACCESS: '${meteredAccessAddress}'`
        );
        
        require('fs').writeFileSync(frontendContractsPath, frontendContractsContent);
        console.log("✅ Frontend contract addresses updated!");

        console.log("\n🚀 Ready to test! The contracts are now deployed and the frontend is configured.");
        console.log("💡 You can now test the micropayment functionality in the frontend.");

    } catch (error) {
        console.error("💥 Deployment failed:", error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

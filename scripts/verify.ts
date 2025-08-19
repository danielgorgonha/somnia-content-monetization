import { ethers, network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";

async function main(): Promise<void> {
    console.log("🔍 Verifying Somnia Content Monetization contracts...");
    console.log(`📡 Network: ${network.name}`);
    console.log(`🔗 Chain ID: ${network.config.chainId}`);

    // Load deployment info if available
    let deploymentInfo;
    try {
        const fs = require('fs');
        const files = fs.readdirSync('.').filter(file => file.startsWith('deployment-') && file.endsWith('.json'));
        
        if (files.length === 0) {
            console.log("❌ No deployment files found. Please run deployment first.");
            return;
        }

        // Use the most recent deployment file
        const latestFile = files.sort().pop();
        deploymentInfo = JSON.parse(fs.readFileSync(latestFile, 'utf8'));
        console.log(`📄 Using deployment info from: ${latestFile}`);
    } catch (error) {
        console.log("❌ Could not load deployment info:", error.message);
        return;
    }

    const contracts = deploymentInfo.contracts;

    try {
        // Verify CreatorRegistry
        if (contracts.creatorRegistry && contracts.creatorRegistry !== "TBD") {
            console.log("\n📦 Verifying CreatorRegistry...");
            console.log(`Contract: ${contracts.creatorRegistry}`);
            
            try {
                await (global as any).hre.run("verify:verify", {
                    address: contracts.creatorRegistry,
                    constructorArguments: [],
                });
                console.log("✅ CreatorRegistry verified successfully!");
            } catch (error) {
                if (error.message.includes("Already Verified")) {
                    console.log("ℹ️  CreatorRegistry already verified");
                } else {
                    console.log("❌ CreatorRegistry verification failed:", error.message);
                }
            }
        }

        // Verify MicroPayVault
        if (contracts.microPayVault && contracts.microPayVault !== "TBD") {
            console.log("\n📦 Verifying MicroPayVault...");
            console.log(`Contract: ${contracts.microPayVault}`);
            
            try {
                await (global as any).hre.run("verify:verify", {
                    address: contracts.microPayVault,
                    constructorArguments: [],
                });
                console.log("✅ MicroPayVault verified successfully!");
            } catch (error) {
                if (error.message.includes("Already Verified")) {
                    console.log("ℹ️  MicroPayVault already verified");
                } else {
                    console.log("❌ MicroPayVault verification failed:", error.message);
                }
            }
        }

        // Contract interaction verification
        console.log("\n🔍 Verifying contract interactions...");
        
        const CreatorRegistry = await ethers.getContractFactory("CreatorRegistry");
        const MicroPayVault = await ethers.getContractFactory("MicroPayVault");
        
        const creatorRegistry = CreatorRegistry.attach(contracts.creatorRegistry);
        const microPayVault = MicroPayVault.attach(contracts.microPayVault);

        // Test basic contract functions
        console.log("\n🧪 Testing contract functions...");

        // Test CreatorRegistry
        try {
            const owner = await creatorRegistry.owner();
            console.log(`✅ CreatorRegistry owner: ${owner}`);
        } catch (error) {
            console.log("❌ CreatorRegistry owner check failed:", error.message);
        }

        // Test MicroPayVault
        try {
            const vaultBalance = await microPayVault.getVaultBalance();
            const totalMicropayments = await microPayVault.totalMicropaymentsProcessed();
            console.log(`✅ MicroPayVault balance: ${ethers.formatEther(vaultBalance)} SOM`);
            console.log(`✅ Total micropayments: ${totalMicropayments}`);
        } catch (error) {
            console.log("❌ MicroPayVault balance check failed:", error.message);
        }

        // Generate verification report
        console.log("\n📊 Verification Report");
        console.log("====================");
        console.log(`Network: ${deploymentInfo.network}`);
        console.log(`Chain ID: ${deploymentInfo.chainId}`);
        console.log(`Deployer: ${deploymentInfo.deployer}`);
        console.log(`Deployment Time: ${deploymentInfo.timestamp}`);
        console.log(`CreatorRegistry: ${contracts.creatorRegistry}`);
        console.log(`MicroPayVault: ${contracts.microPayVault}`);
        console.log(`MeteredAccess: ${contracts.meteredAccess || "TBD"}`);

        // Network-specific links
        if (network.name === "somnia-testnet") {
            console.log("\n🔗 Explorer Links:");
            console.log(`- CreatorRegistry: https://testnet-explorer.somnia.zone/address/${contracts.creatorRegistry}`);
            console.log(`- MicroPayVault: https://testnet-explorer.somnia.zone/address/${contracts.microPayVault}`);
        } else if (network.name === "somnia-mainnet") {
            console.log("\n🔗 Explorer Links:");
            console.log(`- CreatorRegistry: https://explorer.somnia.zone/address/${contracts.creatorRegistry}`);
            console.log(`- MicroPayVault: https://explorer.somnia.zone/address/${contracts.microPayVault}`);
        }

        console.log("\n🎉 Contract verification completed!");

    } catch (error) {
        console.error("❌ Verification failed:", error.message);
        console.error("Stack trace:", error.stack);
        throw error;
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("💥 Verification failed:", error);
        process.exit(1);
    });

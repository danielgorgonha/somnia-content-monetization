const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("🔧 Managing contract versions with account:", deployer.address);

    // Carregar deployment artifacts
    const deploymentPath = path.join(__dirname, "../deployments");
    const deploymentFiles = fs.readdirSync(deploymentPath)
        .filter(file => file.endsWith(".json"))
        .sort()
        .reverse(); // Mais recente primeiro

    if (deploymentFiles.length === 0) {
        console.log("❌ No deployment files found");
        return;
    }

    const latestDeployment = JSON.parse(
        fs.readFileSync(path.join(deploymentPath, deploymentFiles[0]))
    );

    console.log("📋 Latest deployment:", deploymentFiles[0]);
    console.log("📅 Deployed at:", new Date(latestDeployment.timestamp).toLocaleString());

    // Deploy ContractRegistry se não existir
    let contractRegistry;
    const registryAddress = latestDeployment.ContractRegistry;
    
    if (registryAddress) {
        console.log("🔗 Using existing ContractRegistry at:", registryAddress);
        contractRegistry = await ethers.getContractAt("ContractRegistry", registryAddress);
    } else {
        console.log("🚀 Deploying new ContractRegistry...");
        const ContractRegistry = await ethers.getContractFactory("ContractRegistry");
        contractRegistry = await ContractRegistry.deploy();
        await contractRegistry.waitForDeployment();
        
        console.log("✅ ContractRegistry deployed at:", await contractRegistry.getAddress());
    }

    // Registrar versões dos contratos
    const contracts = [
        {
            name: "CreatorRegistry",
            address: latestDeployment.CreatorRegistry,
            version: "1.0.0",
            description: "Initial version with content registration"
        },
        {
            name: "MicroPayVault", 
            address: latestDeployment.MicroPayVault,
            version: "1.0.0",
            description: "Initial version with micropayment processing"
        },
        {
            name: "MeteredAccess",
            address: latestDeployment.MeteredAccess,
            version: "1.0.0", 
            description: "Initial version with session management"
        }
    ];

    console.log("\n📝 Registering contract versions...");
    
    for (const contract of contracts) {
        if (contract.address) {
            try {
                const tx = await contractRegistry.registerContract(
                    contract.name,
                    contract.version,
                    contract.address,
                    contract.description
                );
                await tx.wait();
                
                console.log(`✅ Registered ${contract.name} v${contract.version} at ${contract.address}`);
                
                // Ativar a versão
                const activateTx = await contractRegistry.activateVersion(contract.name, contract.version);
                await activateTx.wait();
                console.log(`🎯 Activated ${contract.name} v${contract.version}`);
                
            } catch (error) {
                console.log(`⚠️ ${contract.name} might already be registered:`, error.message);
            }
        }
    }

    // Verificar versões ativas
    console.log("\n🔍 Checking active versions...");
    
    for (const contract of contracts) {
        if (contract.address) {
            try {
                const activeAddress = await contractRegistry.getActiveContract(contract.name);
                const latestVersion = await contractRegistry.getLatestVersion(contract.name);
                
                console.log(`📊 ${contract.name}:`);
                console.log(`   Active: ${activeAddress}`);
                console.log(`   Latest: v${latestVersion}`);
                
                if (activeAddress === contract.address) {
                    console.log(`   ✅ Status: ACTIVE`);
                } else {
                    console.log(`   ⚠️ Status: DIFFERENT VERSION`);
                }
                
            } catch (error) {
                console.log(`❌ Error checking ${contract.name}:`, error.message);
            }
        }
    }

    // Salvar registry address no deployment
    if (!latestDeployment.ContractRegistry) {
        latestDeployment.ContractRegistry = await contractRegistry.getAddress();
        fs.writeFileSync(
            path.join(deploymentPath, deploymentFiles[0]),
            JSON.stringify(latestDeployment, null, 2)
        );
        console.log("\n💾 Updated deployment file with ContractRegistry address");
    }

    console.log("\n🎉 Version management completed!");
    console.log("🔗 ContractRegistry:", await contractRegistry.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Version management failed:", error);
        process.exit(1);
    });

import { ethers } from "hardhat";

async function main(): Promise<void> {
    console.log("🚀 Setting up test content for Somnia Content Monetization...");
    
    // Get the deployed contract addresses (updated from latest deploy)
    const creatorRegistryAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
    const microPayVaultAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
    const meteredAccessAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
    
    const [deployer] = await ethers.getSigners();
    
    console.log("📋 Setup Info:");
    console.log(`- Deployer: ${deployer.address}`);
    console.log(`- CreatorRegistry: ${creatorRegistryAddress}`);
    console.log(`- MicroPayVault: ${microPayVaultAddress}`);
    console.log(`- MeteredAccess: ${meteredAccessAddress}`);
    
    try {
        // Get contract instances
        const CreatorRegistry = await ethers.getContractFactory("CreatorRegistry");
        const creatorRegistry = CreatorRegistry.attach(creatorRegistryAddress);
        
        const MicroPayVault = await ethers.getContractFactory("MicroPayVault");
        const microPayVault = MicroPayVault.attach(microPayVaultAddress);
        
        const MeteredAccess = await ethers.getContractFactory("MeteredAccess");
        const meteredAccess = MeteredAccess.attach(meteredAccessAddress);
        
        console.log("\n📹 Adding test content...");
        
        // Add test content
        const contentIds = [
            "content-1",
            "content-2", 
            "content-3"
        ];
        
        const contentData = [
            {
                title: "Introduction to Web3",
                description: "Learn the fundamentals of Web3 and blockchain technology",
                rate: ethers.parseEther("0.001") // 0.001 ETH per second
            },
            {
                title: "Smart Contract Development",
                description: "Master Solidity and smart contract development",
                rate: ethers.parseEther("0.0015") // 0.0015 ETH per second
            },
            {
                title: "DeFi Fundamentals",
                description: "Understanding decentralized finance protocols",
                rate: ethers.parseEther("0.002") // 0.002 ETH per second
            }
        ];
        
        for (let i = 0; i < contentIds.length; i++) {
            const contentId = ethers.encodeBytes32String(contentIds[i]);
            const { title, description, rate } = contentData[i];
            
            // Create metadata JSON
            const metadata = JSON.stringify({
                title,
                description,
                thumbnail: `https://picsum.photos/300/200?random=${i + 1}`,
                duration: 180 + (i * 60), // 3, 4, 5 minutes
                category: "education"
            });
            
            // Use a mock token address (we'll use the deployer address as a mock token)
            const mockTokenAddress = deployer.address;
            
            const registerContentTx = await creatorRegistry.registerContent(
                contentId,
                mockTokenAddress, // Use deployer address as mock token
                0, // ContentType.VIDEO
                rate,
                metadata
            );
            await registerContentTx.wait();
            console.log(`✅ Content "${title}" registered with ID: ${contentIds[i]}`);
        }
        
        console.log("\n💰 Setting up test micropayment vault...");
        
        // Deposit some ETH to the vault for testing
        const depositAmount = ethers.parseEther("1.0"); // 1 ETH
        const depositTx = await microPayVault.deposit({ value: depositAmount });
        await depositTx.wait();
        console.log(`✅ Deposited ${ethers.formatEther(depositAmount)} ETH to vault`);
        
        console.log("\n🎉 Test content setup complete!");
        console.log("=====================");
        console.log("Available content IDs:");
        contentIds.forEach((id, index) => {
            console.log(`- ${id}: ${contentData[index].title}`);
        });
        console.log("\n💡 You can now test the content player with these content IDs!");
        
    } catch (error) {
        console.error("💥 Setup failed:", error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

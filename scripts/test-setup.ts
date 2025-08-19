import { ethers, network } from "hardhat";

async function main(): Promise<void> {
    console.log("🚀 Setting up Somnia Content Monetization test environment...");
    console.log(`📡 Network: ${network.name}`);
    console.log(`🔗 Chain ID: ${network.config.chainId}`);

    // Get signers
    const [owner, user1, user2, creator1, creator2, user3, user4, user5] = await ethers.getSigners();

    console.log("\n📋 Test Accounts:");
    console.log("=================");
    console.log(`👑 Owner:     ${owner.address}`);
    console.log(`👤 User1:     ${user1.address}`);
    console.log(`👤 User2:     ${user2.address}`);
    console.log(`🎨 Creator1:  ${creator1.address}`);
    console.log(`🎨 Creator2:  ${creator2.address}`);
    console.log(`👤 User3:     ${user3.address}`);
    console.log(`👤 User4:     ${user4.address}`);
    console.log(`👤 User5:     ${user5.address}`);

    const contracts: Record<string, string> = {};

    try {
        // Deploy contracts
        console.log("\n📦 Deploying contracts...");
        console.log("=======================");

        const CreatorRegistry = await ethers.getContractFactory("CreatorRegistry");
        const creatorRegistry = await CreatorRegistry.deploy() as any;
        await creatorRegistry.waitForDeployment();
        contracts.creatorRegistry = await creatorRegistry.getAddress();
        console.log(`✅ CreatorRegistry deployed to: ${contracts.creatorRegistry}`);

        const MicroPayVault = await ethers.getContractFactory("MicroPayVault");
        const microPayVault = await MicroPayVault.deploy() as any;
        await microPayVault.waitForDeployment();
        contracts.microPayVault = await microPayVault.getAddress();
        console.log(`✅ MicroPayVault deployed to: ${contracts.microPayVault}`);

        // Setup test data
        console.log("\n🎭 Setting up test data...");
        console.log("========================");

        // Test content definitions
        const testContents = [
            {
                contentId: "video_001",
                title: "Introduction to Somnia",
                description: "Learn about the Somnia blockchain and its capabilities",
                contentType: 0, // VIDEO
                consumptionType: 0, // TIME_BASED
                ratePerUnit: ethers.parseEther("0.001"), // 0.001 SOM per second
                metadata: "ipfs://QmTest1",
                creator: creator1
            },
            {
                contentId: "article_001",
                title: "Micropayments Guide",
                description: "Complete guide to micropayments on blockchain",
                contentType: 2, // TEXT
                consumptionType: 1, // VOLUME_BASED
                ratePerUnit: ethers.parseEther("0.01"), // 0.01 SOM per 100 words
                metadata: "ipfs://QmTest2",
                creator: creator2
            },
            {
                contentId: "live_001",
                title: "Live Coding Session",
                description: "Real-time coding with micropayments",
                contentType: 0, // VIDEO
                consumptionType: 0, // TIME_BASED
                ratePerUnit: ethers.parseEther("0.002"), // 0.002 SOM per second
                metadata: "ipfs://QmTest3",
                creator: creator1
            }
        ];

        // Register test content
        for (const content of testContents) {
            await creatorRegistry.connect(content.creator).registerContent(
                content.contentId,
                content.title,
                content.description,
                content.contentType,
                content.consumptionType,
                content.ratePerUnit,
                content.metadata
            );
            console.log(`✅ Content registered: ${content.title}`);
        }

        // Setup user balances and limits
        console.log("\n💰 Setting up user accounts...");
        console.log("=============================");

        const userSetup = [
            { user: user1, deposit: ethers.parseEther("10.0"), limit: ethers.parseEther("5.0") },
            { user: user2, deposit: ethers.parseEther("15.0"), limit: ethers.parseEther("8.0") },
            { user: user3, deposit: ethers.parseEther("5.0"), limit: ethers.parseEther("3.0") },
            { user: user4, deposit: ethers.parseEther("20.0"), limit: ethers.parseEther("10.0") },
            { user: user5, deposit: ethers.parseEther("8.0"), limit: ethers.parseEther("4.0") }
        ];

        for (const setup of userSetup) {
            await microPayVault.connect(setup.user).deposit({ value: setup.deposit });
            await microPayVault.connect(setup.user).setMonthlyLimit(setup.limit);
            console.log(`✅ ${setup.user.address.slice(0, 8)}... setup: ${ethers.formatEther(setup.deposit)} SOM deposit, ${ethers.formatEther(setup.limit)} SOM limit`);
        }

        // Send test micropayments
        console.log("\n💸 Sending test micropayments...");
        console.log("================================");

        const testMicropayments = [
            { user: user1, creator: creator1, amount: ethers.parseEther("0.001"), content: "video_001" },
            { user: user1, creator: creator2, amount: ethers.parseEther("0.01"), content: "article_001" },
            { user: user2, creator: creator1, amount: ethers.parseEther("0.002"), content: "video_001" },
            { user: user2, creator: creator2, amount: ethers.parseEther("0.02"), content: "article_001" },
            { user: user3, creator: creator1, amount: ethers.parseEther("0.003"), content: "live_001" },
            { user: user4, creator: creator2, amount: ethers.parseEther("0.015"), content: "article_001" },
            { user: user5, creator: creator1, amount: ethers.parseEther("0.001"), content: "video_001" }
        ];

        for (const payment of testMicropayments) {
            await microPayVault.connect(payment.user).sendMicropayment(
                payment.creator.address,
                payment.amount,
                payment.content
            );
            console.log(`✅ Micropayment: ${ethers.formatEther(payment.amount)} SOM from ${payment.user.address.slice(0, 8)}... to ${payment.creator.address.slice(0, 8)}...`);
        }

        // Generate test report
        console.log("\n📊 Test Environment Report");
        console.log("==========================");
        console.log(`🏗️  CreatorRegistry: ${contracts.creatorRegistry}`);
        console.log(`🏦 MicroPayVault: ${contracts.microPayVault}`);
        console.log(`💰 Total vault balance: ${ethers.formatEther(await microPayVault.getVaultBalance())} SOM`);
        console.log(`📈 Total micropayments: ${await microPayVault.totalMicropaymentsProcessed()}`);
        console.log(`📝 Content registered: ${testContents.length}`);
        console.log(`👥 Users setup: ${userSetup.length}`);

        // Creator earnings summary
        const creator1Earnings = await microPayVault.getCreatorEarnings(creator1.address);
        const creator2Earnings = await microPayVault.getCreatorEarnings(creator2.address);
        
        console.log(`\n🎨 Creator Earnings:`);
        console.log(`- Creator1: ${ethers.formatEther(creator1Earnings.totalEarnings)} SOM total, ${ethers.formatEther(creator1Earnings.pendingWithdrawal)} SOM pending`);
        console.log(`- Creator2: ${ethers.formatEther(creator2Earnings.totalEarnings)} SOM total, ${ethers.formatEther(creator2Earnings.pendingWithdrawal)} SOM pending`);

        // Export comprehensive test data
        const testData = {
            network: network.name,
            chainId: network.config.chainId,
            timestamp: new Date().toISOString(),
            contracts: contracts,
            accounts: {
                owner: owner.address,
                user1: user1.address,
                user2: user2.address,
                creator1: creator1.address,
                creator2: creator2.address,
                user3: user3.address,
                user4: user4.address,
                user5: user5.address
            },
            testContent: testContents.map(c => ({
                contentId: c.contentId,
                title: c.title,
                contentType: c.contentType,
                ratePerUnit: c.ratePerUnit.toString()
            })),
            userSetup: userSetup.map(u => ({
                user: u.user.address,
                deposit: u.deposit.toString(),
                limit: u.limit.toString()
            })),
            micropayments: testMicropayments.map(p => ({
                from: p.user.address,
                to: p.creator.address,
                amount: p.amount.toString(),
                content: p.content
            })),
            statistics: {
                totalVaultBalance: (await microPayVault.getVaultBalance()).toString(),
                totalMicropayments: (await microPayVault.totalMicropaymentsProcessed()).toString(),
                creator1Earnings: creator1Earnings.totalEarnings.toString(),
                creator2Earnings: creator2Earnings.totalEarnings.toString()
            }
        };

        const filename = `test-setup-${network.name}-${Date.now()}.json`;
        require('fs').writeFileSync(filename, JSON.stringify(testData, null, 2));
        console.log(`\n📄 Test data exported to: ${filename}`);

        console.log("\n🎉 Test environment setup completed successfully!");
        console.log("\n🔗 Next Steps:");
        console.log("1. Run tests: pnpm run test:contracts");
        console.log("2. Run integration tests: pnpm run test:local");
        console.log("3. Check gas usage: pnpm run test:gas");

    } catch (error) {
        console.error("❌ Test setup failed:", error.message);
        console.error("Stack trace:", error.stack);
        throw error;
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("💥 Test setup failed:", error);
        process.exit(1);
    });

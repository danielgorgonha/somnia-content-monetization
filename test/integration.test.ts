import { expect } from "chai";
import { ethers } from "hardhat";

describe("Somnia Content Monetization - Integration Tests", function () {
    let CreatorRegistry: any;
    let MicroPayVault: any;
    let creatorRegistry: any;
    let microPayVault: any;
    let owner: any, user1: any, user2: any, creator1: any, creator2: any, user3: any;

    beforeEach(async function () {
        [owner, user1, user2, creator1, creator2, user3] = await ethers.getSigners();

        // Deploy contracts
        CreatorRegistry = await ethers.getContractFactory("CreatorRegistry");
        creatorRegistry = await CreatorRegistry.deploy();

        MicroPayVault = await ethers.getContractFactory("MicroPayVault");
        microPayVault = await MicroPayVault.deploy();
    });

    describe("Complete User Journey", function () {
        it("Should handle complete content monetization flow", async function () {
            // 1. Creator registers content
            const contentId = "video_123";
            const title = "Amazing Tutorial";
            const description = "Learn something amazing";
            const contentType = 0; // VIDEO
            const consumptionType = 0; // TIME_BASED
            const ratePerUnit = ethers.parseEther("0.001"); // 0.001 SOM per second
            const metadata = "ipfs://QmAmazing";

            // Create a mock token address for testing
            const mockTokenAddress = "0x1234567890123456789012345678901234567890";
            
            await creatorRegistry.connect(creator1).registerContent(
                ethers.keccak256(ethers.toUtf8Bytes(contentId)),
                mockTokenAddress, // token address
                contentType,
                ratePerUnit,
                metadata
            );

            // Verify content registration
            const content = await creatorRegistry.getContent(ethers.keccak256(ethers.toUtf8Bytes(contentId)));
            expect(content.ratePerUnit).to.equal(ratePerUnit);
            expect(content.active).to.be.true;

            // 2. User deposits funds
            const depositAmount = ethers.parseEther("5.0");
            await microPayVault.connect(user1).deposit({ value: depositAmount });

            // Verify deposit
            const userBalance = await microPayVault.getUserBalance(user1.address);
            expect(userBalance.balance).to.equal(depositAmount);

            // 3. User sets monthly limit
            const monthlyLimit = ethers.parseEther("3.0");
            await microPayVault.connect(user1).setMonthlyLimit(monthlyLimit);

            // Verify monthly limit
            const updatedBalance = await microPayVault.getUserBalance(user1.address);
            expect(updatedBalance.monthlyLimit).to.equal(monthlyLimit);

            // 4. User consumes content and sends micropayments
            const micropayment1 = ethers.parseEther("0.001");
            const micropayment2 = ethers.parseEther("0.002");

            await microPayVault.connect(user1).sendMicropayment(
                user1.address,
                creator1.address,
                micropayment1,
                contentId
            );

            await microPayVault.connect(user1).sendMicropayment(
                user1.address,
                creator1.address,
                micropayment2,
                contentId
            );

            // Verify micropayments
            const creatorEarnings = await microPayVault.getCreatorEarnings(creator1.address);
            expect(creatorEarnings.totalEarnings).to.equal(micropayment1 + micropayment2);
            expect(creatorEarnings.pendingWithdrawal).to.equal(micropayment1 + micropayment2);

            // Verify user spending
            const finalUserBalance = await microPayVault.getUserBalance(user1.address);
            expect(finalUserBalance.monthlySpent).to.equal(micropayment1 + micropayment2);
            expect(finalUserBalance.balance).to.equal(depositAmount - micropayment1 - micropayment2);

            // 5. Creator withdraws earnings
            const creatorInitialBalance = await ethers.provider.getBalance(creator1.address);
            
            await microPayVault.connect(creator1).withdrawCreatorEarnings();

            const finalCreatorEarnings = await microPayVault.getCreatorEarnings(creator1.address);
            expect(finalCreatorEarnings.pendingWithdrawal).to.equal(0);
            expect(finalCreatorEarnings.lastWithdrawal).to.be.gt(0);

            // 6. Verify total statistics
            expect(await microPayVault.totalMicropaymentsProcessed()).to.equal(2);
            
            // Verify vault balance (should be deposit minus micropayments)
            const expectedVaultBalance = depositAmount - micropayment1 - micropayment2;
            const actualVaultBalance = await microPayVault.getVaultBalance();
            expect(actualVaultBalance).to.equal(expectedVaultBalance);
        });
    });

    describe("Multiple Creators and Users", function () {
        it("Should handle multiple creators and users simultaneously", async function () {
            // Create a mock token address for testing
            const mockTokenAddress = "0x1234567890123456789012345678901234567890";
            
            // Setup multiple creators
            const content1 = {
                id: "video_1",
                title: "Creator 1 Video",
                rate: ethers.parseEther("0.001")
            };

            const content2 = {
                id: "article_1", 
                title: "Creator 2 Article",
                rate: ethers.parseEther("0.01")
            };

            // Register content
            await creatorRegistry.connect(creator1).registerContent(
                ethers.keccak256(ethers.toUtf8Bytes(content1.id)),
                mockTokenAddress, // token address
                0, // VIDEO
                content1.rate,
                "ipfs://Qm1"
            );

            await creatorRegistry.connect(creator2).registerContent(
                ethers.keccak256(ethers.toUtf8Bytes(content2.id)),
                mockTokenAddress, // token address
                2, // TEXT
                content2.rate,
                "ipfs://Qm2"
            );

            // Setup multiple users
            const depositAmount = ethers.parseEther("10.0");
            await microPayVault.connect(user1).deposit({ value: depositAmount });
            await microPayVault.connect(user2).deposit({ value: depositAmount });
            await microPayVault.connect(user3).deposit({ value: depositAmount });

            // Set monthly limits
            const monthlyLimit = ethers.parseEther("5.0");
            await microPayVault.connect(user1).setMonthlyLimit(monthlyLimit);
            await microPayVault.connect(user2).setMonthlyLimit(monthlyLimit);
            await microPayVault.connect(user3).setMonthlyLimit(monthlyLimit);

            // Send micropayments from multiple users to multiple creators
            const micropayments = [
                { user: user1, creator: creator1, amount: ethers.parseEther("0.001"), content: content1.id },
                { user: user1, creator: creator2, amount: ethers.parseEther("0.01"), content: content2.id },
                { user: user2, creator: creator1, amount: ethers.parseEther("0.002"), content: content1.id },
                { user: user2, creator: creator2, amount: ethers.parseEther("0.02"), content: content2.id },
                { user: user3, creator: creator1, amount: ethers.parseEther("0.003"), content: content1.id },
                { user: user3, creator: creator2, amount: ethers.parseEther("0.03"), content: content2.id }
            ];

            for (const payment of micropayments) {
                await microPayVault.connect(payment.user).sendMicropayment(
                    payment.user.address,
                    payment.creator.address,
                    payment.amount,
                    payment.content
                );
            }

            // Verify creator earnings
            const creator1Earnings = await microPayVault.getCreatorEarnings(creator1.address);
            const creator2Earnings = await microPayVault.getCreatorEarnings(creator2.address);

            const expectedCreator1Earnings = ethers.parseEther("0.006"); // 0.001 + 0.002 + 0.003
            const expectedCreator2Earnings = ethers.parseEther("0.06"); // 0.01 + 0.02 + 0.03

            expect(creator1Earnings.totalEarnings).to.equal(expectedCreator1Earnings);
            expect(creator2Earnings.totalEarnings).to.equal(expectedCreator2Earnings);

            // Verify total micropayments
            expect(await microPayVault.totalMicropaymentsProcessed()).to.equal(6);
        });
    });

    describe("Edge Cases and Error Handling", function () {
        it("Should handle edge cases correctly", async function () {
            // Test minimum micropayment
            await microPayVault.connect(user1).deposit({ value: ethers.parseEther("1.0") });
            await microPayVault.connect(user1).setMonthlyLimit(ethers.parseEther("1.0"));

            const minPayment = ethers.parseEther("0.001");
            await microPayVault.connect(user1).sendMicropayment(
                user1.address,
                creator1.address,
                minPayment,
                "test_content"
            );

            // Test maximum monthly limit
            const maxLimit = ethers.parseEther("100.0");
            await microPayVault.connect(user2).setMonthlyLimit(maxLimit);
            const user2Balance = await microPayVault.getUserBalance(user2.address);
            expect(user2Balance.monthlyLimit).to.equal(maxLimit);

            // Test insufficient balance
            await expect(
                microPayVault.connect(user1).sendMicropayment(
                    user1.address,
                    creator1.address,
                    ethers.parseEther("2.0"), // More than balance
                    "test_content"
                )
            ).to.be.revertedWith("Insufficient balance");

            // Test monthly limit exceeded
            await microPayVault.connect(user3).deposit({ value: ethers.parseEther("10.0") });
            await microPayVault.connect(user3).setMonthlyLimit(ethers.parseEther("0.001"));
            
            await expect(
                microPayVault.connect(user3).sendMicropayment(
                    user3.address,
                    creator1.address,
                    ethers.parseEther("0.002"), // More than monthly limit
                    "test_content"
                )
            ).to.be.revertedWith("Monthly limit exceeded");
        });
    });

    describe("Gas Optimization", function () {
        it("Should optimize gas usage for micropayments", async function () {
            await microPayVault.connect(user1).deposit({ value: ethers.parseEther("10.0") });
            await microPayVault.connect(user1).setMonthlyLimit(ethers.parseEther("5.0"));

            const micropaymentAmount = ethers.parseEther("0.001");
            
            // Measure gas for single micropayment
            const tx = await microPayVault.connect(user1).sendMicropayment(
                user1.address,
                creator1.address,
                micropaymentAmount,
                "test_content"
            );
            
            const receipt = await tx.wait();

            
            // Gas should be reasonable for micropayments
            expect(receipt.gasUsed).to.be.lt(200000); // Less than 200k gas
        });
    });
});

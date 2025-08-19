const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MeteredAccess", function () {
    let meteredAccess;
    let creatorRegistry;
    let microPayVault;
    let owner;
    let creator1;
    let creator2;
    let user1;
    let user2;
    let mockTokenAddress;

    beforeEach(async function () {
        [owner, creator1, creator2, user1, user2] = await ethers.getSigners();
        mockTokenAddress = "0x1234567890123456789012345678901234567890";

        // Deploy CreatorRegistry
        const CreatorRegistry = await ethers.getContractFactory("CreatorRegistry");
        creatorRegistry = await CreatorRegistry.deploy();

        // Deploy MicroPayVault
        const MicroPayVault = await ethers.getContractFactory("MicroPayVault");
        microPayVault = await MicroPayVault.deploy();

        // Deploy MeteredAccess
        const MeteredAccess = await ethers.getContractFactory("MeteredAccess");
        meteredAccess = await MeteredAccess.deploy(
            await creatorRegistry.getAddress(),
            await microPayVault.getAddress()
        );

        // Setup test content
        const contentId1 = ethers.keccak256(ethers.toUtf8Bytes("video_001"));
        const contentId2 = ethers.keccak256(ethers.toUtf8Bytes("article_001"));

        await creatorRegistry.connect(creator1).registerContent(
            contentId1,
            mockTokenAddress,
            0, // VIDEO
            ethers.parseEther("0.001"), // 0.001 SOM per second (minimum rate, should generate 0.06 ETH for 60 seconds)
            "ipfs://QmVideo1"
        );

        await creatorRegistry.connect(creator2).registerContent(
            contentId2,
            mockTokenAddress,
            2, // TEXT
            ethers.parseEther("0.001"), // 0.001 SOM per 100 words (minimum rate)
            "ipfs://QmArticle1"
        );

        // Setup user balances
        await microPayVault.connect(user1).deposit({ value: ethers.parseEther("1.0") });
        await microPayVault.connect(user2).deposit({ value: ethers.parseEther("0.5") });
        
        // Set monthly limits
        await microPayVault.connect(user1).setMonthlyLimit(ethers.parseEther("10.0"));
        await microPayVault.connect(user2).setMonthlyLimit(ethers.parseEther("5.0"));
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await meteredAccess.owner()).to.equal(owner.address);
        });

        it("Should set correct contract dependencies", async function () {
            expect(await meteredAccess.creatorRegistry()).to.equal(await creatorRegistry.getAddress());
            expect(await meteredAccess.microPayVault()).to.equal(await microPayVault.getAddress());
        });

        it("Should start with zero sessions", async function () {
            const stats = await meteredAccess.getStats();
            expect(stats[0]).to.equal(0); // totalSessions
            expect(stats[1]).to.equal(0); // totalMicropaymentsProcessed
        });
    });

    describe("Session Management", function () {
        it("Should start a session successfully", async function () {
            const contentId = ethers.keccak256(ethers.toUtf8Bytes("video_001"));
            
            const tx = await meteredAccess.connect(user1).startSession(contentId);
            const receipt = await tx.wait();
            
            // Get session ID from event
            const event = receipt.logs.find(log => 
                log.fragment && log.fragment.name === "SessionStarted"
            );
            const sessionId = event.args.sessionId;
            
            // Verify session
            const session = await meteredAccess.getSession(sessionId);
            expect(session.user).to.equal(user1.address);
            expect(session.contentId).to.equal(contentId);
            expect(session.active).to.be.true;
            expect(session.totalConsumption).to.equal(0);
            expect(session.totalPayment).to.equal(0);
        });

        it("Should fail to start session for non-existent content", async function () {
            const invalidContentId = ethers.keccak256(ethers.toUtf8Bytes("invalid"));
            
            await expect(
                meteredAccess.connect(user1).startSession(invalidContentId)
            ).to.be.revertedWith("Content does not exist");
        });

        it("Should fail to start session for inactive content", async function () {
            const contentId = ethers.keccak256(ethers.toUtf8Bytes("video_001"));
            
            // Deactivate content
            await creatorRegistry.connect(creator1).deactivateContent(contentId);
            
            await expect(
                meteredAccess.connect(user1).startSession(contentId)
            ).to.be.revertedWith("Content is not active");
        });

        it("Should end a session successfully", async function () {
            const contentId = ethers.keccak256(ethers.toUtf8Bytes("video_001"));
            
            // Start session
            const tx = await meteredAccess.connect(user1).startSession(contentId);
            const receipt = await tx.wait();
            const event = receipt.logs.find(log => 
                log.fragment && log.fragment.name === "SessionStarted"
            );
            const sessionId = event.args.sessionId;
            
            // End session
            await meteredAccess.connect(user1).endSession(sessionId);
            
            // Verify session is inactive
            const session = await meteredAccess.getSession(sessionId);
            expect(session.active).to.be.false;
        });

        it("Should fail to end session by non-owner", async function () {
            const contentId = ethers.keccak256(ethers.toUtf8Bytes("video_001"));
            
            // Start session
            const tx = await meteredAccess.connect(user1).startSession(contentId);
            const receipt = await tx.wait();
            const event = receipt.logs.find(log => 
                log.fragment && log.fragment.name === "SessionStarted"
            );
            const sessionId = event.args.sessionId;
            
            // Try to end session with different user
            await expect(
                meteredAccess.connect(user2).endSession(sessionId)
            ).to.be.revertedWith("Not session owner");
        });
    });

    describe("Consumption Tracking", function () {
        let sessionId;
        let contentId;

        beforeEach(async function () {
            contentId = ethers.keccak256(ethers.toUtf8Bytes("video_002")); // Different content ID
            
            // Register content with correct rate
            await creatorRegistry.connect(creator1).registerContent(
                contentId,
                mockTokenAddress,
                0, // VIDEO
                ethers.parseEther("0.01"), // 0.01 SOM per second (should generate 0.6 ETH for 60 seconds)
                "ipfs://QmVideo2"
            );
            
            const tx = await meteredAccess.connect(user1).startSession(contentId);
            const receipt = await tx.wait();
            const event = receipt.logs.find(log => 
                log.fragment && log.fragment.name === "SessionStarted"
            );
            sessionId = event.args.sessionId;
        });

        it("Should update session with consumption", async function () {
            const consumption = 60; // 60 seconds
            
            await meteredAccess.connect(user1).updateSession(sessionId, consumption);
            
            const session = await meteredAccess.getSession(sessionId);
            expect(session.totalConsumption).to.equal(consumption);
        });

        it("Should process micropayment for consumption", async function () {
            const consumption = 60; // 60 seconds
            
            // Get initial balances
            const initialUserBalance = await microPayVault.getUserBalance(user1.address);

            
            // Update session with consumption (this doesn't process micropayment)
            await meteredAccess.connect(user1).updateSession(sessionId, consumption);
            
            // Get payment due
            const paymentDue = await meteredAccess.getSessionPayment(sessionId);

            
            // Check if payment due is greater than balance

            

            
            // Now process the micropayment manually
            await meteredAccess.connect(user1).processMicropayment(sessionId);
            
            // Get final balances
            const finalUserBalance = await microPayVault.getUserBalance(user1.address);
            const finalCreatorBalance = await microPayVault.getCreatorEarnings(creator1.address);
            

            
            expect(finalUserBalance.balance).to.be.lt(initialUserBalance.balance);
            expect(finalCreatorBalance.totalEarnings).to.be.gt(0);
        });

        it("Should fail to update session with invalid consumption", async function () {
            await expect(
                meteredAccess.connect(user1).updateSession(sessionId, 0)
            ).to.be.revertedWith("Invalid consumption amount");
        });

        it("Should fail to update session with decreasing consumption", async function () {
            // First update
            await meteredAccess.connect(user1).updateSession(sessionId, 60);
            
            // Try to decrease consumption (should fail)
            await expect(
                meteredAccess.connect(user1).updateSession(sessionId, 30)
            ).to.be.revertedWith("No consumption increase");
        });

        it("Should fail to update session by non-owner", async function () {
            await expect(
                meteredAccess.connect(user2).updateSession(sessionId, 60)
            ).to.be.revertedWith("Not session owner");
        });

        it("Should fail to update inactive session", async function () {
            // End session
            await meteredAccess.connect(user1).endSession(sessionId);
            
            await expect(
                meteredAccess.connect(user1).updateSession(sessionId, 60)
            ).to.be.revertedWith("Session not active");
        });
    });

    describe("User Sessions", function () {
        it("Should get user sessions", async function () {
            const contentId1 = ethers.keccak256(ethers.toUtf8Bytes("video_001"));
            const contentId2 = ethers.keccak256(ethers.toUtf8Bytes("article_001"));
            
            // Start two sessions
            await meteredAccess.connect(user1).startSession(contentId1);
            await meteredAccess.connect(user1).startSession(contentId2);
            
            const userSessions = await meteredAccess.getUserSessions(user1.address);
            expect(userSessions.length).to.equal(2);
        });

        it("Should get active sessions", async function () {
            const contentId1 = ethers.keccak256(ethers.toUtf8Bytes("video_001"));
            const contentId2 = ethers.keccak256(ethers.toUtf8Bytes("article_001"));
            
            // Start two sessions
            const tx1 = await meteredAccess.connect(user1).startSession(contentId1);
            const tx2 = await meteredAccess.connect(user1).startSession(contentId2);
            
            const receipt1 = await tx1.wait();
            const receipt2 = await tx2.wait();
            
            const event1 = receipt1.logs.find(log => 
                log.fragment && log.fragment.name === "SessionStarted"
            );
            const event2 = receipt2.logs.find(log => 
                log.fragment && log.fragment.name === "SessionStarted"
            );
            
            const sessionId1 = event1.args.sessionId;
            const sessionId2 = event2.args.sessionId;
            
            // End one session
            await meteredAccess.connect(user1).endSession(sessionId1);
            
            const activeSessions = await meteredAccess.getActiveSessions(user1.address);
            expect(activeSessions.length).to.equal(1);
        });
    });

    describe("Consumption Configuration", function () {
        it("Should set consumption config by content creator", async function () {
            const contentId = ethers.keccak256(ethers.toUtf8Bytes("video_001"));
            
            const config = {
                ratePerUnit: ethers.parseEther("0.002"),
                updateInterval: 30,
                minPayment: ethers.parseEther("0.001"),
                enabled: true
            };
            
            await meteredAccess.connect(creator1).setConsumptionConfig(contentId, config);
            
            const retrievedConfig = await meteredAccess.getConsumptionConfig(contentId);
            expect(retrievedConfig.ratePerUnit).to.equal(config.ratePerUnit);
            expect(retrievedConfig.updateInterval).to.equal(config.updateInterval);
            expect(retrievedConfig.minPayment).to.equal(config.minPayment);
            expect(retrievedConfig.enabled).to.equal(config.enabled);
        });

        it("Should set consumption config by owner", async function () {
            const contentId = ethers.keccak256(ethers.toUtf8Bytes("video_001"));
            
            const config = {
                ratePerUnit: ethers.parseEther("0.003"),
                updateInterval: 60,
                minPayment: ethers.parseEther("0.002"),
                enabled: true
            };
            
            await meteredAccess.connect(owner).setConsumptionConfig(contentId, config);
            
            const retrievedConfig = await meteredAccess.getConsumptionConfig(contentId);
            expect(retrievedConfig.ratePerUnit).to.equal(config.ratePerUnit);
        });

        it("Should fail to set config by unauthorized user", async function () {
            const contentId = ethers.keccak256(ethers.toUtf8Bytes("video_001"));
            
            const config = {
                ratePerUnit: ethers.parseEther("0.002"),
                updateInterval: 30,
                minPayment: ethers.parseEther("0.001"),
                enabled: true
            };
            
            await expect(
                meteredAccess.connect(user1).setConsumptionConfig(contentId, config)
            ).to.be.revertedWith("Not authorized");
        });

        it("Should fail to set invalid update interval", async function () {
            const contentId = ethers.keccak256(ethers.toUtf8Bytes("video_001"));
            
            const config = {
                ratePerUnit: ethers.parseEther("0.002"),
                updateInterval: 0, // Invalid
                minPayment: ethers.parseEther("0.001"),
                enabled: true
            };
            
            await expect(
                meteredAccess.connect(creator1).setConsumptionConfig(contentId, config)
            ).to.be.revertedWith("Update interval too low");
        });
    });

    describe("Micropayment Processing", function () {
        let sessionId;
        let contentId;

        beforeEach(async function () {
            contentId = ethers.keccak256(ethers.toUtf8Bytes("video_001"));
            
            const tx = await meteredAccess.connect(user1).startSession(contentId);
            const receipt = await tx.wait();
            const event = receipt.logs.find(log => 
                log.fragment && log.fragment.name === "SessionStarted"
            );
            sessionId = event.args.sessionId;
        });

        it("Should process micropayment manually", async function () {
            // Update session with consumption
            await meteredAccess.connect(user1).updateSession(sessionId, 60);
            
            // Get payment due
            const paymentDue = await meteredAccess.getSessionPayment(sessionId);
            expect(paymentDue).to.be.gt(0);
            
            // Process micropayment
            await meteredAccess.connect(user1).processMicropayment(sessionId);
            
            // Check payment due is now 0
            const newPaymentDue = await meteredAccess.getSessionPayment(sessionId);
            expect(newPaymentDue).to.equal(0);
        });

        it("Should fail to process micropayment when no payment due", async function () {
            await expect(
                meteredAccess.connect(user1).processMicropayment(sessionId)
            ).to.be.revertedWith("No payment due");
        });

        it("Should fail to process micropayment with insufficient balance", async function () {
            // Update session with consumption
            await meteredAccess.connect(user1).updateSession(sessionId, 60);
            
            // Drain user balance
            const userBalance = await microPayVault.getUserBalance(user1.address);
            await microPayVault.connect(user1).withdraw(userBalance.balance);
            
            // Try to process micropayment (should fail due to insufficient balance)
            await expect(
                meteredAccess.connect(user1).processMicropayment(sessionId)
            ).to.be.revertedWith("Insufficient balance");
        });
    });

    describe("Emergency Functions", function () {
        it("Should allow owner to emergency end user sessions", async function () {
            const contentId1 = ethers.keccak256(ethers.toUtf8Bytes("video_001"));
            const contentId2 = ethers.keccak256(ethers.toUtf8Bytes("article_001"));
            
            // Start sessions
            await meteredAccess.connect(user1).startSession(contentId1);
            await meteredAccess.connect(user1).startSession(contentId2);
            
            // Emergency end sessions
            await meteredAccess.connect(owner).emergencyEndUserSessions(user1.address);
            
            // Check all sessions are inactive
            const activeSessions = await meteredAccess.getActiveSessions(user1.address);
            expect(activeSessions.length).to.equal(0);
        });

        it("Should fail to emergency end sessions by non-owner", async function () {
            await expect(
                meteredAccess.connect(user1).emergencyEndUserSessions(user2.address)
            ).to.be.revertedWithCustomError(meteredAccess, "OwnableUnauthorizedAccount");
        });
    });

    describe("Statistics", function () {
        it("Should track total sessions and micropayments", async function () {
            const contentId = ethers.keccak256(ethers.toUtf8Bytes("video_001"));
            
            // Start session
            const tx = await meteredAccess.connect(user1).startSession(contentId);
            const receipt = await tx.wait();
            const event = receipt.logs.find(log => 
                log.fragment && log.fragment.name === "SessionStarted"
            );
            const sessionId = event.args.sessionId;
            
            // Update session with consumption
            await meteredAccess.connect(user1).updateSession(sessionId, 60);
            
            // Process micropayment manually
            await meteredAccess.connect(user1).processMicropayment(sessionId);
            
            const stats = await meteredAccess.getStats();
            expect(stats[0]).to.be.gt(0); // totalSessions
            expect(stats[1]).to.be.gt(0); // totalMicropaymentsProcessed
        });
    });
});

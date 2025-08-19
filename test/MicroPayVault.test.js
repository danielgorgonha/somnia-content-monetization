const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MicroPayVault", function () {
    let MicroPayVault;
    let microPayVault;
    let owner;
    let user1;
    let user2;
    let creator1;
    let creator2;

    beforeEach(async function () {
        [owner, user1, user2, creator1, creator2] = await ethers.getSigners();
        
        MicroPayVault = await ethers.getContractFactory("MicroPayVault");
        microPayVault = await MicroPayVault.deploy();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await microPayVault.owner()).to.equal(owner.address);
        });

        it("Should have zero initial balance", async function () {
            expect(await microPayVault.getVaultBalance()).to.equal(0);
        });
    });

    describe("Deposits", function () {
        it("Should accept deposits", async function () {
            const depositAmount = ethers.parseEther("1.0");
            
            await microPayVault.connect(user1).deposit({ value: depositAmount });
            
            const userBalance = await microPayVault.getUserBalance(user1.address);
            expect(userBalance.balance).to.equal(depositAmount);
            expect(await microPayVault.getVaultBalance()).to.equal(depositAmount);
        });

        it("Should reject zero deposits", async function () {
            await expect(
                microPayVault.connect(user1).deposit({ value: 0 })
            ).to.be.revertedWith("Deposit amount must be greater than 0");
        });

        it("Should accumulate multiple deposits", async function () {
            const deposit1 = ethers.parseEther("0.5");
            const deposit2 = ethers.parseEther("1.5");
            
            await microPayVault.connect(user1).deposit({ value: deposit1 });
            await microPayVault.connect(user1).deposit({ value: deposit2 });
            
            const userBalance = await microPayVault.getUserBalance(user1.address);
            expect(userBalance.balance).to.equal(deposit1 + deposit2);
        });
    });

    describe("Withdrawals", function () {
        beforeEach(async function () {
            await microPayVault.connect(user1).deposit({ value: ethers.parseEther("2.0") });
        });

        it("Should allow withdrawals", async function () {
            const withdrawAmount = ethers.parseEther("1.0");
            const initialBalance = await ethers.provider.getBalance(user1.address);
            
            await microPayVault.connect(user1).withdraw(withdrawAmount);
            
            const userBalance = await microPayVault.getUserBalance(user1.address);
            expect(userBalance.balance).to.equal(ethers.parseEther("1.0"));
            expect(await microPayVault.getVaultBalance()).to.equal(ethers.parseEther("1.0"));
        });

        it("Should reject withdrawals exceeding balance", async function () {
            const withdrawAmount = ethers.parseEther("3.0");
            
            await expect(
                microPayVault.connect(user1).withdraw(withdrawAmount)
            ).to.be.revertedWith("Insufficient balance");
        });
    });

    describe("Micropayments", function () {
        beforeEach(async function () {
            await microPayVault.connect(user1).deposit({ value: ethers.parseEther("10.0") });
            await microPayVault.connect(user1).setMonthlyLimit(ethers.parseEther("5.0"));
        });

        it("Should send micropayments to creators", async function () {
            const micropaymentAmount = ethers.parseEther("0.001");
            const contentId = "video_123";
            
            await microPayVault.connect(user1).sendMicropayment(
                user1.address,
                creator1.address, 
                micropaymentAmount, 
                contentId
            );
            
            const creatorEarnings = await microPayVault.getCreatorEarnings(creator1.address);
            expect(creatorEarnings.totalEarnings).to.equal(micropaymentAmount);
            expect(creatorEarnings.pendingWithdrawal).to.equal(micropaymentAmount);
            
            const userBalance = await microPayVault.getUserBalance(user1.address);
            expect(userBalance.monthlySpent).to.equal(micropaymentAmount);
        });

        it("Should reject micropayments below minimum", async function () {
            const micropaymentAmount = ethers.parseEther("0.0005"); // Below 0.001 minimum
            
            await expect(
                microPayVault.connect(user1).sendMicropayment(
                    user1.address,
                    creator1.address, 
                    micropaymentAmount, 
                    "video_123"
                )
            ).to.be.revertedWith("Amount below minimum");
        });

        it("Should reject micropayments exceeding monthly limit", async function () {
            const micropaymentAmount = ethers.parseEther("6.0"); // Above 5.0 limit
            
            await expect(
                microPayVault.connect(user1).sendMicropayment(
                    user1.address,
                    creator1.address, 
                    micropaymentAmount, 
                    "video_123"
                )
            ).to.be.revertedWith("Monthly limit exceeded");
        });

        it("Should reject micropayments with insufficient balance", async function () {
            const micropaymentAmount = ethers.parseEther("15.0"); // Above 10.0 balance
            
            await expect(
                microPayVault.connect(user1).sendMicropayment(
                    user1.address,
                    creator1.address, 
                    micropaymentAmount, 
                    "video_123"
                )
            ).to.be.revertedWith("Insufficient balance");
        });

        it("Should reject micropayments to zero address", async function () {
            const micropaymentAmount = ethers.parseEther("0.001");
            
            await expect(
                microPayVault.connect(user1).sendMicropayment(
                    user1.address,
                    ethers.ZeroAddress, 
                    micropaymentAmount, 
                    "video_123"
                )
            ).to.be.revertedWith("Invalid creator address");
        });
    });

    describe("Creator Earnings", function () {
        beforeEach(async function () {
            await microPayVault.connect(user1).deposit({ value: ethers.parseEther("10.0") });
            await microPayVault.connect(user1).setMonthlyLimit(ethers.parseEther("5.0"));
            
            // Send some micropayments
            await microPayVault.connect(user1).sendMicropayment(
                user1.address,
                creator1.address, 
                ethers.parseEther("0.001"), 
                "video_1"
            );
            await microPayVault.connect(user1).sendMicropayment(
                user1.address,
                creator1.address, 
                ethers.parseEther("0.002"), 
                "video_2"
            );
        });

        it("Should allow creators to withdraw earnings", async function () {
            const initialBalance = await ethers.provider.getBalance(creator1.address);
            
            await microPayVault.connect(creator1).withdrawCreatorEarnings();
            
            const creatorEarnings = await microPayVault.getCreatorEarnings(creator1.address);
            expect(creatorEarnings.pendingWithdrawal).to.equal(0);
            expect(creatorEarnings.lastWithdrawal).to.be.gt(0);
        });

        it("Should reject withdrawals when no pending earnings", async function () {
            await microPayVault.connect(creator1).withdrawCreatorEarnings();
            
            await expect(
                microPayVault.connect(creator1).withdrawCreatorEarnings()
            ).to.be.revertedWith("No pending earnings");
        });
    });

    describe("Monthly Limits", function () {
        it("Should set monthly limits", async function () {
            const limit = ethers.parseEther("3.0");
            
            await microPayVault.connect(user1).setMonthlyLimit(limit);
            
            const userBalance = await microPayVault.getUserBalance(user1.address);
            expect(userBalance.monthlyLimit).to.equal(limit);
        });

        it("Should reject limits exceeding maximum", async function () {
            const limit = ethers.parseEther("150.0"); // Above 100 max
            
            await expect(
                microPayVault.connect(user1).setMonthlyLimit(limit)
            ).to.be.revertedWith("Limit exceeds maximum");
        });
    });

    describe("Emergency Functions", function () {
        it("Should allow owner to emergency withdraw", async function () {
            await microPayVault.connect(user1).deposit({ value: ethers.parseEther("1.0") });
            
            await microPayVault.connect(owner).emergencyWithdraw();
            
            expect(await microPayVault.getVaultBalance()).to.equal(0);
        });

        it("Should reject emergency withdrawal from non-owner", async function () {
            await expect(
                microPayVault.connect(user1).emergencyWithdraw()
            ).to.be.revertedWithCustomError(microPayVault, "OwnableUnauthorizedAccount");
        });
    });
});

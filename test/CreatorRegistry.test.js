const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CreatorRegistry", function () {
    let creatorRegistry;
    let owner;
    let creator;
    let token;
    let contentId;

    beforeEach(async function () {
        [owner, creator, token] = await ethers.getSigners();
        
        const CreatorRegistry = await ethers.getContractFactory("CreatorRegistry");
        creatorRegistry = await CreatorRegistry.deploy();
        
        contentId = ethers.keccak256(ethers.toUtf8Bytes("test-content"));
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await creatorRegistry.owner()).to.equal(owner.address);
        });
    });

    describe("Content Registration", function () {
        it("Should register content successfully", async function () {
            const metadata = "Test video content";
            
            await creatorRegistry.connect(creator).registerContent(
                contentId,
                token.address,
                0, // VIDEO
                ethers.parseEther("0.001"), // rate per unit (minimum)
                metadata
            );

            const content = await creatorRegistry.getContent(contentId);
            expect(content.creator).to.equal(creator.address);
            expect(content.token).to.equal(token.address);
            expect(content.contentType).to.equal(0); // VIDEO
            expect(content.ratePerUnit).to.equal(ethers.parseEther("0.001"));
            expect(content.active).to.be.true;
            expect(content.metadata).to.equal(metadata);
        });

        it("Should fail when registering duplicate content", async function () {
            await creatorRegistry.connect(creator).registerContent(
                contentId,
                token.address,
                0,
                ethers.parseEther("0.001"),
                "Test content"
            );

            await expect(
                creatorRegistry.connect(creator).registerContent(
                    contentId,
                    token.address,
                    0,
                    ethers.parseEther("0.001"),
                    "Duplicate content"
                )
            ).to.be.revertedWith("Content already exists");
        });

        it("Should fail with invalid token address", async function () {
            await expect(
                creatorRegistry.connect(creator).registerContent(
                    contentId,
                    ethers.ZeroAddress,
                    0,
                    ethers.parseEther("0.001"),
                    "Test content"
                )
            ).to.be.revertedWith("Invalid token address");
        });

        it("Should fail with zero rate", async function () {
            await expect(
                creatorRegistry.connect(creator).registerContent(
                    contentId,
                    token.address,
                    0,
                    0,
                    "Test content"
                )
            ).to.be.revertedWith("Rate below minimum");
        });
    });

    describe("Content Management", function () {
        beforeEach(async function () {
            await creatorRegistry.connect(creator).registerContent(
                contentId,
                token.address,
                0,
                ethers.parseEther("0.001"),
                "Test content"
            );
        });

        it("Should update content rate", async function () {
            await creatorRegistry.connect(creator).updateContentRate(contentId, ethers.parseEther("0.002"));
            
            const content = await creatorRegistry.getContent(contentId);
            expect(content.ratePerUnit).to.equal(ethers.parseEther("0.002"));
        });

        it("Should deactivate content", async function () {
            await creatorRegistry.connect(creator).deactivateContent(contentId);
            
            const content = await creatorRegistry.getContent(contentId);
            expect(content.active).to.be.false;
        });

        it("Should fail when non-creator tries to update rate", async function () {
            await expect(
                creatorRegistry.connect(owner).updateContentRate(contentId, ethers.parseEther("0.002"))
            ).to.be.revertedWith("Not content creator");
        });

        it("Should fail when non-creator tries to deactivate", async function () {
            await expect(
                creatorRegistry.connect(owner).deactivateContent(contentId)
            ).to.be.revertedWith("Not content creator");
        });
    });

    describe("Content Queries", function () {
        beforeEach(async function () {
            await creatorRegistry.connect(creator).registerContent(
                contentId,
                token.address,
                0,
                ethers.parseEther("0.001"),
                "Test content"
            );
        });

        it("Should return correct content info", async function () {
            const content = await creatorRegistry.getContent(contentId);
            expect(content.creator).to.equal(creator.address);
            expect(content.active).to.be.true;
        });

        it("Should return creator contents", async function () {
            const contents = await creatorRegistry.getCreatorContents(creator.address);
            expect(contents).to.include(contentId);
        });

        it("Should check if content is active", async function () {
            expect(await creatorRegistry.isContentActive(contentId)).to.be.true;
        });
    });

    describe("Admin Functions", function () {
        beforeEach(async function () {
            await creatorRegistry.connect(creator).registerContent(
                contentId,
                token.address,
                0,
                ethers.parseEther("0.001"),
                "Test content"
            );
        });

        it("Should update content earnings", async function () {
            await creatorRegistry.updateContentEarnings(contentId, ethers.parseEther("0.005"));
            
            const content = await creatorRegistry.getContent(contentId);
            expect(content.totalEarnings).to.equal(ethers.parseEther("0.005"));
        });

        it("Should increment content views", async function () {
            await creatorRegistry.incrementContentView(contentId);
            
            const content = await creatorRegistry.getContent(contentId);
            expect(content.totalViews).to.equal(1);
        });

        it("Should fail when non-owner tries to update earnings", async function () {
            await expect(
                creatorRegistry.connect(creator).updateContentEarnings(contentId, ethers.parseEther("0.005"))
            ).to.be.revertedWith("Only owner can update earnings");
        });

        it("Should fail when non-owner tries to increment views", async function () {
            await expect(
                creatorRegistry.connect(creator).incrementContentView(contentId)
            ).to.be.revertedWith("Only owner can increment views");
        });
    });
});

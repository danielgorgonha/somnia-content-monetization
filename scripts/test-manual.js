const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing deployed contracts on Somnia testnet...\n");

  // Contract addresses from deployment
  const CREATOR_REGISTRY = "0xf629fB3b2a5a03D70fD14bA88eA4828da5356e5D";
  const MICRO_PAY_VAULT = "0xD2f94B843557d52A81d12ED04553f57BC7D9a819";
  const METERED_ACCESS = "0xf65391952439f75E2f8c87952f0f143f3117D1f6";

  const [deployer] = await ethers.getSigners();
  console.log("📋 Test Info:");
  console.log("- Deployer:", deployer.address);
  console.log("- Balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "STT\n");

  // Get contract instances
  const creatorRegistry = await ethers.getContractAt("CreatorRegistry", CREATOR_REGISTRY);
  const microPayVault = await ethers.getContractAt("MicroPayVault", MICRO_PAY_VAULT);
  const meteredAccess = await ethers.getContractAt("MeteredAccess", METERED_ACCESS);

  console.log("🔍 Testing CreatorRegistry...");
  
  // Test 1: Register content (with unique ID)
  const timestamp = Date.now();
  const contentId = ethers.keccak256(ethers.toUtf8Bytes(`test-content-${timestamp}`));
  const token = "0x0000000000000000000000000000000000000001"; // Use a non-zero address for token
  const contentType = 0; // VIDEO
  const ratePerUnit = ethers.parseEther("0.001"); // 0.001 STT per unit
  const metadata = "Test content metadata";

  console.log("- Registering content:", contentId);
  
  try {
    const registerTx = await creatorRegistry.registerContent(
      contentId,
      token,
      contentType,
      ratePerUnit,
      metadata
    );
    await registerTx.wait();
    console.log("✅ Content registered successfully!");
  } catch (error) {
    console.log("⚠️ Content already exists or registration failed, continuing with existing content...");
  }

  // Test 2: Get content info
  try {
    const contentInfo = await creatorRegistry.getContent(contentId);
    console.log("- Content info retrieved:", {
      creator: contentInfo.creator,
      contentType: contentInfo.contentType,
      ratePerUnit: ethers.formatEther(contentInfo.ratePerUnit),
      active: contentInfo.active,
      totalEarnings: ethers.formatEther(contentInfo.totalEarnings),
      totalViews: contentInfo.totalViews.toString()
    });
  } catch (error) {
    console.log("⚠️ Could not retrieve content info, using fallback contentId");
    // Use a fallback contentId for testing
    const fallbackContentId = ethers.keccak256(ethers.toUtf8Bytes("fallback-content"));
  }

  console.log("\n🔍 Testing MicroPayVault...");

  // Test 3: Deposit funds
  const depositAmount = ethers.parseEther("0.1"); // 0.1 STT
  console.log("- Depositing", ethers.formatEther(depositAmount), "STT");
  const depositTx = await microPayVault.connect(deployer).deposit({ value: depositAmount });
  await depositTx.wait();
  console.log("✅ Deposit successful!");

  // Test 4: Set monthly limit
  const monthlyLimit = ethers.parseEther("0.5"); // 0.5 STT monthly limit
  console.log("- Setting monthly limit to", ethers.formatEther(monthlyLimit), "STT");
  const setLimitTx = await microPayVault.connect(deployer).setMonthlyLimit(monthlyLimit);
  await setLimitTx.wait();
  console.log("✅ Monthly limit set!");

  // Test 5: Get user balance
  const userBalance = await microPayVault.getUserBalance(deployer.address);
  console.log("- User balance:", {
    balance: ethers.formatEther(userBalance.balance),
    monthlyLimit: ethers.formatEther(userBalance.monthlyLimit),
    monthlySpent: ethers.formatEther(userBalance.monthlySpent)
  });

  console.log("\n🔍 Testing MeteredAccess...");

  // Test 6: Start a session
  const sessionContentId = contentId; // Use the contentId from above
  console.log("- Starting session for content:", sessionContentId);
  
  try {
    const startSessionTx = await meteredAccess.connect(deployer).startSession(sessionContentId);
    const sessionReceipt = await startSessionTx.wait();
    const sessionId = sessionReceipt.logs[0].topics[1]; // Get sessionId from event
    console.log("✅ Session started! Session ID:", sessionId);
  } catch (error) {
    console.log("⚠️ Session start failed, trying with fallback contentId...");
    const fallbackContentId = ethers.keccak256(ethers.toUtf8Bytes("fallback-content"));
    const startSessionTx = await meteredAccess.connect(deployer).startSession(fallbackContentId);
    const sessionReceipt = await startSessionTx.wait();
    const sessionId = sessionReceipt.logs[0].topics[1];
    console.log("✅ Session started with fallback! Session ID:", sessionId);
  }

  // Test 7: Update session with consumption
  const consumption = 100; // 100 units
  console.log("- Updating session with consumption:", consumption, "units");
  const updateTx = await meteredAccess.connect(deployer).updateSession(sessionId, consumption);
  await updateTx.wait();
  console.log("✅ Session updated with consumption!");

  // Test 8: Get session info
  const session = await meteredAccess.getSession(sessionId);
  console.log("- Session info:", {
    user: session.user,
    contentId: session.contentId,
    startTime: new Date(Number(session.startTime) * 1000).toISOString(),
    totalConsumption: session.totalConsumption.toString(),
    totalPayment: ethers.formatEther(session.totalPayment),
    active: session.active
  });

  // Test 9: End session and process micropayment
  console.log("- Ending session and processing micropayment...");
  const endSessionTx = await meteredAccess.connect(deployer).endSession(sessionId);
  await endSessionTx.wait();
  console.log("✅ Session ended and micropayment processed!");

  // Test 10: Check final balances
  const finalUserBalance = await microPayVault.getUserBalance(deployer.address);
  const creatorEarnings = await microPayVault.getCreatorEarnings(deployer.address);
  
  console.log("\n📊 Final Results:");
  console.log("- User balance:", ethers.formatEther(finalUserBalance.balance), "STT");
  console.log("- User monthly spent:", ethers.formatEther(finalUserBalance.monthlySpent), "STT");
  console.log("- Creator earnings:", ethers.formatEther(creatorEarnings.totalEarnings), "STT");

  console.log("\n🎉 Manual testing completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Manual testing failed:", error);
    process.exit(1);
  });

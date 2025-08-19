import { listAvailableVersions } from "./load-contracts";

async function main(): Promise<void> {
    console.log("📋 Available Contract Versions\n");
    
    const networks = ["somnia-testnet", "somnia-mainnet"];
    
    for (const network of networks) {
        console.log(`🌐 ${network.toUpperCase()}:`);
        
        const versions = listAvailableVersions(network);
        
        if (versions.length === 0) {
            console.log("   ❌ No deployments found");
        } else {
            versions.forEach((version, index) => {
                const isLatest = index === 0 ? " (LATEST)" : "";
                console.log(`   📅 ${version.date}${isLatest}`);
                console.log(`   📁 File: ${version.file}`);
                console.log(`   🔗 CreatorRegistry: ${version.contracts.CreatorRegistry || "N/A"}`);
                console.log(`   🔗 MicroPayVault: ${version.contracts.MicroPayVault || "N/A"}`);
                console.log(`   🔗 MeteredAccess: ${version.contracts.MeteredAccess || "N/A"}`);
                console.log("");
            });
        }
    }
    
    console.log("💡 Usage:");
    console.log("   - Use 'LATEST' version for current development");
    console.log("   - Use specific timestamp for historical testing");
    console.log("   - Run 'pnpm run test:manual' to test latest version");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Failed to list versions:", error);
        process.exit(1);
    });

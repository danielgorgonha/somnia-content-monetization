import * as fs from 'fs';
import * as path from 'path';

async function main(): Promise<void> {
    console.log("🧹 Cleaning Somnia Content Monetization development environment...");

    const filesToRemove = [
        // Hardhat artifacts
        'cache',
        'artifacts',
        'typechain',
        'typechain-types',
        
        // Test artifacts
        'coverage',
        'coverage.json',
        
        // Deployment files
        'deployment-*.json',
        'test-setup-*.json',
        'test-addresses.json',
        
        // Environment files
        '.env.local',
        '.env.test',
        
        // Log files
        '*.log',
        'npm-debug.log*',
        'yarn-debug.log*',
        'yarn-error.log*',
        
        // IDE files
        '.vscode',
        '.idea',
        '*.swp',
        '*.swo',
        '*~',
        
        // OS files
        '.DS_Store',
        'Thumbs.db'
    ];

    const dirsToRemove = [
        'cache',
        'artifacts',
        'typechain',
        'typechain-types',
        'coverage',
        '.vscode',
        '.idea'
    ];

    let removedCount = 0;

    try {
        // Remove directories
        for (const dir of dirsToRemove) {
            if (fs.existsSync(dir)) {
                fs.rmSync(dir, { recursive: true, force: true });
                console.log(`🗑️  Removed directory: ${dir}`);
                removedCount++;
            }
        }

        // Remove files by pattern
        const currentDir = process.cwd();
        const files = fs.readdirSync(currentDir);

        for (const file of files) {
            const filePath = path.join(currentDir, file);
            const stat = fs.statSync(filePath);

            if (stat.isFile()) {
                // Check if file matches any pattern
                for (const pattern of filesToRemove) {
                    if (pattern.includes('*')) {
                        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
                        if (regex.test(file)) {
                            fs.unlinkSync(filePath);
                            console.log(`🗑️  Removed file: ${file}`);
                            removedCount++;
                            break;
                        }
                    } else if (file === pattern) {
                        fs.unlinkSync(filePath);
                        console.log(`🗑️  Removed file: ${file}`);
                        removedCount++;
                        break;
                    }
                }
            }
        }

        // Clean node_modules if requested
        if (process.argv.includes('--all')) {
            if (fs.existsSync('node_modules')) {
                console.log("🗑️  Removing node_modules (use --all flag)...");
                fs.rmSync('node_modules', { recursive: true, force: true });
                console.log("🗑️  Removed node_modules");
                removedCount++;
            }
        }

        // Clean Docker volumes if requested
        if (process.argv.includes('--docker')) {
            console.log("🐳 Cleaning Docker volumes...");
            const { execSync } = require('child_process');
            try {
                execSync('docker-compose down -v', { stdio: 'inherit' });
                console.log("🗑️  Removed Docker volumes");
                removedCount++;
            } catch (error) {
                console.log("ℹ️  Docker not running or no volumes to remove");
            }
        }

        console.log(`\n🎉 Cleanup completed! Removed ${removedCount} items.`);

        if (removedCount === 0) {
            console.log("✨ Environment was already clean!");
        }

        console.log("\n🔗 Next Steps:");
        console.log("1. Reinstall dependencies: pnpm install");
        console.log("2. Compile contracts: pnpm run compile");
        console.log("3. Run tests: pnpm run test:contracts");
        console.log("4. Start Docker: pnpm run docker:up");

    } catch (error) {
        console.error("❌ Cleanup failed:", error.message);
        throw error;
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("💥 Cleanup failed:", error);
        process.exit(1);
    });

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Hardhat pre-funded test accounts (safe to use for localhost testing)
const testAccounts = {
  PRIVATE_KEY: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  DEPLOYER_PRIVATE_KEY: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
  TEST_ACCOUNT_1: '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
  TEST_ACCOUNT_2: '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6',
  TEST_ACCOUNT_3: '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a',
  TEST_ACCOUNT_4: '0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba',
  TEST_ACCOUNT_5: '0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e',
  TEST_ACCOUNT_6: '0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356',
  TEST_ACCOUNT_7: '0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97',
  TEST_ACCOUNT_8: '0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6'
};

function updateEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  
  try {
    // Read current .env file
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Update private keys section
    const privateKeysSection = `# Private Keys (DO NOT COMMIT REAL KEYS)
# For localhost testing, use Hardhat's pre-funded accounts
PRIVATE_KEY=${testAccounts.PRIVATE_KEY}
DEPLOYER_PRIVATE_KEY=${testAccounts.DEPLOYER_PRIVATE_KEY}

# Additional test accounts for localhost (Hardhat pre-funded accounts)
TEST_ACCOUNT_1=${testAccounts.TEST_ACCOUNT_1}
TEST_ACCOUNT_2=${testAccounts.TEST_ACCOUNT_2}
TEST_ACCOUNT_3=${testAccounts.TEST_ACCOUNT_3}
TEST_ACCOUNT_4=${testAccounts.TEST_ACCOUNT_4}
TEST_ACCOUNT_5=${testAccounts.TEST_ACCOUNT_5}
TEST_ACCOUNT_6=${testAccounts.TEST_ACCOUNT_6}
TEST_ACCOUNT_7=${testAccounts.TEST_ACCOUNT_7}
TEST_ACCOUNT_8=${testAccounts.TEST_ACCOUNT_8}`;

    // Replace the private keys section
    envContent = envContent.replace(
      /# Private Keys.*?(?=\n# )/s,
      privateKeysSection
    );
    
    // Write updated .env file
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ .env file updated with secure test accounts');
    console.log('🔒 Using Hardhat pre-funded accounts for localhost testing');
    console.log('⚠️  These accounts are safe for localhost only');
    
  } catch (error) {
    console.error('❌ Error updating .env file:', error.message);
    process.exit(1);
  }
}

// Run the update
updateEnvFile();

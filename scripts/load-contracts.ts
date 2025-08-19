import { ethers } from "hardhat";
import type { Contract } from "ethers";
import * as fs from "fs";
import * as path from "path";

/**
 * Carrega os endereços dos contratos deployados
 * @param {string} network - Nome da rede (ex: 'somnia-testnet')
 * @param {string} version - Versão específica (opcional)
 * @returns {Object} Objeto com endereços dos contratos
 */
function loadDeployedContracts(network = "somnia-testnet", version = null) {
    const deploymentPath = path.join(__dirname, "../deployments");
    
    if (!fs.existsSync(deploymentPath)) {
        throw new Error("Deployments directory not found");
    }

    // Search deployment files for the specific network
    const deploymentFiles = fs.readdirSync(deploymentPath)
        .filter(file => file.includes(network) && file.endsWith(".json"))
        .sort()
        .reverse(); // Mais recente primeiro

    if (deploymentFiles.length === 0) {
        throw new Error(`No deployment files found for network: ${network}`);
    }

    // If specific version was requested, search by timestamp
    let targetFile;
    if (version) {
        targetFile = deploymentFiles.find(file => file.includes(version));
        if (!targetFile) {
            throw new Error(`Version ${version} not found for network ${network}`);
        }
    } else {
        // Use the latest
        targetFile = deploymentFiles[0];
    }

    const deployment = JSON.parse(
        fs.readFileSync(path.join(deploymentPath, targetFile), 'utf8')
    );

    console.log(`📋 Loading contracts from: ${targetFile}`);
    console.log(`📅 Deployed at: ${new Date(deployment.timestamp).toLocaleString()}`);

    return {
        deployment,
        contracts: {
            CreatorRegistry: deployment.CreatorRegistry,
            MicroPayVault: deployment.MicroPayVault,
            MeteredAccess: deployment.MeteredAccess,
            ContractRegistry: deployment.ContractRegistry
        },
        metadata: {
            timestamp: deployment.timestamp,
            deployer: deployment.deployer,
            network: network,
            file: targetFile
        }
    };
}

/**
 * Gets contract instances
 * @param {string} network - Network name
 * @param {string} version - Specific version (optional)
 * @returns {Object} Object with contract instances
 */
async function getContractInstances(network = "somnia-testnet", version = null) {
    const { contracts } = loadDeployedContracts(network, version);
    
    const instances: Record<string, Contract> = {};
    
    // Carregar CreatorRegistry
    if (contracts.CreatorRegistry) {
        instances.CreatorRegistry = await ethers.getContractAt(
            "CreatorRegistry", 
            contracts.CreatorRegistry
        );
    }
    
    // Carregar MicroPayVault
    if (contracts.MicroPayVault) {
        instances.MicroPayVault = await ethers.getContractAt(
            "MicroPayVault", 
            contracts.MicroPayVault
        );
    }
    
    // Carregar MeteredAccess
    if (contracts.MeteredAccess) {
        instances.MeteredAccess = await ethers.getContractAt(
            "MeteredAccess", 
            contracts.MeteredAccess
        );
    }
    
    // Carregar ContractRegistry (se existir)
    if (contracts.ContractRegistry) {
        instances.ContractRegistry = await ethers.getContractAt(
            "ContractRegistry", 
            contracts.ContractRegistry
        );
    }
    
    return instances;
}

/**
 * Lista todas as versões disponíveis
 * @param {string} network - Nome da rede
 * @returns {Array} Lista de versões disponíveis
 */
function listAvailableVersions(network = "somnia-testnet") {
    const deploymentPath = path.join(__dirname, "../deployments");
    
    if (!fs.existsSync(deploymentPath)) {
        return [];
    }

    const deploymentFiles = fs.readdirSync(deploymentPath)
        .filter(file => file.includes(network) && file.endsWith(".json"))
        .sort()
        .reverse();

    return deploymentFiles.map(file => {
        const deployment = JSON.parse(
            fs.readFileSync(path.join(deploymentPath, file), 'utf8')
        );
        
        return {
            file,
            timestamp: deployment.timestamp,
            date: new Date(deployment.timestamp).toLocaleString(),
            contracts: {
                CreatorRegistry: deployment.CreatorRegistry,
                MicroPayVault: deployment.MicroPayVault,
                MeteredAccess: deployment.MeteredAccess
            }
        };
    });
}

export {
    loadDeployedContracts,
    getContractInstances,
    listAvailableVersions
};

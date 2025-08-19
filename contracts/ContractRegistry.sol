// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ContractRegistry
 * @dev Registry to manage contract versions
 */
contract ContractRegistry is Ownable {
    
    struct ContractVersion {
        string version;
        address contractAddress;
        uint256 deployedAt;
        string description;
        bool active;
    }
    
    mapping(string => ContractVersion[]) public contractVersions;
    mapping(string => string) public latestVersions;
    
    event ContractRegistered(string contractName, string version, address contractAddress);
    event VersionActivated(string contractName, string version);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Registers a new contract version
     */
    function registerContract(
        string memory contractName,
        string memory version,
        address contractAddress,
        string memory description
    ) external onlyOwner {
        require(contractAddress != address(0), "Invalid contract address");
        
        ContractVersion memory newVersion = ContractVersion({
            version: version,
            contractAddress: contractAddress,
            deployedAt: block.timestamp,
            description: description,
            active: false
        });
        
        contractVersions[contractName].push(newVersion);
        latestVersions[contractName] = version;
        
        emit ContractRegistered(contractName, version, contractAddress);
    }
    
    /**
     * @dev Activates a specific version
     */
    function activateVersion(string memory contractName, string memory version) external onlyOwner {
        ContractVersion[] storage versions = contractVersions[contractName];
        
        for (uint i = 0; i < versions.length; i++) {
            if (keccak256(bytes(versions[i].version)) == keccak256(bytes(version))) {
                // Deactivate all other versions
                for (uint j = 0; j < versions.length; j++) {
                    versions[j].active = false;
                }
                // Activate the selected version
                versions[i].active = true;
                latestVersions[contractName] = version;
                
                emit VersionActivated(contractName, version);
                return;
            }
        }
        
        revert("Version not found");
    }
    
    /**
     * @dev Returns the address of the active version
     */
    function getActiveContract(string memory contractName) external view returns (address) {
        ContractVersion[] storage versions = contractVersions[contractName];
        
        for (uint i = 0; i < versions.length; i++) {
            if (versions[i].active) {
                return versions[i].contractAddress;
            }
        }
        
        revert("No active version found");
    }
    
    /**
     * @dev Returns the latest version
     */
    function getLatestVersion(string memory contractName) external view returns (string memory) {
        return latestVersions[contractName];
    }
    
    /**
     * @dev Returns all versions of a contract
     */
    function getContractVersions(string memory contractName) external view returns (ContractVersion[] memory) {
        return contractVersions[contractName];
    }
}

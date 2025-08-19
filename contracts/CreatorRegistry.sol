// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/ICreatorRegistry.sol";

contract CreatorRegistry is ICreatorRegistry, Ownable, ReentrancyGuard {
    // Mappings
    mapping(bytes32 => Content) public contents;
    mapping(address => bytes32[]) public creatorContents;
    
    // Constants
    uint256 public constant MIN_RATE_PER_UNIT = 0.001 ether; // 0.001 ETH minimum rate
    
    // State variables
    uint256 public totalContents;
    uint256 public totalCreators;

    modifier onlyContentCreator(bytes32 contentId) {
        require(contents[contentId].creator == msg.sender, "Not content creator");
        _;
    }

    modifier contentExists(bytes32 contentId) {
        require(contents[contentId].creator != address(0), "Content does not exist");
        _;
    }

    constructor() Ownable(msg.sender) {}

    function registerContent(
        bytes32 contentId,
        address token,
        ContentType contentType,
        uint128 ratePerUnit,
        string calldata metadata
    ) external override {
        require(contentId != bytes32(0), "Invalid content ID");
        require(token != address(0), "Invalid token address");
        require(ratePerUnit >= MIN_RATE_PER_UNIT, "Rate below minimum");
        require(contents[contentId].creator == address(0), "Content already exists");
        
        // Create content
        Content storage content = contents[contentId];
        content.creator = msg.sender;
        content.token = token;
        content.contentType = contentType;
        content.ratePerUnit = ratePerUnit;
        content.active = true;
        content.totalEarnings = 0;
        content.totalViews = 0;
        content.metadata = metadata;
        
        // Update mappings
        creatorContents[msg.sender].push(contentId);
        totalContents++;
        
        emit ContentRegistered(contentId, msg.sender, contentType);
    }

    function updateContentRate(
        bytes32 contentId,
        uint128 newRate
    ) external override onlyContentCreator(contentId) contentExists(contentId) {
        require(newRate > 0, "Rate must be greater than 0");
        contents[contentId].ratePerUnit = newRate;
        emit ContentUpdated(contentId, newRate);
    }

    function deactivateContent(
        bytes32 contentId
    ) external override onlyContentCreator(contentId) contentExists(contentId) {
        contents[contentId].active = false;
        emit ContentDeactivated(contentId);
    }

    function getContent(
        bytes32 contentId
    ) external view override returns (Content memory) {
        return contents[contentId];
    }

    function getCreatorContents(
        address creator
    ) external view override returns (bytes32[] memory) {
        return creatorContents[creator];
    }

    function isContentActive(
        bytes32 contentId
    ) external view override returns (bool) {
        return contents[contentId].active;
    }

    function updateContentEarnings(
        bytes32 contentId,
        uint128 amount
    ) external {
        require(msg.sender == owner(), "Only owner can update earnings");
        contents[contentId].totalEarnings += amount;
    }

    function incrementContentView(bytes32 contentId) external {
        require(msg.sender == owner(), "Only owner can increment views");
        contents[contentId].totalViews++;
    }
}

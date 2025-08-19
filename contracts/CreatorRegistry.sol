// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/ICreatorRegistry.sol";

contract CreatorRegistry is ICreatorRegistry, Ownable, ReentrancyGuard {
    mapping(bytes32 => Content) public contents;
    mapping(address => bytes32[]) public creatorContents;
    mapping(ContentType => uint256) public contentTypeCounts;

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
        uint256 ratePerUnit,
        string memory metadata
    ) external override nonReentrant {
        require(contents[contentId].creator == address(0), "Content already exists");
        require(token != address(0), "Invalid token address");
        require(ratePerUnit > 0, "Rate must be greater than 0");

        contents[contentId] = Content({
            creator: msg.sender,
            token: token,
            contentType: contentType,
            ratePerUnit: ratePerUnit,
            active: true,
            totalEarnings: 0,
            totalViews: 0,
            metadata: metadata
        });

        creatorContents[msg.sender].push(contentId);
        contentTypeCounts[contentType]++;

        emit ContentRegistered(contentId, msg.sender, contentType);
    }

    function updateContentRate(
        bytes32 contentId,
        uint256 newRate
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
        uint256 amount
    ) external {
        require(msg.sender == owner(), "Only owner can update earnings");
        contents[contentId].totalEarnings += amount;
    }

    function incrementContentView(bytes32 contentId) external {
        require(msg.sender == owner(), "Only owner can increment views");
        contents[contentId].totalViews++;
    }

    function getContentTypeCount(ContentType contentType) external view returns (uint256) {
        return contentTypeCounts[contentType];
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ICreatorRegistry {
    enum ContentType {
        VIDEO,
        AUDIO,
        TEXT,
        RECIPE,
        BOOK,
        COURSE,
        PODCAST,
        ARTICLE
    }

    struct Content {
        address creator;
        address token;
        ContentType contentType;
        uint128 ratePerUnit;      // Reduced from uint256
        bool active;
        uint128 totalEarnings;    // Reduced from uint256
        uint64 totalViews;        // Reduced from uint256
        string metadata;
    }

    event ContentRegistered(
        bytes32 indexed contentId,
        address indexed creator,
        ContentType contentType
    );
    event ContentUpdated(bytes32 indexed contentId, uint256 newRate);
    event ContentDeactivated(bytes32 indexed contentId);

    function registerContent(
        bytes32 contentId,
        address token,
        ContentType contentType,
        uint128 ratePerUnit,
        string calldata metadata
    ) external;

    function updateContentRate(bytes32 contentId, uint128 newRate) external;

    function deactivateContent(bytes32 contentId) external;

    function getContent(bytes32 contentId) external view returns (Content memory);

    function getCreatorContents(address creator) external view returns (bytes32[] memory);

    function isContentActive(bytes32 contentId) external view returns (bool);
}

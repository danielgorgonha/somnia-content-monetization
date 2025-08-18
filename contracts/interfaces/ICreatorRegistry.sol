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
        uint256 ratePerUnit;
        bool active;
        uint256 totalEarnings;
        uint256 totalViews;
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
        uint256 ratePerUnit,
        string memory metadata
    ) external;

    function updateContentRate(bytes32 contentId, uint256 newRate) external;

    function deactivateContent(bytes32 contentId) external;

    function getContent(bytes32 contentId) external view returns (Content memory);

    function getCreatorContents(address creator) external view returns (bytes32[] memory);

    function isContentActive(bytes32 contentId) external view returns (bool);
}

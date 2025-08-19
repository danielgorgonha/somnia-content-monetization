// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IMeteredAccess
 * @dev Interface for the MeteredAccess contract - Main contract for content consumption and micropayments
 */
interface IMeteredAccess {
    // Events
    event SessionStarted(
        bytes32 indexed sessionId,
        address indexed user,
        bytes32 indexed contentId,
        uint256 startTime
    );
    event SessionUpdated(
        bytes32 indexed sessionId,
        uint256 consumption,
        uint256 micropaymentAmount
    );
    event SessionEnded(
        bytes32 indexed sessionId,
        address indexed user,
        bytes32 indexed contentId,
        uint256 totalConsumption,
        uint256 totalPayment
    );
    event MicropaymentProcessed(
        address indexed user,
        address indexed creator,
        uint256 amount,
        bytes32 indexed contentId
    );

    // Structs
    struct Session {
        address user;
        bytes32 contentId;
        uint32 startTime;      // Reduced from uint256 for gas optimization
        uint32 lastUpdate;     // Reduced from uint256 for gas optimization
        uint128 totalConsumption; // Total units consumed (seconds, words, etc.)
        uint256 totalPayment;     // Total amount paid
        bool active;
    }

    struct ConsumptionConfig {
        uint128 ratePerUnit;   // Rate per consumption unit
        uint32 updateInterval; // How often to process micropayments (seconds)
        uint128 minPayment;    // Minimum payment threshold
        bool enabled;
    }

    // Functions
    function startSession(bytes32 contentId) external returns (bytes32 sessionId);
    function updateSession(bytes32 sessionId, uint128 consumption) external;
    function endSession(bytes32 sessionId) external;
    function getSession(bytes32 sessionId) external view returns (Session memory);
    function getUserSessions(address user) external view returns (bytes32[] memory);
    function getActiveSessions(address user) external view returns (bytes32[] memory);
    function setConsumptionConfig(bytes32 contentId, ConsumptionConfig calldata config) external;
    function getConsumptionConfig(bytes32 contentId) external view returns (ConsumptionConfig memory);
    function processMicropayment(bytes32 sessionId) external;
    function getSessionPayment(bytes32 sessionId) external view returns (uint256);
}


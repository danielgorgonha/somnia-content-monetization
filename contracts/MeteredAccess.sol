// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IMeteredAccess.sol";
import "./interfaces/ICreatorRegistry.sol";
import "./interfaces/IMicroPayVault.sol";

/**
 * @title MeteredAccess
 * @dev Main contract for content consumption tracking and micropayment processing
 * Integrates CreatorRegistry and MicroPayVault for seamless content monetization
 */
contract MeteredAccess is IMeteredAccess, Ownable, ReentrancyGuard {
    // Contract dependencies
    ICreatorRegistry public immutable creatorRegistry;
    IMicroPayVault public immutable microPayVault;
    
    // Storage
    mapping(bytes32 => Session) public sessions;
    mapping(address => bytes32[]) public userSessions;
    mapping(bytes32 => ConsumptionConfig) public consumptionConfigs;
    mapping(bytes32 => bytes32[]) public contentSessions;
    
    // Counters
    uint256 public totalSessions;
    uint256 public totalMicropaymentsProcessed;
    
    // Constants
    uint256 public constant MIN_UPDATE_INTERVAL = 1; // 1 second minimum
    uint256 public constant MAX_UPDATE_INTERVAL = 3600; // 1 hour maximum
    
    constructor(
        address _creatorRegistry,
        address _microPayVault
    ) Ownable(msg.sender) {
        require(_creatorRegistry != address(0), "Invalid creator registry");
        require(_microPayVault != address(0), "Invalid micro pay vault");
        
        creatorRegistry = ICreatorRegistry(_creatorRegistry);
        microPayVault = IMicroPayVault(_microPayVault);
    }
    
    /**
     * @dev Start a new consumption session
     */
    function startSession(
        bytes32 contentId
    ) external override nonReentrant returns (bytes32 sessionId) {
        // Verify content exists and is active
        ICreatorRegistry.Content memory content = creatorRegistry.getContent(contentId);
        require(content.creator != address(0), "Content does not exist");
        require(content.active, "Content is not active");
        
        // Generate unique session ID
        sessionId = keccak256(abi.encodePacked(
            msg.sender,
            contentId,
            block.timestamp,
            totalSessions
        ));
        
        // Create session
        Session storage session = sessions[sessionId];
        session.user = msg.sender;
        session.contentId = contentId;
        session.startTime = uint32(block.timestamp);
        session.lastUpdate = uint32(block.timestamp);
        session.totalConsumption = 0;
        session.totalPayment = 0;
        session.active = true;
        
        // Update mappings
        userSessions[msg.sender].push(sessionId);
        contentSessions[contentId].push(sessionId);
        totalSessions++;
        
        emit SessionStarted(sessionId, msg.sender, contentId, block.timestamp);
    }
    
    /**
     * @dev Update session with new consumption data
     */
    function updateSession(
        bytes32 sessionId,
        uint128 consumption
    ) external override nonReentrant {
        Session storage session = sessions[sessionId];
        require(session.user == msg.sender, "Not session owner");
        require(session.active, "Session not active");
        require(consumption > 0, "Invalid consumption amount");
        
        // Get content info
        ICreatorRegistry.Content memory content = creatorRegistry.getContent(session.contentId);
        require(content.active, "Content is not active");
        
        // Calculate consumption increase
        require(consumption > session.totalConsumption, "No consumption increase");
        uint128 consumptionIncrease = consumption - session.totalConsumption;
        
        // Update session consumption (don't process micropayment here)
        session.totalConsumption = consumption;
        session.lastUpdate = uint32(block.timestamp);
        
        emit SessionUpdated(sessionId, consumptionIncrease, 0);
    }
    
    /**
     * @dev End a consumption session
     */
    function endSession(bytes32 sessionId) external override nonReentrant {
        Session storage session = sessions[sessionId];
        require(session.user == msg.sender, "Not session owner");
        require(session.active, "Session not active");
        
        session.active = false;
        
        emit SessionEnded(
            sessionId,
            session.user,
            session.contentId,
            session.totalConsumption,
            session.totalPayment
        );
    }
    
    /**
     * @dev Get session information
     */
    function getSession(
        bytes32 sessionId
    ) external view override returns (Session memory) {
        return sessions[sessionId];
    }
    
    /**
     * @dev Get all sessions for a user
     */
    function getUserSessions(
        address user
    ) external view override returns (bytes32[] memory) {
        return userSessions[user];
    }
    
    /**
     * @dev Get active sessions for a user
     */
    function getActiveSessions(
        address user
    ) external view override returns (bytes32[] memory) {
        bytes32[] memory allSessions = userSessions[user];
        uint256 activeCount = 0;
        
        // Count active sessions
        for (uint256 i = 0; i < allSessions.length; i++) {
            if (sessions[allSessions[i]].active) {
                activeCount++;
            }
        }
        
        // Create array with active sessions
        bytes32[] memory activeSessions = new bytes32[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < allSessions.length; i++) {
            if (sessions[allSessions[i]].active) {
                activeSessions[index] = allSessions[i];
                index++;
            }
        }
        
        return activeSessions;
    }
    
    /**
     * @dev Set consumption configuration for content
     */
    function setConsumptionConfig(
        bytes32 contentId,
        ConsumptionConfig calldata config
    ) external override {
        // Only content creator or owner can set config
        ICreatorRegistry.Content memory content = creatorRegistry.getContent(contentId);
        require(
            content.creator == msg.sender || msg.sender == owner(),
            "Not authorized"
        );
        
        require(config.updateInterval >= MIN_UPDATE_INTERVAL, "Update interval too low");
        require(config.updateInterval <= MAX_UPDATE_INTERVAL, "Update interval too high");
        require(config.ratePerUnit > 0, "Rate must be greater than 0");
        
        consumptionConfigs[contentId] = config;
    }
    
    /**
     * @dev Get consumption configuration for content
     */
    function getConsumptionConfig(
        bytes32 contentId
    ) external view override returns (ConsumptionConfig memory) {
        return consumptionConfigs[contentId];
    }
    
    /**
     * @dev Process micropayment for a session
     */
    function processMicropayment(bytes32 sessionId) external override nonReentrant {
        Session storage session = sessions[sessionId];
        require(session.user == msg.sender, "Not session owner");
        require(session.active, "Session not active");
        
        // Get content info
        ICreatorRegistry.Content memory content = creatorRegistry.getContent(session.contentId);
        require(content.active, "Content is not active");
        
        // Calculate payment based on current consumption
        uint256 payment = session.totalConsumption * content.ratePerUnit;
        uint256 paymentDue = payment - session.totalPayment;
        
        require(paymentDue > 0, "No payment due");
        
        // Check user balance
        IMicroPayVault.UserBalance memory userBalance = microPayVault.getUserBalance(msg.sender);
        require(userBalance.balance >= paymentDue, "Insufficient balance");
        
        // Debug: Log the actual values being compared
        emit SessionUpdated(sessionId, userBalance.balance, paymentDue);
        
        // Send micropayment
        microPayVault.sendMicropayment(
            msg.sender,
            content.creator,
            paymentDue,
            _bytes32ToString(session.contentId)
        );
        
        // Update session
        session.totalPayment = uint256(payment);
        session.lastUpdate = uint32(block.timestamp);
        
        totalMicropaymentsProcessed++;
        
        emit SessionUpdated(sessionId, 0, paymentDue);
        emit MicropaymentProcessed(msg.sender, content.creator, paymentDue, session.contentId);
    }
    
    /**
     * @dev Get current payment amount for a session
     */
    function getSessionPayment(
        bytes32 sessionId
    ) external view override returns (uint256) {
        Session storage session = sessions[sessionId];
        if (session.user == address(0)) return 0;
        
        ICreatorRegistry.Content memory content = creatorRegistry.getContent(session.contentId);
        if (!content.active) return 0;
        
        uint256 payment = session.totalConsumption * content.ratePerUnit;
        return payment - session.totalPayment;
    }
    
    /**
     * @dev Emergency function to end all sessions for a user (owner only)
     */
    function emergencyEndUserSessions(address user) external onlyOwner {
        bytes32[] memory userSessionList = userSessions[user];
        
        for (uint256 i = 0; i < userSessionList.length; i++) {
            Session storage session = sessions[userSessionList[i]];
            if (session.active) {
                session.active = false;
                
                emit SessionEnded(
                    userSessionList[i],
                    session.user,
                    session.contentId,
                    session.totalConsumption,
                    session.totalPayment
                );
            }
        }
    }
    
    /**
     * @dev Get contract statistics
     */
    function getStats() external view returns (
        uint256 _totalSessions,
        uint256 _totalMicropaymentsProcessed,
        uint256 _activeSessions
    ) {
        uint256 activeCount = 0;
        // Note: This is a simplified count. In production, you'd want to track this separately
        return (totalSessions, totalMicropaymentsProcessed, activeCount);
    }
    
    /**
     * @dev Helper function to convert bytes32 to string
     */
    function _bytes32ToString(bytes32 _bytes32) internal pure returns (string memory) {
        uint8 i = 0;
        while (i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }
}

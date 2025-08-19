// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IMicroPayVault
 * @dev Interface for the MicroPayVault contract
 */
interface IMicroPayVault {
    // Events
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);
    event MicropaymentSent(address indexed from, address indexed to, uint256 amount, string contentId);
    event CreatorEarningsUpdated(address indexed creator, uint256 totalEarnings);

    // Structs
    struct UserBalance {
        uint128 balance;      // Reduced from uint256
        uint128 monthlyLimit; // Reduced from uint256
        uint128 monthlySpent; // Reduced from uint256
        uint32 lastReset;     // Reduced from uint256 (timestamp)
    }

    struct CreatorEarnings {
        uint128 totalEarnings;    // Reduced from uint256
        uint128 pendingWithdrawal; // Reduced from uint256
        uint32 lastWithdrawal;    // Reduced from uint256 (timestamp)
    }

    // Functions
    function deposit() external payable;
    function withdraw(uint256 amount) external;
    function getUserBalance(address user) external view returns (UserBalance memory);
    function getCreatorEarnings(address creator) external view returns (CreatorEarnings memory);
    function sendMicropayment(address creator, uint256 amount, string calldata contentId) external;
    function withdrawCreatorEarnings() external;
    function setMonthlyLimit(uint128 limit) external;
    function getVaultBalance() external view returns (uint256);
}

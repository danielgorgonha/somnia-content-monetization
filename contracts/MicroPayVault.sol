// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IMicroPayVault.sol";

/**
 * @title MicroPayVault
 * @dev Escrow system for micropayments
 */
contract MicroPayVault is IMicroPayVault, ReentrancyGuard, Ownable {
    // Mappings
    mapping(address => UserBalance) public userBalances;
    mapping(address => CreatorEarnings) public creatorEarnings;
    
    // Constants
    uint256 public constant MIN_MICROPAYMENT = 0.001 ether; // 0.001 SOM
    uint256 public constant MAX_MONTHLY_LIMIT = 100 ether; // 100 SOM
    
    // State variables
    uint256 public totalVaultBalance;
    uint256 public totalMicropaymentsProcessed;
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Deposit funds to user's balance
     */
    function deposit() external payable override {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        
        UserBalance storage balance = userBalances[msg.sender];
        balance.balance += msg.value;
        totalVaultBalance += msg.value;
        
        emit Deposit(msg.sender, msg.value);
    }
    
    /**
     * @dev Withdraw funds from user's balance
     */
    function withdraw(uint256 amount) external override nonReentrant {
        UserBalance storage balance = userBalances[msg.sender];
        require(balance.balance >= amount, "Insufficient balance");
        
        balance.balance -= amount;
        totalVaultBalance -= amount;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");
        
        emit Withdrawal(msg.sender, amount);
    }
    
    /**
     * @dev Send micropayment to creator
     */
    function sendMicropayment(
        address creator, 
        uint256 amount, 
        string calldata contentId
    ) external override {
        require(creator != address(0), "Invalid creator address");
        require(amount >= MIN_MICROPAYMENT, "Amount below minimum");
        require(amount <= MAX_MONTHLY_LIMIT, "Amount exceeds maximum");
        
        UserBalance storage userBalance = userBalances[msg.sender];
        require(userBalance.balance >= amount, "Insufficient balance");
        
        // Check monthly limit
        _resetMonthlyLimitIfNeeded(msg.sender);
        require(
            userBalance.monthlySpent + amount <= userBalance.monthlyLimit,
            "Monthly limit exceeded"
        );
        
        // Transfer funds
        userBalance.balance -= amount;
        userBalance.monthlySpent += amount;
        totalVaultBalance -= amount; // Decrement total vault balance
        
        CreatorEarnings storage earnings = creatorEarnings[creator];
        earnings.totalEarnings += amount;
        earnings.pendingWithdrawal += amount;
        
        totalMicropaymentsProcessed++;
        
        emit MicropaymentSent(msg.sender, creator, amount, contentId);
        emit CreatorEarningsUpdated(creator, earnings.totalEarnings);
    }
    
    /**
     * @dev Withdraw creator earnings
     */
    function withdrawCreatorEarnings() external override nonReentrant {
        CreatorEarnings storage earnings = creatorEarnings[msg.sender];
        require(earnings.pendingWithdrawal > 0, "No pending earnings");
        
        uint256 amount = earnings.pendingWithdrawal;
        earnings.pendingWithdrawal = 0;
        earnings.lastWithdrawal = block.timestamp;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");
        
        emit Withdrawal(msg.sender, amount);
    }
    
    /**
     * @dev Set monthly spending limit
     */
    function setMonthlyLimit(uint256 limit) external override {
        require(limit <= MAX_MONTHLY_LIMIT, "Limit exceeds maximum");
        
        UserBalance storage balance = userBalances[msg.sender];
        balance.monthlyLimit = limit;
        
        // Reset monthly spent if setting new limit
        _resetMonthlyLimitIfNeeded(msg.sender);
    }
    
    /**
     * @dev Get user balance information
     */
    function getUserBalance(address user) external view override returns (UserBalance memory) {
        return userBalances[user];
    }
    
    /**
     * @dev Get creator earnings information
     */
    function getCreatorEarnings(address creator) external view override returns (CreatorEarnings memory) {
        return creatorEarnings[creator];
    }
    
    /**
     * @dev Get total vault balance
     */
    function getVaultBalance() external view override returns (uint256) {
        return totalVaultBalance;
    }
    
    /**
     * @dev Reset monthly limit if needed
     */
    function _resetMonthlyLimitIfNeeded(address user) internal {
        UserBalance storage balance = userBalances[user];
        
        // Reset monthly spent if it's a new month
        if (balance.lastReset == 0 || _isNewMonth(balance.lastReset)) {
            balance.monthlySpent = 0;
            balance.lastReset = block.timestamp;
        }
    }
    
    /**
     * @dev Check if it's a new month since last reset
     */
    function _isNewMonth(uint256 lastReset) internal view returns (bool) {
        // Simple month check (30 days)
        return block.timestamp >= lastReset + 30 days;
    }
    
    /**
     * @dev Emergency withdrawal (owner only)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Emergency withdrawal failed");
        
        // Reset vault balance after emergency withdrawal
        totalVaultBalance = 0;
    }
    
    /**
     * @dev Receive function
     */
    receive() external payable {
        // Allow direct deposits
        UserBalance storage balance = userBalances[msg.sender];
        balance.balance += msg.value;
        totalVaultBalance += msg.value;
        
        emit Deposit(msg.sender, msg.value);
    }
}

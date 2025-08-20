import { useAccount } from 'wagmi';
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import {
  CONTRACT_ADDRESSES,
  CONTRACT_ABIS,
  type Session
} from '../types/contracts';

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Helper function to get signer
const getSigner = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // Check if we're on the correct network (Hardhat local)
    const network = await provider.getNetwork();
    console.log('Current network:', network);
    
    // For Hardhat local, chainId should be 31337
    if (network.chainId !== 31337n) {
      console.warn('Please switch to Hardhat local network (Chain ID: 31337)');
      return null;
    }
    
    return provider.getSigner();
  }
  return null;
};

// Helper function to convert string to bytes32
const stringToBytes32 = (str: string): string => {
  return ethers.encodeBytes32String(str);
};

// Real contract hooks
export const useMeteredAccess = () => {
  const { address } = useAccount();
  const [activeSessions, setActiveSessions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getActiveSessions = useCallback(async () => {
    if (!address) return;
    
    try {
      const signer = await getSigner();
      if (!signer) return;
      
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.METERED_ACCESS,
        CONTRACT_ABIS.METERED_ACCESS,
        signer
      );
      
      // Try to call the function directly
      const sessions = await contract.getActiveSessions(address);
      console.log('Active sessions:', sessions);
      setActiveSessions(sessions);
    } catch (error) {
      console.error('Error fetching active sessions:', error);
      // If function doesn't exist or contract not deployed, set empty array
      setActiveSessions([]);
    }
  }, [address]);

  const startSession = useCallback(async (contentId: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    setIsLoading(true);
    try {
      const signer = await getSigner();
      if (!signer) throw new Error('No signer available');
      
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.METERED_ACCESS,
        CONTRACT_ABIS.METERED_ACCESS,
        signer
      );
      const contentIdBytes32 = stringToBytes32(contentId);
      const tx = await contract.startSession(contentIdBytes32);
      await tx.wait();
      await getActiveSessions();
      return tx.hash;
    } catch (error) {
      console.error('Error starting session:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [address, getActiveSessions]);

  const updateSession = useCallback(async (sessionId: string, consumption: number) => {
    if (!address) throw new Error('Wallet not connected');
    
    setIsLoading(true);
    try {
      const signer = await getSigner();
      if (!signer) throw new Error('No signer available');
      
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.METERED_ACCESS,
        CONTRACT_ABIS.METERED_ACCESS,
        signer
      );
      const tx = await contract.updateSession(sessionId, consumption);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  const endSession = useCallback(async (sessionId: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    setIsLoading(true);
    try {
      const signer = await getSigner();
      if (!signer) throw new Error('No signer available');
      
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.METERED_ACCESS,
        CONTRACT_ABIS.METERED_ACCESS,
        signer
      );
      const tx = await contract.endSession(sessionId);
      await tx.wait();
      await getActiveSessions();
      return tx.hash;
    } catch (error) {
      console.error('Error ending session:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [address, getActiveSessions]);

  const getSession = useCallback(async (sessionId: string): Promise<Session | null> => {
    if (!address) return null;
    
    try {
      const signer = await getSigner();
      if (!signer) return null;
      
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.METERED_ACCESS,
        CONTRACT_ABIS.METERED_ACCESS,
        signer
      );
      const session = await contract.getSession(sessionId);
      return {
        user: session.user,
        creator: '0x1234567890123456789012345678901234567890', // Mock for now
        contentId: session.contentId,
        active: session.active,
        startTime: Number(session.startTime) * 1000, // Convert to milliseconds
        lastUpdate: Number(session.lastUpdate) * 1000,
        totalConsumption: Number(session.totalConsumption),
        totalPaid: Number(session.totalPayment),
      };
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }, [address]);

  useEffect(() => {
    getActiveSessions();
  }, [getActiveSessions]);

  return {
    activeSessions,
    startSession,
    updateSession,
    endSession,
    getSession,
    getActiveSessions,
    isLoading,
  };
};

export const useCreatorRegistry = () => {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  const registerCreator = useCallback(async (name: string, description: string, rate: number) => {
    if (!address) throw new Error('Wallet not connected');
    
    setIsLoading(true);
    try {
      const signer = await getSigner();
      if (!signer) throw new Error('No signer available');
      
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.CREATOR_REGISTRY,
        CONTRACT_ABIS.CREATOR_REGISTRY,
        signer
      );
      const tx = await contract.registerCreator(name, description, BigInt(rate));
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error registering creator:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  const updateProfile = useCallback(async (name: string, description: string, rate: number) => {
    if (!address) throw new Error('Wallet not connected');
    
    setIsLoading(true);
    try {
      const signer = await getSigner();
      if (!signer) throw new Error('No signer available');
      
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.CREATOR_REGISTRY,
        CONTRACT_ABIS.CREATOR_REGISTRY,
        signer
      );
      const tx = await contract.updateProfile(name, description, BigInt(rate));
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  const addContent = useCallback(async (contentId: string, title: string, description: string, rate: number) => {
    if (!address) throw new Error('Wallet not connected');
    
    setIsLoading(true);
    try {
      const signer = await getSigner();
      if (!signer) throw new Error('No signer available');
      
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.CREATOR_REGISTRY,
        CONTRACT_ABIS.CREATOR_REGISTRY,
        signer
      );
      const tx = await contract.addContent(contentId, title, description, BigInt(rate));
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error adding content:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  return {
    registerCreator,
    updateProfile,
    addContent,
    isLoading,
  };
};

export const useMicroPayVault = () => {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  const deposit = useCallback(async (amount: number) => {
    if (!address) throw new Error('Wallet not connected');
    
    setIsLoading(true);
    try {
      const signer = await getSigner();
      if (!signer) throw new Error('No signer available');
      
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.MICRO_PAY_VAULT,
        CONTRACT_ABIS.MICRO_PAY_VAULT,
        signer
      );
      const tx = await contract.deposit({ value: BigInt(amount) });
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error depositing:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  const withdraw = useCallback(async (amount: number) => {
    if (!address) throw new Error('Wallet not connected');
    
    setIsLoading(true);
    try {
      const signer = await getSigner();
      if (!signer) throw new Error('No signer available');
      
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.MICRO_PAY_VAULT,
        CONTRACT_ABIS.MICRO_PAY_VAULT,
        signer
      );
      const tx = await contract.withdraw(BigInt(amount));
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error withdrawing:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  return {
    deposit,
    withdraw,
    isLoading,
  };
};

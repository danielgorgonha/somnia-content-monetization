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
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return provider.getSigner();
  }
  return null;
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
      const sessions = await contract.getActiveSessions(address);
      setActiveSessions(sessions);
    } catch (error) {
      console.error('Error fetching active sessions:', error);
    }
  }, [address]);

  const createSession = useCallback(async (creator: string, contentId: string) => {
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
      const tx = await contract.createSession(creator, contentId);
      await tx.wait();
      await getActiveSessions();
      return tx.hash;
    } catch (error) {
      console.error('Error creating session:', error);
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
      const tx = await contract.updateSession(sessionId, BigInt(consumption));
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
      // Mock for now - would need to implement session retrieval from contract
      return {
        user: address,
        creator: '0x1234567890123456789012345678901234567890',
        contentId: sessionId,
        active: true,
        startTime: Date.now(),
        lastUpdate: Date.now(),
        totalConsumption: 0,
        totalPaid: 0,
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
    createSession,
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

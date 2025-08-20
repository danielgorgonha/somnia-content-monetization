import { useAccount } from 'wagmi';
import { useState, useEffect, useCallback } from 'react';
import { 
  type Session,
  type CreatorProfile,
  type ContentItem
} from '../types/contracts';

// Mock hooks for development
export const useMeteredAccess = () => {
  const { address } = useAccount();
  
  const [activeSessions, setActiveSessions] = useState<string[]>([]);

  const getActiveSessions = useCallback(async () => {
    if (!address) return;
    setActiveSessions([]);
  }, [address]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const createSession = useCallback(async (creator: string, contentId: string) => {
    if (!address) throw new Error('Wallet not connected');
    // Mock implementation - parameters not used in development
    const mockHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    return mockHash;
  }, [address]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateSession = useCallback(async (sessionId: string, consumption: number) => {
    if (!address) throw new Error('Wallet not connected');
    const mockHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    return mockHash;
  }, [address]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const endSession = useCallback(async (sessionId: string) => {
    if (!address) throw new Error('Wallet not connected');
    const mockHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    return mockHash;
  }, [address]);

  const getSession = useCallback(async (sessionId: string): Promise<Session | null> => {
    return {
      user: address || '',
      creator: '0x1234567890123456789012345678901234567890',
      contentId: sessionId,
      active: true,
      startTime: Date.now(),
      lastUpdate: Date.now(),
      totalConsumption: 0,
      totalPaid: 0,
    };
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
  };
};

export const useCreatorRegistry = () => {
  const { address } = useAccount();
  
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null);
  const [creatorContent, setCreatorContent] = useState<ContentItem[]>([]);

  const getCreatorProfile = useCallback(async (creatorAddress?: string) => {
    const targetAddress = creatorAddress || address;
    if (!targetAddress) return;
    
    setCreatorProfile({
      address: targetAddress,
      name: 'Mock Creator',
      description: 'A mock creator for development',
      contentCount: 5,
             totalEarnings: 1000000000000000000, // 1 SOM
      isVerified: true,
    });
  }, [address]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const registerCreator = useCallback(async (name: string, description: string) => {
    if (!address) throw new Error('Wallet not connected');
    const mockHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    return mockHash;
  }, [address]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const registerContent = useCallback(async (title: string, description: string, pricePerSecond: number) => {
    if (!address) throw new Error('Wallet not connected');
    const mockHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    return mockHash;
  }, [address]);

  const getCreatorContent = useCallback(async (creatorAddress?: string) => {
    const targetAddress = creatorAddress || address;
    if (!targetAddress) return;
    
    setCreatorContent([
      {
        id: 'mock-content-1',
        creator: targetAddress,
        title: 'Mock Video 1',
        description: 'A mock video for development',
                 pricePerSecond: 1000000000000000, // 0.001 SOM/s
         totalViews: 100,
         totalEarnings: 500000000000000000, // 0.5 SOM
        isActive: true,
        createdAt: Date.now(),
      }
    ]);
  }, [address]);

  useEffect(() => {
    if (address) {
      getCreatorProfile();
      getCreatorContent();
    }
  }, [address, getCreatorProfile, getCreatorContent]);

  return {
    creatorProfile,
    creatorContent,
    registerCreator,
    registerContent,
    getCreatorProfile,
    getCreatorContent,
  };
};

export const useMicroPayVault = () => {
  const { address } = useAccount();
  
  const [balance, setBalance] = useState<number>(0);

  const getBalance = useCallback(async () => {
    if (!address) return;
    setBalance(1.5); // Mock balance
  }, [address]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const deposit = useCallback(async (amount: string) => {
    if (!address) throw new Error('Wallet not connected');
    const mockHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    return mockHash;
  }, [address]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const withdraw = useCallback(async (amount: string) => {
    if (!address) throw new Error('Wallet not connected');
    const mockHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    return mockHash;
  }, [address]);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  return {
    balance,
    deposit,
    withdraw,
    getBalance,
  };
};

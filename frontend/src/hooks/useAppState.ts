import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  type Session, 
  type CreatorProfile, 
  type ContentItem,
  type MicropaymentEvent 
} from '../types/contracts';

interface AppState {
  // User state
  isConnected: boolean;
  userAddress: string | null;
  
  // Session state
  currentSession: Session | null;
  sessionHistory: Session[];
  
  // Content state
  currentContent: ContentItem | null;
  contentLibrary: ContentItem[];
  
  // Creator state
  currentCreator: CreatorProfile | null;
  
  // Payment state
  userBalance: number;
  paymentHistory: MicropaymentEvent[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  notifications: Notification[];
  
  // Actions
  setConnected: (connected: boolean, address?: string) => void;
  setCurrentSession: (session: Session | null) => void;
  addSessionToHistory: (session: Session) => void;
  setCurrentContent: (content: ContentItem | null) => void;
  addContentToLibrary: (content: ContentItem) => void;
  setCurrentCreator: (creator: CreatorProfile | null) => void;
  setUserBalance: (balance: number) => void;
  addPaymentToHistory: (payment: MicropaymentEvent) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  clearNotifications: () => void;
  clearError: () => void;
  reset: () => void;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

const initialState = {
  isConnected: false,
  userAddress: null,
  currentSession: null,
  sessionHistory: [],
  currentContent: null,
  contentLibrary: [],
  currentCreator: null,
  userBalance: 0,
  paymentHistory: [],
  isLoading: false,
  error: null,
  notifications: [],
};

export const useAppState = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setConnected: (connected, address) => 
        set({ 
          isConnected: connected, 
          userAddress: address || null 
        }),
      
      setCurrentSession: (session) => 
        set({ currentSession: session }),
      
      addSessionToHistory: (session) => 
        set((state) => ({
          sessionHistory: [...state.sessionHistory, session]
        })),
      
      setCurrentContent: (content) => 
        set({ currentContent: content }),
      
      addContentToLibrary: (content) => 
        set((state) => ({
          contentLibrary: [...state.contentLibrary, content]
        })),
      
      setCurrentCreator: (creator) => 
        set({ currentCreator: creator }),
      
      setUserBalance: (balance) => 
        set({ userBalance: balance }),
      
      addPaymentToHistory: (payment) => 
        set((state) => ({
          paymentHistory: [...state.paymentHistory, payment]
        })),
      
      setLoading: (loading) => 
        set({ isLoading: loading }),
      
      setError: (error) => 
        set({ error }),
      
      addNotification: (notification) => 
        set((state) => ({
          notifications: [...state.notifications, {
            ...notification,
            id: Date.now().toString(),
            timestamp: Date.now(),
            read: false,
          }]
        })),
      
      clearNotifications: () => 
        set({ notifications: [] }),
      
      clearError: () => 
        set({ error: null }),
      
      reset: () => 
        set(initialState),
    }),
    {
      name: 'somnia-app-state',
      partialize: (state) => ({
        userAddress: state.userAddress,
        sessionHistory: state.sessionHistory,
        contentLibrary: state.contentLibrary,
        paymentHistory: state.paymentHistory,
        notifications: state.notifications,
      }),
    }
  )
);

// Utility hooks for specific state slices
export const useUserState = () => {
  const { isConnected, userAddress, setConnected } = useAppState();
  return { isConnected, userAddress, setConnected };
};

export const useSessionState = () => {
  const { 
    currentSession, 
    sessionHistory, 
    setCurrentSession, 
    addSessionToHistory 
  } = useAppState();
  return { currentSession, sessionHistory, setCurrentSession, addSessionToHistory };
};

export const useContentState = () => {
  const { 
    currentContent, 
    contentLibrary, 
    setCurrentContent, 
    addContentToLibrary 
  } = useAppState();
  return { currentContent, contentLibrary, setCurrentContent, addContentToLibrary };
};

export const usePaymentState = () => {
  const { 
    userBalance, 
    paymentHistory, 
    setUserBalance, 
    addPaymentToHistory 
  } = useAppState();
  return { userBalance, paymentHistory, setUserBalance, addPaymentToHistory };
};

export const useUIState = () => {
  const { 
    isLoading, 
    error, 
    notifications, 
    setLoading, 
    setError, 
    addNotification, 
    clearNotifications, 
    clearError 
  } = useAppState();
  return { 
    isLoading, 
    error, 
    notifications, 
    setLoading, 
    setError, 
    addNotification, 
    clearNotifications, 
    clearError 
  };
};

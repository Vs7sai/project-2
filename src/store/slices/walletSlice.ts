import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'contest-join' | 'contest-win' | 'referral';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  description: string;
}

export interface Referral {
  id: string;
  referredEmail: string;
  status: 'pending' | 'registered' | 'active';
  reward: number;
  timestamp: string;
}

interface WalletState {
  balance: number;
  transactions: Transaction[];
  referrals: Referral[];
  referralCode: string;
  referralLink: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: WalletState = {
  balance: 5000, // Start with some balance for demo
  transactions: [],
  referrals: [],
  referralCode: 'BULLS123',
  referralLink: 'https://bullsbattle.com/refer/BULLS123',
  isLoading: false,
  error: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    fetchWalletStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchWalletSuccess: (state, action: PayloadAction<{ 
      balance: number; 
      transactions: Transaction[]; 
      referrals: Referral[];
      referralCode: string;
      referralLink: string;
    }>) => {
      state.isLoading = false;
      state.balance = action.payload.balance;
      state.transactions = action.payload.transactions;
      state.referrals = action.payload.referrals;
      state.referralCode = action.payload.referralCode;
      state.referralLink = action.payload.referralLink;
    },
    fetchWalletFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addTransaction: (state, action: PayloadAction<Omit<Transaction, 'id' | 'timestamp'>>) => {
      const { type, amount, status, description } = action.payload;
      
      const newTransaction: Transaction = {
        id: `transaction-${Date.now()}`,
        type,
        amount,
        status,
        description,
        timestamp: new Date().toISOString(),
      };
      
      state.transactions.unshift(newTransaction);
      
      // Update balance for completed transactions
      if (status === 'completed') {
        if (type === 'deposit' || type === 'contest-win' || type === 'referral') {
          state.balance += amount;
        } else if (type === 'withdrawal' || type === 'contest-join') {
          state.balance -= amount;
        }
      }
    },
    updateTransactionStatus: (state, action: PayloadAction<{ id: string; status: 'pending' | 'completed' | 'failed' }>) => {
      const { id, status } = action.payload;
      const transactionIndex = state.transactions.findIndex(t => t.id === id);
      
      if (transactionIndex !== -1) {
        const oldStatus = state.transactions[transactionIndex].status;
        const type = state.transactions[transactionIndex].type;
        const amount = state.transactions[transactionIndex].amount;
        
        // Update status
        state.transactions[transactionIndex].status = status;
        
        // Update balance if status changes to or from completed
        if (oldStatus !== 'completed' && status === 'completed') {
          if (type === 'deposit' || type === 'contest-win' || type === 'referral') {
            state.balance += amount;
          } else if (type === 'withdrawal' || type === 'contest-join') {
            state.balance -= amount;
          }
        } else if (oldStatus === 'completed' && status !== 'completed') {
          if (type === 'deposit' || type === 'contest-win' || type === 'referral') {
            state.balance -= amount;
          } else if (type === 'withdrawal' || type === 'contest-join') {
            state.balance += amount;
          }
        }
      }
    },
    addReferral: (state, action: PayloadAction<Omit<Referral, 'id' | 'timestamp'>>) => {
      const { referredEmail, status, reward } = action.payload;
      
      const newReferral: Referral = {
        id: `referral-${Date.now()}`,
        referredEmail,
        status,
        reward,
        timestamp: new Date().toISOString(),
      };
      
      state.referrals.unshift(newReferral);
    },
    updateReferralStatus: (state, action: PayloadAction<{ id: string; status: 'pending' | 'registered' | 'active'; reward?: number }>) => {
      const { id, status, reward } = action.payload;
      const referralIndex = state.referrals.findIndex(r => r.id === id);
      
      if (referralIndex !== -1) {
        state.referrals[referralIndex].status = status;
        
        if (reward !== undefined) {
          state.referrals[referralIndex].reward = reward;
        }
        
        // If status changed to active, add a transaction
        if (status === 'active' && state.referrals[referralIndex].reward > 0) {
          const referralReward = state.referrals[referralIndex].reward;
          const referredEmail = state.referrals[referralIndex].referredEmail;
          
          const newTransaction: Transaction = {
            id: `transaction-${Date.now()}`,
            type: 'referral',
            amount: referralReward,
            status: 'completed',
            description: `Referral bonus for ${referredEmail}`,
            timestamp: new Date().toISOString(),
          };
          
          state.transactions.unshift(newTransaction);
          state.balance += referralReward;
        }
      }
    },
    setReferralCode: (state, action: PayloadAction<{ code: string; link: string }>) => {
      state.referralCode = action.payload.code;
      state.referralLink = action.payload.link;
    },
  },
});

export const { 
  fetchWalletStart, 
  fetchWalletSuccess, 
  fetchWalletFailure,
  addTransaction,
  updateTransactionStatus,
  addReferral,
  updateReferralStatus,
  setReferralCode
} = walletSlice.actions;

export default walletSlice.reducer;
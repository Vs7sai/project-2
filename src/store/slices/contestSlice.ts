import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Participant {
  userId: string;
  userName: string;
  profilePicture?: string;
  portfolioValue: number;
  profit: number;
  profitPercentage: number;
  rank?: number;
  portfolioId: string;
  multiplierBonus: number;
}

export interface Contest {
  id: string;
  title: string;
  description: string;
  entryFee: number;
  prizePool: number;
  startTime: string;
  endTime: string;
  registrationDeadline: string; // 2:00 AM IST
  marketStartTime: string; // 9:30 AM IST
  marketEndTime: string; // 3:30 PM IST
  participants: Participant[];
  maxParticipants: number;
  status: 'registration' | 'portfolio_selection' | 'live' | 'completed';
  contestType: 'daily' | 'weekly' | 'monthly';
  assetType: 'stock'; // Removed crypto
  virtualCash: number;
  isRegistrationOpen: boolean;
  isPortfolioSelectionOpen: boolean;
  isMarketLive: boolean;
  sectorFocus?: string; // New field for sector-specific contests
}

interface ContestState {
  contests: Contest[];
  userContests: string[];
  userPortfolios: { [contestId: string]: string };
  currentTime: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: ContestState = {
  contests: [],
  userContests: [],
  userPortfolios: {},
  currentTime: new Date().toISOString(),
  isLoading: false,
  error: null,
};

const contestSlice = createSlice({
  name: 'contests',
  initialState,
  reducers: {
    fetchContestsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchContestsSuccess: (state, action: PayloadAction<Contest[]>) => {
      state.isLoading = false;
      state.contests = action.payload;
    },
    fetchContestsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateCurrentTime: (state, action: PayloadAction<string>) => {
      state.currentTime = action.payload;
      
      // Update contest statuses based on current time
      state.contests.forEach((contest, index) => {
        const now = new Date(action.payload);
        const registrationDeadline = new Date(contest.registrationDeadline);
        const marketStart = new Date(contest.marketStartTime);
        const marketEnd = new Date(contest.marketEndTime);
        const contestEnd = new Date(contest.endTime);
        
        if (now < registrationDeadline) {
          state.contests[index].status = 'registration';
          state.contests[index].isRegistrationOpen = true;
          state.contests[index].isPortfolioSelectionOpen = true;
          state.contests[index].isMarketLive = false;
        } else if (now >= registrationDeadline && now < marketStart) {
          state.contests[index].status = 'portfolio_selection';
          state.contests[index].isRegistrationOpen = false;
          state.contests[index].isPortfolioSelectionOpen = false;
          state.contests[index].isMarketLive = false;
        } else if (now >= marketStart && now < marketEnd) {
          state.contests[index].status = 'live';
          state.contests[index].isRegistrationOpen = false;
          state.contests[index].isPortfolioSelectionOpen = false;
          state.contests[index].isMarketLive = true;
        } else if (now >= contestEnd) {
          state.contests[index].status = 'completed';
          state.contests[index].isRegistrationOpen = false;
          state.contests[index].isPortfolioSelectionOpen = false;
          state.contests[index].isMarketLive = false;
        }
      });
    },
    joinContest: (state, action: PayloadAction<{ 
      contestId: string; 
      userId: string; 
      portfolioId: string;
      userName: string;
      profilePicture?: string;
    }>) => {
      const { contestId, userId, portfolioId, userName, profilePicture } = action.payload;
      
      if (!state.userContests.includes(contestId)) {
        state.userContests.push(contestId);
        state.userPortfolios[contestId] = portfolioId;
        
        // Add participant to contest
        const contestIndex = state.contests.findIndex(contest => contest.id === contestId);
        if (contestIndex !== -1) {
          state.contests[contestIndex].participants.push({
            userId,
            userName,
            profilePicture,
            portfolioValue: state.contests[contestIndex].virtualCash,
            profit: 0,
            profitPercentage: 0,
            portfolioId,
            multiplierBonus: 0
          });
        }
      }
    },
    updateContestStatus: (state, action: PayloadAction<{ contestId: string; status: Contest['status'] }>) => {
      const { contestId, status } = action.payload;
      const contestIndex = state.contests.findIndex(contest => contest.id === contestId);
      
      if (contestIndex !== -1) {
        state.contests[contestIndex].status = status;
      }
    },
    updateParticipantPortfolio: (state, action: PayloadAction<{
      contestId: string;
      userId: string;
      portfolioValue: number;
      profit: number;
      profitPercentage: number;
      multiplierBonus: number;
    }>) => {
      const { contestId, userId, portfolioValue, profit, profitPercentage, multiplierBonus } = action.payload;
      const contestIndex = state.contests.findIndex(contest => contest.id === contestId);
      
      if (contestIndex !== -1) {
        const participantIndex = state.contests[contestIndex].participants.findIndex(p => p.userId === userId);
        if (participantIndex !== -1) {
          state.contests[contestIndex].participants[participantIndex] = {
            ...state.contests[contestIndex].participants[participantIndex],
            portfolioValue,
            profit,
            profitPercentage,
            multiplierBonus
          };
          
          // Recalculate rankings based on total return (including multiplier bonus)
          state.contests[contestIndex].participants.sort((a, b) => {
            const totalReturnA = a.profitPercentage + a.multiplierBonus;
            const totalReturnB = b.profitPercentage + b.multiplierBonus;
            return totalReturnB - totalReturnA;
          });
          
          state.contests[contestIndex].participants.forEach((participant, index) => {
            participant.rank = index + 1;
          });
        }
      }
    },
  },
});

export const { 
  fetchContestsStart, 
  fetchContestsSuccess, 
  fetchContestsFailure,
  updateCurrentTime,
  joinContest,
  updateContestStatus,
  updateParticipantPortfolio
} = contestSlice.actions;

export default contestSlice.reducer;
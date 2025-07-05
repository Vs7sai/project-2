import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  isKycVerified: boolean;
  kycStatus: {
    status: 'not_started' | 'pending' | 'verified' | 'rejected';
    steps: {
      personalInfo: 'not_started' | 'pending' | 'completed';
      idUpload: 'not_started' | 'pending' | 'completed';
      bankDetails: 'not_started' | 'pending' | 'completed';
    };
    documents: {
      idFront?: string;
      idBack?: string;
    };
    verificationDate: string | null;
    rejectionReason: string | null;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false, // Will be managed by Clerk
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    updateKycStatus: (state, action: PayloadAction<{
      status?: User['kycStatus']['status'];
      steps?: Partial<User['kycStatus']['steps']>;
      documents?: Partial<User['kycStatus']['documents']>;
    }>) => {
      if (state.user) {
        state.user.kycStatus = {
          ...state.user.kycStatus,
          ...action.payload,
          steps: {
            ...state.user.kycStatus.steps,
            ...(action.payload.steps || {})
          },
          documents: {
            ...state.user.kycStatus.documents,
            ...(action.payload.documents || {})
          }
        };
      }
    },
    // Sync with Clerk user data
    syncWithClerk: (state, action: PayloadAction<{
      id: string;
      name: string;
      email: string;
      profilePicture?: string;
    }>) => {
      const { id, name, email, profilePicture } = action.payload;
      
      if (!state.user) {
        // Create new user profile
        state.user = {
          id,
          name,
          email,
          profilePicture,
          isKycVerified: false,
          kycStatus: {
            status: 'not_started',
            steps: {
              personalInfo: 'not_started',
              idUpload: 'not_started',
              bankDetails: 'not_started'
            },
            documents: {},
            verificationDate: null,
            rejectionReason: null
          }
        };
      } else {
        // Update existing user
        state.user = {
          ...state.user,
          id,
          name,
          email,
          profilePicture
        };
      }
      
      state.isAuthenticated = true;
    },
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  updateUser,
  updateKycStatus,
  syncWithClerk
} = authSlice.actions;

export default authSlice.reducer;
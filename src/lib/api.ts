// API integration for RupeeRush
import { Contest } from '../store/slices/contestSlice';
import { AppDispatch } from '../store';
import { fetchContestsStart, fetchContestsSuccess, fetchContestsFailure } from '../store/slices/contestSlice';
import { env } from './env';

// API endpoint for hackathon
const API_URL = env.app.contestApiUrl || 'https://8e04-150-242-197-103.ngrok-free.app/api/hackthon/';

// Fetch contests from external API
export const fetchContestsFromAPI = async (dispatch: AppDispatch) => {
  dispatch(fetchContestsStart());
  
  try {
    console.log('Fetching contests from external API:', API_URL);
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API response:', data);
    
    // Transform API data to match our Contest interface
    const contests: Contest[] = transformAPIData(data);
    
    // Update Redux store with fetched contests
    dispatch(fetchContestsSuccess(contests));
    
    return contests;
  } catch (error) {
    console.error('Error fetching contests from API:', error);
    dispatch(fetchContestsFailure(error instanceof Error ? error.message : 'Failed to fetch contests'));
    
    // Fallback to mock data in case of API failure
    return null;
  }
};

// Transform API data to match our Contest interface
const transformAPIData = (apiData: any[]): Contest[] => {
  // Check if apiData is an array
  if (!Array.isArray(apiData)) {
    console.error('API data is not an array:', apiData);
    return [];
  }
  
  try {
    return apiData.map((item: any) => {
      // Parse dates from API
      const registrationStartsFrom = new Date(item.registration_starts_from || new Date());
      const registrationEndsAt = new Date(item.registration_ends_at || new Date());
      const startDate = new Date(item.start_date || new Date());
      const endDate = new Date(item.end_date || new Date());
      
      // Determine if registration is open based on current time
      const now = new Date();
      const isRegistrationOpen = now >= registrationStartsFrom && now <= registrationEndsAt;
      
      // Determine if market is live based on current time
      const isMarketLive = now >= startDate && now <= endDate;
      
      // Determine if portfolio selection is open
      const isPortfolioSelectionOpen = now <= startDate;
      
      // Determine contest status
      let status: 'registration' | 'portfolio_selection' | 'live' | 'completed';
      if (now < registrationEndsAt) {
        status = 'registration';
      } else if (now < startDate) {
        status = 'portfolio_selection';
      } else if (now < endDate) {
        status = 'live';
      } else {
        status = 'completed';
      }
      
      // Determine contest type based on duration
      const durationHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
      let contestType: 'daily' | 'weekly' | 'monthly';
      if (durationHours <= 24) {
        contestType = 'daily';
      } else if (durationHours <= 168) { // 7 days
        contestType = 'weekly';
      } else {
        contestType = 'monthly';
      }
      
      // Determine if it's a crypto contest based on title or sector
      const isCrypto = item.Contest_name?.toLowerCase().includes('crypto') || 
                      item.Contest_name?.toLowerCase().includes('bitcoin') ||
                      item.Sector?.toLowerCase().includes('crypto');
      
      // Determine sector focus
      const sectorFocus = item.Sector || 'All Sectors';
      
      // Create participants array (empty for now, will be populated as users join)
      const participants = [];
      
      return {
        id: item.id?.toString() || `contest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: item.Contest_name || 'Unnamed Contest',
        description: item.description || 'Join this exciting trading contest!',
        entryFee: 100, // Default entry fee
        prizePool: item.Poolsize || 25000,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        registrationDeadline: registrationEndsAt.toISOString(),
        marketStartTime: startDate.toISOString(),
        marketEndTime: endDate.toISOString(),
        participants: participants,
        maxParticipants: item.Participants || 200,
        status: status,
        contestType: contestType,
        assetType: isCrypto ? 'crypto' : 'stock',
        virtualCash: isCrypto ? 10000000 : 1000000, // ₹1 crore for crypto, ₹10 lakh for stocks
        isRegistrationOpen: isRegistrationOpen,
        isPortfolioSelectionOpen: isPortfolioSelectionOpen,
        isMarketLive: isMarketLive,
        sectorFocus: sectorFocus
      };
    });
  } catch (error) {
    console.error('Error transforming API data:', error);
    return [];
  }
};

// Post contest results back to API
export const postContestResults = async (contestId: string, results: any) => {
  try {
    const response = await fetch(`${API_URL}${contestId}/results/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(results),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to post contest results: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error posting contest results:', error);
    return null;
  }
};
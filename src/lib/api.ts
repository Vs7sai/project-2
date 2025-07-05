// API integration for RupeeRush
import { Contest } from '../store/slices/contestSlice';
import { AppDispatch } from '../store';
import { fetchContestsStart, fetchContestsSuccess, fetchContestsFailure } from '../store/slices/contestSlice';

// API endpoint for hackathon
const API_URL = 'https://8e04-150-242-197-103.ngrok-free.app/api/hackthon/';

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
const transformAPIData = (apiData: any): Contest[] => {
  // Check if apiData is an array
  if (!Array.isArray(apiData)) {
    console.error('API data is not an array:', apiData);
    return [];
  }
  
  try {
    return apiData.map((item: any) => {
      // Generate dates based on contest type
      const now = new Date();
      const registrationDeadline = new Date(now);
      registrationDeadline.setHours(2, 0, 0, 0); // 2:00 AM IST today
      registrationDeadline.setDate(registrationDeadline.getDate() + 1); // Tomorrow
      
      const marketStartTime = new Date(now);
      marketStartTime.setHours(9, 30, 0, 0); // 9:30 AM IST today
      marketStartTime.setDate(marketStartTime.getDate() + 1); // Tomorrow
      
      const marketEndTime = new Date(now);
      marketEndTime.setHours(15, 30, 0, 0); // 3:30 PM IST today
      marketEndTime.setDate(marketEndTime.getDate() + 1); // Tomorrow
      
      const endTime = new Date(now);
      
      // Set end time based on contest type
      if (item.contestType === 'daily') {
        endTime.setDate(endTime.getDate() + 1); // 1 day
      } else if (item.contestType === 'weekly') {
        endTime.setDate(endTime.getDate() + 7); // 7 days
      } else if (item.contestType === 'monthly') {
        endTime.setDate(endTime.getDate() + 30); // 30 days
      } else {
        endTime.setDate(endTime.getDate() + 1); // Default to 1 day
      }
      
      // Determine if it's a crypto contest based on assetType or title
      const isCrypto = item.assetType === 'crypto' || 
                      (item.title && item.title.toLowerCase().includes('crypto')) ||
                      (item.title && item.title.toLowerCase().includes('bitcoin'));
      
      // Determine sector focus based on title or provided sector
      let sectorFocus = item.sectorFocus || 'All Sectors';
      if (!sectorFocus || sectorFocus === 'All Sectors') {
        if (item.title) {
          const title = item.title.toLowerCase();
          if (title.includes('it') || title.includes('tech')) {
            sectorFocus = 'IT Services';
          } else if (title.includes('bank')) {
            sectorFocus = 'Banking';
          } else if (title.includes('fmcg')) {
            sectorFocus = 'FMCG';
          } else if (title.includes('small cap')) {
            sectorFocus = 'Small Cap';
          }
        }
      }
      
      return {
        id: item.id || `contest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: item.title || 'Unnamed Contest',
        description: item.description || 'Join this exciting trading contest!',
        entryFee: item.entryFee || 100,
        prizePool: item.prizePool || 25000,
        startTime: item.startTime || now.toISOString(),
        endTime: item.endTime || endTime.toISOString(),
        registrationDeadline: item.registrationDeadline || registrationDeadline.toISOString(),
        marketStartTime: item.marketStartTime || marketStartTime.toISOString(),
        marketEndTime: item.marketEndTime || marketEndTime.toISOString(),
        participants: item.participants || [],
        maxParticipants: item.maxParticipants || 200,
        status: item.status || 'registration',
        contestType: item.contestType || 'daily',
        assetType: isCrypto ? 'crypto' : 'stock',
        virtualCash: isCrypto ? 10000000 : 1000000, // ₹1 crore for crypto, ₹10 lakh for stocks
        isRegistrationOpen: item.isRegistrationOpen !== undefined ? item.isRegistrationOpen : true,
        isPortfolioSelectionOpen: item.isPortfolioSelectionOpen !== undefined ? item.isPortfolioSelectionOpen : true,
        isMarketLive: item.isMarketLive !== undefined ? item.isMarketLive : false,
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
    const response = await fetch(`${API_URL}/${contestId}/results`, {
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
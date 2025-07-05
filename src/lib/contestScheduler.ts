import { supabase } from './supabase';
import { getMarketStatus } from './marketHours';
import { fetchMarketData } from './marketDataService';
import { AppDispatch } from '../store';

// Contest status types
export type ContestStatus = 'registration' | 'portfolio_selection' | 'live' | 'completed';

// Contest schedule functions
export const scheduleContestActions = (dispatch: AppDispatch) => {
  // Check current time and schedule appropriate actions
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  // Schedule contest registration closure at 9:29 AM
  scheduleAction(9, 29, () => closeContestRegistration(dispatch));
  
  // Schedule market open actions at 9:30 AM
  scheduleAction(9, 30, () => startLiveMarket(dispatch));
  
  // Schedule market close actions at 3:30 PM
  scheduleAction(15, 30, () => endLiveMarket(dispatch));
  
  // Schedule contest results calculation at 3:35 PM
  scheduleAction(15, 35, () => calculateContestResults(dispatch));
  
  // Schedule new contest opening at 3:40 PM
  scheduleAction(15, 40, () => openNewContests(dispatch));
  
  console.log('Contest actions scheduled');
};

// Schedule an action to run at a specific time
const scheduleAction = (targetHour: number, targetMinute: number, action: () => void) => {
  const now = new Date();
  const target = new Date();
  target.setHours(targetHour, targetMinute, 0, 0);
  
  // If target time is in the past, schedule for tomorrow
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }
  
  const timeUntilTarget = target.getTime() - now.getTime();
  
  console.log(`Scheduling action for ${target.toLocaleTimeString()} (in ${Math.round(timeUntilTarget / 60000)} minutes)`);
  
  setTimeout(action, timeUntilTarget);
};

// Close contest registration at 9:29 AM
export const closeContestRegistration = async (dispatch: AppDispatch) => {
  console.log('Closing contest registration');
  
  try {
    // In a real implementation, this would update the database
    // For now, we'll just log the action
    console.log('Contest registration closed at', new Date().toLocaleTimeString());
    
    // Fetch latest market data
    await fetchMarketData(dispatch);
  } catch (error) {
    console.error('Error closing contest registration:', error);
  }
};

// Start live market at 9:30 AM
export const startLiveMarket = async (dispatch: AppDispatch) => {
  console.log('Starting live market');
  
  try {
    // Check if market is actually open
    const marketStatus = getMarketStatus();
    if (!marketStatus.isOpen) {
      console.log('Market is not open, skipping live market start');
      return;
    }
    
    // In a real implementation, this would update the database
    // For now, we'll just log the action
    console.log('Live market started at', new Date().toLocaleTimeString());
    
    // Fetch latest market data
    await fetchMarketData(dispatch);
  } catch (error) {
    console.error('Error starting live market:', error);
  }
};

// End live market at 3:30 PM
export const endLiveMarket = async (dispatch: AppDispatch) => {
  console.log('Ending live market');
  
  try {
    // In a real implementation, this would update the database
    // For now, we'll just log the action
    console.log('Live market ended at', new Date().toLocaleTimeString());
    
    // Fetch final market data
    await fetchMarketData(dispatch);
  } catch (error) {
    console.error('Error ending live market:', error);
  }
};

// Calculate contest results at 3:35 PM
export const calculateContestResults = async (dispatch: AppDispatch) => {
  console.log('Calculating contest results');
  
  try {
    // In a real implementation, this would calculate results and update the database
    // For now, we'll just log the action
    console.log('Contest results calculated at', new Date().toLocaleTimeString());
  } catch (error) {
    console.error('Error calculating contest results:', error);
  }
};

// Open new contests at 3:40 PM
export const openNewContests = async (dispatch: AppDispatch) => {
  console.log('Opening new contests');
  
  try {
    // In a real implementation, this would create new contests in the database
    // For now, we'll just log the action
    console.log('New contests opened at', new Date().toLocaleTimeString());
  } catch (error) {
    console.error('Error opening new contests:', error);
  }
};

// Get current contest status based on time
export const getCurrentContestStatus = (): ContestStatus => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours * 60 + minutes;
  
  // Registration: Before 9:29 AM
  const registrationEnd = 9 * 60 + 29;
  if (currentTime < registrationEnd) {
    return 'registration';
  }
  
  // Portfolio Selection: 9:29 AM - 9:30 AM (very short window in this implementation)
  const marketStart = 9 * 60 + 30;
  if (currentTime < marketStart) {
    return 'portfolio_selection';
  }
  
  // Live: 9:30 AM - 3:30 PM
  const marketEnd = 15 * 60 + 30;
  if (currentTime < marketEnd) {
    return 'live';
  }
  
  // Completed: After 3:30 PM
  return 'completed';
};
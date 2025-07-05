// Indian Market Hours and Holiday Management
export const INDIAN_HOLIDAYS_2024 = [
  '2024-01-26', // Republic Day
  '2024-03-08', // Holi
  '2024-03-29', // Good Friday
  '2024-04-11', // Eid ul-Fitr
  '2024-04-14', // Ram Navami
  '2024-04-17', // Mahavir Jayanti
  '2024-05-01', // Maharashtra Day
  '2024-08-15', // Independence Day
  '2024-08-19', // Raksha Bandhan
  '2024-08-26', // Janmashtami
  '2024-09-07', // Ganesh Chaturthi
  '2024-10-02', // Gandhi Jayanti
  '2024-10-12', // Dussehra
  '2024-10-31', // Diwali Laxmi Puja
  '2024-11-01', // Diwali Padva
  '2024-11-15', // Guru Nanak Jayanti
  '2024-12-25', // Christmas
];

export const INDIAN_HOLIDAYS_2025 = [
  '2025-01-26', // Republic Day
  '2025-03-14', // Holi
  '2025-03-31', // Eid ul-Fitr
  '2025-04-06', // Ram Navami
  '2025-04-14', // Mahavir Jayanti
  '2025-04-18', // Good Friday
  '2025-05-01', // Maharashtra Day
  '2025-08-15', // Independence Day
  '2025-08-27', // Janmashtami
  '2025-09-05', // Ganesh Chaturthi
  '2025-10-02', // Gandhi Jayanti
  '2025-10-22', // Dussehra
  '2025-11-01', // Diwali
  '2025-11-05', // Guru Nanak Jayanti
  '2025-12-25', // Christmas
];

export const ALL_INDIAN_HOLIDAYS = [...INDIAN_HOLIDAYS_2024, ...INDIAN_HOLIDAYS_2025];

export const isIndianHoliday = (date: Date): boolean => {
  const dateString = date.toISOString().split('T')[0];
  return ALL_INDIAN_HOLIDAYS.includes(dateString);
};

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
};

export const isIndianMarketOpen = (): boolean => {
  const now = new Date();
  const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
  
  // Check if it's a weekend
  if (isWeekend(istTime)) {
    return false;
  }
  
  // Check if it's a holiday
  if (isIndianHoliday(istTime)) {
    return false;
  }
  
  const hour = istTime.getHours();
  const minute = istTime.getMinutes();
  const currentTime = hour * 60 + minute;
  
  // Market hours: 9:30 AM to 3:30 PM IST
  const marketOpen = 9 * 60 + 30; // 9:30 AM
  const marketClose = 15 * 60 + 30; // 3:30 PM
  
  return currentTime >= marketOpen && currentTime <= marketClose;
};

export const getMarketStatus = () => {
  const now = new Date();
  const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
  
  if (isWeekend(istTime)) {
    return {
      isOpen: false,
      reason: 'Weekend - Market Closed',
      nextOpen: getNextMarketOpen(istTime),
      canCreateStockContest: false,
      canCreateCryptoContest: true
    };
  }
  
  if (isIndianHoliday(istTime)) {
    return {
      isOpen: false,
      reason: 'Indian National Holiday - Market Closed',
      nextOpen: getNextMarketOpen(istTime),
      canCreateStockContest: false,
      canCreateCryptoContest: true
    };
  }
  
  const hour = istTime.getHours();
  const minute = istTime.getMinutes();
  const currentTime = hour * 60 + minute;
  const marketOpen = 9 * 60 + 30;
  const marketClose = 15 * 60 + 30;
  
  if (currentTime < marketOpen) {
    return {
      isOpen: false,
      reason: 'Pre-Market Hours',
      nextOpen: new Date(istTime.setHours(9, 30, 0, 0)),
      canCreateStockContest: true,
      canCreateCryptoContest: true
    };
  }
  
  if (currentTime > marketClose) {
    return {
      isOpen: false,
      reason: 'Post-Market Hours',
      nextOpen: getNextMarketOpen(istTime),
      canCreateStockContest: true,
      canCreateCryptoContest: true
    };
  }
  
  return {
    isOpen: true,
    reason: 'Market is Open',
    nextOpen: null,
    canCreateStockContest: true,
    canCreateCryptoContest: true
  };
};

const getNextMarketOpen = (currentDate: Date): Date => {
  let nextDate = new Date(currentDate);
  nextDate.setDate(nextDate.getDate() + 1);
  nextDate.setHours(9, 30, 0, 0);
  
  // Skip weekends and holidays
  while (isWeekend(nextDate) || isIndianHoliday(nextDate)) {
    nextDate.setDate(nextDate.getDate() + 1);
  }
  
  return nextDate;
};

export const formatTimeUntilMarketOpen = (nextOpen: Date): string => {
  const now = new Date();
  const timeLeft = nextOpen.getTime() - now.getTime();
  
  if (timeLeft <= 0) return 'Market should be open now';
  
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m until market opens`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m until market opens`;
  } else {
    return `${minutes}m until market opens`;
  }
};
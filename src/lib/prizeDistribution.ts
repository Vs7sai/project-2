// Prize distribution system for contest winners
export interface PrizeDistribution {
  rank: number;
  percentage: number;
  amount: number;
}

export const calculatePrizeDistribution = (totalPrizePool: number): PrizeDistribution[] => {
  return [
    {
      rank: 1,
      percentage: 40,
      amount: Math.floor(totalPrizePool * 0.40)
    },
    {
      rank: 2,
      percentage: 20,
      amount: Math.floor(totalPrizePool * 0.20)
    },
    {
      rank: 3,
      percentage: 10,
      amount: Math.floor(totalPrizePool * 0.10)
    },
    {
      rank: 4,
      percentage: 8,
      amount: Math.floor(totalPrizePool * 0.08)
    },
    {
      rank: 5,
      percentage: 7,
      amount: Math.floor(totalPrizePool * 0.07)
    },
    {
      rank: 6,
      percentage: 5,
      amount: Math.floor(totalPrizePool * 0.05)
    },
    {
      rank: 7,
      percentage: 4,
      amount: Math.floor(totalPrizePool * 0.04)
    },
    {
      rank: 8,
      percentage: 3,
      amount: Math.floor(totalPrizePool * 0.03)
    },
    {
      rank: 9,
      percentage: 2,
      amount: Math.floor(totalPrizePool * 0.02)
    },
    {
      rank: 10,
      percentage: 1,
      amount: Math.floor(totalPrizePool * 0.01)
    }
  ];
};

export const getUserPrize = (rank: number, totalPrizePool: number): number => {
  const distribution = calculatePrizeDistribution(totalPrizePool);
  const userPrize = distribution.find(d => d.rank === rank);
  return userPrize ? userPrize.amount : 0;
};

export const formatPrizeDistribution = (totalPrizePool: number): string[] => {
  const distribution = calculatePrizeDistribution(totalPrizePool);
  return distribution.map(d => 
    `${d.rank === 1 ? '🥇' : d.rank === 2 ? '🥈' : d.rank === 3 ? '🥉' : `#${d.rank}`} - ₹${d.amount.toLocaleString()} (${d.percentage}%)`
  );
};
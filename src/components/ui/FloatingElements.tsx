import React from 'react';
import { IndianRupee, TrendingUp, BarChart3, PieChart, Target, Award, Coins, Banknote, DollarSign, LineChart } from 'lucide-react';
import { motion } from 'framer-motion';

interface FloatingElementsProps {
  density?: 'low' | 'medium' | 'high';
  speed?: 'slow' | 'medium' | 'fast';
  opacity?: number;
}

const FloatingElements: React.FC<FloatingElementsProps> = ({
  density = 'medium',
  speed = 'medium',
  opacity = 0.1
}) => {
  const icons = [
    IndianRupee, TrendingUp, BarChart3, PieChart, Target, 
    Award, Coins, Banknote, DollarSign, LineChart
  ];

  const colors = [
    'text-orange-400', 'text-red-400', 'text-yellow-400', 
    'text-green-400', 'text-blue-400', 'text-purple-400',
    'text-pink-400', 'text-indigo-400'
  ];

  const getElementCount = () => {
    switch (density) {
      case 'low': return 8;
      case 'medium': return 15;
      case 'high': return 25;
      default: return 15;
    }
  };

  const getAnimationDuration = () => {
    switch (speed) {
      case 'slow': return { min: 15, max: 25 };
      case 'medium': return { min: 10, max: 20 };
      case 'fast': return { min: 5, max: 15 };
      default: return { min: 10, max: 20 };
    }
  };

  const duration = getAnimationDuration();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: getElementCount() }).map((_, i) => {
        const Icon = icons[Math.floor(Math.random() * icons.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 20 + Math.random() * 60;
        const animationDuration = duration.min + Math.random() * (duration.max - duration.min);
        const delay = Math.random() * 5;

        return (
          <motion.div
            key={i}
            className={`absolute ${color}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: animationDuration,
              repeat: Infinity,
              delay,
              ease: "easeInOut"
            }}
          >
            <Icon size={size} />
          </motion.div>
        );
      })}
    </div>
  );
};

export default FloatingElements;
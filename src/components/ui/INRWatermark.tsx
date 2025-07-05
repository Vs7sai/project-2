import React from 'react';
import { IndianRupee, TrendingUp, BarChart3, PieChart, Target, Award, Coins, Banknote } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

interface INRWatermarkProps {
  variant?: 'hero' | 'section' | 'card' | 'minimal';
  opacity?: number;
  animated?: boolean;
}

const INRWatermark: React.FC<INRWatermarkProps> = ({ 
  variant = 'section', 
  opacity = 0.05, 
  animated = true 
}) => {
  const { theme } = useTheme();

  const getWatermarkElements = () => {
    switch (variant) {
      case 'hero':
        return (
          <>
            {/* Large Central Rupee */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ 
                scale: animated ? [0.8, 1.2, 1] : 1,
                rotate: animated ? [0, 10, -5, 0] : 0
              }}
              transition={{ 
                duration: 4,
                repeat: animated ? Infinity : 0,
                repeatType: "reverse"
              }}
              style={{ opacity }}
            >
              <IndianRupee size={400} className="text-orange-500" />
            </motion.div>

            {/* Floating Icons */}
            <motion.div
              className="absolute top-20 left-20"
              animate={animated ? { 
                y: [-10, 10, -10],
                rotate: [0, 5, -5, 0]
              } : {}}
              transition={{ 
                duration: 6,
                repeat: animated ? Infinity : 0,
                ease: "easeInOut"
              }}
              style={{ opacity: opacity * 0.7 }}
            >
              <TrendingUp size={80} className="text-green-500" />
            </motion.div>

            <motion.div
              className="absolute top-40 right-32"
              animate={animated ? { 
                y: [10, -10, 10],
                rotate: [0, -5, 5, 0]
              } : {}}
              transition={{ 
                duration: 8,
                repeat: animated ? Infinity : 0,
                ease: "easeInOut",
                delay: 1
              }}
              style={{ opacity: opacity * 0.6 }}
            >
              <BarChart3 size={100} className="text-blue-500" />
            </motion.div>

            <motion.div
              className="absolute bottom-32 left-40"
              animate={animated ? { 
                y: [-15, 15, -15],
                x: [-5, 5, -5]
              } : {}}
              transition={{ 
                duration: 7,
                repeat: animated ? Infinity : 0,
                ease: "easeInOut",
                delay: 2
              }}
              style={{ opacity: opacity * 0.8 }}
            >
              <PieChart size={90} className="text-purple-500" />
            </motion.div>

            <motion.div
              className="absolute bottom-20 right-20"
              animate={animated ? { 
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0]
              } : {}}
              transition={{ 
                duration: 5,
                repeat: animated ? Infinity : 0,
                ease: "easeInOut",
                delay: 0.5
              }}
              style={{ opacity: opacity * 0.7 }}
            >
              <Award size={85} className="text-yellow-500" />
            </motion.div>

            {/* Scattered Rupee Symbols */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: opacity * 0.3
                }}
                animate={animated ? {
                  y: [0, -20, 0],
                  rotate: [0, 360],
                  scale: [0.8, 1.2, 0.8]
                } : {}}
                transition={{
                  duration: 10 + Math.random() * 5,
                  repeat: animated ? Infinity : 0,
                  delay: Math.random() * 3,
                  ease: "easeInOut"
                }}
              >
                <IndianRupee size={30 + Math.random() * 40} className="text-orange-400" />
              </motion.div>
            ))}
          </>
        );

      case 'section':
        return (
          <>
            {/* Corner Rupee Symbols */}
            <motion.div
              className="absolute top-8 left-8"
              animate={animated ? { rotate: [0, 360] } : {}}
              transition={{ 
                duration: 20,
                repeat: animated ? Infinity : 0,
                ease: "linear"
              }}
              style={{ opacity }}
            >
              <IndianRupee size={120} className="text-orange-500" />
            </motion.div>

            <motion.div
              className="absolute top-8 right-8"
              animate={animated ? { rotate: [360, 0] } : {}}
              transition={{ 
                duration: 25,
                repeat: animated ? Infinity : 0,
                ease: "linear"
              }}
              style={{ opacity }}
            >
              <Coins size={100} className="text-red-500" />
            </motion.div>

            <motion.div
              className="absolute bottom-8 left-8"
              animate={animated ? { 
                scale: [1, 1.2, 1],
                rotate: [0, 15, -15, 0]
              } : {}}
              transition={{ 
                duration: 8,
                repeat: animated ? Infinity : 0,
                ease: "easeInOut"
              }}
              style={{ opacity }}
            >
              <Banknote size={110} className="text-yellow-500" />
            </motion.div>

            <motion.div
              className="absolute bottom-8 right-8"
              animate={animated ? { 
                y: [-10, 10, -10],
                rotate: [0, -10, 10, 0]
              } : {}}
              transition={{ 
                duration: 6,
                repeat: animated ? Infinity : 0,
                ease: "easeInOut"
              }}
              style={{ opacity }}
            >
              <Target size={95} className="text-green-500" />
            </motion.div>

            {/* Center Pattern */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              animate={animated ? { 
                rotate: [0, 360],
                scale: [0.8, 1.1, 0.8]
              } : {}}
              transition={{ 
                duration: 15,
                repeat: animated ? Infinity : 0,
                ease: "linear"
              }}
              style={{ opacity: opacity * 0.3 }}
            >
              <div className="relative">
                <IndianRupee size={200} className="text-orange-400" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 border-4 border-orange-300 rounded-full animate-pulse"></div>
                </div>
              </div>
            </motion.div>
          </>
        );

      case 'card':
        return (
          <>
            <motion.div
              className="absolute top-2 right-2"
              animate={animated ? { rotate: [0, 360] } : {}}
              transition={{ 
                duration: 12,
                repeat: animated ? Infinity : 0,
                ease: "linear"
              }}
              style={{ opacity }}
            >
              <IndianRupee size={60} className="text-orange-500" />
            </motion.div>

            <motion.div
              className="absolute bottom-2 left-2"
              animate={animated ? { 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              } : {}}
              transition={{ 
                duration: 4,
                repeat: animated ? Infinity : 0,
                ease: "easeInOut"
              }}
              style={{ opacity: opacity * 0.7 }}
            >
              <Coins size={40} className="text-yellow-500" />
            </motion.div>
          </>
        );

      case 'minimal':
        return (
          <motion.div
            className="absolute top-4 right-4"
            animate={animated ? { 
              rotate: [0, 360],
              scale: [0.9, 1.1, 0.9]
            } : {}}
            transition={{ 
              duration: 10,
              repeat: animated ? Infinity : 0,
              ease: "linear"
            }}
            style={{ opacity }}
          >
            <IndianRupee size={80} className="text-orange-500" />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {getWatermarkElements()}
    </div>
  );
};

export default INRWatermark;
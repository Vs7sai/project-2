import React from 'react';
import { TrendingUp, IndianRupee } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Logo: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="flex items-center">
      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-xl mr-2 shadow-lg">
        <IndianRupee size={24} className="text-white" />
      </div>
      <span className="font-bold text-xl">
        Rupee<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Rush</span>
      </span>
    </div>
  );
};

export default Logo;
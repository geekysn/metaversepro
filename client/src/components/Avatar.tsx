import React from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
  id: string;
  username: string;
  position: { x: number; y: number };
  color: string;
  isCurrentUser: boolean;
  isNearby?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ 
  id, 
  username, 
  position, 
  color, 
  isCurrentUser,
  isNearby = false 
}) => {
  return (
    <div 
      className={`absolute flex flex-col items-center transform transition-all duration-300 ease-out
                  ${isCurrentUser ? 'z-20' : 'z-10'}`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Avatar character */}
      <div 
        className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full 
                   ${color} transition-all duration-300 shadow-lg
                   ${isCurrentUser ? 'ring-2 sm:ring-4 ring-white/30' : ''}
                   ${isNearby ? 'ring-1 sm:ring-2 ring-green-400 animate-pulse' : ''}`}
      >
        <User 
          size={20} 
          className="text-white sm:w-6 sm:h-6 md:w-7 md:h-7" 
        />
      </div>
      
      {/* Username */}
      <div className="mt-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-black/50 text-xs sm:text-sm text-white whitespace-nowrap">
        {username}
        {isCurrentUser && <span className="ml-1 text-[10px] sm:text-xs">(you)</span>}
      </div>
      
      {/* Proximity indicator (only for nearby users) */}
      {isNearby && !isCurrentUser && (
        <div className="absolute inset-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-2 border-green-400/20 -z-10"
             style={{ transform: 'translate(-50%, -50%)' }}>
          <div className="absolute inset-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-2 border-green-400/10 animate-ping" />
        </div>
      )}
    </div>
  );
};

export default Avatar;
import React, { useState } from 'react';
import { Users, ChevronLeft, ChevronRight } from 'lucide-react';

interface User {
  id: string;
  username: string;
  position: { x: number; y: number };
  color: string;
}

interface UserListProps {
  users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="absolute left-2 sm:left-4 top-2 sm:top-4 flex items-start z-50">
      <button 
        onClick={() => setIsVisible(!isVisible)}
        className="bg-gray-800/90 backdrop-blur-sm p-1.5 sm:p-2 rounded-lg shadow-xl flex items-center justify-center text-blue-400 hover:bg-gray-700/90 transition-colors pointer-events-auto cursor-pointer z-50"
        aria-label={isVisible ? "Hide user list" : "Show user list"}
      >
        {isVisible ? <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" /> : <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />}
      </button>
      
      <div 
        className={`
          bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-xl pointer-events-auto ml-1
          transition-all duration-300 ease-in-out overflow-hidden z-50
          ${isVisible ? 'w-56 sm:w-64 opacity-100' : 'w-0 opacity-0'}
        `}
      >
        <div className="p-3 sm:p-4 border-b border-gray-700 flex items-center whitespace-nowrap">
          <Users size={16} className="text-blue-400 mr-2 flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
          <h3 className="text-sm sm:text-md font-medium text-white">Online Users ({users.length})</h3>
        </div>
        
        <div className="max-h-40 sm:max-h-60 overflow-y-auto">
          {users.length === 0 ? (
            <div className="p-3 sm:p-4 text-center text-gray-500 text-xs sm:text-sm whitespace-nowrap">
              No other users online
            </div>
          ) : (
            <ul className="divide-y divide-gray-700">
              {users.map(user => (
                <li key={user.id} className="flex items-center p-2 sm:p-3 hover:bg-gray-700/50 transition-colors whitespace-nowrap">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${user.color} mr-2 sm:mr-3 flex-shrink-0`}>
                    <span className="text-xs text-white font-medium">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm sm:text-base text-white">{user.username}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;
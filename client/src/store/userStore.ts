import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { socket } from '../services/socket';

interface User {
  id: string;
  username: string;
  position: { x: number; y: number };
  color: string;
}

interface UserState {
  userId: string | null;
  username: string;
  position: { x: number; y: number };
  avatarColor: string;
  isLoggedIn: boolean;
  onlineUsers: User[];
  nearbyUsers: User[];
  login: (username: string) => void;
  updatePosition: (position: { x: number; y: number }) => void;
  updateNearbyUsers: () => void;
}

// Generate random color for avatar
const getRandomColor = () => {
  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-teal-500',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Distance threshold for "nearby" users in pixels
const PROXIMITY_THRESHOLD = 150;

// Helper function to load user data from localStorage
const loadUserData = () => {
  try {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Failed to load user data from localStorage:', error);
    return null;
  }
};

// Helper function to save user data to localStorage
const saveUserData = (data: {
  userId: string;
  username: string;
  position: { x: number; y: number };
  avatarColor: string;
}) => {
  try {
    localStorage.setItem('userData', JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save user data to localStorage:', error);
  }
};

export const useUserStore = create<UserState>((set, get) => {
  // Load saved user data if available
  const savedUserData = loadUserData();
  
  // Setup socket listeners for online users
  socket.on('onlineUsers', (users: User[]) => {
    set({ onlineUsers: users });
    get().updateNearbyUsers();
  });
  
  // Reconnect with saved data if available
  if (savedUserData) {
    // Re-emit join with saved data to reconnect
    socket.emit('userJoin', {
      id: savedUserData.userId,
      username: savedUserData.username,
      position: savedUserData.position,
      color: savedUserData.avatarColor
    });
  }

  return {
    // Initialize with saved data or defaults
    userId: savedUserData?.userId || null,
    username: savedUserData?.username || '',
    position: savedUserData?.position || { x: 300, y: 300 },
    avatarColor: savedUserData?.avatarColor || getRandomColor(),
    isLoggedIn: savedUserData ? true : false,
    onlineUsers: [],
    nearbyUsers: [],
    
    login: (username) => {
      const userId = nanoid(8);
      const position = { x: Math.random() * 500 + 100, y: Math.random() * 300 + 100 };
      const avatarColor = getRandomColor();
      
      const userData = {
        userId,
        username,
        position,
        avatarColor
      };
      
      // Save to localStorage for persistence
      saveUserData(userData);
      
      set({
        ...userData,
        isLoggedIn: true,
      });
      
      // Emit join event to the server
      socket.emit('userJoin', {
        id: userId,
        username,
        position,
        color: avatarColor
      });
    },
    
    updatePosition: (position) => {
      set({ position });
      
      // Update localStorage
      const { userId, username, avatarColor } = get();
      if (userId) {
        saveUserData({ userId, username, position, avatarColor });
      }
      
      // Send position update to server
      socket.emit('updatePosition', { 
        id: get().userId,
        position 
      });
      
      // Update nearby users
      get().updateNearbyUsers();
    },
    
    updateNearbyUsers: () => {
      const { position, onlineUsers } = get();
      
      // Calculate distance and filter nearby users
      const nearby = onlineUsers.filter(user => {
        const dx = position.x - user.position.x;
        const dy = position.y - user.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= PROXIMITY_THRESHOLD;
      });
      
      set({ nearbyUsers: nearby });
    }
  };
});
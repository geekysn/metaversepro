import React, { useEffect, useRef, useState } from 'react';
import Avatar from './Avatar';
import ChatPanel from './ChatPanel';
import UserList from './UserList';
import { useUserStore } from '../store/userStore';
import { useChatStore } from '../store/chatStore';
import { socket } from '../services/socket';
import useKeyboardMovement from '../hooks/useKeyboardMovement';
import { mapGrid, GRID_SIZE, MAP_WIDTH, MAP_HEIGHT, isOnPath, findNearestPathPosition } from '../assets/mapData';

const Metaverse: React.FC = () => {
  const { 
    userId, 
    username, 
    position, 
    avatarColor, 
    onlineUsers, 
    nearbyUsers,
    updatePosition
  } = useUserStore();
  
  const { 
    messages, 
    isChatOpen, 
    openChat, 
    addMessage 
  } = useChatStore();
  
  const metaverseRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Handle responsive dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (metaverseRef.current) {
        setDimensions({
          width: metaverseRef.current.clientWidth,
          height: metaverseRef.current.clientHeight
        });
      }
    };
    
    // Initial measurement
    updateDimensions();
    
    // Update on resize
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Set up keyboard movement
  useKeyboardMovement(position, updatePosition, dimensions);
  
  // Ensure user starts on a valid path
  useEffect(() => {
    if (userId && !isOnPath(position.x, position.y)) {
      const nearestPath = findNearestPathPosition(position.x, position.y);
      updatePosition(nearestPath);
    }
  }, [userId, position.x, position.y, updatePosition]);
  
  // Connect to server and handle user updates
  useEffect(() => {
    // Join the metaverse
    if (userId) {
      socket.emit('userJoin', {
        id: userId,
        username,
        position,
        color: avatarColor
      });
    }
    
    // Listen for online users updates from server
    socket.on('onlineUsers', (serverUsers: any[]) => {
      useUserStore.setState(state => ({
        ...state,
        onlineUsers: serverUsers.filter(user => user.id !== userId) // Don't include current user in the list
      }));
    });
    
    return () => {
      socket.off('onlineUsers');
    };
  }, [userId, username, position, avatarColor]);
  
  useEffect(() => {
    // Listen for new messages
    socket.on('newMessage', (message) => {
      addMessage(message);
      
      // Auto-open chat when receiving messages
      if (nearbyUsers.length > 0) {
        openChat();
      }
    });
    
    return () => {
      socket.off('newMessage');
    };
  }, [addMessage, openChat, nearbyUsers.length]);
  
  // Auto-open chat when users are nearby
  useEffect(() => {
    if (nearbyUsers.length > 0) {
      openChat();
    }
  }, [nearbyUsers, openChat]);

  // Determine if a cell is part of the central plaza
  const isCentralPlaza = (x: number, y: number): boolean => {
    const centerX = Math.floor(MAP_WIDTH / GRID_SIZE / 2);
    const centerY = Math.floor(MAP_HEIGHT / GRID_SIZE / 2);
    const plazaSize = 8;
    
    return (
      Math.abs(x - centerX) <= plazaSize && 
      Math.abs(y - centerY) <= plazaSize
    );
  };

  // Determine if a cell is part of a main road (horizontal or vertical)
  const isMainRoad = (x: number, y: number): boolean => {
    // Check if on horizontal main roads
    const horizontalMainRoads = [9, 10, 11, 19, 20, 21, 29, 30, 31];
    
    // Check if on vertical main roads
    const verticalMainRoads = [14, 15, 16, 29, 30, 31, 44, 45, 46];
    
    return (
      horizontalMainRoads.includes(y) || 
      verticalMainRoads.includes(x)
    );
  };

  // Render map grid cells
  const renderMapGrid = () => {
    const cells = [];
    
    for (let y = 0; y < mapGrid.length; y++) {
      for (let x = 0; x < mapGrid[y].length; x++) {
        const cell = mapGrid[y][x];
        if (cell.type === 'path') {
          // Determine cell type for styling
          const isCentralCell = isCentralPlaza(x, y);
          const isRoad = isMainRoad(x, y);
          
          // Apply different styles based on cell type
          let cellStyle = "absolute border ";
          let cellBg = "";
          
          if (isCentralCell) {
            // Central plaza - more vibrant blue
            cellBg = "bg-blue-500/20";
            cellStyle += "border-blue-400/40";
          } else if (isRoad) {
            // Main roads - medium blue
            cellBg = "bg-blue-500/15";
            cellStyle += "border-blue-400/30";
          } else {
            // Regular paths - subtle blue
            cellBg = "bg-blue-500/10";
            cellStyle += "border-blue-400/20";
          }
          
          cells.push(
            <div 
              key={`cell-${x}-${y}`}
              className={`${cellStyle} ${cellBg}`}
              style={{
                left: cell.x,
                top: cell.y,
                width: GRID_SIZE,
                height: GRID_SIZE,
              }}
            />
          );
        }
      }
    }
    
    return cells;
  };

  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
      {/* Metaverse space */}
      <div 
        ref={metaverseRef}
        className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-auto"
        style={{ 
          width: MAP_WIDTH, 
          height: MAP_HEIGHT,
          maxWidth: '100%',
          maxHeight: '100vh',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        {/* Map background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        
        {/* Star-like dots in the background */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.1,
              }}
            />
          ))}
        </div>

        {/* Map grid with paths */}
        <div className="absolute inset-0 pointer-events-none">
          {renderMapGrid()}
        </div>
        
        {/* Current user's avatar */}
        {userId && (
          <Avatar
            id={userId}
            username={username}
            position={position}
            color={avatarColor}
            isCurrentUser={true}
          />
        )}
        
        {/* Other online users */}
        {onlineUsers.map(user => (
          <Avatar
            key={user.id}
            id={user.id}
            username={user.username}
            position={user.position}
            color={user.color}
            isCurrentUser={false}
            isNearby={nearbyUsers.some(nearbyUser => nearbyUser.id === user.id)}
          />
        ))}
      </div>
      
      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Online users list */}
        <UserList users={onlineUsers} />
        
        {/* Chat panel - only visible when users are nearby */}
        <ChatPanel 
          isOpen={isChatOpen} 
          nearbyUsers={nearbyUsers} 
        />
        
        {/* Movement instructions */}
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800/80 px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm text-white max-w-[90%] text-center">
          Use arrow keys to move • Stay on the paths • Get close to others to chat
        </div>
      </div>
    </div>
  );
};

export default Metaverse;
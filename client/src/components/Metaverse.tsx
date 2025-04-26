import React, { useEffect, useRef, useState } from 'react';
import Avatar from './Avatar';
import ChatPanel from './ChatPanel';
import UserList from './UserList';
import { useUserStore } from '../store/userStore';
import { useChatStore } from '../store/chatStore';
import { socket } from '../services/socket';
import useKeyboardMovement from '../hooks/useKeyboardMovement';

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

  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
      {/* Metaverse space */}
      <div 
        ref={metaverseRef}
        className="relative w-full h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden"
      >
        {/* Grid lines for visual reference */}
        <div className="absolute inset-0 grid grid-cols-8 sm:grid-cols-12 grid-rows-8 sm:grid-rows-12 gap-4 sm:gap-8 opacity-20 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <React.Fragment key={`grid-${i}`}>
              <div className="col-span-1 row-span-full border-r border-blue-500/20" />
              <div className="row-span-1 col-span-full border-b border-blue-500/20" />
            </React.Fragment>
          ))}
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
          Use arrow keys to move • Get close to others to chat
        </div>
      </div>
    </div>
  );
};

export default Metaverse;
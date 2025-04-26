import { io } from 'socket.io-client';

// Connect to the WebSocket server
export const socket = io('https://metaverse-backend.onrender.com', {
  transports: ['websocket'],
  autoConnect: true,
});

// Socket connection event handlers
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
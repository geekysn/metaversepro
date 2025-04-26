import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Store online users
const onlineUsers = new Map();

// Handle socket connections
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user joining
  socket.on('userJoin', (userData) => {
    console.log(`User joined: ${userData.username}`);
    
    // Store user data
    onlineUsers.set(socket.id, {
      ...userData,
      socketId: socket.id
    });
    
    // Broadcast updated online users list to all clients
    io.emit('onlineUsers', Array.from(onlineUsers.values()));
  });

  // Handle position updates
  socket.on('updatePosition', (userData) => {
    // Update user's position
    if (onlineUsers.has(socket.id)) {
      onlineUsers.set(socket.id, {
        ...onlineUsers.get(socket.id),
        position: userData.position
      });
      
      // Broadcast updated position to all other clients
      io.emit('onlineUsers', Array.from(onlineUsers.values()));
    }
  });

  // Handle chat messages
  socket.on('sendMessage', (message) => {
    // Broadcast message to all clients
    io.emit('newMessage', message);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    // Remove user from online users
    onlineUsers.delete(socket.id);
    
    // Broadcast updated online users list
    io.emit('onlineUsers', Array.from(onlineUsers.values()));
  });
});

// Start server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Metaverse server is running');
});
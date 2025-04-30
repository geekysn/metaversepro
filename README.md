# 2D Metaverse

A web-based virtual world where users can move around, meet other people, and chat in real-time.

![2D Metaverse](/client/public/image.png)

## Features

- **Virtual World Exploration**: Navigate through a stylized 2D grid-based map
- **Real-time Interaction**: Meet other users as they move around the space
- **Proximity Chat**: Chat with users who are near your avatar
- **Customizable Avatars**: Choose your own username and avatar color
- **Responsive Design**: Works on both desktop and mobile devices

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Socket.io client for real-time communication
- Zustand for state management

### Backend
- Node.js with Express
- Socket.io for WebSocket connections

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd metaversepro
   ```

2. Install server dependencies
   ```
   cd server
   npm install
   ```

3. Install client dependencies
   ```
   cd ../client
   npm install
   ```

### Running the Application

1. Start the server
   ```
   cd server
   npm run dev
   ```

2. Start the client in a separate terminal window
   ```
   cd client
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## How to Use

1. Enter your username and select an avatar color on the login screen
2. Use arrow keys to move your avatar around the world
3. Stay on the path (blue-tinted tiles)
4. When you approach other users, a chat panel will automatically appear
5. Send messages to nearby users through the chat panel

## Project Structure

```
metaversepro/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── assets/         # Static assets and map data
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   └── store/          # Zustand state stores
│   └── ...
├── server/                 # Backend Node.js application
│   ├── index.js            # Server entry point
│   └── ...
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

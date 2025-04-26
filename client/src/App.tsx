import React, { useEffect } from 'react';
import Metaverse from './components/Metaverse';
import LoginScreen from './components/LoginScreen';
import { useUserStore } from './store/userStore';

function App() {
  const isLoggedIn = useUserStore(state => state.isLoggedIn);

  // Prevent overscroll behavior on mobile
  useEffect(() => { 
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.touchAction = 'none';
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.touchAction = '';
    };
  }, []);

  return (
    <div className="min-h-screen max-h-screen bg-gray-900 text-white overflow-hidden">
      {isLoggedIn ? <Metaverse /> : <LoginScreen />}
    </div>
  );
}

export default App;
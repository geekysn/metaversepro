import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { useUserStore } from '../store/userStore';

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const login = useUserStore(state => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username cannot be empty');
      return;
    }
    
    login(username);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md p-6 sm:p-8 space-y-6 sm:space-y-8 bg-gray-800 rounded-xl shadow-2xl transform transition-all animate-fade-in">
        <div className="text-center">
          <div className="flex justify-center mb-4 sm:mb-6">
            <Users size={48} className="text-blue-500 sm:w-16 sm:h-16" />
          </div>
          <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-extrabold text-white">
            Enter the Metaverse
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-400">
            Join others in the virtual space
          </p>
        </div>
        
        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 sm:py-3 border border-gray-700 
                           placeholder-gray-500 text-white rounded-lg bg-gray-700 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                           focus:z-10 text-sm transition-all"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-xs sm:text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 sm:py-3 px-3 sm:px-4 border border-transparent 
                         text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                         transition-all duration-150 transform hover:scale-105"
            >
              Enter Metaverse
            </button>
          </div>
        </form>
        
        <div className="mt-4 sm:mt-6 text-center text-[10px] sm:text-xs text-gray-500">
          <p>Use arrow keys to move • Get close to others to chat</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
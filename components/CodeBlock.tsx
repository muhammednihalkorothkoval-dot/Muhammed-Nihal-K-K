import React, { useState } from 'react';
import { CloseIcon } from './Icon';

interface AdminLoginModalProps {
  onClose: () => void;
  onLogin: (pin: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onLogin }) => {
  const [pin, setPin] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(pin);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-sm border border-gray-700 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <CloseIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-center text-white mb-6">Restricted Access</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="pin" className="block text-sm font-medium text-gray-400 mb-2">
              Enter PIN
            </label>
            <input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2 px-4 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              maxLength={4}
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            disabled={!pin}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
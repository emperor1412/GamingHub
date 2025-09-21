import React from 'react';
import ReactDOM from 'react-dom/client';
import FlippingStars from './FlippingStars';
import './FlippingStars.css';

// Mock shared object for testing
const mockShared = {
  userProfile: {
    pictureIndex: 0
  },
  telegramUserData: {
    firstName: 'TestUser'
  },
  avatars: [
    { src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+' }
  ],
  getBcoin: () => 1000,
  getStarlets: () => 500,
  getTicket: () => 10,
  showPopup: (options) => {
    console.log('Mock popup:', options);
    return Promise.resolve();
  },
  flipCoin: async (isHeads, betAmount, allin) => {
    // Mock flip result - random win/lose
    const isWin = Math.random() > 0.5;
    const reward = isWin ? betAmount * 2 : 0;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      isWin,
      reward,
      error: null
    };
  },
  setInitialMarketTab: (tab) => {
    console.log('Mock setInitialMarketTab:', tab);
  }
};

// Mock component props
const mockProps = {
  onClose: () => console.log('Mock onClose called'),
  setShowProfileView: (show) => console.log('Mock setShowProfileView:', show),
  setActiveTab: (tab) => console.log('Mock setActiveTab:', tab)
};

// Test component wrapper
const FlippingStarsTest = () => {
  // Override shared object globally for testing
  window.shared = mockShared;
  
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <FlippingStars {...mockProps} />
    </div>
  );
};

// Render the test component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<FlippingStarsTest />);

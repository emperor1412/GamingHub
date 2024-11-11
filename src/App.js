import React, { useEffect, useState } from 'react';
import './App.css';
import Frame4556 from './images/Frame4556.png';
import Frame4561 from './images/Frame4561.png';
import locker from './images/locker.png';
import leaderboard from './images/leaderboard.png';

import { init, initData, miniApp, viewport, swipeBehavior, closingBehavior, retrieveLaunchParams } from '@telegram-apps/sdk';

function App() {
  const { initDataRaw } = retrieveLaunchParams();
  console.log(initDataRaw);

  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  // const swipeBehavior = useSwipeBehavior();

  useEffect(() => {
    console.log('App useEffect called');
    // WebApp.ready();
    // WebApp.expand();
    
    init();
    miniApp.ready();
    miniApp.mount();
    viewport.expand();

    closingBehavior.mount();
    closingBehavior.enableConfirmation();
    // swipeBehavior.mount();
    // swipeBehavior.disableVertical();

    // document.addEventListener('touchstart', function(event) {
    //     if (event.touches.length > 1) {
    //         event.preventDefault();
    //     }
    // }, { passive: false });
    
    // document.addEventListener('touchmove', function(event) {
    //     if (event.scale !== 1) {
    //         event.preventDefault();
    //     }
    // }, { passive: false });

    // tg.ready();
    // tg.expand();   
    
    // Get user info when the app loads
    // const user = tg.initDataUnsafe.user;
    // const temp = WebApp.initDataUnsafe.user;
    initData.restore();
    const temp = initData.user();
    console.log('User:', temp);

    setUser(temp);
  }, []);

  return (
    <div className="App">
      <div className="app-container">
        {/* Header with stats */}
        <header className="stats-header">
          <div className="profile-pic">
            <img src="/profile-placeholder.png" alt="Profile" />
          </div>
          <div className="stats">
            <div className="stat-item">
              <span>3</span>
              <img src="/stat-icon-1.svg" alt="Stat 1" />
            </div>
            <div className="stat-item">
              <span>24.4</span>
              <img src="/stat-icon-2.svg" alt="Stat 2" />
            </div>
            <div className="stat-item">
              <span>75</span>
              <img src="/stat-icon-3.svg" alt="Stat 3" />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="scrollable-content">
          {/* Tickets Section */}
          <section className="tickets-section">
            <button className="ticket-card">
              <img 
                src={Frame4556}
                alt="My Tickets" 
                className="ticket-card-image"
              />
              
            </button>
          </section>

          {/* Locked Sections */}
          <section className="locked-sections">
            <button className="locked-card">
              <img 
                // src={`${process.env.PUBLIC_URL}/images/Frame4561.png`} 
                src={Frame4561}
                alt="LFGO Coming Soon" 
                className="locked-card-image"
              />
              <img 
                src={locker}
                alt="Locker" 
                className="locker-icon"
              />
            </button>

            <button className="locked-card">
              <img 
                // src={`${process.env.PUBLIC_URL}/images/Frame4561.png`} 
                src={leaderboard}
                alt="Leaderboard Coming Soon" 
                className="locked-card-image"
              />
              <img 
                src={locker}
                alt="Locker" 
                className="locker-icon"
              />
            </button>
          </section>

          {/* Raffle Section */}
          <section className="raffle-section">
            <div className="raffle-card">
              <h2>SNOOP DOGG RAFFLE <span className="new-tag">NEW!</span></h2>
              <p>BLENDING WITH YOUR SHOES FOR BETTER RESULTS</p>
              <button className="purple-button">Check out</button>
            </div>
          </section>
        </div>

        {/* Navigation Bar */}
        <nav className="bottom-nav">
          <button className="nav-item">🏠</button>
          <button className="nav-item">📝</button>
          <button className="nav-item">👥</button>
          <button className="nav-item">🛒</button>
          <button className="nav-item">ℹ️</button>
        </nav>
      </div>
    </div>
  );
}

export default App;

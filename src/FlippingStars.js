import React, { useState, useEffect } from 'react';
import './FlippingStars.css';
import shared from './Shared';
import ticketIcon from './images/ticket.svg';
import starlet from './images/starlet.png';
import flippingStarsLogo from './images/Flipping_stars.png';
import headsCounterLogo from './images/HeadsCounterLogo.png';
import tailsCounterLogo from './images/TailsCounterLogo.png';

// Navigation icons
import HomeIcon_normal from './images/Home_normal.svg';
import HomeIcon_selected from './images/Home_selected.svg';
import Task_normal from './images/Task_normal.svg';
import Task_selected from './images/Task_selected.svg';
import Friends_normal from './images/Friends_normal.svg';
import Friends_selected from './images/Friends_selected.svg';
import Market_normal from './images/Market_normal.svg';
import Market_selected from './images/Market_selected.svg';
import ID_normal from './images/ID_normal.svg';
import ID_selected from './images/ID_selected.svg';

const betOptions = [1, 10, 20, 50, 100, 500];

const FlippingStars = ({ onClose, setShowProfileView, setActiveTab }) => {
  const [selectedSide, setSelectedSide] = useState('HEADS');
  const [selectedBet, setSelectedBet] = useState(10);
  const [tickets, setTickets] = useState(0);
  const [starlets, setStarlets] = useState(0);
  const [headsCount, setHeadsCount] = useState(0);
  const [tailsCount, setTailsCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState({ side: 'HEADS', count: 5 });

  useEffect(() => {
    const setupProfileData = async () => {
      if (shared.userProfile) {
        const userStarlets = shared.userProfile.UserToken?.find(token => token.prop_id === 10020);
        if (userStarlets) {
          setStarlets(userStarlets.num);
        }

        const userTicket = shared.userProfile.UserToken?.find(token => token.prop_id === 10010);
        if (userTicket) {
          setTickets(userTicket.num);
        }
      }
    };

    setupProfileData();
  }, []);

  return (
    <div className="fc_app">
      {/* Header - matching Market.js stats-header */}
      <header className="fc_stats-header">
        <button 
          className="fc_profile-pic-main"
          onClick={() => setShowProfileView && setShowProfileView(true)}
        >
          <img 
            src={shared.avatars[shared.userProfile ? shared.userProfile.pictureIndex : 0]?.src} 
            alt="Profile" 
          />
        </button>
        <div className="fc_stat-item-main-text" onClick={() => setShowProfileView && setShowProfileView(true)}>
          GM {shared.telegramUserData?.firstName || 'User'}!
        </div>
        <div className="fc_stats-main">
          <button 
            className="fc_stat-item-main"
            onClick={() => setShowProfileView && setShowProfileView(true)}
          >
            <img src={ticketIcon} alt="Tickets" />
            <span className="fc_stat-item-main-text">{tickets}</span>
          </button>
          <button 
            className="fc_stat-item-main"
            onClick={() => setShowProfileView && setShowProfileView(true)}
          >
            <img src={starlet} alt="Starlets" />
            <span className="fc_stat-item-main-text">{starlets}</span>
          </button>
        </div>
      </header>

      {/* Logo */}
      <div className="fc_logo-container">
        <img src={flippingStarsLogo} alt="Flipping Stars" className="fc_logo-image" />
      </div>

      {/* Coin face selection */}
      <div className="fc_coin-select">
        <button
          className={`fc_coin-button ${selectedSide === 'HEADS' ? 'fc_selected' : ''}`}
          onClick={() => setSelectedSide('HEADS')}
        >
          {/* Counter positioned above button */}
          <div className="fc_coin-counter-wrapper">
            <img src={headsCounterLogo} alt="Heads Logo" className="fc_coin-logo" />
            <span className="fc_coin-counter">{headsCount}</span>
          </div>
          
          <div className="fc_corner fc_corner-top-left"></div>
          <div className="fc_corner fc_corner-top-right"></div>
          <div className="fc_corner fc_corner-bottom-left"></div>
          <div className="fc_corner fc_corner-bottom-right"></div>
          <div className="fc_coin-content">
            <div className="fc_coin-title">HEADS</div>
          </div>
          
          {/* Streak positioned below button */}
          {currentStreak.side === 'HEADS' && currentStreak.count > 0 && (
            <div className="fc_coin-streak-wrapper">
              <div className="fc_coin-streak">STREAK</div>
              <div className="fc_coin-streak-multiplier">X{currentStreak.count}</div>
            </div>
          )}
        </button>
        
        <button
          className={`fc_coin-button ${selectedSide === 'TAILS' ? 'fc_selected' : ''}`}
          onClick={() => setSelectedSide('TAILS')}
        >
          {/* Counter positioned above button */}
          <div className="fc_coin-counter-wrapper">
            <img src={tailsCounterLogo} alt="Tails Logo" className="fc_coin-logo" />
            <span className="fc_coin-counter">{tailsCount}</span>
          </div>
          
          <div className="fc_corner fc_corner-top-left"></div>
          <div className="fc_corner fc_corner-top-right"></div>
          <div className="fc_corner fc_corner-bottom-left"></div>
          <div className="fc_corner fc_corner-bottom-right"></div>
          <div className="fc_coin-content">
            <div className="fc_coin-title">TAILS</div>
          </div>
          
          {/* Streak positioned below button */}
          {currentStreak.side === 'TAILS' && currentStreak.count > 0 && (
            <div className="fc_coin-streak-wrapper">
              <div className="fc_coin-streak">STREAK</div>
              <div className="fc_coin-streak-multiplier">X{currentStreak.count}</div>
            </div>
          )}
        </button>
      </div>

      {/* Bet buttons */}
      <div className="fc_bet-buttons">
        {betOptions.map((bet) => (
          <button
            key={bet}
            className={`fc_bet-button ${selectedBet === bet ? 'fc_selected' : ''}`}
            onClick={() => setSelectedBet(bet)}
          >
            {/* Corner borders */}
            <div className="fc_corner fc_corner-top-left"></div>
            <div className="fc_corner fc_corner-top-right"></div>
            <div className="fc_corner fc_corner-bottom-left"></div>
            <div className="fc_corner fc_corner-bottom-right"></div>
            
            <div className="fc_bet-content">
              <span className="fc_bet-amount">{bet}</span>
              <img src={starlet} alt="starlet" className="fc_bet-starlet-icon" />
            </div>
          </button>
        ))}
        <button className="fc_bet-button fc_all-in">
          <div className="fc_corner fc_corner-top-left"></div>
          <div className="fc_corner fc_corner-top-right"></div>
          <div className="fc_corner fc_corner-bottom-left"></div>
          <div className="fc_corner fc_corner-bottom-right"></div>
          <div className="fc_bet-content">ALL IN</div>
        </button>
        <button className="fc_bet-button">
          <div className="fc_corner fc_corner-top-left"></div>
          <div className="fc_corner fc_corner-top-right"></div>
          <div className="fc_corner fc_corner-bottom-left"></div>
          <div className="fc_corner fc_corner-bottom-right"></div>
          <div className="fc_bet-content">CUSTOM</div>
        </button>
        <button className="fc_bet-button fc_disabled">
          <div className="fc_corner fc_corner-top-left"></div>
          <div className="fc_corner fc_corner-top-right"></div>
          <div className="fc_corner fc_corner-bottom-left"></div>
          <div className="fc_corner fc_corner-bottom-right"></div>
          <div className="fc_bet-content">DOUBLE OR NOTHING</div>
        </button>
      </div>

      {/* Flip button */}
      <button className="fc_flip-btn">
        <div className="fc_flip-content">FLIP</div>
      </button>

      {/* Bottom nav */}
      <nav className="fc_bottom-nav">
        <button onClick={() => {
          if (onClose) onClose();
          if (setActiveTab) setActiveTab('home');
        }}>
          <img src={HomeIcon_normal} alt="Home" />
        </button>
        <button onClick={() => {
          if (onClose) onClose();
          if (setActiveTab) setActiveTab('tasks');
        }}>
          <img src={Task_normal} alt="Tasks" />
        </button>
        <button onClick={() => {
          if (onClose) onClose();
          if (setActiveTab) setActiveTab('frens');
        }}>
          <img src={Friends_normal} alt="Friends" />
        </button>
        <button onClick={() => {
          if (onClose) onClose();
          if (setActiveTab) setActiveTab('market');
        }}>
          <img src={Market_normal} alt="Market" />
        </button>
        <button onClick={() => {
          if (onClose) onClose();
          if (setActiveTab) setActiveTab('fslid');
        }}>
          <img src={ID_normal} alt="FSLID" />
        </button>
      </nav>
    </div>
  );
};

export default FlippingStars;

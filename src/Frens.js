import React, { useState } from 'react';
import './Frens.css';
import shared from './Shared';
import ticketIcon from './images/ticket.svg';
import friendsIcon from './images/Friends_selected.svg';
import gmtIcon from './images/gmt.svg';
import trophy_1 from './images/trophy_1.svg';
import trophy_2 from './images/trophy_2.svg';
import trophy_3 from './images/trophy_3.svg';
import locker from './images/locker.png';
import unlock from './images/unlock.png';
import link from './images/link.svg';
import particle from './images/particle.svg';

const Frens = () => {
  const [activeTab, setActiveTab] = useState('friends'); // 'friends' or 'trophies'
  const [selectedTrophy, setSelectedTrophy] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const mockFriends = [
    { id: 1, name: 'Chonky', tickets: 3, points: 267 },
    { id: 2, name: 'Chonky', tickets: 3, points: 267 },
    { id: 3, name: 'Chonky', tickets: 3, points: 267 },
    { id: 4, name: 'Chonky', tickets: 3, points: 267 },
    { id: 5, name: 'Chonky', tickets: 3, points: 267 },
    { id: 6, name: 'Chonky', tickets: 3, points: 267 }
  ];

  const trophies = [
    { id: 1, name: 'Rookie Recruiter', status: 'unlocked', icon: trophy_1, description: "You're just starting out. Keep sharing to climb the ranks!"},
    { id: 2, name: 'Junior Ambassador', status: 'unlocked', icon: trophy_2, description: "Great job! You're becoming an influential member of the community"},
    { id: 3, name: 'Senior Ambassador', status: 'unlocked', icon: trophy_3, description: "Impressive! Your efforts are making a significant impact" },
    { id: 4, name: 'Master Connector', status: 'ready', icon: trophy_1, description: "Outstanding work! You're a key player in growing our community" },
    { id: 5, name: 'Elite Influencer', status: 'ready', icon: trophy_2, description: "Exceptional! You're among the top contributors" },
    { id: 6, name: 'Legendary Luminary', status: 'locked', icon: trophy_3, description: "Legendary status achieved! You're a cornerstone of our growth" },
    // { id: 7, name: 'Rookie', status: 'unlocked', icon: '🏆' },
    // { id: 8, name: 'Unlock', status: 'ready', icon: '🏆' },
    // { id: 9, name: 'Locked', status: 'locked', icon: '🏆' },
    // { id: 10, name: 'Locked', status: 'locked', icon: '🏆' },
    // { id: 11, name: 'Locked', status: 'locked', icon: '🏆' }
  ];

  const handleTrophyClick = (trophy) => {
    // if (trophy.status === 'ready') {
      // Handle trophy claim
      console.log('Claiming trophy:', trophy.id);
    // } else {
      setSelectedTrophy(trophy);
      setShowOverlay(true);
    // }
  };

  const closeOverlay = () => {
    setShowOverlay(false);
    setSelectedTrophy(null);
  };

  return (
    <div className="frens-content">
      <div className="frens-inner-content">
        <div className="info-box">
          EARN EXTRA TICKETS BY INVITING FRENS OR BY COMPLETING DAILY TASKS. THE MORE YOU ENGAGE, THE MORE REWARDS YOU'LL UNLOCK.
        </div>

        <div className="stats-row">
          <div className="stat-item-frens">
            <img src={friendsIcon} alt="Friends" className="stat-icon" />
            <span className="stat-label">Friends</span>
            <span className="stat-value">3</span>
          </div>
          <div className="stat-item-frens">
            <img src={ticketIcon} alt="Tickets" className="stat-icon" />
            <span className="stat-label">Tickets</span>
            <span className="stat-value">92</span>
          </div>
        </div>

        {activeTab === 'friends' ? (
          <div className="friends-container">
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'friends' ? 'active' : ''}`}
                onClick={() => setActiveTab('friends')}
              >
                Friends
              </button>
              <button 
                className={`tab ${activeTab === 'trophies' ? 'active' : ''}`}
                onClick={() => setActiveTab('trophies')}
              >
                Trophies
              </button>
            </div>
            <div className="friends-list">
              {mockFriends.map(friend => (
                <div key={friend.id} className="friend-item">
                  <img 
                    src={shared.avatars[0].src}
                    alt="Avatar" 
                    className="friend-avatar" 
                  />
                  <div className="friend-info">
                    <span className="friend-name">{friend.name}</span>
                    <div className="friend-stats">
                      <div className="friend-stat">
                      <img src={ticketIcon} alt="Tickets" className="stat-icon" />
                        <span>{friend.tickets}</span>
                      </div>
                      <div className="friend-stat">
                      <img src={gmtIcon} alt="GMT" className="stat-icon" />
                        <span>{friend.points}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="invite-button-container">
              <button className="invite-button">
                invite friends
                <img src={link} alt="Link" className="stat-icon" />
              </button>
            </div>
          </div>
        ) : (
          <div className="friends-container">
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'friends' ? 'active' : ''}`}
                onClick={() => setActiveTab('friends')}
              >
                Friends
              </button>
              <button 
                className={`tab ${activeTab === 'trophies' ? 'active' : ''}`}
                onClick={() => setActiveTab('trophies')}
              >
                Trophies
              </button>
            </div>
            <div className="trophies-list">
              <div className="trophies-grid">
                {trophies.map(trophy => (
                  <button 
                    key={trophy.id} 
                    className={`trophy-item ${trophy.status}`}
                    onClick={() => handleTrophyClick(trophy)}
                  >
                    <div className="trophy-content">
                      <span className="trophy-icon">
                        <img src={trophy.icon} alt="Trophy" />
                      </span>
                      {(trophy.status === 'locked' || trophy.status === 'ready') && (
                        <div className="trophy-overlay"></div>
                      )}
                      {trophy.status === 'locked' && (
                        <img src={locker} alt="Locked" className="trophy-status-icon" />
                      )}
                      {trophy.status === 'ready' && (
                        <img src={unlock} alt="Ready to unlock" className="trophy-status-icon" />
                      )}
                      {trophy.status === 'ready' && <span className="ready-icon">✨</span>}
                      <span className="trophy-name">{trophy.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {showOverlay && selectedTrophy && (
          <div className="trophy-overlay-container" onClick={closeOverlay}>
            <div className="trophy-overlay-content" onClick={closeOverlay}>
              {/* <button className="trophy-overlay-close" onClick={closeOverlay}>×</button> */}
              
              <div className="trophy-overlay-requirement">
                {selectedTrophy.status === 'locked' ? '1-4 INVITES' : '5-9 INVITES'}
              </div>

              <div className="trophy-overlay-icon-container">
                <img 
                  src={selectedTrophy.icon} 
                  alt={selectedTrophy.name} 
                  className="trophy-overlay-icon"
                />
                <img 
                  src={particle} 
                  alt="Particle" 
                  className="trophy-overlay-particle" 
                />
              </div>

              <h2 className="trophy-overlay-title">{selectedTrophy.name}</h2>
              <p className="trophy-overlay-description">
                {selectedTrophy.description}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Frens;

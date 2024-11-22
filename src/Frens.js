import React, { useState } from 'react';
import './Frens.css';
import shared from './Shared';

const Frens = () => {
  const [activeTab, setActiveTab] = useState('friends'); // 'friends' or 'trophies'

  const mockFriends = [
    { id: 1, name: 'Chonky', tickets: 3, points: 267 },
    { id: 2, name: 'Chonky', tickets: 3, points: 267 },
    { id: 3, name: 'Chonky', tickets: 3, points: 267 },
    { id: 4, name: 'Chonky', tickets: 3, points: 267 },
    { id: 5, name: 'Chonky', tickets: 3, points: 267 },
    { id: 6, name: 'Chonky', tickets: 3, points: 267 }
  ];

  const trophies = [
    { id: 1, name: 'Rookie', status: 'unlocked', icon: '🏆' },
    { id: 2, name: 'Rookie', status: 'unlocked', icon: '🏆' },
    { id: 3, name: 'Rookie', status: 'unlocked', icon: '🏆' },
    { id: 4, name: 'Rookie', status: 'ready', icon: '🏆' },
    { id: 5, name: 'Unlock', status: 'ready', icon: '🏆' },
    { id: 6, name: 'Locked', status: 'locked', icon: '🏆' },
    { id: 7, name: 'Rookie', status: 'unlocked', icon: '🏆' },
    { id: 8, name: 'Unlock', status: 'ready', icon: '🏆' },
    { id: 9, name: 'Locked', status: 'locked', icon: '🏆' },
    { id: 10, name: 'Locked', status: 'locked', icon: '🏆' },
    { id: 11, name: 'Locked', status: 'locked', icon: '🏆' }
  ];

  return (
    <div className="frens-content">
      <div className="frens-inner-content">
        <div className="info-box">
          EARN EXTRA TICKETS BY INVITING FRENS OR BY COMPLETING DAILY TASKS. THE MORE YOU ENGAGE, THE MORE REWARDS YOU'LL UNLOCK.
        </div>

        <div className="stats-row">
          <div className="stat-item-frens">
            <span className="stat-icon">👥</span>
            <span className="stat-label">Friends</span>
            <span className="stat-value">3</span>
          </div>
          <div className="stat-item-frens">
            <span className="stat-icon">🎟️</span>
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
                        <span className="ticket-icon">🎟️</span>
                        <span>{friend.tickets}</span>
                      </div>
                      <div className="friend-stat">
                        <span className="points-icon">💰</span>
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
                <span className="invite-icon">↗️</span>
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
                  <div key={trophy.id} className={`trophy-item ${trophy.status}`}>
                    <div className="trophy-content">
                      {trophy.status === 'locked' && <span className="lock-icon">🔒</span>}
                      {trophy.status === 'ready' && <span className="ready-icon">✨</span>}
                      {trophy.status !== 'locked' && (
                        <span className="trophy-icon">{trophy.icon}</span>
                      )}
                      <span className="trophy-name">{trophy.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Frens;

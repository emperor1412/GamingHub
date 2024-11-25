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
    { id: 1, name: 'Rookie', status: 'unlocked', icon: trophy_1 },
    { id: 2, name: 'Rookie', status: 'unlocked', icon: trophy_2 },
    { id: 3, name: 'Rookie', status: 'unlocked', icon: trophy_3 },
    { id: 4, name: 'Rookie', status: 'ready', icon: trophy_1 },
    { id: 5, name: 'Unlock', status: 'ready', icon: trophy_2 },
    { id: 6, name: 'Locked', status: 'locked', icon: trophy_3 },
    // { id: 7, name: 'Rookie', status: 'unlocked', icon: '🏆' },
    // { id: 8, name: 'Unlock', status: 'ready', icon: '🏆' },
    // { id: 9, name: 'Locked', status: 'locked', icon: '🏆' },
    // { id: 10, name: 'Locked', status: 'locked', icon: '🏆' },
    // { id: 11, name: 'Locked', status: 'locked', icon: '🏆' }
  ];

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
                    onClick={() => {
                      if (trophy.status === 'ready') {
                        // Handle trophy claim
                        console.log('Claiming trophy:', trophy.id);
                      }
                    }}
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
      </div>
    </div>
  );
};

export default Frens;

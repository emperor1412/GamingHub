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
import lock_trophy from './images/lock_trophy.png';
import close from './images/close.svg';

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
    { id: 6, name: 'Chonky', tickets: 3, points: 267 },
    { id: 7, name: 'Chonky', tickets: 3, points: 267 },
    { id: 8, name: 'Chonky', tickets: 3, points: 267 },
    { id: 9, name: 'Chonky', tickets: 3, points: 267 },
    { id: 10, name: 'Chonky', tickets: 3, points: 267 },
    { id: 11, name: 'Chonky', tickets: 3, points: 267 },
  ];

  /*
  state: 0 = locked, 1 = ready, 2 = unlocked

  trophiesDataFromServer: [
        {
            "id": 1,
            "min": 1,
            "max": 4,
            "state": 0,
            "description": "You're just starting out. Keep sharing to climb the ranks!",
            "name": "Rookie Recruiter"
        },
        {
            "id": 2,
            "min": 5,
            "max": 9,
            "state": 0,
            "description": "Great job! You're becoming an influential member of the community",
            "name": "Junior Ambassador"
        },
        {
            "id": 3,
            "min": 10,
            "max": 19,
            "state": 0,
            "description": "Impressive! Your efforts are making a significant impact",
            "name": "Senior Ambassador"
        },
        {
            "id": 4,
            "min": 20,
            "max": 49,
            "state": 0,
            "description": "Outstanding work! You're a key player in growing our community",
            "name": "Master Connector"
        },
        {
            "id": 5,
            "min": 50,
            "max": 99,
            "state": 0,
            "description": "Exceptional! You're among the top contributors",
            "name": "Elite Influencer"
        },
        {
            "id": 6,
            "min": 100,
            "max": -1,
            "state": 0,
            "description": "Legendary status achieved! You're a cornerstone of our growth",
            "name": "Legendary Luminary"
        }
    ]
        */

  const trophies = [
    { 
      id: 1, 
      name: 'ROOKIE RECRUITER', 
      status: 'unlocked', 
      icon: trophy_1,
      min: 1,
      max: 4,
      description: "GREAT JOB! YOU'VE JUST STARTED OUT, KEEP SHARING TO CLIMB THE RANKS!"
    },
    { 
      id: 2, 
      name: 'JUNIOR AMBASSADOR', 
      status: 'ready', 
      icon: trophy_2,
      min: 5,
      max: 9,
      description: "CONGRATULATIONS! YOU'VE BEEN PROMOTED!"
    },
    { 
      id: 3, 
      name: 'SENIOR AMBASSADOR', 
      status: 'locked', 
      icon: trophy_3,
      min: 10,
      max: 19,
      description: "TO UNLOCK THIS TROPHY AND BECOME AN INFLUENTIAL MEMBER OF OUR COMMUNITY!"
    },
    { id: 4, name: 'Master Connector', status: 'ready', icon: trophy_1, description: "Outstanding work! You're a key player in growing our community" },
    { id: 5, name: 'Elite Influencer', status: 'ready', icon: trophy_2, description: "Exceptional! You're among the top contributors" },
    { id: 6, name: 'Legendary Luminary', status: 'locked', icon: trophy_3, description: "Legendary status achieved! You're a cornerstone of our growth" },
    // { id: 7, name: 'Master Connector', status: 'ready', icon: trophy_1, description: "Outstanding work! You're a key player in growing our community" },
    // { id: 8, name: 'Elite Influencer', status: 'ready', icon: trophy_2, description: "Exceptional! You're among the top contributors" },
    // { id: 9, name: 'Legendary Luminary', status: 'locked', icon: trophy_3, description: "Legendary status achieved! You're a cornerstone of our growth" },
  ];

  const onClickShareStory = () => {
    console.log('Share story');
    closeOverlay();
  };

  const handleTrophyClick = (trophy) => {
    setSelectedTrophy(trophy);
    setShowOverlay(true);
  };

  const getTrophyContent = (trophy) => {
    if (trophy.status === 'locked') {
      return {
        requirement: ``,
        description: (
          <>
            REFER <span className="bold-text">{trophy.min} FRIENDS</span> TO UNLOCK THIS TROPHY AND BECOME AN INFLUENTIAL MEMBER OF OUR COMMUNITY!
          </>
        )
      };
    } else if (trophy.status === 'ready') {
      return {
        requirement: `${trophy.min}-${trophy.max} INVITES`,
        description: `CONGRATULATIONS! YOU'VE BEEN PROMOTED!`
      };
    } else {
      return {
        requirement: `${trophy.min}-${trophy.max} INVITES`,
        description: `GREAT JOB! YOU'VE JUST STARTED OUT, KEEP SHARING TO CLIMB THE RANKS!`
      };
    }
  };

  const closeOverlay = () => {
    setShowOverlay(false);
    setSelectedTrophy(null);
  };

  const renderFriendsList = () => {
    return (
      <div className="friends-list-content">
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
        <div className="friend-item placeholder">
        </div>
      </div>
    );
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
              {renderFriendsList()}
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
                      {(trophy.status === 'locked' || trophy.status === 'ready') && (
                        <div className="trophy-overlay"></div>
                      )}
                    <div className="trophy-content">
                      <span className="trophy-icon">
                        <img src={trophy.icon} alt="Trophy" />
                      </span>
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
            <button className="trophy-overlay-close" onClick={closeOverlay}>
              <img src={close} alt="Close" />
            </button>
            <div className="trophy-overlay-content" onClick={e => e.stopPropagation()}>
              {selectedTrophy.status === 'locked' ? (
                <>
                  
                  <div className="trophy-overlay-icon-container">
                    <img 
                      src={selectedTrophy.icon} 
                      alt={selectedTrophy.name} 
                      className="trophy-overlay-icon"
                    />
                  </div>
                  <div className="trophy-overlay-lock-content">
                    <img src={lock_trophy} alt="Lock" className="trophy-overlay-lock" />
                    <div className="trophy-overlay-title">UNLOCK THIS TROPHY</div>
                    <p className="trophy-overlay-description">
                      REFER <span className="bold-text">{selectedTrophy.min} FRIENDS</span> TO UNLOCK THIS TROPHY AND BECOME AN INFLUENTIAL MEMBER OF OUR COMMUNITY!
                    </p>
                  </div>
                </>
              ) : selectedTrophy.status === 'ready' ? (
                <>
                  <div className="trophy-overlay-requirement">
                    {selectedTrophy.min}-{selectedTrophy.max} INVITES
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
                  <div className="trophy-overlay-promotion">
                    CONGRATULATIONS!<br />
                    YOU'VE BEEN PROMOTED!
                  </div>
                  <h2 className="trophy-overlay-title">{selectedTrophy.name}</h2>
                  <p className="trophy-overlay-description">
                    GREAT JOB! YOU'RE ARE AN INFLUENTIAL MEMBER OF THE COMMUNITY!
                  </p>
                  <button className="share-story-button" onClick={onClickShareStory}>
                    SHARE A STORY
                  </button>
                  <div className="trophy-reward">
                    <img src={gmtIcon} alt="GMT" className="stat-icon" />
                    <span>267</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="trophy-overlay-requirement">
                    {selectedTrophy.min}-{selectedTrophy.max} INVITES
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
                    GREAT JOB! YOU'VE JUST STARTED OUT, KEEP SHARING TO CLIMB THE RANKS!
                  </p>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Frens;

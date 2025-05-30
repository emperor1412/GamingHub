import React, { useEffect, useState, useRef } from 'react';
import { shareStory, shareURL } from '@telegram-apps/sdk';
import { logEvent } from 'firebase/analytics';
import { analytics } from './Firebase';
import { trackUserAction, trackStoryShare, trackOverlayView, trackOverlayExit } from './analytics';

import './Frens.css';
import shared from './Shared';
import ticketIcon from './images/ticket.svg';
import friendsIcon from './images/friends_icon.svg';
// import kmIcon from './images/km.svg';
import starletIcon from './images/starlet.png';
import trophy_1 from './images/trophy_1_200px.png';
import trophy_2 from './images/trophy_2_200px.png';
import trophy_3 from './images/trophy_3_200px.png';
import trophy_4 from './images/trophy_4_200px.png';
import trophy_5 from './images/trophy_5_200px.png';
import trophy_6 from './images/trophy_6_200px.png';
import trophy_10000 from './images/trophy_10000_200px.png';
import trophy_10000_locked from './images/trophy_10000_locked.png';
import trophy_10010 from './images/Trophy-ALPHA_TESTER_Unlocked.png';
import trophy_10010_locked from './images/Trophy-ALPHA_TESTER2-Locked.png';
import trophy_10020 from './images/Runner-Trophy_Colour.png';
import trophy_10020_locked from './images/Runner-Trophy_Bw.png';
import locker from './images/locker.png';
import unlock from './images/unlock.png';
import link from './images/checkout.svg';
import particle from './images/particle.svg';
import lock_trophy from './images/lock_trophy.png';
import close from './images/close.svg';


const Frens = () => {
  const [activeTab, setActiveTab] = useState('friends'); // 'friends' or 'trophies'
  const [selectedTrophy, setSelectedTrophy] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [trophies, setTrophies] = useState([]);
  const [friendsData, setFriendsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [totalFriends, setTotalFriends] = useState(0);
  const [earnedTickets, setEarnedTickets] = useState(0);



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

  const trophyIcon = {
    1: trophy_1,
    2: trophy_2,
    3: trophy_3,
    4: trophy_4,
    5: trophy_5,
    6: trophy_6,
    10000: trophy_10000,
    10010: trophy_10010,
    10020: trophy_10020
  }
  
  const trophyIconLocked = {
    10000: trophy_10000_locked,
    10010: trophy_10010_locked,
    10020: trophy_10020_locked
  }
  
  const getTrophyData = async (depth = 0) => {
    if (depth > 3) {
      console.error('Get trophy data failed after 3 attempts');
      return;
    }

    const response = await fetch(`${shared.server_url}/api/app/trophiesData?token=${shared.loginData.token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Trophies data:', data);
      if (data.code === 0) {
        const trophiesData = data.data.map(trophy => ({
          id: trophy.id,
          name: trophy.id === 10000 && trophy.state === 2 ? "STARLETS CHAMPION" : trophy.name,
          description: trophy.description,
          min: trophy.min,
          max: trophy.max,
          state: trophy.state,
          status: trophy.state === 0 ? 'locked' : trophy.state === 1 ? 'ready' : 'unlocked',
          icon: trophy.id === 10000 && trophy.state === 0 ? trophy_10000_locked : 
                trophy.id === 10010 && trophy.state === 0 ? trophy_10010_locked :
                trophy.id === 10020 && trophy.state === 0 ? trophy_10020_locked :
                trophyIcon[trophy.id]
        }));

        // setTrophies(trophiesData.concat(trophiesData));
        setTrophies(trophiesData);
      }
      else if (data.code === 102002 || data.code === 102001) {
        console.error('Trophies data error:', data.msg);
        const result = await shared.login(shared.initData);
        if (result.success) {
          getTrophyData(depth + 1);
        }
        else {
          console.error('Login failed:', result.error);
        }
      }
    } else {
      console.error('Trophies data error:', response);
    }
  };

  const unlockTrophy = async (trophyId, depth = 0) => {
    if (depth > 3) {
      console.error('Unlock trophy failed after 3 attempts');
      return;
    }
    const response = await fetch(`${shared.server_url}/api/app/unlockTrophy?token=${shared.loginData.token}&trophyId=${trophyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Unlock trophy data:', data);
      if (data.code === 0) {
        console.log('Trophy unlocked success');
        getTrophyData();
      }
      else if (data.code === 102002 || data.code === 102001) {
        console.error('Unlock trophy data error:', data.msg);
        const result = await shared.login(shared.initData);
        if (result.success) {
          unlockTrophy(trophyId, depth + 1);
        }
        else {
          console.error('Login failed:', result.error);
        }
      }
    } else {
      console.error('Unlock trophy data error:', response);
    }
  };

  /*

  friends data from server:
  url: /app/frensData

  {
    "code": 0,
    "data": {
        "friends": 10,
        "ticket": 0,
        "page": {
            "pageSize": 10,
            "pageNo": 1,
            "totalPages": 3,
            "totalRecords": 30,
            "list": [
                {
                    "name": "t_name",
                    "ticket": 0,
                    "starlets": 0,
                    "pictureIndex": 6
                },
                {
                    "name": "t_name",
                    "ticket": 0,
                    "starlets": 0,
                    "pictureIndex": 6
                },
                {
                    "name": "t_name",
                    "ticket": 0,
                    "starlets": 0,
                    "pictureIndex": 6
                },
                {
                    "name": "t_name",
                    "ticket": 0,
                    "starlets": 0,
                    "pictureIndex": 6
                },
                {
                    "name": "t_name",
                    "ticket": 0,
                    "starlets": 0,
                    "pictureIndex": 6
                },
                {
                    "name": "t_name",
                    "ticket": 0,
                    "starlets": 0,
                    "pictureIndex": 6
                },
                {
                    "name": "t_name",
                    "ticket": 0,
                    "starlets": 0,
                    "pictureIndex": 6
                },
                {
                    "name": "t_name",
                    "ticket": 0,
                    "starlets": 0,
                    "pictureIndex": 6
                },
                {
                    "name": "t_name",
                    "ticket": 0,
                    "starlets": 0,
                    "pictureIndex": 6
                },
                {
                    "name": "t_name",
                    "ticket": 0,
                    "starlets": 0,
                    "pictureIndex": 6
                }
            ],
            "prePage": false,
            "nextPage": true,
            "prePageNo": 1,
            "nextPageNo": 2
        }
    }
}

  */

  const getFriendsData = async (page = 1, depth = 0) => {
    if (depth > 3) {
      console.error('Get friends data failed after 3 attempts');
      return;
    }

    setIsLoading(true);
    // await new Promise(resolve => setTimeout(resolve, 2000));

    const response = await fetch(`${shared.server_url}/api/app/frensData?token=${shared.loginData.token}&page=${page}&pageSize=10`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Friends data:', data);
      if (data.code === 0) {
        const newFriendsData = data.data.page.list.map(friend => ({
          name: friend.name,
          ticket: friend.ticket,
          starlets: friend.kmPoint,
          pictureIndex: friend.pictureIndex
        }));

        setEarnedTickets(data.data.ticket);
        setTotalFriends(data.data.page.totalRecords);
        setFriendsData(prev => page === 1 ? newFriendsData : [...prev, ...newFriendsData]);
        setHasMorePages(data.data.page.nextPage);
        setCurrentPage(page);
      }
      else if (data.code === 102002 || data.code === 102001) {
        console.error('Friends data error:', data.msg);
        const result = await shared.login(shared.initData);
        if (result.success) {
          getFriendsData(page, depth + 1);
        }
        else {
          console.error('Login failed:', result.error);
        }
      }
    } else {
      console.error('Friends data error:', response);
    }
    setIsLoading(false);
  };

  // url: /app/sharingTrophy

  const shareStoryAPI = async (trophyId, depth = 0) => {
    if (depth > 3) {
      console.error('Share story API failed after 3 attempts');
      return;
    }
    const response = await fetch(`${shared.server_url}/api/app/sharingTrophy?token=${shared.loginData.token}&trophyId=${trophyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Share story API data:', data);
      if (data.code === 0) {
        console.log('Story shared API called success');
      }
      else if (data.code === 102002 || data.code === 102001) {
        console.error('Share story data error:', data.msg);
        const result = await shared.login(shared.initData);
        if (result.success) {
          shareStoryAPI(trophyId, depth + 1);
        }
        else {
          console.error('Login failed:', result.error);
        }
      }
    } else {
      console.error('Share story API data error:', response);
    }
  };

  const onClickShareStory = () => {
    console.log('Share story');
    closeOverlay();

    if (shareStory.isSupported()) {
      // const url = 'https://pub-8bab4a9dfe21470ebad9203e437e2292.r2.dev/miniGameHub/Dg+LT/1rbDTBnSBE673KpzH+jOrxj9FWbKzk1AHpGtw=.png';
      const url = "https://fsl-minigame-res.s3.ap-east-1.amazonaws.com/miniGameHub/2542.png";
      shareStory(url, {
        text: 'Yay! I just unlocked a trophy in FSL Gaming Hub! 🏆',
      });

      trackStoryShare('trophy', {
        trophy_id: selectedTrophy.id,
        trophy_name: selectedTrophy.name,
        trophy_status: selectedTrophy.status
      }, shared.loginData?.userId);

      shareStoryAPI(selectedTrophy.id);
    }
  };

  const onClickInviteFriends = () => {
    console.log('Invite friends');
    const url = `${shared.app_link}?startapp=invite_${shared.loginData.link}`;
    console.log('Invite friends URL:', url);
    
    // Log the invite friends event
    logEvent(analytics, 'invite_friends_clicked', {
        userId: shared.loginData?.userId || 'unknown',
        timestamp: new Date().toISOString()
    });
    
    shareURL(url);
  };

  const handleTrophyClick = (trophy) => {
    setSelectedTrophy(trophy);
    setShowOverlay(true);

    if (trophy.status === 'ready') {
      console.log('Unlocked trophy:', trophy.name);
      unlockTrophy(trophy.id);
    }
  };

  const closeOverlay = () => {
    trackOverlayExit('trophy_details', shared.loginData?.link, 'frens');
    setShowOverlay(false);
    setSelectedTrophy(null);
  };

  useEffect(() => {
    /*
    setTrophies([
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
    ]);
    */

    /*
    setFriendsData([
      { pictureIndex: 1, name: 'Chonky', ticket: 3, starlets: 267 },
      { pictureIndex: 2, name: 'Chonky', ticket: 3, starlets: 267 },
      { pictureIndex: 3, name: 'Chonky', ticket: 3, starlets: 267 },
      { pictureIndex: 4, name: 'Chonky', ticket: 3, starlets: 267 },
      { pictureIndex: 5, name: 'Chonky', ticket: 3, starlets: 267 },
      { pictureIndex: 6, name: 'Chonky', ticket: 3, starlets: 267 },
      { pictureIndex: 7, name: 'Chonky', ticket: 3, starlets: 267 },
      { pictureIndex: 8, name: 'Chonky', ticket: 3, starlets: 267 },
      { pictureIndex: 9, name: 'Chonky', ticket: 3, starlets: 267 },
      { pictureIndex: 10, name: 'Chonky', ticket: 3, starlets: 267 },
      { pictureIndex: 11, name: 'Chonky', ticket: 3, starlets: 267 },
    ]);  
    */

    getTrophyData();
    getFriendsData();
  }, []);

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;

    if (scrollHeight - scrollTop <= clientHeight + 100 && !isLoading && hasMorePages) {
      getFriendsData(currentPage + 1);
    }
  };

  const renderFriendsList = () => {
    return (
      <div className="friends-list-content">
        {friendsData.map((friend, index) => (
          <div key={index} className="friend-item">
            <img
              src={shared.avatars[friend.pictureIndex].src}
              alt="Avatar"
              className="friend-avatar"
            />
            <div className="friend-info">
              <span className="friend-name">{friend.name}</span>
              <div className="friend-stats">
                <div className="friend-stat">
                  <img src={ticketIcon} alt="Tickets" className="stat-icon" />
                  <span>{friend.ticket}</span>
                </div>
                <div className="friend-stat">
                  <img src={starletIcon} alt="Starlets" className="stat-icon" />
                  <span>{friend.starlets}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="friend-item loading" style={{
            height: friendsData.length === 0 ? '100%' : 'auto'
          }}>
            Loading...
          </div>
        )}
        <div className="friend-item placeholder"></div>
      </div>
    );
  };

  // Track overlay views
  useEffect(() => {
    if (showOverlay && selectedTrophy) {
      trackOverlayView('trophy_details', shared.loginData?.link, 'frens');
    }
  }, [showOverlay, selectedTrophy]);

  return (
    <div className="frens-content">
      <div className="frens-inner-content">
        <div className="info-box">
        Earn extra tickets by inviting friends or completing daily tasks. The more you engage, the more rewards you unlock!
        </div>

        <div className="stats-row">
          <div className="stat-item-frens">
            <img src={friendsIcon} alt="Friends" className="stat-icon" />
            <span className="stat-label">Friends</span>
            <span className="stat-value">{totalFriends}</span>
          </div>
          <div className="stat-item-frens">
            <img src={ticketIcon} alt="Tickets" className="stat-icon" />
            <span className="stat-label">Earned</span>
            <span className="stat-value">{earnedTickets}</span>
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
            <div className="friends-list" onScroll={handleScroll}>
              {renderFriendsList()}
            </div>
            <div className="invite-button-container">
              <button className="invite-button" onClick={onClickInviteFriends}>
                Invite Friends
                <img src={link} alt="Link" className="invite-icon" />
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
                      <span className="trophy-name">
                        {trophy.id === 10000 && trophy.status === 'unlocked' ? "Starlets Champion" : trophy.name}
                      </span>
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
                      {selectedTrophy.description}
                    </p>
                  </div>
                </>
              ) : selectedTrophy.status === 'ready' ? (
                <>
                  <div className="trophy-overlay-requirement">
                    {selectedTrophy.max > 0 ? `${selectedTrophy.min} - ${selectedTrophy.max} INVITES` : ``}
                  </div>
                  <div className="trophy-overlay-icon-container">
                    <img
                      src={selectedTrophy.icon}
                      alt={selectedTrophy.name}
                      className="trophy-overlay-icon"
                    />
                    {/* <img
                      src={particle}
                      alt="Particle"
                      className="trophy-overlay-particle"
                    /> */}
                    <div className='stars' style={{top: 176, left: -32}}>
                      <img src={shared.starImages.star1} alt="Star" className="single-star single-star-1" />
                      <img src={shared.starImages.star2} alt="Star" className="single-star single-star-2" />
                      <img src={shared.starImages.star3} alt="Star" className="single-star single-star-3" />
                      <img src={shared.starImages.star4} alt="Star" className="single-star single-star-4" />
                      <img src={shared.starImages.star5} alt="Star" className="single-star single-star-5" />
                    </div>
                  </div>
                  <div className="trophy-overlay-promotion">
                    {selectedTrophy.id === 10000 ? (
                      <>
                        CONGRATULATIONS!<br />
                        YOU'VE UNLOCKED A MYSTERY TROPHY!
                      </>
                    ) : (
                      <>
                        CONGRATULATIONS!<br />
                        YOU'VE BEEN PROMOTED!
                      </>
                    )}
                  </div>
                  <h2 className="trophy-overlay-title">
                    {selectedTrophy.id === 10000 ? "STARLETS CHAMPION" : selectedTrophy.name}
                  </h2>
                  <p className="trophy-overlay-description">
                    {selectedTrophy.id === 10000 ? (
                      "YOU DIDN'T JUST COLLECT STARLETS\nYOU BECAME ONE!"
                    ) : (
                      selectedTrophy.description
                    )}
                  </p>
                  <button className="share-story-button" onClick={onClickShareStory}>
                    SHARE A STORY
                    <div className="trophy-reward">
                      <img src={starletIcon} alt="Starlets" className="stat-icon" />
                      <span>20</span>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <div className="trophy-overlay-requirement">
                    {selectedTrophy.max > 0 ? `${selectedTrophy.min} - ${selectedTrophy.max} INVITES` : ``}
                  </div>
                  <div className="trophy-overlay-icon-container">
                    <img
                      src={selectedTrophy.icon}
                      alt={selectedTrophy.name}
                      className="trophy-overlay-icon"
                    />
                    {/* <img
                      src={particle}
                      alt="Particle"
                      className="trophy-overlay-particle"
                    /> */}

                    <div className='stars' style={{top: 176, left: -32}}>
                      <img src={shared.starImages.star1} alt="Star" className="single-star single-star-1" />
                      <img src={shared.starImages.star2} alt="Star" className="single-star single-star-2" />
                      <img src={shared.starImages.star3} alt="Star" className="single-star single-star-3" />
                      <img src={shared.starImages.star4} alt="Star" className="single-star single-star-4" />
                      <img src={shared.starImages.star5} alt="Star" className="single-star single-star-5" />
                    </div>
                  </div>
                  <h2 className="trophy-overlay-title">
                    {selectedTrophy.id === 10000 ? "STARLETS CHAMPION" : selectedTrophy.name}
                  </h2>
                  <p className="trophy-overlay-description">
                    {selectedTrophy.id === 10000 ? (
                      "YOU DIDN'T JUST COLLECT STARLETS\nYOU BECAME ONE!"
                    ) : (
                      selectedTrophy.description
                    )}
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

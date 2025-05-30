import React, { useEffect, useState } from 'react';
import './Market.css';
import { trackUserAction } from './analytics';
import shared from './Shared';
import ticketIcon from './images/ticket.svg';
import starlet from './images/starlet.png';
import scratch_ticket_button_bg from './images/scratch_ticket_button_bg.png';
import ConfirmPurchasePopup from './ConfirmPurchasePopup';
import Buy from './Buy';
import background from './images/background_2.png';

// url: /app/buyOptions
// Request:
// Response:
// {
//     "code": 0,
//     "data": [
//         {
//             "id": 1,
//             "state": 0,
//             "stars": 1,
//             "starlet": 10,
//             "ticket": 1
//         },
//         {
//             "id": 2,
//             "state": 0,
//             "stars": 2,
//             "starlet": 30,
//             "ticket": 2
//         }
//     ]
// }

// url: /app/buyStarlets
// Request:
//     optionId int
// Response:
// {
//     "code": 0,
//     "data": "https://t.me/$rSx3fmgFAFZgAQAAuXGUvcVgAw"
// }

// url: /app/getFreeRewardTime
// Request:
// Response:
// {
//     "code": 0,
//     "data": 1741737600000
// }

// url: /app/claimFreeReward
// Request:
// Response:
// {
//     "code": 0,
//     "data": {
//         "success": true,
//         "time": 1741737600000
//     }
// }

const Market = ({ showFSLIDScreen, setShowProfileView }) => {
  const [tickets, setTickets] = useState(0);
  const [starlets, setStarlets] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showBuyView, setShowBuyView] = useState(false);
  const [isFreeItemClaimed, setIsFreeItemClaimed] = useState(false);
  const [nextClaimTime, setNextClaimTime] = useState(null);
  const [buyOptions, setBuyOptions] = useState([]);

  // Add body class to prevent iOS overscrolling
  useEffect(() => {
    // Add class when component mounts
    document.body.classList.add('mk-market-open');
    
    // Remove class when component unmounts
    return () => {
      document.body.classList.remove('mk-market-open');
    };
  }, []);

  useEffect(() => {
    const fetchBuyOptions = async () => {
      try {
        const data = await shared.api.getBuyOptions(shared.loginData.token);
        console.log('Buy Options Response:', data);
        if (data.code === 0 && Array.isArray(data.data)) {
          console.log('Buy Options Data:', data.data);
          setBuyOptions(data.data);
        } else if (data.code === 102002 || data.code === 102001) {
          // Token expired, attempt to refresh
          console.log('Token expired, attempting to refresh...');
          const result = await shared.login(shared.initData);
          if (result.success) {
            // Retry the fetch after login
            const retryData = await shared.api.getBuyOptions(shared.loginData.token);
            if (retryData.code === 0 && Array.isArray(retryData.data)) {
              setBuyOptions(retryData.data);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch buy options:', error);
      }
    };

    fetchBuyOptions();
  }, []);

  useEffect(() => {
    const setupProfileData = async () => {
      const userStarlets = shared.userProfile?.UserToken?.find(token => token.prop_id === 10020);
      if (userStarlets) {
        setStarlets(userStarlets.num);
      }

      const userTicket = shared.userProfile?.UserToken?.find(token => token.prop_id === 10010);
      if (userTicket) {
        setTickets(userTicket.num);
      }
    };

    setupProfileData();
  }, []);

  // Add effect to watch showBuyView changes
  useEffect(() => {
    if (!showBuyView) { // When returning from Buy view
      const updateData = async () => {
        await shared.getProfileWithRetry();
        const userStarlets = shared.userProfile?.UserToken?.find(token => token.prop_id === 10020);
        if (userStarlets) {
          setStarlets(userStarlets.num);
        }

        const userTicket = shared.userProfile?.UserToken?.find(token => token.prop_id === 10010);
        if (userTicket) {
          setTickets(userTicket.num);
        }
      };
      updateData();
    }
  }, [showBuyView]);

  // Add new function to check free reward time
  const checkFreeRewardTime = async () => {
    try {
      const data = await shared.api.getFreeRewardTime(shared.loginData.token);
      if (data.code === 0) {
        const currentTime = Date.now();
        const nextTime = data.data;
        setNextClaimTime(nextTime);
        setIsFreeItemClaimed(nextTime > currentTime);
      } else if (data.code === 102002 || data.code === 102001) {
        console.log('Token expired, attempting to refresh...');
        const result = await shared.login(shared.initData);
        if (result.success) {
          const retryData = await shared.api.getFreeRewardTime(shared.loginData.token);
          if (retryData.code === 0) {
            const currentTime = Date.now();
            const nextTime = retryData.data;
            setNextClaimTime(nextTime);
            setIsFreeItemClaimed(nextTime > currentTime);
          }
        }
      }
    } catch (error) {
      console.error('Failed to check free reward time:', error);
    }
  };

  // Add new function to claim free reward
  const handleClaimFreeReward = async () => {
    try {
      const data = await shared.api.claimFreeReward(shared.loginData.token);
      if (data.code === 0 && data.data.success) {
        // Update next claim time
        setNextClaimTime(data.data.time);
        setIsFreeItemClaimed(true);
        
        // Update user profile to reflect new starlets and tickets
        await shared.getProfileWithRetry();
        
        // Update local state
        const userStarlets = shared.userProfile?.UserToken?.find(token => token.prop_id === 10020);
        if (userStarlets) {
          setStarlets(userStarlets.num);
        }

        const userTicket = shared.userProfile?.UserToken?.find(token => token.prop_id === 10010);
        if (userTicket) {
          setTickets(userTicket.num);
        }

        // Show success popup
        if (window.Telegram?.WebApp?.showPopup) {
          await window.Telegram.WebApp.showPopup({
            title: 'Success',
            message: 'You have successfully claimed your free reward!',
            buttons: [{ id: 'ok', type: 'ok', text: 'OK' }]
          });
        }
      } else if (data.code === 102002 || data.code === 102001) {
        console.log('Token expired, attempting to refresh...');
        const result = await shared.login(shared.initData);
        if (result.success) {
          const retryData = await shared.api.claimFreeReward(shared.loginData.token);
          if (retryData.code === 0 && retryData.data.success) {
            setNextClaimTime(retryData.data.time);
            setIsFreeItemClaimed(true);
            await shared.getProfileWithRetry();
            
            const userStarlets = shared.userProfile?.UserToken?.find(token => token.prop_id === 10020);
            if (userStarlets) {
              setStarlets(userStarlets.num);
            }

            const userTicket = shared.userProfile?.UserToken?.find(token => token.prop_id === 10010);
            if (userTicket) {
              setTickets(userTicket.num);
            }

            if (window.Telegram?.WebApp?.showPopup) {
              await window.Telegram.WebApp.showPopup({
                title: 'Success',
                message: 'You have successfully claimed your free reward!',
                buttons: [{ id: 'ok', type: 'ok', text: 'OK' }]
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to claim free reward:', error);
      if (window.Telegram?.WebApp?.showPopup) {
        await window.Telegram.WebApp.showPopup({
          title: 'Error',
          message: 'Failed to claim free reward. Please try again.',
          buttons: [{ id: 'ok', type: 'ok', text: 'OK' }]
        });
      }
    }
  };

  // Add useEffect to check free reward time on component mount
  useEffect(() => {
    checkFreeRewardTime();
  }, []);

  const handleConnectFSLID = () => {
    showFSLIDScreen();
  };

  const handleStarletPurchase = (amount, stars, price, optionId = null) => {
    setSelectedPurchase({ amount, stars, optionId });
    setShowBuyView(true);
  };

  const refreshUserProfile = async () => {
    await shared.getProfileWithRetry();
    const userStarlets = shared.userProfile?.UserToken?.find(token => token.prop_id === 10020);
    if (userStarlets) {
      setStarlets(userStarlets.num);
    }

    const userTicket = shared.userProfile?.UserToken?.find(token => token.prop_id === 10010);
    if (userTicket) {
      setTickets(userTicket.num);
    }

    // Check free reward time after profile refresh
    await checkFreeRewardTime();
  };

  // Add effect to watch showBuyView changes
  useEffect(() => {
    if (!showBuyView) { // When returning from Buy view
      refreshUserProfile();
    }
  }, [showBuyView]);

  useEffect(() => {
    refreshUserProfile();
  }, []);

  const handleConfirmPurchase = () => {
    if (!shared.loginData?.fslId) {
      setIsPopupOpen(false);
      setSelectedPurchase(null);
      showFSLIDScreen();
      return;
    }

    if (selectedPurchase) {
      trackUserAction('market_purchase_click', {
        amount: selectedPurchase.amount,
        stars: selectedPurchase.stars,
        price: selectedPurchase.stars === 0 ? 'FREE' : null
      }, shared.loginData?.link);
    }
    
    // Reset states
    setIsPopupOpen(false);
    setSelectedPurchase(null);
    setShowBuyView(false);
  };

  if (showBuyView) {
    return (
      <Buy
        selectedPurchase={selectedPurchase}
        setShowBuyView={setShowBuyView}
        showFSLIDScreen={showFSLIDScreen}
        setSelectedPurchase={setSelectedPurchase}
        setShowProfileView={setShowProfileView}
      />
    );
  }

  return (
    <>
      <div className="background-container">
        <img src={background} alt="background" />
      </div>
      <header className="stats-header">
        <button 
          className="profile-pic-main"
          onClick={() => setShowProfileView(true)}
        >
          <img 
            src={shared.avatars[shared.userProfile ? shared.userProfile.pictureIndex : 0]?.src} 
            alt="Profile" 
          />
        </button>
        <div className="stat-item-main-text" onClick={() => setShowProfileView(true)}>
          GM {shared.telegramUserData?.firstName || 'User'}!
        </div>
        <div className="stats-main">
          <button 
            className="stat-item-main"
            onClick={() => setShowProfileView(true)}
          >
            <img src={ticketIcon} alt="Tickets" />
            <span className="stat-item-main-text">{tickets}</span>
          </button>
          <button 
            className="stat-item-main"
            onClick={() => setShowProfileView(true)}
          >
            <img src={starlet} alt="Starlets" />
            <span className="stat-item-main-text">{starlets}</span>
          </button>
        </div>
      </header>

      <div className="mk-market-container">
        <div className="mk-market-content">
          <div className="mk-market-title">MARKET</div>

          {!shared.userProfile?.fslId && (
            <div className="mk-fsl-connect-section" onClick={handleConnectFSLID}>
              <div className="mk-fsl-connect-content">
                <div className="mk-lock-icon">🔒</div>
                <div className="mk-fsl-text">
                  <div className="mk-connect-title">CONNECT YOUR FSL ID</div>
                  <div className="mk-connect-subtitle">USERS WHO HAVE FSL ID CONNECTED WILL BE ABLE TO CLAIM 50 STARLETS AND 1 TICKET DAILY</div>
                </div>
              </div>
            </div>
          )}
          
          <div className="mk-scrollable-market-content">
            <div className="mk-starlet-grid">
              <button 
                className={`mk-market-ticket-button ${isFreeItemClaimed ? 'sold-out' : ''}`} 
                onClick={() => !isFreeItemClaimed && handleStarletPurchase(50, 0, 'FREE', 'free')}
                disabled={isFreeItemClaimed}
              >
                <div className="mk-market-ticket-button-image-container">
                  <div className="mk-market-ticket-content">
                    <div className="mk-market-ticket-icon">
                      <img src={starlet} alt="Starlet" style={{ opacity: isFreeItemClaimed ? 0.5 : 1 }} />
                    </div>
                    <div className="mk-market-ticket-info">
                      <div className="mk-market-ticket-text">
                        <div className="mk-market-ticket-amount" style={{ opacity: isFreeItemClaimed ? 0.5 : 1 }}>50</div>
                        <div className="mk-market-ticket-label" style={{ opacity: isFreeItemClaimed ? 0.5 : 1 }}>STARLETS</div>
                      </div>
                      <div className="mk-market-ticket-bonus">
                        <span>X1</span>&nbsp;<span>TICKETS</span>
                      </div>
                    </div>
                  </div>
                  <div className="mk-market-ticket-price">
                    {isFreeItemClaimed ? 'SOLD OUT' : 'FREE'}
                  </div>
                </div>
              </button>

              {buyOptions.map((option) => (
                <button 
                  key={option.id}
                  className="mk-market-ticket-button" 
                  onClick={() => handleStarletPurchase(option.starlet, option.stars, null, option.id)}
                >
                  <div className="mk-market-ticket-button-image-container">
                    <div className="mk-market-ticket-content">
                      <div className="mk-market-ticket-icon">
                        <img src={starlet} alt="Starlet" />
                      </div>
                      <div className="mk-market-ticket-info">
                        <div className="mk-market-ticket-text">
                          <div className="mk-market-ticket-amount">{option.starlet}</div>
                          <div className="mk-market-ticket-label">STARLETS</div>
                        </div>
                        <div className="mk-market-ticket-bonus">
                          <span>X{option.ticket}</span>&nbsp;<span>TICKETS</span>
                        </div>
                      </div>
                    </div>
                    <div className="mk-market-ticket-price">{option.stars} TELEGRAM STARS</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Market; 
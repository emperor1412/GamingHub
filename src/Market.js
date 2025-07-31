import React, { useEffect, useState } from 'react';
import './Market.css';
import { trackLineConversion, trackUserAction } from './analytics';
import shared from './Shared';
import { t } from './utils/localization';
import ticketIcon from './images/ticket.svg';
import starlet from './images/starlet.png';
import scratch_ticket_button_bg from './images/scratch_ticket_button_bg.png';
import ConfirmPurchasePopup from './ConfirmPurchasePopup';
import Buy from './Buy';
import background from './images/background_2.png';
import arrow_2 from './images/arrow_2.svg';

// url: /app/buyOptions
// Request:
// Response:
// type Type_Init = 0;
//      Type_Weekly = 10;
//      Type_Month = 20;
//      Type_OnlyOnce = 30;
// {
//     "code": 0,
//     "data": [
//         {
//             "id": 2001,
//             "state": 0,
//             "type": 20,
//             "stars": 250,
//             "starlet": 1950,
//             "ticket": 0,
//             "canBuy": true
//         },
//         {
//             "id": 4,
//             "state": 0,
//             "type": 0,
//             "stars": 100,
//             "starlet": 500,
//             "ticket": 0,
//             "canBuy": true
//         }
//     ]
// }

// url: /app/buyStarlets
// Request:
//     optionId int
// Response:
// {
//     "code": 0,
//     "data": "https://t.me/$rSx3fmgFAFZgAQAAuXGU/vcVgAw"
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
  const [activeTab, setActiveTab] = useState('telegram'); // 'starlet' or 'telegram'
  
  // Category expansion states
  const [standardPackExpanded, setStandardPackExpanded] = useState(true);
  const [exclusiveOfferExpanded, setExclusiveOfferExpanded] = useState(true);
  const [monthlyOfferExpanded, setMonthlyOfferExpanded] = useState(true);
  const [weeklyOfferExpanded, setWeeklyOfferExpanded] = useState(true);

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
        const response = await fetch(`${shared.server_url}/api/app/buyOptions?token=${shared.loginData.token}`);
        const data = await response.json();
        console.log('Buy Options Response:', data);
        if (data.code === 0 && Array.isArray(data.data)) {
          console.log('Buy Options Data:', data.data);
          // Filter to only show free options (type 0)
          const freeOptions = data.data.filter(option => option.type === 0);
          setBuyOptions(freeOptions);
        } else if (data.code === 102002 || data.code === 102001) {
          // Token expired, attempt to refresh
          console.log('Token expired, attempting to refresh...');
          const result = await shared.login(shared.initData);
          if (result.success) {
            // Retry the fetch after login
            const retryResponse = await fetch(`${shared.server_url}/api/app/buyOptions?token=${shared.loginData.token}`);
            const retryData = await retryResponse.json();
            if (retryData.code === 0 && Array.isArray(retryData.data)) {
              // Filter to only show free options (type 0)
              const freeOptions = retryData.data.filter(option => option.type === 0);
              setBuyOptions(freeOptions);
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
      const response = await fetch(`${shared.server_url}/api/app/getFreeRewardTime?token=${shared.loginData.token}`);
      const data = await response.json();
      if (data.code === 0) {
        const currentTime = Date.now();
        const nextTime = data.data;
        setNextClaimTime(nextTime);
        setIsFreeItemClaimed(nextTime > currentTime);
      } else if (data.code === 102002 || data.code === 102001) {
        console.log('Token expired, attempting to refresh...');
        const result = await shared.login(shared.initData);
        if (result.success) {
          const retryResponse = await fetch(`${shared.server_url}/api/app/getFreeRewardTime?token=${shared.loginData.token}`);
          const retryData = await retryResponse.json();
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
      const response = await fetch(`${shared.server_url}/api/app/claimFreeReward?token=${shared.loginData.token}`);
      const data = await response.json();
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
            title: t('SUCCESS'),
            message: t('SUCCESSFULLY_CLAIMED_FREE_REWARD'),
            buttons: [{ id: 'ok', type: 'ok', text: t('OKAY') }]
          });
        }
      } else if (data.code === 102002 || data.code === 102001) {
        console.log('Token expired, attempting to refresh...');
        const result = await shared.login(shared.initData);
        if (result.success) {
          const retryResponse = await fetch(`${shared.server_url}/api/app/claimFreeReward?token=${shared.loginData.token}`);
          const retryData = await retryResponse.json();
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
                title: t('SUCCESS'),
                message: t('SUCCESSFULLY_CLAIMED_FREE_REWARD'),
                buttons: [{ id: 'ok', type: 'ok', text: t('OKAY') }]
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to claim free reward:', error);
      if (window.Telegram?.WebApp?.showPopup) {
        await window.Telegram.WebApp.showPopup({
          title: t('ERROR'),
          message: t('FAILED_TO_CLAIM_FREE_REWARD'),
          buttons: [{ id: 'ok', type: 'ok', text: t('OKAY') }]
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

    // Reload buy options to update limited offer status
    try {
      const response = await fetch(`${shared.server_url}/api/app/buyOptions?token=${shared.loginData.token}`);
      const data = await response.json();
      console.log('Refreshed Buy Options Response:', data);
      if (data.code === 0 && Array.isArray(data.data)) {
        console.log('Refreshed Buy Options Data:', data.data);
        // Filter to only show free options (type 0)
        const freeOptions = data.data.filter(option => option.type === 0);
        setBuyOptions(freeOptions);
      } else if (data.code === 102002 || data.code === 102001) {
        // Token expired, attempt to refresh
        console.log('Token expired, attempting to refresh...');
        const result = await shared.login(shared.initData);
        if (result.success) {
          // Retry the fetch after login
          const retryResponse = await fetch(`${shared.server_url}/api/app/buyOptions?token=${shared.loginData.token}`);
          const retryData = await retryResponse.json();
          if (retryData.code === 0 && Array.isArray(retryData.data)) {
            // Filter to only show free options (type 0)
            const freeOptions = retryData.data.filter(option => option.type === 0);
            setBuyOptions(freeOptions);
          }
        }
      }
    } catch (error) {
      console.error('Failed to refresh buy options:', error);
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

  // Add useEffect to listen for data refresh trigger from App component
  useEffect(() => {
    // This will run when dataRefreshTrigger changes (after focus/unfocus reload)
    if (shared.userProfile) {
      console.log('Market: Updating currency display after data refresh');
      const userStarlets = shared.userProfile?.UserToken?.find(token => token.prop_id === 10020);
      if (userStarlets) {
        setStarlets(userStarlets.num);
      }

      const userTicket = shared.userProfile?.UserToken?.find(token => token.prop_id === 10010);
      if (userTicket) {
        setTickets(userTicket.num);
      }
    }
  }, [shared.userProfile]); // This will trigger when shared.userProfile changes

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

  // Helper function to get category title and color based on type
  const getCategoryInfo = (type) => {
    switch (type) {
      case 0:
        return { title: 'STANDARD PACK', color: '#00FF00', bgColor: 'rgba(0, 255, 0, 0.1)' };
      case 10:
        return { title: 'LIMITED WEEKLY OFFER', color: '#FF69B4', bgColor: 'rgba(255, 105, 180, 0.1)' };
      case 20:
        return { title: 'LIMITED MONTHLY OFFER', color: '#9370DB', bgColor: 'rgba(147, 112, 219, 0.1)' };
      case 30:
        return { title: 'EXCLUSIVE ONE-TIME OFFER', color: '#FFA500', bgColor: 'rgba(255, 165, 0, 0.1)' };
      default:
        return { title: 'STANDARD PACK', color: '#00FF00', bgColor: 'rgba(0, 255, 0, 0.1)' };
    }
  };

  // Helper function to get expansion state based on type
  const getExpansionState = (type) => {
    switch (type) {
      case 0:
        return standardPackExpanded;
      case 10:
        return weeklyOfferExpanded;
      case 20:
        return monthlyOfferExpanded;
      case 30:
        return exclusiveOfferExpanded;
      default:
        return standardPackExpanded;
    }
  };

  // Helper function to set expansion state based on type
  const setExpansionState = (type, value) => {
    switch (type) {
      case 0:
        setStandardPackExpanded(value);
        break;
      case 10:
        setWeeklyOfferExpanded(value);
        break;
      case 20:
        setMonthlyOfferExpanded(value);
        break;
      case 30:
        setExclusiveOfferExpanded(value);
        break;
      default:
        setStandardPackExpanded(value);
    }
  };

  // Group buy options by type
  const groupedOptions = buyOptions.reduce((acc, option) => {
    if (!acc[option.type]) {
      acc[option.type] = [];
    }
    acc[option.type].push(option);
    return acc;
  }, {});

  // Ensure all category types exist
  [0, 10, 20, 30].forEach(type => {
    if (!groupedOptions[type]) {
      groupedOptions[type] = [];
    }
  });

  // Sort categories by type order: 0 (Standard), 30 (Exclusive), 20 (Monthly), 10 (Weekly)
  const categoryOrder = [0, 30, 20, 10];

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
          {t('GM_GREETING')} {shared.telegramUserData?.firstName || t('USER')}!
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
          <div className="mk-market-title">{t('MARKET')}</div>

          {!shared.userProfile?.fslId && (
            <div className="mk-fsl-connect-section" onClick={handleConnectFSLID}>
              <div className="mk-fsl-connect-content">
                <div className="mk-lock-icon">🔒</div>
                <div className="mk-fsl-text">
                  <div className="mk-connect-title">{t('CONNECT_FSL_ID')}</div>
                  <div className="mk-connect-subtitle">{t('MARKET_CONNECT_FSL')}</div>
                </div>
              </div>
            </div>
          )}
          
          <div className="mk-scrollable-market-content">
            <div className="mk-starlet-grid">
              <button 
                className={`mk-market-ticket-button ${isFreeItemClaimed ? 'sold-out' : ''}`} 
                onClick={() => 
                {
                  !isFreeItemClaimed && handleStarletPurchase(50, 0, 'FREE', 'free')
                  trackLineConversion('Free_Starlets_Click');
                }}
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
                        <div className="mk-market-ticket-label" style={{ opacity: isFreeItemClaimed ? 0.5 : 1 }}>{t('STARLETS_TEXT')}</div>
                      </div>
                      <div className="mk-market-ticket-bonus">
                        <span>X1</span>&nbsp;<span>{t('TICKETS_TEXT')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mk-market-ticket-price">
                    {isFreeItemClaimed ? t('SOLD_OUT') : t('FREE')}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Market; 
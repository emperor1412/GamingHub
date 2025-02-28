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

const Market = ({ showFSLIDScreen, setShowProfileView }) => {
  const [tickets, setTickets] = useState(0);
  const [starlets, setStarlets] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showBuyView, setShowBuyView] = useState(false);
  const [isFreeItemClaimed, setIsFreeItemClaimed] = useState(false);
  const [buyOptions, setBuyOptions] = useState([]);

  useEffect(() => {
    const fetchBuyOptions = async () => {
      try {
        const response = await fetch(`${shared.server_url}/api/app/buyOptions?token=${shared.loginData.token}`);
        const data = await response.json();
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
            const retryResponse = await fetch(`${shared.server_url}/api/app/buyOptions?token=${shared.loginData.token}`);
            const retryData = await retryResponse.json();
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

  const handleConnectFSLID = () => {
    showFSLIDScreen();
  };

  const handleStarletPurchase = (amount, stars, price, optionId = null) => {
    setSelectedPurchase({ amount, stars, optionId });
    setShowBuyView(true);
  };

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

      <div className="market-container">
        <div className="market-content">
          <div className="market-title">MARKET</div>

          {!shared.userProfile?.fslId && (
            <div className="fsl-connect-section" onClick={handleConnectFSLID}>
              <div className="fsl-connect-content">
                <div className="lock-icon">🔒</div>
                <div className="fsl-text">
                  <div className="connect-title">CONNECT YOUR FSL ID</div>
                  <div className="connect-subtitle">STEPN OR SNEAKER HOLDERS CAN CLAIM 10 FREE STARLETS DAILY</div>
                </div>
              </div>
            </div>
          )}
          
          <div className="scrollable-market-content">
            <div className="starlet-grid">
              <button 
                className={`market-ticket-button ${isFreeItemClaimed ? 'sold-out' : ''}`} 
                onClick={() => !isFreeItemClaimed && handleStarletPurchase(10, 0, 'FREE')}
                disabled={isFreeItemClaimed}
              >
                <div className="market-ticket-button-image-container">
                  <div className="market-ticket-content">
                    <div className="market-ticket-icon">
                      <img src={starlet} alt="Starlet" style={{ opacity: isFreeItemClaimed ? 0.5 : 1 }} />
                    </div>
                    <div className="market-ticket-info">
                      <div className="market-ticket-text">
                        <div className="market-ticket-amount">10</div>
                        <div className="market-ticket-label">STARLETS</div>
                      </div>
                      <div className="market-ticket-bonus">
                        <span>X10</span>&nbsp;<span>TICKETS</span>
                      </div>
                    </div>
                  </div>
                  <div className="market-ticket-price">{isFreeItemClaimed ? 'SOLD OUT' : 'FREE'}</div>
                </div>
              </button>

              {buyOptions.map((option) => (
                <button 
                  key={option.id}
                  className="market-ticket-button" 
                  onClick={() => handleStarletPurchase(option.starlet, option.stars, null, option.id)}
                >
                  <div className="market-ticket-button-image-container">
                    <div className="market-ticket-content">
                      <div className="market-ticket-icon">
                        <img src={starlet} alt="Starlet" />
                      </div>
                      <div className="market-ticket-info">
                        <div className="market-ticket-text">
                          <div className="market-ticket-amount">{option.starlet}</div>
                          <div className="market-ticket-label">STARLETS</div>
                        </div>
                        <div className="market-ticket-bonus">
                          <span>X{option.ticket}</span>&nbsp;<span>TICKETS</span>
                        </div>
                      </div>
                    </div>
                    <div className="market-ticket-price">{option.stars} TELEGRAM STARS</div>
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
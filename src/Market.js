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

const Market = ({ showFSLIDScreen, setShowProfileView }) => {
  const [tickets, setTickets] = useState(0);
  const [starlets, setStarlets] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showBuyView, setShowBuyView] = useState(false);

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

  const handleConnectFSLID = () => {
    showFSLIDScreen();
  };

  const handleStarletPurchase = (amount, stars, price) => {
    setSelectedPurchase({ amount, stars });
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
        <div className="level-badge" onClick={() => setShowProfileView(true)}>
          LV.{shared.userProfile ? shared.userProfile.level || 0 : 0}
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
              <button className="market-ticket-button" onClick={() => handleStarletPurchase(10, 0, 'FREE')}>
                <div className="market-ticket-button-image-container">
                  <div className="market-ticket-content">
                    <div className="market-ticket-icon">
                      <img src={starlet} alt="Starlet" />
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
                  <div className="market-ticket-price">FREE</div>
                </div>
              </button>

              <button className="market-ticket-button" onClick={() => handleStarletPurchase(100, 5, null)}>
                <div className="market-ticket-button-image-container">
                  <div className="market-ticket-content">
                    <div className="market-ticket-icon">
                      <img src={starlet} alt="Starlet" />
                    </div>
                    <div className="market-ticket-info">
                      <div className="market-ticket-text">
                        <div className="market-ticket-amount">100</div>
                        <div className="market-ticket-label">STARLETS</div>
                      </div>
                      <div className="market-ticket-bonus">
                        <span>X10</span>&nbsp;<span>TICKETS</span>
                      </div>
                    </div>
                  </div>
                  <div className="market-ticket-price">5 TELEGRAM STARS</div>
                </div>
              </button>

              <button className="market-ticket-button" onClick={() => handleStarletPurchase(250, 10, null)}>
                <div className="market-ticket-button-image-container">
                  <div className="market-ticket-content">
                    <div className="market-ticket-icon">
                      <img src={starlet} alt="Starlet" />
                    </div>
                    <div className="market-ticket-info">
                      <div className="market-ticket-text">
                        <div className="market-ticket-amount">250</div>
                        <div className="market-ticket-label">STARLETS</div>
                      </div>
                      <div className="market-ticket-bonus">
                        <span>X10</span>&nbsp;<span>TICKETS</span>
                      </div>
                    </div>
                  </div>
                  <div className="market-ticket-price">10 TELEGRAM STARS</div>
                </div>
              </button>

              <button className="market-ticket-button" onClick={() => handleStarletPurchase(300, 20, null)}>
                <div className="market-ticket-button-image-container">
                  <div className="market-ticket-content">
                    <div className="market-ticket-icon">
                      <img src={starlet} alt="Starlet" />
                    </div>
                    <div className="market-ticket-info">
                      <div className="market-ticket-text">
                        <div className="market-ticket-amount">300</div>
                        <div className="market-ticket-label">STARLETS</div>
                      </div>
                      <div className="market-ticket-bonus">
                        <span>X10</span>&nbsp;<span>TICKETS</span>
                      </div>
                    </div>
                  </div>
                  <div className="market-ticket-price">20 TELEGRAM STARS</div>
                </div>
              </button>

              <button className="market-ticket-button" onClick={() => handleStarletPurchase(350, 20, null)}>
                <div className="market-ticket-button-image-container">
                  <div className="market-ticket-content">
                    <div className="market-ticket-icon">
                      <img src={starlet} alt="Starlet" />
                    </div>
                    <div className="market-ticket-info">
                      <div className="market-ticket-text">
                        <div className="market-ticket-amount">350</div>
                        <div className="market-ticket-label">STARLETS</div>
                      </div>
                      <div className="market-ticket-bonus">
                        <span>X10</span>&nbsp;<span>TICKETS</span>
                      </div>
                    </div>
                  </div>
                  <div className="market-ticket-price">20 TELEGRAM STARS</div>
                </div>
              </button>

              <button className="market-ticket-button" onClick={() => handleStarletPurchase(500, 20, null)}>
                <div className="market-ticket-button-image-container">
                  <div className="market-ticket-content">
                    <div className="market-ticket-icon">
                      <img src={starlet} alt="Starlet" />
                    </div>
                    <div className="market-ticket-info">
                      <div className="market-ticket-text">
                        <div className="market-ticket-amount">500</div>
                        <div className="market-ticket-label">STARLETS</div>
                      </div>
                      <div className="market-ticket-bonus">
                        <span>X10</span>&nbsp;<span>TICKETS</span>
                      </div>
                    </div>
                  </div>
                  <div className="market-ticket-price">20 TELEGRAM STARS</div>
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
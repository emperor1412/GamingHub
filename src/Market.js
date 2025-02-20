import React, { useEffect, useState } from 'react';
import './Market.css';
import { trackUserAction } from './analytics';
import shared from './Shared';
import ticketIcon from './images/ticket.svg';
import starlet from './images/starlet.png';

const Market = ({ showFSLIDScreen, setShowProfileView }) => {
  const [tickets, setTickets] = useState(0);
  const [starlets, setStarlets] = useState(0);

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

  const handleStarletPurchase = (amount, stars, price) => {
    if (!shared.loginData?.fslId) {
      showFSLIDScreen();
      return;
    }
    // Handle purchase logic here
    trackUserAction('market_purchase_click', {
      amount: amount,
      stars: stars,
      price: price
    }, shared.loginData?.link);
  };

  return (
    <div className="market-container">
      <div className="market-top-bar">
        <div className="user-greeting">
          <button 
            className="profile-pic-main"
            onClick={() => setShowProfileView(true)}
          >
            <img 
              src={shared.avatars[shared.userProfile ? shared.userProfile.pictureIndex : 0]?.src} 
              alt="Profile" 
            />
          </button>
          <span className="greeting-text">GM! {shared.telegramUserData?.firstName}</span>
        </div>
        <div className="currency-info">
          <div className="currency-item">
            <img src={ticketIcon} alt="Tickets" />
            <span className="currency-value">{tickets}</span>
          </div>
          <div className="currency-item">
            <img src={starlet} alt="Starlets" />
            <span className="currency-value">{starlets}</span>
          </div>
        </div>
      </div>

      <div className="market-content">
        <div className="market-title">MARKET</div>

        <div className="fsl-connect-section">
          <div className="fsl-connect-content">
            <div className="lock-icon">🔒</div>
            <div className="fsl-text">
              <div className="connect-title">CONNECT YOUR FSL ID</div>
              <div className="connect-subtitle">STEPN OR SNEAKER HOLDERS CAN CLAIM 10 FREE STARLETS DAILY</div>
            </div>
          </div>
        </div>

        <div className="starlet-grid">
          <div className="starlet-item" onClick={() => handleStarletPurchase(10, 0, 'FREE')}>
            <div className="starlet-amount">10</div>
            <div className="starlet-label">STARLETS</div>
            <div className="price-tag free">FREE</div>
          </div>

          <div className="starlet-item" onClick={() => handleStarletPurchase(100, 10, null)}>
            <div className="starlet-amount">100</div>
            <div className="starlet-label">STARLETS</div>
            <div className="price-tag">10 TELEGRAM STARS</div>
          </div>

          <div className="starlet-item" onClick={() => handleStarletPurchase(250, 10, null)}>
            <div className="starlet-amount">250</div>
            <div className="starlet-label">STARLETS</div>
            <div className="price-tag">10 TELEGRAM STARS</div>
          </div>

          <div className="starlet-item" onClick={() => handleStarletPurchase(300, 20, null)}>
            <div className="starlet-amount">300</div>
            <div className="starlet-label">STARLETS</div>
            <div className="price-tag">20 TELEGRAM STARS</div>
          </div>

          <div className="starlet-item" onClick={() => handleStarletPurchase(350, 20, null)}>
            <div className="starlet-amount">350</div>
            <div className="starlet-label">STARLETS</div>
            <div className="price-tag">20 TELEGRAM STARS</div>
          </div>

          <div className="starlet-item" onClick={() => handleStarletPurchase(500, 20, null)}>
            <div className="starlet-amount">500</div>
            <div className="starlet-label">STARLETS</div>
            <div className="price-tag">20 TELEGRAM STARS</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Market; 
import React, { useState } from 'react';
import './SuccessfulPurchasePopup.css';
import starletIcon from './images/starlet.png';
import ticketIcon from './images/ticket_scratch_icon.svg';
import shared from './Shared';

const SuccessfulPurchasePopup = ({ isOpen, onClaim, amount }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState(null);

  if (!isOpen) return null;

  const verifyStarletsPurchase = async () => {
    const startTime = Date.now();
    const TIMEOUT = 30000; // 30 seconds timeout
    const INTERVAL = 2000; // Check every 2 seconds

    const initialStarlets = shared.getStarlets();
    console.log('Starting verification with initial Starlets:', initialStarlets);

    while (Date.now() - startTime < TIMEOUT) {
      try {
        // Lấy profile mới để check số Starlets hiện tại
        const profileResult = await shared.getProfileWithRetry();
        if (!profileResult.success) {
          await new Promise(resolve => setTimeout(resolve, INTERVAL));
          continue;
        }

        // Lấy số Starlets hiện tại
        const currentStarlets = shared.getStarlets();
        console.log('Checking Starlets:', {
          initialStarlets,
          currentStarlets,
          expectedAmount: amount,
          difference: currentStarlets - initialStarlets
        });

        // So sánh chênh lệch với số Starlets đã mua
        if (currentStarlets - initialStarlets === amount) {
          return true;
        }

        // Đợi một khoảng thời gian trước khi check lại
        await new Promise(resolve => setTimeout(resolve, INTERVAL));
      } catch (error) {
        console.error('Verify error:', error);
        await new Promise(resolve => setTimeout(resolve, INTERVAL));
      }
    }

    setVerifyError('Payment failed. Please contact support.');
    return false;
  };

  const handleClaim = async () => {
    setIsVerifying(true);
    setVerifyError(null);

    const isValid = await verifyStarletsPurchase();
    if (isValid) {
      onClaim();
      // Redirect to Market view
      if (shared.setActiveTab) {
        shared.setActiveTab('market');
      }
    }
    setIsVerifying(false);
  };

  return (
    <div className="sp-popup-overlay">
      <div className={`sp-popup-container ${verifyError ? 'has-error' : ''}`}>
        <div className="sp-popup-content">
          <div className="sp-popup-icon">
            <img src={starletIcon} alt="Starlet" />
          </div>
          
          <h2 className="sp-popup-title">PURCHASE</h2>
          <div className="sp-popup-subtitle">SUCCESSFUL</div>
          
          <div className="sp-received-section">
            <div className="sp-received-text">YOU RECEIVED</div>
            <div className="sp-received-items">
              <div className="sp-received-item">
                <img src={starletIcon} alt="Starlet" />
                <span>{amount}</span>
              </div>
              <div className="sp-received-item">
                <img src={ticketIcon} alt="Ticket" className="ticket-icon" />
                <span>10</span>
              </div>
            </div>
          </div>

          {verifyError && (
            <div className="sp-error-message">{verifyError}</div>
          )}

          <button 
            className="sp-claim-button" 
            onClick={handleClaim}
            disabled={isVerifying}
          >
            {isVerifying ? 'VERIFYING...' : 'CLAIM'}
          </button>
        </div>

        <div className="sp-floating-stars">
          <img src={starletIcon} alt="Star" className="sp-floating-star sp-s1" />
          <img src={starletIcon} alt="Star" className="sp-floating-star sp-s2" />
          <img src={starletIcon} alt="Star" className="sp-floating-star sp-s3" />
          <img src={starletIcon} alt="Star" className="sp-floating-star sp-s4" />
          <img src={starletIcon} alt="Star" className="sp-floating-star sp-s5" />
          <img src={starletIcon} alt="Star" className="sp-floating-star sp-s7" />
          <img src={starletIcon} alt="Star" className="sp-floating-star sp-s8" />
        </div>
      </div>
    </div>
  );
};

export default SuccessfulPurchasePopup; 
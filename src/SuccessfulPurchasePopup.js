import React, { useEffect } from 'react';
import './SuccessfulPurchasePopup.css';
import starletIcon from './images/starlet.png';
import ticketIcon from './images/ticket_scratch_icon.svg';
import shared from './Shared';

const SuccessfulPurchasePopup = ({ isOpen, onClaim, amount, setShowBuyView, tickets }) => {
  useEffect(() => {
    // Clean up payment_success when component unmounts
    return () => {
      localStorage.removeItem('payment_success');
    };
  }, []);

  if (!isOpen) return null;

  const handleClaim = async () => {
    try {
      // Close popup and trigger back button in Buy.js
      onClaim(); // Close ConfirmPurchasePopup
      setShowBuyView(false); // Trigger back button effect
    } catch (error) {
      console.error('Error during claim:', error);
      setShowBuyView(false);
    }
  };

  return (
    <div className="sp-popup-overlay">
      <div className="sp-popup-container">
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
              {tickets > 0 && tickets !== undefined && (
                <div className="sp-received-item">
                  <img src={ticketIcon} alt="Ticket" className="ticket-icon" />
                  <span>{tickets}</span>
                </div>
              )}
            </div>
          </div>

          <button 
            className="sp-claim-button" 
            onClick={handleClaim}
          >
            CLAIM
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
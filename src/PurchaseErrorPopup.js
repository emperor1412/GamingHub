import React from 'react';
import './PurchaseErrorPopup.css';
import logo from './images/confirmpurchase.png';

const PurchaseErrorPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-content">
          <div className="popup-icon">
            <img src={logo} alt="Purchase Error" />
          </div>
          <h2 className="popup-title">PURCHASE</h2>
          <div className="popup-subtitle">ERROR</div>
          
          <div className="error-details">
            <div className="error-text">
              YOU STILL HAVE AN ONGOING PREMIUM MEMBERSHIP
            </div>
          </div>

          <button className="pep_back-button" onClick={onClose}>
            BACK
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseErrorPopup;


import React from 'react';
import './ChallengeErrorPopup.css';

const ChallengeErrorPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="cep-overlay" onClick={onClose}>
      <div className="cep-popup" onClick={(e) => e.stopPropagation()}>
        {/* Error Header */}
        <div className="cep-error-header">
          <span className="cep-error-text">ERROR</span>
        </div>
        
        {/* Main Message */}
        <div className="cep-message-container">
          <div className="cep-message-group">
            <div className="cep-message-line">THIS CHALLENGE</div>
            <div className="cep-message-line">IS NOT FINISHED</div>
          </div>
          <div className="cep-message-group">
            <div className="cep-message-line">BANK MORE STEPS</div>
            <div className="cep-message-line">TO FINISH THE</div>
            <div className="cep-message-line">CHALLENGE</div>
          </div>
        </div>
        
        {/* OK Button */}
        <button className="cep-ok-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default ChallengeErrorPopup;

import React from 'react';
import './ChallengeErrorPopup.css';
import errorImage from './images/challenge_not_done.png';

const ChallengeErrorPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="cep-overlay" onClick={onClose}>
      <div className="cep-popup" onClick={(e) => e.stopPropagation()}>
        <div className="cep-message-image">
          <img src={errorImage} alt="Error" />
        </div>
        {/* Error Header */}
        <div className="cep-error-header">
          <span className="cep-error-text">CHALLENGE NOT COMPLETE</span>
        </div>
        
        {/* Main Message */}
        <div className="cep-message-container">
          <div className="cep-message-group">
            <div className="cep-message-line">YOU HAVEN'T REACHED</div>
            <div className="cep-message-line">THE GOAL.</div>
          </div>
          <div className="cep-message-group">
            <div className="cep-message-line">BANK YOUR LATEST</div>
            <div className="cep-message-line">STEPS TO UPDATE YOUR</div>
            <div className="cep-message-line">PROGRESS.</div>
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

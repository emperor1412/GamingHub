import React from 'react';
import './TreasureHuntPopup.css';
import starletIcon from './images/starlet.png';
import shared from './Shared';
import { t } from './utils/localization';

const TreasureHuntPopup = ({ isOpen, onClose, redirectUrl, onGetReward }) => {
  if (!isOpen) return null;

  const handleGetReward = () => {
    try {
      if (typeof onGetReward === 'function') {
        onGetReward();
      } else if (redirectUrl) {
        shared.openExternalLinkWithFallback(redirectUrl);
      }
    } catch (e) {
      console.error('Failed to handle Get Reward action:', e);
      if (redirectUrl) window.open(redirectUrl, '_blank');
    }
    if (onClose) onClose();
  };

  return (
    <div className="th-popup-overlay">
      <div className="th-popup-container">
        <div className="th-popup-content">
          <div className="th-popup-icon">
            <img src={starletIcon} alt="Starlet" />
          </div>

          <h2 className="th-popup-title">{t('TREASURE_HUNT')}</h2>
          <div className="th-popup-subtitle">{t('TH_COMPLETED')}</div>

          <div className="th-received-section">
            <div className="th-received-text">{t('REWARD_LINK')}</div>
          </div>

          <button
            className="th-get-reward-button"
            onClick={handleGetReward}
          >
            {t('TH_GET_REWARD')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TreasureHuntPopup;

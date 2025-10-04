import React from 'react';
import './StarletsDetailView.css';
import starletIcon from './images/starlet.png';

const StarletsDetailView = ({ 
  isOpen, 
  onClose 
}) => {
  // Only render when open
  if (!isOpen) return null;

  return (
    <>
      <div className="starlets-detail-overlay" onClick={onClose}>
        <div
          className="starlets-detail-popup"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Corner borders */}
          <div className="mk-corner mk-top-left"></div>
          <div className="mk-corner mk-top-right"></div>
          <div className="mk-corner mk-bottom-left"></div>
          <div className="mk-corner mk-bottom-right"></div>

          {/* Main content */}
          <div className="starlets-detail-body">
            {/* Star icon */}
            <div className="starlets-detail-header">
              <div className="starlets-detail-icon-container">
                <img
                  src={starletIcon}
                  alt="Starlets icon"
                  className="starlets-detail-icon"
                />
              </div>
            </div>

            {/* Content area */}
            <div className="starlets-detail-content">
              <div className="starlets-detail-title">
                STARLETS
              </div>
              
              <div className="starlets-detail-description">
                STARLETS ARE THE CORE POINTS SYSTEM INSIDE FSL GAME HUB.
              </div>

              <div className="starlets-detail-earning-section">
                <div className="starlets-detail-earning-title">
                  HOW TO EARN STARLETS
                </div>
                
                <div className="starlets-detail-earning-list">
                  <div className="starlets-detail-earning-item">
                    <span className="starlets-detail-bullet"></span>
                    <span className="starlets-detail-earning-text">DAILY CHECK-INS</span>
                  </div>
                  <div className="starlets-detail-earning-item">
                    <span className="starlets-detail-bullet"></span>
                    <span className="starlets-detail-earning-text">BANK STEPS WITH STEPN</span>
                  </div>
                  <div className="starlets-detail-earning-item">
                    <span className="starlets-detail-bullet"></span>
                    <span className="starlets-detail-earning-text">PLAYING TADOKAMI</span>
                  </div>
                  <div className="starlets-detail-earning-item">
                    <span className="starlets-detail-bullet"></span>
                    <span className="starlets-detail-earning-text">COMPLETING TASKS</span>
                  </div>
                  <div className="starlets-detail-earning-item">
                    <span className="starlets-detail-bullet"></span>
                    <span className="starlets-detail-earning-text">SCRATCHING TICKETS</span>
                  </div>
                  <div className="starlets-detail-earning-item">
                    <span className="starlets-detail-bullet"></span>
                    <span className="starlets-detail-earning-text">CLAIM IN THE MARKET</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* OKAY button */}
          <div className="starlets-detail-actions">
            <button className="starlets-detail-okay-button" onClick={onClose}>
              OKAY
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StarletsDetailView;

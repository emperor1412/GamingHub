import React from 'react';
import './ChallengeBadgeDone.css';
import backIcon from './images/back.svg';
import badge_incatrail from './images/badge_incatrail.png';
import starlet from './images/starlet.png';

const ChallengeBadgeDone = ({ 
  onClose,
  challengeData = {
    challengeTitle: "INCA TRAIL",
    badgeName: "TRAILBLAZER OF MACHU PICCHU",
    stepsCompleted: 56000,
    distance: 11,
    starletsReward: 400,
    challengeEndDate: "15/10/2025 23:59",
    description: "Your path through challenges, discoveries, and untold wonders has earned you the title of"
  }
}) => {
  return (
    <div className="cbd-container">
      {/* Background Pattern */}
      <div className="cbd-background-pattern"></div>
      
      {/* Back Button */}
      <button className="cbd-back-button" onClick={onClose}>
        <img src={backIcon} alt="Back" />
      </button>

      {/* Main Content */}
      <div className="cbd-main-content">
        {/* Congratulations Section */}
        <div className="cbd-congratulations-section">
          {/* Corner Brackets */}
          {/* <div className="cbd-corner cbd-top-left"></div>
          <div className="cbd-corner cbd-top-right"></div>
          <div className="cbd-corner cbd-bottom-left"></div>
          <div className="cbd-corner cbd-bottom-right"></div> */}
          
          <div className="cbd-title-container">
            <div className="cbd-main-title">
              <span className="cbd-title-part-1">YOU CONQUERED</span>
              <span className="cbd-title-part-2">THE LEGENDARY</span>
              <span className="cbd-title-part-3">{challengeData.challengeTitle}!</span>
            </div>
            
            <div className="cbd-description">
              {challengeData.description}
            </div>
            
            <div className="cbd-badge-title">
              {challengeData.badgeName}
            </div>
          </div>
          {/* Badge Display */}
          <div className="cbd-badge-container">
            <img 
              src={badge_incatrail} 
              alt="Challenge Badge" 
              className="cbd-badge-image"
            />
          </div>
        </div>



        {/* Stats Section */}
        <div className="cbd-stats-section">
          {/* Corner Brackets */}
          <div className="cbd-corner cbd-top-left"></div>
          <div className="cbd-corner cbd-top-right"></div>
          <div className="cbd-corner cbd-bottom-left"></div>
          <div className="cbd-corner cbd-bottom-right"></div>
          
          <div className="cbd-stats-grid">
            <div className="cbd-stat-item">
              <div className="cbd-stat-icon cbd-distance-icon">
                <span className="cbd-stat-text">KM</span>
              </div>
              <div className="cbd-stat-value">{challengeData.distance}</div>
            </div>
            
            <div className="cbd-stat-item">
              <div className="cbd-stat-icon cbd-starlets-icon">
                <img src={starlet} alt="Starlet" className="cbd-starlet-image" />
              </div>
              <div className="cbd-stat-value">{challengeData.starletsReward}</div>
            </div>
          </div>
          
          <div className="cbd-steps-completed">
            {challengeData.stepsCompleted.toLocaleString()} STEPS
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeBadgeDone;

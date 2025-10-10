import React from 'react';
import './ChallengeStatus.css';
import starletIcon from './images/starlet.png';
import backIcon from './images/back.svg';

const ChallengeStatus = ({ 
  status = 'incomplete', // 'incomplete' or 'missed'
  challengeData = {},
  onClose 
}) => {
  const isIncomplete = status === 'incomplete';
  
  const getStatusText = () => {
    return isIncomplete ? 'CHALLENGE INCOMPLETE' : 'CHALLENGE MISSED';
  };

  const getStatusDescription = () => {
    if (isIncomplete) {
      return [
        "The Inca Trail proved to be a tough one, and sadly, you didn't make it to Machu Picchu this time.",
        "The ancient paths remain unconquered, and the Incas have claimed your Starlets as tribute.",
        "But don't let this be the end of your journey! Every step counts, and there's always another challenge waiting."
      ];
    } else {
      return [
        "You didn’t join this challenge.",
        "Check out on-going challenges to prove",
        "your determination."
      ];
    }
  };

  const getCallToAction = () => {
    return "READY TO PROVE YOURSELF NEXT TIME?";
  };

  const getStepsText = () => {
    return isIncomplete ? "23,000 STEPS COMPLETED" : "15,000 STEPS COMPLETED";
  };

  return (
    <div className="challenge-status-container">
      {/* Background Pattern */}
      <div className="cs-background-pattern"></div>
      
      {/* Back Button */}
      <button className="cs-back-button" onClick={onClose}>
        <img src={backIcon} alt="Back" />
      </button>

      {/* Main Content */}
      <div className="cs-main-content">
        {/* Status Section with Corner Brackets */}
        <div className="cs-status-section">
          {/* Corner Brackets */}
          <div className="cs-corner cs-top-left"></div>
          <div className="cs-corner cs-top-right"></div>
          <div className="cs-corner cs-bottom-left"></div>
          <div className="cs-corner cs-bottom-right"></div>
          
          {/* Status Header */}
          <div className="cs-status-header">
            <div className="cs-status-text">
              <span className="cs-status-main">CHALLENGE</span>
              <span className="cs-status-sub">{isIncomplete ? 'INCOMPLETE' : 'MISSED'}</span>
            </div>
          </div>

          {/* Status Description */}
          <div className="cs-status-description">
            {getStatusDescription().map((line, index) => (
              <div key={index} className="cs-description-line">
                {line}
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="cs-call-to-action">
          <div className="cs-action-text">{getCallToAction()}</div>
        </div>

        {/* Steps Completed */}
        <div className="cs-steps-container">
          <div className="cs-steps-text">{getStepsText()}</div>
        </div>

        {/* Done Button */}
        <button className="cs-done-button" onClick={onClose}>
          DONE
        </button>
      </div>
    </div>
  );
};

export default ChallengeStatus;

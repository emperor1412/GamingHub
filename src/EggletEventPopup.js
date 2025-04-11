import React, { useEffect } from 'react';
import './EggletEventPopup.css';
import eggletLogo from './images/Egglets_Logo.png';
import scratching from './images/Egglets_Description_1.png';
import buying from './images/Egglets_Description_2.png';
import unlittyHat from './images/Egglets_Description_3.png';
import levelUp from './images/Egglets_Description_4.png';
import back from './images/back.svg';
import fslLogo from './images/FSLID_Login_Logo.png';
import mooarLogo from './images/MooAR_Login_Logo.png';

const EggletEventPopup = ({ isOpen, onClose }) => {
  // Add useEffect to control body overflow when popup is open
  useEffect(() => {
    if (isOpen) {
      // Prevent background scrolling when popup is open
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    }
    
    // Cleanup function to restore scrolling when popup is closed
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle popup content click to prevent event bubbling
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="egg_popup-overlay" onClick={onClose}>
      <button className="egg_back-button back-button-alignment" onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}>
        <img src={back} alt="Back" />
      </button>
      
      <div className="egg_popup-container" onClick={handleContentClick}>
        <div className="egg_logo-container">
          <img src={eggletLogo} alt="Egglet Event" className="egg_logo" />
        </div>
        
        <div className="egg_popup-content">
          <h2 className="egg_popup-title">EGGLET EVENT IS HERE!</h2>
          
          <div className="egg_date">17 - 27 APRIL</div>
          
          <p className="egg_description">
            EARN EVENT POINTS TO EARN EGGLETS
            FOR YOUR MOOAR ACCOUNT!
          </p>

          <div className="egg_points-section">
            <p className="egg_earn-text">EARN POINTS BY:</p>
            
            <div className="egg_methods">
              <div className="egg_method">
                <img src={scratching} alt="Scratching Tickets" />
                <span>SCRATCHING TICKETS</span>
              </div>
              <div className="egg_method">
                <img src={buying} alt="Buying Starlets" />
                <span>BUYING STARLETS</span>
              </div>
              <div className="egg_method">
                <img src={unlittyHat} alt="Unlitty Hat" />
                <span>UNLITTY MISSIONS</span>
              </div>
              <div className="egg_method">
                <img src={levelUp} alt="Leveling Up" />
                <span>LEVELING UP</span>
              </div>
            </div>
          </div>

          <div className="egg_logo-wrapper">
            <div className="egg_auth-logos">
              <img src={fslLogo} alt="FSL ID" className="egg_auth-logo" />
              <img src={mooarLogo} alt="MOOAR" className="egg_auth-logo" />
            </div>
          </div>

          <div className="egg_note">
            YOUR GAME HUB AND MOOAR ACCOUNT NEEDS
            TO BE LINKED TO YOUR FSL ID TO GET EGGLETS
          </div>

          <div className="egg_waiting-text">
            WHAT ARE YOU WAITING FOR?
          </div>
        </div>
      </div>
    </div>
  );
};

export default EggletEventPopup; 
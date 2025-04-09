import React from 'react';
import './AccountLinkPopup.css';
import eggletLogo from './images/Egglets_Logo.png';
import fslLogo from './images/FSLID_Login_Logo.png';
import mooarLogo from './images/MooAR_Login_Logo.png';
import back from './images/back.svg';

const AccountLinkPopup = ({ isOpen, onClose, linkType }) => {
  if (!isOpen) return null;

  const handleFSLLinkAccount = () => {
    // Implement FSL linking logic
    console.log('Linking FSL ID account');
    // After linking is complete:
    // onClose();
  };

  const handleMOOARLinkAccount = () => {
    // Implement MOOAR linking logic
    console.log('Linking MOOAR account');
    // After linking is complete:
    // onClose();
  };

  return (
    <div className="egglink_popup-overlay">
      <button className="egglink_back-button back-button-alignment" onClick={onClose}>
        <img src={back} alt="Back" />
      </button>
      
      <div className="egglink_popup-container">
        <div className="egglink_logo-container">
          <img src={eggletLogo} alt="Egglet Event" className="egglink_logo" />
        </div>
        
        <div className="egglink_popup-content">
          <div className="egglink_popup-header">
            <h2 className="egglink_popup-title">GAIN POINTS +</h2>
            <h2 className="egglink_popup-title egglink_subtitle">EARN EGGLETS</h2>
          </div>
          
          <div className="egglink_service-logo-container">
            <div className="egglink_service-item">
              <div className="egglink_service-logo">
                <img src={fslLogo} alt="FSL ID" />
              </div>
              <p className="egglink_service-text">
                LINK TO YOUR FSL ID TO<br />GAIN YOUR POINTS
              </p>
              <button className="egglink_link-button" onClick={handleFSLLinkAccount}>
                LINK
              </button>
            </div>
            
            <div className="egglink_service-item">
              <div className="egglink_service-logo">
                <img src={mooarLogo} alt="MOOAR" />
              </div>
              <p className="egglink_service-text">
                LINK MOOAR ACCOUNT<br />TO RECEIVE EGGLETS
              </p>
              <button className="egglink_link-button" onClick={handleMOOARLinkAccount}>
                LINK
              </button>
            </div>
          </div>
          
          <div className="egglink_footer">
            <div className="egglink_note">
              FOR A LIMITED TIME, EARN EGGLETS FOR YOUR MOOAR ACCOUNT!
            </div>

            <div className="egglink_subtext">
              ACTIVITIES INSIDE FSL GAME HUB REWARD EVENT POINTS WHICH YOU CAN USE TO CLAIM EGGLETS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountLinkPopup; 
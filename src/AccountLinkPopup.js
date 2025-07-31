import React, { useState, useEffect } from 'react';
import './AccountLinkPopup.css';
import eggletLogo from './images/Egglets_Logo.png';
import fslLogo from './images/FSLID_Login_Logo.png';
import mooarLogo from './images/MooAR_Login_Logo.png';
import loggedInLogo from './images/FSL_MooAR_Logined.png';
import back from './images/back.svg';
import shared from './Shared';
import liff from '@line/liff';
import { trackUserAction } from './analytics';

const AccountLinkPopup = ({ isOpen, onClose, linkType }) => {
  const [fslLinked, setFslLinked] = useState(false);
  const [mooarLinked, setMooarLinked] = useState(false);

  useEffect(() => {
    // Check if FSL is linked based on user profile
    if (shared.userProfile && shared.userProfile.fslId) {
      setFslLinked(true);
    }

    // Check if MOOAR is linked from shared data or fetch from API
    const checkMooarStatus = async () => {
      try {
        const response = await fetch(`${shared.server_url}/api/app/eventPointData?token=${shared.loginData.token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.code === 0 && data.data) {
            setMooarLinked(data.data.mooarFlag);
          }
        }
      } catch (error) {
        console.error('Error checking MOOAR status:', error);
      }
    };

    if (isOpen) {
      checkMooarStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFSLLinkAccount = () => {
    if (fslLinked) return; // Do nothing if already linked
    
    // Track event and show FSL ID tab
    trackUserAction('egglet_fsl_link_clicked', {}, shared.loginData?.userId);
    
    // Close popup and navigate to FSLID tab
    onClose();
    
    // Navigate to FSL ID tab using setActiveTab function that's available in shared
    if (typeof shared.setActiveTab === 'function') {
      shared.setActiveTab('fslid');
    } else {
      // Fallback if direct tab navigation isn't available
      window.location.hash = '#fslid';
    }
  };

  const handleMOOARLinkAccount = () => {
    if (mooarLinked) return; // Do nothing if already linked
    
    // Track event
    trackUserAction('egglet_mooar_link_clicked', {}, shared.loginData?.userId);
    
    // Open MOOAR login page using LIFF if available, otherwise fallback to window.open
    try {
      shared.openExternalLink('https://mooar.com/');
    } catch (e) {
      console.log('Error opening MOOAR link:', e);
      shared.openExternalLink('https://mooar.com/');
    }
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
                <img 
                  src={fslLinked ? loggedInLogo : fslLogo} 
                  alt="FSL ID" 
                  className={fslLinked ? "logged-in" : ""}
                />
              </div>
              <p className="egglink_service-text">
                LINK TO YOUR FSL ID TO<br />GAIN YOUR POINTS
              </p>
              <button 
                className="egglink_link-button" 
                onClick={handleFSLLinkAccount}
                disabled={fslLinked}
              >
                {fslLinked ? "LINKED" : "LINK"}
              </button>
            </div>
            
            <div className="egglink_service-item">
              <div className="egglink_service-logo">
                <img 
                  src={mooarLinked ? loggedInLogo : mooarLogo} 
                  alt="MOOAR" 
                  className={mooarLinked ? "logged-in" : ""}
                />
              </div>
              <p className="egglink_service-text">
                LINK MOOAR ACCOUNT<br />TO RECEIVE EGGLETS
              </p>
              <button 
                className="egglink_link-button" 
                onClick={handleMOOARLinkAccount}
                disabled={mooarLinked}
              >
                {mooarLinked ? "LINKED" : "LINK"}
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
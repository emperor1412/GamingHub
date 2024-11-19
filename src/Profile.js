import React, { useState } from 'react';
import './Profile.css';
import backIcon from './images/back.svg';
import accountIcon from './images/account.svg';
import ticketIcon from './images/ticket.svg';
import kmIcon from './images/km.svg';
import gmtIcon from './images/gmt.svg';
import arrowIcon from './images/arrow.svg';

import avatar1 from './images/avatar1.svg';
import avatar2 from './images/avatar2.svg';
import avatar3 from './images/avatar3.svg';

const Profile = ({ onClose,  user, loginData }) => {
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  
  const avatars = [
    // Add your avatar image imports here
    // Example: { id: 1, src: avatar1 }
    { id: 1, src: avatar1 },
    { id: 2, src: avatar2 },
    { id: 3, src: avatar3 }
  ];

  const profileItems = [
    { icon: accountIcon, text: 'Account Level', value: '3' },
    { icon: ticketIcon, text: 'Tickets', value: '3' },
    { icon: kmIcon, text: 'KM', value: '3' },
    { icon: gmtIcon, text: 'GMT', value: '3', showClaim: true, showArrow: true },
  ];

  return (
    <>
      <div className="profile-container">
        <div className="profile-header">
          <button className="profile-back" onClick={onClose}>
            <img src={backIcon} alt="Back" />
          </button>
          <div className="profile-user">
            <img 
              src={avatars[0]?.src} 
              alt="Avatar" 
              className="profile-avatar"
            />
            <div>
              <div className="profile-username">RUNNER</div>
              <div className="profile-id">4CH4H9W2...AaCFChF</div>
            </div>
            <button className="profile-user-arrow" onClick={() => setShowAvatarSelector(true)}>
              <img src={arrowIcon} alt="Open Avatar Selector" />
            </button>
          </div>
        </div>

        <div className="profile-content">
          {profileItems.map((item, index) => (
            <div key={index} className="profile-item">
              <div className="profile-item-left">
                <img src={item.icon} alt="" className="profile-item-icon" />
                <span className="profile-item-text">{item.text}</span>
              </div>
              <div className="profile-item-right">
                {item.showClaim && (
                  <button className="profile-claim">Claim</button>
                )}
                <span className="profile-item-value">{item.value}</span>
              </div>
              {item.showArrow && (
                <img src={arrowIcon} alt="" className="profile-item-arrow" />
              )}
            </div>
          ))}
        </div>
      </div>

      {showAvatarSelector && (
        <div className="avatar-selector">
          <h2 className="avatar-selector-header">Select Avatar</h2>
          <div className="avatar-grid">
            {avatars.map((avatar) => (
              <button 
                key={avatar.id} 
                className="avatar-option"
                onClick={() => {
                  // Handle avatar selection
                  setShowAvatarSelector(false);
                }}
              >
                <img src={avatar.src} alt="Avatar option" />
              </button>
            ))}
          </div>
          <div className="avatar-footer">
            <button className="terms-button">Terms and Conditions</button>
            <button className="privacy-button">Privacy Policy</button>
            <button 
              className="okay-button"
              onClick={() => setShowAvatarSelector(false)}
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;

import React, { useState } from 'react';
import './Profile.css';
import backIcon from './images/back.svg';
import accountIcon from './images/account.svg';
import ticketIcon from './images/ticket.svg';
import kmIcon from './images/km.svg';
import gmtIcon from './images/gmt.svg';

const Profile = ({ onClose,  user, loginData }) => {
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  
  const avatars = [
    // Add your avatar image imports here
    // Example: { id: 1, src: avatar1 }
  ];

  const profileItems = [
    { icon: accountIcon, text: 'Account Level', value: '3' },
    { icon: ticketIcon, text: 'Tickets', value: '3' },
    { icon: kmIcon, text: 'KM', value: '3' },
    { icon: gmtIcon, text: 'GMT', value: '3', showClaim: true },
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
              onClick={() => setShowAvatarSelector(true)}
            />
            <div>
              <div className="profile-username">RUNNER</div>
              <div className="profile-id">4CH4H9W2...AaCFChF</div>
            </div>
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
                <span className="profile-item-value">{item.value}</span>
                {item.showClaim && (
                  <button className="profile-claim">CLAIM</button>
                )}
              </div>
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
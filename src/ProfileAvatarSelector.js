import React from 'react';
import './ProfileAvatarSelector.css';
import backIcon from './images/back.svg';

// Import your avatar images
import avatar1 from './images/avatar1.svg';
import avatar2 from './images/avatar2.svg';
import avatar3 from './images/avatar3.svg';
import ID_selected from './images/ID_selected.svg';

const ProfileAvatarSelector = ({ onClose, onSelect, user }) => {
  const avatars = [
    { id: 1, src: avatar1 },
    { id: 2, src: avatar2 },
    { id: 3, src: avatar3 }
  ];

  return (
    <div className="avatar-selector-overlay">
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
            <div className="profile-id">
             <img src={ID_selected} alt="FSL ID" className="profile-id-icon" />
             4CH4H9W2...AaCFChF
           </div>
          </div>
        </div>
      </div>

      <div className="avatar-selector-container">
        
        <div className="avatar-grid-container">
            <div className="avatar-selector-header">
            Select Avatar
            </div>
          <div className="avatar-grid">
            {[...Array(12)].map((_, index) => (
              <button 
                key={index} 
                className="avatar-option"
                onClick={() => {
                  onSelect(avatars[index % 3]);
                }}
              >
                <img src={avatars[index % 3].src} alt={`Avatar option ${index + 1}`} />
              </button>
            ))}
          </div>
          <button className="okay-button-profile" onClick={onClose}>
            Okay
          </button>
        </div>

        <div className="avatar-footer">
          <button className="footer-button terms-button">
            Terms and Conditions
          </button>
          <button className="footer-button privacy-button">
            Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileAvatarSelector;

import React, { useState } from 'react';
import './ProfileAvatarSelector.css';
import backIcon from './images/back.svg';

// Import your avatar images
import avatar1 from './images/avatar1.svg';
import avatar2 from './images/avatar2.svg';
import avatar3 from './images/avatar3.svg';
import ID_selected from './images/ID_selected.svg';
import circle from './images/circle.svg';
import selected_avatar from './images/selected_avatar.svg';

const ProfileAvatarSelector = ({ onClose, onSelect, user, userProfile }) => {
    
    /*
    userProfile: {
        "tUserId": "5000076292",
        "tName": "Kaka Lala",
        "tUserName": "",
        "fslId": 0,
        "pictureIndex": 0,
        "link": 21201,
        "claimRecord": [
            {
                "id": 7,
                "uid": 21201,
                "type": 20010,
                "state": 1,
                "num": 4000,
                "ctime": 1731661421159,
                "ltime": 1731661420158
            },
            {
                "id": 6,
                "uid": 21201,
                "type": 30010,
                "state": 0,
                "num": 1,
                "ctime": 1731661773099,
                "ltime": 1731661773095
            },
            {
                "id": 5,
                "uid": 21201,
                "type": 40010,
                "state": 0,
                "num": 1,
                "ctime": 1731661773098,
                "ltime": 1731661773095
            },
            {
                "id": 4,
                "uid": 21201,
                "type": 30020,
                "state": 0,
                "num": 1,
                "ctime": 1731661773097,
                "ltime": 1731661773095
            },
            {
                "id": 3,
                "uid": 21201,
                "type": 30010,
                "state": 0,
                "num": 1,
                "ctime": 1731661773096,
                "ltime": 1731661773095
            },
            {
                "id": 2,
                "uid": 21201,
                "type": 30020,
                "state": 0,
                "num": 1,
                "ctime": 1731661773095,
                "ltime": 1731661773095
            },
            {
                "id": 1,
                "uid": 21201,
                "type": 20020,
                "state": 1,
                "num": 9000,
                "ctime": 1731661420158,
                "ltime": 1731661420158
            }
        ],
        "UserToken": [
            {
                "uid": 21201,
                "prop_id": 10010,
                "chain": 0,
                "num": 173,
                "lock_num": 0,
                "ableNum": 173
            },
            {
                "uid": 21201,
                "prop_id": 10020,
                "chain": 0,
                "num": 8450,
                "lock_num": 0,
                "ableNum": 8450
            },
            {
                "uid": 21201,
                "prop_id": 20010,
                "chain": 0,
                "num": 50000,
                "lock_num": 0,
                "ableNum": 50000
            },
            {
                "uid": 21201,
                "prop_id": 20020,
                "chain": 0,
                "num": 100000,
                "lock_num": 0,
                "ableNum": 100000
            }
        ]
    } */

  const avatars = [
    { id: 0, src: avatar1 },
    { id: 1, src: avatar2 },
    { id: 2, src: avatar3 }
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
                className={`avatar-option ${index === userProfile.pictureIndex ? 'selected' : ''}`}
                onClick={() => {
                  onSelect(avatars[index % 3]);
                }}
              >
                {index === userProfile.pictureIndex && (
                  <div className="avatar-selection-indicators">
                    <img src={circle} alt="Selection circle" className="selection-circle" />
                    <img src={selected_avatar} alt="Selected" className="selection-mark" />
                  </div>
                )}
                <img src={avatars[index % 3].src} alt={`Avatar option ${index + 1}`} className="avatar-option-img" />
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

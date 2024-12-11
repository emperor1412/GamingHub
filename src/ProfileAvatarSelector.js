import React, { useState, useEffect } from 'react';
import './ProfileAvatarSelector.css';
import backIcon from './images/back.svg';
import background_avatar_selection from './images/background_avatar_selection.svg';
import ID_selected from './images/ID_selected.svg';
import circle from './images/circle.svg';
import selected_avatar from './images/selected_avatar.svg';
import { popup } from '@telegram-apps/sdk';
import lock_icon from "./images/lock_trophy.png";
import shared from './Shared';

const ProfileAvatarSelector = ({ onClose, onSelect, getProfileData }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(shared.userProfile ? shared.userProfile.pictureIndex : 0);
  const [hasChanged, setHasChanged] = useState(false);


  const handleAvatarSelect = (index) => {
    if (index < 5) {
      setSelectedAvatar(index);
      setHasChanged(index !== shared.userProfile.pictureIndex);
      onSelect(shared.avatars[index % 3]);
    }
  };

  const handleOkayClick = async () => {
    if (hasChanged) {
    //   onClose();
        console.log('ChangePicture:', selectedAvatar);
        const response = await fetch(`${shared.server_url}/api/app/changePicture?token=${shared.loginData.token}&index=${selectedAvatar}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        console.log('ChangePicture Response:', response);
        const data = await response.json();

        try {
            console.log('ChangePicture Data:', data);
            await getProfileData();
            console.log('Update new userProfile:', shared.userProfile);
            setHasChanged(false);
        }
        catch (error) {
            console.error('CheckIn error:', error);
            if (data.code === 102001) {
                // login();
            }
            else {
                const promise = popup.open({
                    title: 'Error Getting Profile Data',
                    message: `Error code:${JSON.stringify(data)}`,
                    buttons: [{ id: 'my-id', type: 'default', text: 'OK' }],
                });
                const buttonId = await promise;
            }
        }
    }
  };

  return (
    <div className="avatar-selector-overlay">
      <div className="profile-header">
        <button className="profile-back" onClick={onClose}>
          <img src={backIcon} alt="Back" />
        </button>
        <div className="profile-user">
          <img 
            src={shared.avatars[shared.userProfile.pictureIndex]?.src} 
            alt="Avatar" 
            className="profile-avatar"
          />
          <div>
            <div className="profile-username">{shared.user.firstName}</div>
            <div className="profile-id">
             <img src={ID_selected} alt="FSL ID" className="profile-id-icon" />
             4CH4H9W2...AaCFChF
           </div>
          </div>
        </div>
      </div>

      <div className="avatar-selector-container">
        
        <div className="avatar-grid-container">
            <img src={background_avatar_selection} alt="Background" className="background-avatar-selection" />
            <div className="avatar-selector-header">
            Select Avatar
            </div>
          <div className="avatar-grid">
            {[...Array(12)].map((_, index) => (
              <button 
                key={index} 
                className={`avatar-option ${index === selectedAvatar ? 'selected' : ''} ${index >= 4 ? 'locked' : ''}`}
                onClick={() => handleAvatarSelect(index)}
                disabled={index >= 4}
              >
                {index === selectedAvatar && (
                  <div className="avatar-selection-indicators">
                    <img src={circle} alt="Selection circle" className="selection-circle" />
                    <img src={selected_avatar} alt="Selected" className="selection-mark" />
                  </div>
                )}
                <img src={shared.avatars[index].src} alt={`Avatar option ${index + 1}`} className="avatar-option-img" />
                {index >= 4 && (
                  <div className="lock-overlay">
                    <img src={lock_icon} alt="Locked" className="lock-icon" />
                  </div>
                )}
              </button>
            ))}
          </div>
          <button 
            className={`okay-button-profile ${!hasChanged ? 'inactive' : ''}`}
            onClick={handleOkayClick}
            disabled={!hasChanged}
          >
            Okay
          </button>
        </div>

        <div className="avatar-footer">
          <button className="footer-button">
            Terms and Conditions
          </button>
          <button className="footer-button">
            Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileAvatarSelector;

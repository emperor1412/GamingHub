import React, { useState, useEffect } from 'react';
import './ProfileAvatarSelector.css';
import './Share.css';
import backIcon from './images/back.svg';
import background_avatar_selection from './images/background_avatar_selection.svg';
import ID_selected from './images/ID_selected.svg';
import circle from './images/circle.svg';
import selected_avatar from './images/selected_avatar.svg';
import { openLink, popup } from '@telegram-apps/sdk';
import liff from '@line/liff';
import lock_icon from "./images/lock_trophy.png";
import shared from './Shared';
import unlock from './images/unlock.png';
import LevelUp from './LevelUp';
import { trackUserAction, trackOverlayView, trackOverlayExit } from './analytics';
import { t } from './utils/localization';

const ProfileAvatarSelector = ({ onClose, onSelect, getProfileData }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(shared.userProfile ? shared.userProfile.pictureIndex : 0);
  const [hasChanged, setHasChanged] = useState(false);
  const [showLockOverlay, setShowLockOverlay] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    // Track view when component mounts
    trackOverlayView('avatar_selector', shared.loginData?.link, 'profile');
    return () => {
      // Track exit when component unmounts
      trackOverlayExit('avatar_selector', shared.loginData?.link, 'profile');
    };
  }, []);

  const handleAvatarSelect = (index) => {
    console.log('Avatar selected:', index);
    setSelectedIndex(index);

    // Special handling for buyStarlets avatar (index 12)
    if (index === 12) {
      if (shared.userProfile.buyStarlets) {
        setSelectedAvatar(index);
        setHasChanged(index !== shared.userProfile.pictureIndex);
        onSelect(shared.avatars[index % 3]);
        
        // Track avatar selection
        trackUserAction('avatar_selected', {
          avatar_index: index,
          previous_avatar: shared.userProfile.pictureIndex,
          is_unlocked: true
        }, shared.loginData?.userId);
      } else {
        setShowLockOverlay(true);
        
        // Track attempt to select locked avatar
        trackUserAction('avatar_selected', {
          avatar_index: index,
          is_unlocked: false,
          requires_starlets: true
        }, shared.loginData?.userId);
      }
      return;
    }

    // Handle regular avatars
    if (index < shared.userProfile.avatarNum) {
      setSelectedAvatar(index);
      setHasChanged(index !== shared.userProfile.pictureIndex);
      onSelect(shared.avatars[index % 3]);
      
      // Track avatar selection
      trackUserAction('avatar_selected', {
        avatar_index: index,
        previous_avatar: shared.userProfile.pictureIndex,
        is_unlocked: true
      }, shared.loginData?.userId);
    } else {
      setShowLockOverlay(true);
      
      // Track attempt to select locked avatar
      trackUserAction('avatar_selected', {
        avatar_index: index,
        is_unlocked: false,
        user_level: shared.userProfile.level
      }, shared.loginData?.userId);
    }
  };

  const onCloseLevelup = async () => {
    setShowLoading(true);
    try {
      await shared.getProfileWithRetry();
    } finally {
      setShowLoading(false);
      setShowLevelUp(false);
    }
  };

  const handleOkayClick = async () => {
    if (hasChanged) {
      setShowLoading(true);
      try {
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

            // Track successful avatar change
            trackUserAction('avatar_changed', {
              new_avatar_index: selectedAvatar,
              previous_avatar_index: shared.userProfile.pictureIndex,
              success: true
            }, shared.loginData?.userId);
        }
        catch (error) {
            console.error('CheckIn error:', error);
            // Track failed avatar change
            trackUserAction('avatar_changed', {
              attempted_avatar_index: selectedAvatar,
              error_code: data.code,
              success: false
            }, shared.loginData?.userId);

            if (data.code === 102001) {
                // login();
            }
            else {
                alert('Notice\n\nAvatar selection failed');
            }
        }
      } finally {
        setShowLoading(false);
      }
    }
  };

  // Track level up attempts from avatar selector
  const handleLevelUpClick = () => {
    trackUserAction('level_up_from_avatar', {
      locked_avatar_index: selectedIndex,
      current_level: shared.userProfile.level
    }, shared.loginData?.userId);
    setShowLockOverlay(false);
    setShowLevelUp(true);
  };

  return (
    <div className="avatar-selector-overlay">
      {showLoading && (
                        <div className="loading-overlay">
                    {t('LOADING')}
                </div>
      )}
      
      {showLevelUp ? (
        <LevelUp onClose={onCloseLevelup} />
      ) : (
        <>
          <div className="profile-header">
            <button className="profile-back back-button-alignment" onClick={onClose}>
              <img src={backIcon} alt="Back" />
            </button>
            <div className="profile-user">
              <img 
                src={shared.avatars[shared.userProfile.pictureIndex]?.src} 
                alt="Avatar" 
                className="profile-avatar"
              />
              <div>
                <div className="profile-username">{shared.telegramUserData.firstName}
                <div className="level-badge">{t('LEVEL_ABBR')}.{shared.userProfile.level || 0}</div>
                </div>
                <div className="profile-id">
                {shared.userProfile.email && (
                    <>
                        <img src={ID_selected} alt="FSL ID" className="profile-id-icon" />
                        {shared.userProfile.email}
                    </>
                )}
               </div>
              </div>
            </div>
          </div>

          <div className="avatar-selector-container">
          <div className="avatar-selector-inner">
            <div className="avatar-grid-container">
                <img src={background_avatar_selection} alt="Background" className="background-avatar-selection" />
                <div className="avatar-selector-header">
                {t('SELECT_AVATAR')}
                </div>
              <div className="avatar-grid">
                {[...Array(13)].map((_, index) => (
                  <button 
                    key={index} 
                    className={`avatar-option ${index === selectedAvatar ? 'selected' : ''} ${
                      index === 12 
                        ? (!shared.userProfile.buyStarlets ? 'locked' : '')
                        : (index >= shared.userProfile.avatarNum ? 'locked' : '')
                    }`}
                    onClick={() => handleAvatarSelect(index)}
                  >
                    {index === selectedAvatar && (
                      <div className="avatar-selection-indicators">
                        <img src={circle} alt="Selection circle" className="selection-circle" />
                        <img src={selected_avatar} alt="Selected" className="selection-mark" />
                      </div>
                    )}
                    <img src={shared.avatars[index].src} alt={`Avatar option ${index + 1}`} className="avatar-option-img" />
                    {(index === 12 && !shared.userProfile.buyStarlets) || (index < 12 && index >= shared.userProfile.avatarNum) ? (
                      <div className="lock-overlay">
                        <img src={lock_icon} alt="Locked" className="lock-icon" />
                      </div>
                    ) : null}
                  </button>
                ))}
              </div>
              <button 
                className={`okay-button-profile ${!hasChanged ? 'inactive' : ''}`}
                onClick={handleOkayClick}
                disabled={!hasChanged}
              >
                {t('OKAY_BUTTON')}
              </button>
            </div>
            </div>

            <div className="avatar-footer">
              <button className="footer-button" onClick={() => {
                shared.openExternalLink("https://www.notion.so/fsl-web3/Terms-of-Use-17395c775fea803f8a29cf876e98ef0b?pvs=4");
              }}>
                {t('TERMS_AND_CONDITIONS')}
              </button>
              <button className="footer-button" onClick={() => {
                shared.openExternalLink("https://www.notion.so/fsl-web3/Privacy-Policy-17395c775fea803b8487e8c2a844de53?pvs=4");
              }}>
                {t('PRIVACY_POLICY')}
              </button>
            </div>

          </div>

          {showLockOverlay && (
            <div className="lock-overlay-container" onClick={() => setShowLockOverlay(false)}>
              <div className="lock-overlay-content" onClick={e => e.stopPropagation()}>
                <div className="avatar-preview-container">
                  <div className="avatar-preview-circle">
                    <img 
                      src={shared.avatars[selectedIndex].src} 
                      alt="Selected Avatar" 
                      className="avatar-preview-image" 
                    />
                  </div>
                </div>
                <div className="lock-overlay-header">
                  <img src={unlock} alt="Lock" className="header-lock-icon" />
                  {t('UNLOCK_THIS_PFP')}
                </div>
                <div className="lock-overlay-description">
                  {selectedIndex === 12 ? 
                    t('SECRETS_DISCOVERED') :
                    t('UNLOCK_EXCLUSIVE_PFPS')}
                </div>
                {selectedIndex !== 12 && (
                  <button className="level-up-button-pfp" onClick={handleLevelUpClick}>
                    {t('LEVEL_UP')}
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileAvatarSelector;

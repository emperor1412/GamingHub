import React, { useEffect, useState, useRef } from 'react';
import './Profile.css';
import backIcon from './images/back.svg';

import arrowIcon from './images/arrow.svg';

// import ID_normal from './images/ID_normal.svg';
import ID_selected from './images/ID_selected.svg';


import ProfileAvatarSelector from './ProfileAvatarSelector';

import { popup } from '@telegram-apps/sdk';

import shared from './Shared';

const Profile = ({ onClose, getProfileData }) => {
    const [showAvatarSelector, setShowAvatarSelector] = useState(false);
    
    useEffect(() => {
        getProfileData(shared.loginData);
    }, []);

    return (
        <div className="app-container">

            {
                showAvatarSelector ? (
                    <ProfileAvatarSelector
                        onClose={() => setShowAvatarSelector(false)}
                        onSelect={(avatar) => {
                            console.log('Selected avatar:', avatar);
                        }}
                        getProfileData={getProfileData}
                    />
                )
                    : <div className="profile-container">
                        <div className="profile-header">
                            <button className="profile-back" onClick={onClose}>
                                <img src={backIcon} alt="Back" />
                            </button>
                            <div className="profile-user">
                                <img
                                    src={shared.avatars[shared.userProfile ? shared.userProfile.pictureIndex : 0]?.src} 
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
                                <button className="profile-user-arrow" onClick={() => setShowAvatarSelector(true)}>
                                    <img src={arrowIcon} alt="Open Avatar Selector" />
                                </button>
                            </div>
                        </div>

                        <div className="profile-content-wrapper">
                            <div className="profile-content">
                                {shared.profileItems.map((item, index) => (
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
                        <div className="profile-info-box">
                            Earn extra rewards by inviting frens or by completing daily tasks. The more you engage, the more rewards you'll unlock.
                        </div>
                    </div>
            }
        </div>
    );
};

export default Profile;

import React, { useEffect, useState, useRef } from 'react';
import './Profile.css';
import backIcon from './images/back.svg';

import arrowIcon from './images/arrow.svg';

// import ID_normal from './images/ID_normal.svg';
import ID_selected from './images/ID_selected.svg';


import ProfileAvatarSelector from './ProfileAvatarSelector';

import { popup, openLink } from '@telegram-apps/sdk';

import shared from './Shared';
import FSLAuthorization from 'fsl-authorization';

const Profile = ({ onClose, getProfileData }) => {
    const [showAvatarSelector, setShowAvatarSelector] = useState(false);
    console.log('Current Window URL:', window.location.href);    
    const onClickClaim = (item) => {
        console.log('Claim:', item);

        const FSL_ID_URL = 'https://gm3.joysteps.io/login'; // 'https://id.fsl.com/login'

        // const REDIRECT_URL = 'https://t.me/TestFSL_bot/';
        const REDIRECT_URL = 'http://192.168.1.33:3000';
        // const REDIRECT_URL = window.location.href; 


        const fslAuthorization = FSLAuthorization.init({
            responseType: 'code', // 'code' or 'token'
            appKey: 'MiniGame',
            redirectUri: REDIRECT_URL, // https://xxx.xxx.com
            scope: 'basic%20wallet', // Grant Scope
            state: 'test',
            usePopup: true // Popup a window instead of jump to
        });
        fslAuthorization.signIn().then((code) => {
            if (code) {
              // Implement your code here
                console.log('FSL Login, Code:', code);
            }
        });
        
        /*
        // Construct login URL with necessary parameters
        const loginUrl = `${FSL_ID_URL}?` + new URLSearchParams({
            client_id: 'MiniGame',
            redirect_uri: REDIRECT_URL,
            response_type: 'code',
            state: 'test', // Generate random state for security verification
        })

        // Use Telegram Mini App API to open built-in browser
        // openLink(loginUrl, {
        //     tryBrowser: 'chrome',
        //     tryInstantView: true,
        // })

        // // Alternative way 1: Using window.open
        // window.open(loginUrl, '_blank');

        // Alternative way 2: Using location.href
        window.location.href = loginUrl;

        // Alternative way 3: Using an anchor element
        // const anchor = document.createElement('a');
        // anchor.href = loginUrl;
        // anchor.target = '_self';
        // anchor.click();
        */
    }

    

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
                                                <button className="profile-claim" onClick={() => onClickClaim(item)}>Claim</button>
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

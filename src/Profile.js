import React, { useEffect, useState, useRef } from 'react';
import LevelUp from './LevelUp';
import './Profile.css';
import './Share.css';
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
    const [showLevelUp, setShowLevelUp] = useState(false);

    console.log('Current Window URL:', window.location.href);    

    const onClickLevel = () => {
        console.log('Level clicked');
        setShowLevelUp(!showLevelUp);
    }
    
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
            {showLevelUp ? (
                <LevelUp onClose={() => setShowLevelUp(false)} />
            ) :
            (
                showAvatarSelector ? (
                    <ProfileAvatarSelector
                        onClose={() => setShowAvatarSelector(false)}
                        onSelect={(avatar) => {
                            console.log('Selected avatar:', avatar);
                        }}
                        getProfileData={getProfileData}
                        onLevelUp={() => {
                            setShowAvatarSelector(false);
                            setShowLevelUp(true);
                        }}
                    />
                )
                    : <div className="profile-container">
                        <div className="profile-header">
                            <button className="profile-back back-button-alignment" onClick={onClose}>
                                <img src={backIcon} alt="Back" />
                            </button>
                            <div className="profile-user" onClick={() => onClickLevel()}>
                                <img
                                    src={shared.avatars[shared.userProfile ? shared.userProfile.pictureIndex : 0]?.src} 
                                    alt="Avatar"
                                    className="profile-avatar"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowAvatarSelector(true);
                                    }}
                                />
                                <div>
                                    <div className="profile-username">
                                        {shared.user.firstName}
                                        <button className="level-badge" onClick={() => onClickLevel()}>LV.{shared.userProfile.level || 0}</button>
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
                                <img src={arrowIcon} alt="Open Avatar Selector" className="profile-user-arrow"/>
                            </div>
                        </div>

                        <div className="profile-content-wrapper">
                            <div className="profile-content">
                                {shared.profileItems.filter(item => item.type !== 10030) // Filter out items with type 10030
                                                    .map((item, index) => (
                                    <div key={index} className="profile-item">
                                        <div className="profile-item-left">
                                            <img src={item.icon} alt="" className="profile-item-icon" />
                                            <span className="profile-item-text">{item.text}</span>
                                        </div>
                                        <div className="profile-item-right">
                                            {item.showClaim && (
                                                <button className="profile-claim" onClick={() => onClickClaim(item)}>CLAIM</button>
                                            )}
                                            <span className="profile-item-value">{(item.type === 20010 || item.type === 20020) ? item.value / 100 : item.value}</span>
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
            )}
        </div>
    );
};

export default Profile;

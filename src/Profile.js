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

const Profile = ({ onClose, getProfileData, showFSLIDScreen }) => {
    const [showAvatarSelector, setShowAvatarSelector] = useState(false);
    const [showLevelUp, setShowLevelUp] = useState(false);

    console.log('Current Window URL:', window.location.href);    

    const onClickLevel = () => {
        console.log('Level clicked');
        setShowLevelUp(!showLevelUp);
    }
    
    const onClickClaim = async (item) => {
        console.log('Claim:', item);

        if(shared.userProfile.fslId === 0) {
            onClose();
            showFSLIDScreen();
        }
        else {
            // if (popup.open.isAvailable()) {
            //     const promise = popup.open({
            //         title: 'Notice',
            //         message: 'This feature is coming soon',
            //         buttons: [{ id: 'my-id', type: 'default', text: 'OK' }],
            //     });
            //     await promise;
            // }
/*
url: /app/claimAssets
Request:
	type int:
		 >0 UserToken of claim profile userData interface(gmt or sut)
		 else claimRecord of claim profile userData interface, when claimRecord state is 0
	recordId long
		type >0: Token Type
		else claimRecord.id
	amount int //UserToken Number of UserTokens
Response:
{
    "code": 0
}
*/
            const claimAsset = async (item, depth = 0) => {
                if (depth > 3) {
                    console.error('claimAssets failed after 3 attempts');
                    await shared.showPopup({
                        type: 'error',
                        message: 'Failed to claim asset after multiple attempts. Please try again later.'
                    });
                    return false;
                }

                try {
                    console.log('Claiming asset:', item);
                    let apiUrl = `${shared.server_url}/api/app/claimAssets?token=${shared.loginData.token}`;
                    
                    if (item.record.type === undefined) {
                        apiUrl += `&type=${item.record.prop_id}&amount=${item.record.num}`;
                    } else {
                        apiUrl += `&recordId=${item.record.id}&amount=1`;
                    }

                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    const data = await response.json();
                    console.log('Claim response:', data);

                    if (data.code === 0) {
                        console.log('Asset claimed successfully');
                        await getProfileData(shared.loginData);
                        await shared.showPopup({
                            type: 'success',
                            message: 'Asset claimed successfully'
                        });
                        return true;
                    } else if (data.code === 102002 || data.code === 102001) {
                        console.log('Token expired, attempting to refresh...');
                        const result = await shared.login(shared.initData);
                        if (result.success) {
                            return await claimAsset(item, depth + 1);
                        } else {
                            console.error('Login failed:', result.error);
                            return false;
                        }
                    } else {
                        console.error('Failed to claim asset:', data);
                        await shared.showPopup({
                            type: 'error',
                            message: data.msg || 'Failed to claim asset. Please try again later.'
                        });
                        return false;
                    }
                } catch (error) {
                    console.error('Error claiming asset:', error);
                    if (depth < 3) {
                        console.log(`Retrying claim attempt ${depth + 1}...`);
                        return await claimAsset(item, depth + 1);
                    } else {
                        await shared.showPopup({
                            type: 'error',
                            message: 'Failed to claim asset. Please try again later.'
                        });
                        return false;
                    }
                }
            };

            await claimAsset(item);
        }
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
                                        {item.type === 30020 && (
                                            <button className="info-button" onClick={() => window.open('https://www.notion.so/fsl-web3/MOOAR-Membership-19395c775fea80b3ab52e55972ddd555?pvs=4', '_blank')}>
                                                i
                                            </button>
                                        )}
                                        </div>
                                        <div className="profile-item-right">
                                            {item.showClaim && (
                                                <button className="profile-claim" disabled={!item.clickAble} onClick={() => onClickClaim(item)}> {item.claimText} </button>
                                            )}
                                            <span className="profile-item-value">{(item.type === 20010 || item.type === 20020) ? item.value / 100 : item.value}</span>
                                        </div>
                                        {item.showClaim && (
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

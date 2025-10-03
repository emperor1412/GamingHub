import React, { useEffect, useState, useRef } from 'react';
import LevelUp from './LevelUp';
import './Profile.css';
import './Share.css';
import backIcon from './images/back.svg';
import arrowIcon from './images/arrow.svg';
import ID_selected from './images/ID_selected.svg';
import ticketDiscountIcon from './images/ticket-discount.png';
import infoIcon from './images/Info_Icon.png';
import premiumDiamond from './images/Premium_icon.png';

import ProfileAvatarSelector from './ProfileAvatarSelector';

import { popup, openLink } from '@telegram-apps/sdk';

import shared from './Shared';
import FSLAuthorization from 'fsl-authorization';

// Import icons for navigation items
import premiumIcon from './images/Premium_icon.png';
import levelIcon from './images/account_level.png';
import earnablesIcon from './images/starlet.png';
import collectiblesIcon from './images/ticket_scratch_icon.png';
import powerupsIcon from './images/Icon_Step_Boost.png';
import trophiesIcon from './images/trophy_4_200px.png';

const maskEmail = (email) => {
    if (!email) return '';
    return `${email.substring(0, 2)}...${email.substring(email.length - 4)}`;
};

const GoldenTicketList = ({ onClose, tickets }) => {
    const getTimeRemaining = (expiredTime) => {
        const now = new Date().getTime();
        const timeLeft = expiredTime - now;
        
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
            return `Expires in ${days}d ${hours}h`;
        } else if (hours > 0) {
            return `Expires in ${hours}h ${minutes}m`;
        } else {
            return `Expires in ${minutes}m`;
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <button className="profile-back back-button-alignment" onClick={onClose}>
                    <img src={backIcon} alt="Back" />
                </button>
                <div className="profile-title">Golden Tickets</div>
            </div>
            <div className="profile-content-wrapper">
                <div className="profile-content">
                    {tickets.map((ticket, index) => (
                        <div key={index} className="profile-item">
                            <div className="profile-item-left">
                                <img src={ticketDiscountIcon} alt="" className="profile-item-icon" />
                                <div className="golden-ticket-info">
                                    <div className="profile-item-text">Discount Ticket</div>
                                    <span className="golden-ticket-expiry">
                                        {getTimeRemaining(ticket.expiredTime)}
                                    </span>
                                </div>
                            </div>
                            <div className="profile-item-right">
                                <span className={`golden-ticket-status ${ticket.state === 0 ? 'active' : 'used'}`}>
                                    {ticket.state === 0 ? 'Active' : 'Used'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="profile-info-box">
                Golden Tickets provide special discounts. Each ticket has an expiration date, make sure to use them before they expire!
            </div>
        </div>
    );
};

const Profile = ({ onClose, getProfileData, showFSLIDScreen }) => {
    const [showAvatarSelector, setShowAvatarSelector] = useState(false);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [showFullEmail, setShowFullEmail] = useState(false);
    const [showGoldenTickets, setShowGoldenTickets] = useState(false);

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
        console.log('Available avatars:', shared.avatars);
    }, []);

    // Navigation items data
    const navigationItems = [
        {
            id: 'premium',
            text: 'PREMIUM MEMBERSHIP',
            icon: premiumIcon,
            onClick: () => console.log('Premium clicked')
        },
        {
            id: 'level',
            text: 'ACCOUNT LEVEL',
            icon: levelIcon,
            onClick: () => onClickLevel()
        },
        {
            id: 'earnables',
            text: 'EARNABLES',
            icon: earnablesIcon,
            onClick: () => console.log('Earnables clicked')
        },
        {
            id: 'collectibles',
            text: 'COLLECTIBLES',
            icon: collectiblesIcon,
            onClick: () => console.log('Collectibles clicked')
        },
        {
            id: 'powerups',
            text: 'POWER-UPS',
            icon: powerupsIcon,
            onClick: () => console.log('Power-ups clicked')
        },
        {
            id: 'trophies',
            text: 'TROPHIES AND BADGES',
            icon: trophiesIcon,
            onClick: () => console.log('Trophies clicked')
        }
    ];

    return (
        <div className="app-container">
            {showLevelUp ? (
                <LevelUp onClose={() => setShowLevelUp(false)} />
            ) : showAvatarSelector ? (
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
            ) : showGoldenTickets ? (
                <GoldenTicketList 
                    onClose={() => setShowGoldenTickets(false)}
                    tickets={shared.userProfile.goldenTicketList}
                />
            ) : (
                <div className="profile-container">
                    {/* Back Button */}
                    <button className="back-button back-button-alignment" onClick={onClose}>
                        <img src={backIcon} alt="Back" />
                    </button>

                    {/* User Profile Card */}
                    <div className="user-profile-card">
                        <div className="profile-avatar-container">
                            <img
                                src={shared.avatars[shared.userProfile ? shared.userProfile.pictureIndex : 0]?.src} 
                                alt="Avatar"
                                className="profile-avatar"
                                onClick={() => setShowAvatarSelector(true)}
                            />
                            {/* Premium icon overlay */}
                            {shared.isPremiumMember && (
                                <div className="premium-icon-overlay-profile">
                                    <img src={premiumDiamond} alt="Premium" className="premium-icon-profile" />
                                </div>
                            )}
                        </div>
                        <div className="profile-info">
                            <div className="profile-username">
                                {shared.telegramUserData.firstName || 'RUNNER'}
                                {shared.loginData.link && <span className="profile-id-badge">id: {shared.loginData.link}</span>}
                            </div>
                            <div className="profile-wallet">
                                <img src={ID_selected} alt="FSL ID" className="profile-id-icon" />
                                <span className="profile-wallet-address">
                                    {shared.userProfile.email ? 
                                        (showFullEmail ? shared.userProfile.email : maskEmail(shared.userProfile.email)) :
                                        '4CfsH8Wz...AafCHfcF'
                                    }
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="navigation-list">
                        {navigationItems.map((item, index) => (
                            <div key={item.id} className="navigation-item" onClick={item.onClick}>
                                <div className="navigation-item-left">
                                    <img src={item.icon} alt={item.text} className="navigation-item-icon" />
                                    <span className="navigation-item-text">{item.text}</span>
                                </div>
                                <img src={arrowIcon} alt="Arrow" className="navigation-item-arrow" />
                            </div>
                        ))}
                    </div>

                    {/* Promotional Text Box */}
                    <div className="promotional-box">
                        EARN EXTRA REWARDS BY INVITING FRENS OR BY COMPLETING DAILY TASKS. THE MORE YOU ENGAGE, THE MORE REWARDS YOU'LL UNLOCK.
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;

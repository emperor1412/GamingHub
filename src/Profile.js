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
import bCoinIcon from './images/bCoin_icon.png';
import gmtIcon from './images/GMT_1.png';
import mooarIcon from './images/Mooar.svg';
import alphaChestIcon from './images/Chest_Icon.png';
import stepBoostIcon from './images/Boost_Icon.png';
import freezeStreakIcon from './images/streakFreezeIcon.png';
import badgesIcon from './images/Badges_Icon.png';

import ProfileAvatarSelector from './ProfileAvatarSelector';
import IntroducePremium from './IntroducePremium';
import Premium from './Premium';
import TrophiesView from './TrophiesView';
import StarletsDetailView from './StarletsDetailView';
import ProfileTokenDetailView from './ProfileTokenDetailView';

import { popup, openLink } from '@telegram-apps/sdk';

import shared from './Shared';
import FSLAuthorization from 'fsl-authorization';

// Import icons for navigation items
import premiumIcon from './images/Premium_icon.png';
import levelIcon from './images/account_level.png';
import earnablesIcon from './images/starlet.png';
import collectiblesIcon from './images/ticket_scratch_icon.png';
import powerupsIcon from './images/Icon_StepBoosts_x2.png';
import powerupsIcon2 from './images/Icon_StepBoosts_x1_5.png';
import trophiesIcon from './images/trophy_4_200px.png';

const maskEmail = (email) => {
    if (!email) return '';
    return `${email.substring(0, 6)}...${email.substring(email.length - 4)}`;
};

// Helper functions to get token quantities from user profile
const getTokenQuantity = (propId) => {
    if (!shared.userProfile || !shared.userProfile.UserToken) return 0;
    const token = shared.userProfile.UserToken.find(t => t.prop_id === propId);
    return token ? token.num : 0;
};

const getTicketQuantity = () => getTokenQuantity(10010);
const getStarletsQuantity = () => getTokenQuantity(10020);
const getBCoinQuantity = () => getTokenQuantity(10030);
const getGMTQuantity = () => getTokenQuantity(20020);
const getMooarQuantity = () => getTokenQuantity(30020);
const getAlphaChestQuantity = () => getTokenQuantity(50010);
const getFreezeStreakQuantity = () => getTokenQuantity(10110);
const getStepBoost1_5xQuantity = () => getTokenQuantity(10120);
const getStepBoost2xQuantity = () => getTokenQuantity(10121);

const EarnablesSection = ({ onBack, onShowTokenDetail, showTokenDetail, onCloseTokenDetail }) => {
    return (
        <div className="profile-container">
            {/* Back Button */}
            <button className="back-button back-button-alignment" onClick={showTokenDetail ? onCloseTokenDetail : onBack}>
                <img src={backIcon} alt="Back" />
            </button>

            {/* Header */}
            <div className="section-header">
                <img src={earnablesIcon} alt="Earnables" className="section-header-icon" />
                <h1 className="pf_section-title">EARNABLES</h1>
            </div>

            {/* Earnables List */}
            <div className="navigation-scroll-wrapper">
                <div className="navigation-list">
                    <div className="navigation-item" onClick={() => onShowTokenDetail('starlets')}>
                        <div className="navigation-item-left">
                            <img src={earnablesIcon} alt="Starlets" className="navigation-item-icon" />
                            <span className="navigation-item-text">STARLETS</span>
                        </div>
                        <span className="navigation-item-value">{getStarletsQuantity().toLocaleString()}</span>
                    </div>
                    <div className="navigation-item" onClick={() => onShowTokenDetail('bcoin')}>
                        <div className="navigation-item-left">
                            <img src={bCoinIcon} alt="B$" className="navigation-item-icon" />
                            <span className="navigation-item-text">B$</span>
                        </div>
                        <span className="navigation-item-value">{getBCoinQuantity().toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Promotional Text Box */}
            <div className="promotional-box">
                EARN STARLETS AND B$ BY: DAILY CHECK-IN: KEEP YOUR STREAK! TICKETS: TRY YOUR LUCK AND WIN MORE POINTS TASKS: ENGAGE WITH TASKS TO UNLOCK REWARDS.
            </div>
        </div>
    );
};

const CollectiblesSection = ({ onBack, onShowTokenDetail, showTokenDetail, onCloseTokenDetail, onClickClaim }) => {
    return (
        <div className="profile-container">
            {/* Back Button */}
            <button className="back-button back-button-alignment" onClick={showTokenDetail ? onCloseTokenDetail : onBack}>
                <img src={backIcon} alt="Back" />
            </button>

            {/* Header */}
            <div className="section-header">
                <img src={collectiblesIcon} alt="Collectibles" className="section-header-icon" />
                <h1 className="pf_section-title">COLLECTIBLES</h1>
            </div>

            {/* Collectibles List */}
            <div className="navigation-scroll-wrapper">
                <div className="navigation-list">
                    <div className="navigation-item" onClick={() => onShowTokenDetail('tickets')}>
                        <div className="navigation-item-left">
                            <img src={collectiblesIcon} alt="Tickets" className="navigation-item-icon" />
                            <span className="navigation-item-text">TICKETS</span>
                        </div>
                        <span className="navigation-item-value">{getTicketQuantity()}</span>
                    </div>
                    <div className="navigation-item" onClick={() => onShowTokenDetail('gmt')}>
                        <div className="navigation-item-left">
                            <img src={gmtIcon} alt="GMT" className="navigation-item-icon" />
                            <span className="navigation-item-text">GMT</span>
                        </div>
                        <div className="navigation-item-right">
                            <span className="navigation-item-value">{getGMTQuantity()}</span>
                            <button 
                                className={`pf_claim-button ${getGMTQuantity() <= 0 ? 'disabled' : ''}`}
                                disabled={getGMTQuantity() <= 0}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (getGMTQuantity() > 0) {
                                        onClickClaim({ record: { prop_id: 20020, num: getGMTQuantity() } });
                                    }
                                }}
                            >
                                CLAIM
                            </button>
                            <img src={arrowIcon} alt="Arrow" className="navigation-item-arrow" />
                        </div>
                    </div>
                    <div className="navigation-item" onClick={() => onShowTokenDetail('mooar')}>
                        <div className="navigation-item-left">
                            <img src={mooarIcon} alt="MooAR+" className="navigation-item-icon" />
                            <span className="navigation-item-text">MOOAR+</span>
                        </div>
                        <div className="navigation-item-right">
                            <span className="navigation-item-value">{getMooarQuantity()}</span>
                            <button 
                                className={`pf_claim-button ${getMooarQuantity() <= 0 ? 'disabled' : ''}`}
                                disabled={getMooarQuantity() <= 0}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (getMooarQuantity() > 0) {
                                        onClickClaim({ record: { prop_id: 30020, num: getMooarQuantity() } });
                                    }
                                }}
                            >
                                CLAIM
                            </button>
                            <img src={arrowIcon} alt="Arrow" className="navigation-item-arrow" />
                        </div>
                    </div>
                    <div className="navigation-item" onClick={() => onShowTokenDetail('alphaChest')}>
                        <div className="navigation-item-left">
                            <img src={alphaChestIcon} alt="Alpha Chests" className="navigation-item-icon" />
                            <span className="navigation-item-text">ALPHA CHESTS</span>
                        </div>
                        <span className="navigation-item-value">{getAlphaChestQuantity()}</span>
                    </div>
                </div>
            </div>

            {/* Promotional Text Box */}
            <div className="promotional-box">
                EARN EXTRA REWARDS BY INVITING FRENS OR BY COMPLETING DAILY TASKS. THE MORE YOU ENGAGE, THE MORE REWARDS YOU'LL UNLOCK.
            </div>
        </div>
    );
};

const PowerupsSection = ({ onBack, onShowTokenDetail, showTokenDetail, onCloseTokenDetail }) => {
    return (
        <div className="profile-container">
            {/* Back Button */}
            <button className="back-button back-button-alignment" onClick={showTokenDetail ? onCloseTokenDetail : onBack}>
                <img src={backIcon} alt="Back" />
            </button>

            {/* Header */}
            <div className="section-header">
                <img src={powerupsIcon2} alt="Power-ups" className="section-header-icon" />
                <h1 className="pf_section-title">POWER-UPS</h1>
            </div>

            {/* Power-ups List */}
            <div className="navigation-scroll-wrapper">
                <div className="navigation-list">
                    <div className="navigation-item" onClick={() => onShowTokenDetail('freezeStreak')}>
                        <div className="navigation-item-left">
                            <img src={freezeStreakIcon} alt="Freeze Streak" className="navigation-item-icon" />
                            <span className="navigation-item-text">FREEZE STREAK</span>
                        </div>
                        <span className="navigation-item-value">{getFreezeStreakQuantity()}</span>
                    </div>
                    <div className="navigation-item" onClick={() => onShowTokenDetail('stepBoost1_5x')}>
                        <div className="navigation-item-left">
                            <img src={stepBoostIcon} alt="1.5X Step Boost" className="navigation-item-icon" />
                            <span className="navigation-item-text">1.5X STEP BOOST</span>
                        </div>
                        <span className="navigation-item-value">{getStepBoost1_5xQuantity()}</span>
                    </div>
                    <div className="navigation-item" onClick={() => onShowTokenDetail('stepBoost2x')}>
                        <div className="navigation-item-left">
                            <img src={stepBoostIcon} alt="2X Step Boost" className="navigation-item-icon" />
                            <span className="navigation-item-text">2X STEP BOOST</span>
                        </div>
                        <span className="navigation-item-value">{getStepBoost2xQuantity()}</span>
                    </div>
                </div>
            </div>

            {/* Promotional Text Box */}
            <div className="promotional-box">
                EARN EXTRA REWARDS BY INVITING FRENS OR BY COMPLETING DAILY TASKS. THE MORE YOU ENGAGE, THE MORE REWARDS YOU'LL UNLOCK.
            </div>
        </div>
    );
};

const TrophiesSection = ({ onBack }) => {
    const [showTrophiesView, setShowTrophiesView] = useState(false);

    if (showTrophiesView) {
        return <TrophiesView onBack={() => setShowTrophiesView(false)} />;
    }

    return (
        <div className="profile-container">
            {/* Back Button */}
            <button className="back-button back-button-alignment" onClick={onBack}>
                <img src={backIcon} alt="Back" />
            </button>

            {/* Header */}
            <div className="section-header">
                <img src={trophiesIcon} alt="Trophies" className="section-header-icon" />
                <h1 className="pf_section-title">TROPHIES & BADGES</h1>
            </div>

            {/* Trophies & Badges List */}
            <div className="navigation-scroll-wrapper">
                <div className="navigation-list">
                    <div className="navigation-item" onClick={() => setShowTrophiesView(true)}>
                        <div className="navigation-item-left">
                            <img src={trophiesIcon} alt="Trophies" className="navigation-item-icon" />
                            <span className="navigation-item-text">TROPHIES</span>
                        </div>
                        <img src={arrowIcon} alt="Arrow" className="navigation-item-arrow" />
                    </div>
                    <div className="navigation-item">
                        <div className="navigation-item-left">
                            <img src={badgesIcon} alt="Badges" className="navigation-item-icon" />
                            <span className="navigation-item-text">BADGES</span>
                        </div>
                        <img src={arrowIcon} alt="Arrow" className="navigation-item-arrow" />
                    </div>
                </div>
            </div>

            {/* Promotional Text Box */}
            <div className="promotional-box">
                UNLOCK TROPHIES AND BADGES BY COMPLETING SPECIAL ACHIEVEMENTS AND MILESTONES. SHOWCASE YOUR PROGRESS AND ACCOMPLISHMENTS!
            </div>
        </div>
    );
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

const Profile = ({ onClose, getProfileData, showFSLIDScreen, onNavigateToTicket, onOpenTadokami, onNavigateToMarket }) => {
    const [showAvatarSelector, setShowAvatarSelector] = useState(false);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [showFullEmail, setShowFullEmail] = useState(false);
    const [showGoldenTickets, setShowGoldenTickets] = useState(false);
    const [currentSection, setCurrentSection] = useState('profile'); // 'profile', 'earnables', 'collectibles', 'powerups', 'trophies'
    const [showIntroducePremium, setShowIntroducePremium] = useState(false);
    const [showPremium, setShowPremium] = useState(false);
    const [isCheckingPremiumStatus, setIsCheckingPremiumStatus] = useState(true);
    const [showStarletsDetail, setShowStarletsDetail] = useState(false);
    const [showTokenDetail, setShowTokenDetail] = useState(false);
    const [currentTokenType, setCurrentTokenType] = useState('starlets');

    console.log('Current Window URL:', window.location.href);    

    // Function to check premium membership status (from MainView.js)
    const checkPremiumStatus = async () => {
        try {
            setIsCheckingPremiumStatus(true);

            if (!shared.loginData?.token) {
                console.log('No login token available for premium status check');
                return;
            }
            
            const url = `${shared.server_url}/api/app/getPremiumDetail?token=${shared.loginData.token}`;
            const response = await fetch(url);
            
            if (response.ok) {
                const data = await response.json();
                if (data.code === 0 && data.data) {
                    const premiumData = data.data;
                    const newPremiumStatus = premiumData.isMembership || false;
                    
                    shared.isPremiumMember = newPremiumStatus; // Update shared state
                    console.log('Premium status updated:', newPremiumStatus);
                    console.log('shared.isPremiumMember:', shared.isPremiumMember);
                    
                    // Auto-adjust avatar if premium status changed and avatar doesn't match
                    if (shared.userProfile && shared.userProfile.pictureIndex >= 13 && shared.userProfile.pictureIndex <= 15 && !newPremiumStatus) {
                        console.log('Premium status is false but user has premium avatar, auto-adjusting...');
                        const adjustResult = await shared.autoAdjustAvatar(getProfileData);
                        if (adjustResult.success) {
                            console.log('Avatar auto-adjusted:', adjustResult.message);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error checking premium status:', error);
        } finally {
            setIsCheckingPremiumStatus(false);
            console.log('Premium check completed, isCheckingPremiumStatus set to false');
        }
    };
    
    const onClickPremium = () => {
        console.log('onClickPremium called');
        console.log('isCheckingPremiumStatus:', isCheckingPremiumStatus);
        console.log('shared.isPremiumMember:', shared.isPremiumMember);
        
        if (isCheckingPremiumStatus) {
            console.log('Premium check in progress, returning early');
            return; // Disable khi đang loading
        }
        
        if (shared.isPremiumMember) {
            console.log('User is premium member, opening Premium page');
            setShowPremium(true); // Mở trang Premium
        } else {
            console.log('User is not premium member, opening IntroducePremium page');
            setShowIntroducePremium(true); // Mở trang IntroducePremium
        }
    };

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
        // Check premium status on component mount
        checkPremiumStatus();
    }, []);

    // Navigation items data
    const navigationItems = [
        {
            id: 'premium',
            text: 'PREMIUM MEMBERSHIP',
            icon: premiumIcon,
            onClick: () => onClickPremium()
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
            onClick: () => setCurrentSection('earnables')
        },
        {
            id: 'collectibles',
            text: 'COLLECTIBLES',
            icon: collectiblesIcon,
            onClick: () => setCurrentSection('collectibles')
        },
        {
            id: 'powerups',
            text: 'POWER-UPS',
            icon: powerupsIcon,
            onClick: () => setCurrentSection('powerups')
        },
        {
            id: 'trophies',
            text: 'TROPHIES AND BADGES',
            icon: trophiesIcon,
            onClick: () => setCurrentSection('trophies')
        }
    ];

    return (
        <div className="app-container">
            {showLevelUp ? (
                <LevelUp onClose={() => setShowLevelUp(false)} />
            ) : showGoldenTickets ? (
                <GoldenTicketList 
                    onClose={() => setShowGoldenTickets(false)}
                    tickets={shared.userProfile.goldenTicketList}
                />
            ) : currentSection === 'earnables' ? (
                <EarnablesSection 
                    onBack={() => setCurrentSection('profile')} 
                    onShowTokenDetail={(tokenType) => {
                        setCurrentTokenType(tokenType);
                        setShowTokenDetail(true);
                    }}
                    showTokenDetail={showTokenDetail}
                    onCloseTokenDetail={() => setShowTokenDetail(false)}
                />
            ) : currentSection === 'collectibles' ? (
                <CollectiblesSection 
                    onBack={() => setCurrentSection('profile')} 
                    onShowTokenDetail={(tokenType) => {
                        setCurrentTokenType(tokenType);
                        setShowTokenDetail(true);
                    }}
                    showTokenDetail={showTokenDetail}
                    onCloseTokenDetail={() => setShowTokenDetail(false)}
                    onClickClaim={onClickClaim}
                />
            ) : currentSection === 'powerups' ? (
                <PowerupsSection 
                    onBack={() => setCurrentSection('profile')} 
                    onShowTokenDetail={(tokenType) => {
                        setCurrentTokenType(tokenType);
                        setShowTokenDetail(true);
                    }}
                    showTokenDetail={showTokenDetail}
                    onCloseTokenDetail={() => setShowTokenDetail(false)}
                />
            ) : currentSection === 'trophies' ? (
                <TrophiesSection onBack={() => setCurrentSection('profile')} />
            ) : (
                <div className="profile-container">
                    {/* Back Button - Hidden when premium popup is shown */}
                    {!showPremium && (
                        <button className="back-button back-button-alignment" onClick={showAvatarSelector ? () => setShowAvatarSelector(false) : onClose}>
                            <img src={backIcon} alt="Back" />
                        </button>
                    )}

                    {/* User Profile Card */}
                    <div className="user-profile-card" onClick={() => showFSLIDScreen()}>
                        <div className="profile-avatar-container">
                            <img
                                src={shared.avatars[shared.userProfile ? shared.userProfile.pictureIndex : 0]?.src} 
                                alt="Avatar"
                                className="profile-avatar"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowAvatarSelector(true);
                                }}
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
                                    {shared.userProfile ? 
                                        (showFullEmail ? shared.userProfile.solAddr : maskEmail(shared.userProfile.solAddr)) :
                                        'Not connected'
                                    }
                                </span>
                            </div>
                        </div>
                        <img src={arrowIcon} alt="Arrow" className="profile-card-arrow" />
                    </div>

                    {/* Conditional content - Avatar Selector or Navigation */}
                    {showAvatarSelector ? (
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
                    ) : (
                        <>
                            {/* Navigation Items */}
                            <div className="navigation-scroll-wrapper">
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
                            </div>

                            {/* Promotional Text Box */}
                            <div className="promotional-box">
                                EARN EXTRA REWARDS BY INVITING FRENS OR BY COMPLETING DAILY TASKS. THE MORE YOU ENGAGE, THE MORE REWARDS YOU'LL UNLOCK.
                            </div>
                        </>
                    )}
                </div>
            )}
            
            {/* Premium Popup */}
            <Premium 
                isOpen={showPremium} 
                onClose={async () => {
                    setShowPremium(false);
                    // Refresh all data when closing premium to match Market → MainView behavior
                    await getProfileData(shared.loginData);
                    await checkPremiumStatus();
                }}
            />
            
            {/* Introduce Premium Popup */}
            <IntroducePremium 
                isOpen={showIntroducePremium} 
                onClose={() => setShowIntroducePremium(false)}
                onSelectPlan={(plan) => {
                    console.log('Selected plan:', plan);
                    setShowIntroducePremium(false);
                    // Navigate to market with starlet tab to show premium packages
                    shared.setInitialMarketTab('starlet');
                    shared.setActiveTab('market');
                }}
            />
            
            {/* Starlets Detail View */}
            <StarletsDetailView 
                isOpen={showStarletsDetail} 
                onClose={() => setShowStarletsDetail(false)}
            />
            
            {/* Profile Token Detail View */}
            <ProfileTokenDetailView 
                isOpen={showTokenDetail} 
                onClose={() => setShowTokenDetail(false)}
                tokenType={currentTokenType}
                onNavigateToTicket={onNavigateToTicket}
                onOpenTadokami={onOpenTadokami}
                onNavigateToMarket={onNavigateToMarket}
            />
        </div>
    );
};

export default Profile;

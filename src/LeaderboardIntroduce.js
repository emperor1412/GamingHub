import React, { useState, useEffect } from 'react';
import './LeaderboardIntroduce.css';
import background from './images/background_2.png';
import shared from './Shared';
import ticketIcon from './images/ticket.svg';
import premiumDiamond from './images/Premium_icon.png';
import HomeIcon_normal from './images/Home_normal.svg';
import Task_normal from './images/Task_normal.svg';
import Friends_normal from './images/Friends_normal.svg';
import Market_normal from './images/Market_normal.svg';
import ID_normal from './images/ID_normal.svg';
import calendar from './images/calendar.svg';
import calendar_before_checkin from './images/calendar_before_checkin.svg';
import starlet from './images/starlet.png';
import km from './images/km.svg';

const LeaderboardIntroduce = ({ onClose, setShowProfileView, setActiveTab, checkIn, checkInData, setShowCheckInAnimation, setIsFSLIDConnected }) => {
    const [starlets, setStarlets] = useState(0);
    const [ticket, setTicket] = useState(0);
    const [kmValue, setKmValue] = useState('24.4');
    const [showTextCheckIn, setShowTextCheckIn] = useState(false);

    // Setup profile data
    const setupProfileData = () => {
        const userStarlets = shared.userProfile?.UserToken?.find(token => token.prop_id === 10020);
        if (userStarlets) {
            setStarlets(userStarlets.num);
        }

        const userTicket = shared.userProfile?.UserToken?.find(token => token.prop_id === 10010);
        if (userTicket) {
            setTicket(userTicket.num);
        }
    };

    useEffect(() => {
        setupProfileData();
    }, []);

    const onClickCheckIn = async () => {
        if (checkIn) {
            try {
                const result = await checkIn();
                console.log('Check-in result:', result);
                if (result === 1) {
                    setShowCheckInAnimation(true);
                }
            } catch (error) {
                console.error('Check-in error:', error);
            }
        }
    };

    const handleConnectFSLID = () => {
        // Handle connect FSL ID logic
        console.log('Connect FSL ID clicked');
        // Set FSL ID as connected and show LeaderboardGlobal
        if (setIsFSLIDConnected) {
            setIsFSLIDConnected(true);
        }
    };

    return (
        <>
            <header className="stats-header">
                <div className="profile-pic-container">
                    <button 
                        className="profile-pic"
                        onClick={() => setShowProfileView(true)}
                    >
                        <img 
                            src={shared.avatars[shared.userProfile ? shared.userProfile.pictureIndex : 0]?.src} 
                            alt="Profile" 
                        />
                    </button>
                    {/* Premium icon overlay */}
                    {shared.isPremiumMember && (
                        <div className="premium-icon-overlay">
                            <img src={premiumDiamond} alt="Premium" className="premium-icon" />
                        </div>
                    )}
                </div>
                <div className="stats">
                    <button 
                        className="stat-item"
                        onClick={() => setShowProfileView(true)}
                    >
                        <img src={ticketIcon} alt="Tickets" />
                        <span className="stat-item-text">{ticket}</span>
                    </button>
                    <button 
                        className="stat-item"
                        onClick={() => setShowProfileView(true)}
                    >
                        <img src={km} alt="KM" />
                        <span className="stat-item-text">{kmValue}</span>
                    </button>
                    <div className="stat-item-main">
                        <button className="stat-button" onClick={() => onClickCheckIn()}>
                            <img src={showTextCheckIn ? calendar_before_checkin : calendar} alt="Check-in" />
                            <div className="check-in-text">
                                {showTextCheckIn ? (
                                    <>
                                        <span>CHECK-IN</span>
                                        <span>TODAY</span>
                                    </>
                                ) : (
                                    <span className='stat-item-main-text'>{checkInData != null ? checkInData.streakDay : "0"}</span>
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            <div className="leaderboard-introduce">
                {/* Background */}
                <div className="background-container">
                    <img src={background} alt="background" />
                </div>

                {/* Content */}
                <div className="leaderboard-introduce-content">
                    <div className="leaderboard-introduce-title">
                        {/* Corner borders for title */}
                        <div className="leaderboard-corner leaderboard-top-left"></div>
                        <div className="leaderboard-corner leaderboard-top-right"></div>
                        <div className="leaderboard-corner leaderboard-bottom-left"></div>
                        <div className="leaderboard-corner leaderboard-bottom-right"></div>
                        <div className="title-container">
                            <span className="title-word-crossed">STEP</span>
                            <div className="title-word">LEADERBOARD</div>
                        </div>
                    </div>

                    {/* Steps Section */}
                    <div className="steps-section">
                        {/* Step 1 */}
                        <div className="step-item">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <div className="step-title">CONNECT</div>
                                <div className="step-description">LINK YOUR FSL ID TO FSL GAME HUB AND TO STEPN</div>
                            </div>
                        </div>

                        {/* Vertical Line */}
                        <div className="step-line"></div>

                        {/* Step 2 */}
                        <div className="step-item">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <div className="step-title">CREATE</div>
                                <div className="step-description">LINK YOUR FSL ID TO FSL GAME HUB AND TO STEPN</div>
                            </div>
                        </div>

                        {/* Vertical Line */}
                        <div className="step-line"></div>

                        {/* Step 3 */}
                        <div className="step-item">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <div className="step-title">JOIN</div>
                                <div className="step-description">LINK YOUR FSL ID TO FSL GAME HUB AND TO STEPN</div>
                            </div>
                        </div>
                    </div>

                    {/* Connect Button */}
                    <div className="connect-button-container">
                        <button className="connect-button" onClick={handleConnectFSLID}>
                            CONNECT FSL ID
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom nav */}
            <nav className="fc_bottom-nav">
                <button onClick={() => {
                    if (onClose) onClose();
                    if (setActiveTab) setActiveTab('home');
                }}>
                    <img src={HomeIcon_normal} alt="Home" />
                </button>
                <button onClick={() => {
                    if (onClose) onClose();
                    if (setActiveTab) setActiveTab('tasks');
                }}>
                    <img src={Task_normal} alt="Tasks" />
                </button>
                <button onClick={() => {
                    if (onClose) onClose();
                    if (setActiveTab) setActiveTab('frens');
                }}>
                    <img src={Friends_normal} alt="Friends" />
                </button>
                <button onClick={() => {
                    if (onClose) onClose();
                    if (setActiveTab) {
                        shared.setInitialMarketTab('telegram');
                        setActiveTab('market');
                    }
                }}>
                    <img src={Market_normal} alt="Market" />
                </button>
                <button onClick={() => {
                    if (onClose) onClose();
                    if (setActiveTab) setActiveTab('fslid');
                }}>
                    <img src={ID_normal} alt="FSLID" />
                </button>
            </nav>
        </>
    );
};

export default LeaderboardIntroduce;


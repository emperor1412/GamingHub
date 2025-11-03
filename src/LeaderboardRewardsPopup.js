import React, { useState } from 'react';
import './LeaderboardRewardsPopup.css';
import shared from './Shared';
import back from './images/back.svg';
import starlet from './images/starlet.png';
import sneakerIcon from './images/stepn-sneaker-icons.png';
import bcoin from './images/bCoin_icon.png';
import spark from './images/Spark.png';

const LeaderboardRewardsPopup = ({ isOpen, onClose, userRank }) => {
    const [activeTab, setActiveTab] = useState('premium');

    if (!isOpen) return null;

    // Mock rewards data
    const premiumRewards = [
        { rank: 1, sneaker: 1, starlet: 15000, bcoin: 22500 },
        { rank: 2, sneaker: 1, starlet: 10500, bcoin: 21000 },
        { rank: 3, sneaker: 1, starlet: 9000, bcoin: 19500 },
        { rank: 4, starlet: 9000, bcoin: 18000 },
        { rank: "5-10", starlet: 7500, bcoin: 15000 },
        { rank: "11-50", starlet: 1500, bcoin: 7500 },
        { rank: "TOP 1%", bcoin: 1500 },
        { rank: "TOP 20%", bcoin: 1200 },
        { rank: "TOP 50%", bcoin: 750 },
        { rank: "UNRANKED (UR)", bcoin: 150 }
    ];

    const regularRewards = [
        { rank: 1, sneaker: 1, starlet: 10000, bcoin: 15000 },
        { rank: 2, sneaker: 1, starlet: 7000, bcoin: 14000 },
        { rank: 3, sneaker: 1, starlet: 6000, bcoin: 13000 },
        { rank: 4, starlet: 6000, bcoin: 12000 },
        { rank: "5-10", starlet: 5000, bcoin: 10000 },
        { rank: "11-50", starlet: 1000, bcoin: 5000 },
        { rank: "TOP 1%", bcoin: 1000 },
        { rank: "TOP 20%", bcoin: 800 },
        { rank: "TOP 50%", bcoin: 500 },
        { rank: "UNRANKED (UR)", bcoin: 100 }
    ];

    const currentRewards = activeTab === 'premium' ? premiumRewards : regularRewards;

    return (
        <div className="leaderboard-rewards-popup-overlay">
            <div className="leaderboard-rewards-popup">
                {/* Header */}
                <div className="leaderboard-rewards-popup-header">
                    <button className="back-button back-button-alignment" onClick={onClose}>
                        <img src={back} alt="Back" />
                    </button>
                    <div className="leaderboard-rewards-title-container">
                        <div className="leaderboard-rewards-title">
                            {/* Corner borders for title */}
                            <div className="leaderboard-rewards-corner leaderboard-rewards-top-left"></div>
                            <div className="leaderboard-rewards-corner leaderboard-rewards-top-right"></div>
                            <div className="leaderboard-rewards-corner leaderboard-rewards-bottom-left"></div>
                            <div className="leaderboard-rewards-corner leaderboard-rewards-bottom-right"></div>
                            <div className="leaderboard-rewards-title-text">REWARDS</div>
                        </div>
                        {/* Sparkle icons */}
                            <img src={spark} alt="sparkle" className="leaderboard-rewards-sparkle leaderboard-rewards-sparkle-top-right" />
                            <img src={spark} alt="sparkle" className="leaderboard-rewards-sparkle leaderboard-rewards-sparkle-bottom-left" />
                            <img src={spark} alt="sparkle" className="leaderboard-rewards-sparkle leaderboard-rewards-sparkle-bottom-right" />
                            <img src={spark} alt="sparkle" className="leaderboard-rewards-sparkle leaderboard-rewards-sparkle-top1" />
                            <img src={spark} alt="sparkle" className="leaderboard-rewards-sparkle leaderboard-rewards-sparkle-top2" />
                    </div>
                </div>

                {/* Tabs */}
                <div className="leaderboard-rewards-tabs">
                    <div className="leaderboard-rewards-tab-wrapper">
                        {/* Corner borders for PREMIUM tab */}
                        <div className="leaderboard-rewards-tab-corner leaderboard-rewards-tab-top-left"></div>
                        <div className="leaderboard-rewards-tab-corner leaderboard-rewards-tab-top-right"></div>
                        <div className="leaderboard-rewards-tab-corner leaderboard-rewards-tab-bottom-left"></div>
                        <div className="leaderboard-rewards-tab-corner leaderboard-rewards-tab-bottom-right"></div>
                        
                        <button 
                            className={`leaderboard-rewards-tab ${activeTab === 'premium' ? 'active' : ''}`}
                            onClick={() => setActiveTab('premium')}
                        >
                            PREMIUM
                            <img src={require('./images/Premium_icon.png')} alt="Premium" className="tab-icon" />
                        </button>
                    </div>
                    
                    <div className="leaderboard-rewards-tab-wrapper">
                        {/* Corner borders for REGULAR tab */}
                        <div className="leaderboard-rewards-tab-corner leaderboard-rewards-tab-top-left"></div>
                        <div className="leaderboard-rewards-tab-corner leaderboard-rewards-tab-top-right"></div>
                        <div className="leaderboard-rewards-tab-corner leaderboard-rewards-tab-bottom-left"></div>
                        <div className="leaderboard-rewards-tab-corner leaderboard-rewards-tab-bottom-right"></div>
                        
                        <button 
                            className={`leaderboard-rewards-tab ${activeTab === 'regular' ? 'active' : ''}`}
                            onClick={() => setActiveTab('regular')}
                        >
                            REGULAR
                        </button>
                    </div>
                </div>

                {/* Your Rank Section */}
                <div className="leaderboard-rewards-your-rank-section">
                    <div className="leaderboard-rewards-section-title">YOUR RANK</div>
                    <div className="leaderboard-rewards-your-rank-card">
                        <div className="leaderboard-rewards-rank-info">
                            <span className="leaderboard-rewards-rank-number">{userRank?.rank || 0}</span>
                            <div className="leaderboard-rewards-user-avatar">
                                <img 
                                    src={shared.avatars[userRank?.avatar || 0]?.src} 
                                    alt="Your Avatar" 
                                />
                            </div>
                            <span className="leaderboard-rewards-username">{userRank?.username || "PLAYER"}</span>
                        </div>
                        <div className="leaderboard-rewards-steps-info">
                            <span className="leaderboard-rewards-steps-count">{userRank?.steps?.toLocaleString() || "0"}</span>
                            <span className="leaderboard-rewards-steps-label">STEPS</span>
                        </div>
                    </div>
                </div>

                {/* Ranks List */}
                <div className="leaderboard-rewards-ranks-section">
                    <div className="leaderboard-rewards-ranks-list">
                        <div className="leaderboard-rewards-section-title">RANKS</div>
                        {currentRewards.map((reward, index) => (
                            <div key={index} className="leaderboard-rewards-rank-reward-item">
                                <div className="leaderboard-rewards-rank-label">{reward.rank}</div>
                                <div className="leaderboard-rewards-reward-icons">
                                    {reward.sneaker && (
                                        <div className="leaderboard-rewards-reward-item sneaker">
                                            <img src={sneakerIcon} alt="Sneaker" className="leaderboard-rewards-reward-icon" />
                                            <span className="leaderboard-rewards-reward-amount">{reward.sneaker}</span>
                                        </div>
                                    )}
                                    {reward.starlet && (
                                        <div className="leaderboard-rewards-reward-item starlet">
                                            <img src={starlet} alt="Starlet" className="leaderboard-rewards-reward-icon" />
                                            <span className="leaderboard-rewards-reward-amount">{reward.starlet}</span>
                                        </div>
                                    )}
                                    {reward.bcoin && (
                                        <div className="leaderboard-rewards-reward-item bcoin">
                                            <img src={bcoin} alt="BCoin" className="leaderboard-rewards-reward-icon" />
                                            <span className="leaderboard-rewards-reward-amount">{reward.bcoin}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardRewardsPopup;

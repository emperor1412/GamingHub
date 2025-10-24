import React, { useState } from 'react';
import './LeaderboardRewardsPopup.css';
import shared from './Shared';
import back from './images/back.svg';
import starlet from './images/starlet.png';
import km from './images/km.svg';
import bcoin from './images/bCoin_icon.png';

const LeaderboardRewardsPopup = ({ isOpen, onClose, userRank }) => {
    const [activeTab, setActiveTab] = useState('premium');

    if (!isOpen) return null;

    // Mock rewards data
    const premiumRewards = [
        { rank: 1, drink: 1, star: 15000, gallery: 22500 },
        { rank: 2, drink: 1, star: 10500, gallery: 21000 },
        { rank: 3, drink: 1, star: 9000, gallery: 19500 },
        { rank: 4, star: 9000, gallery: 18000 },
        { rank: "5-10", star: 7500, gallery: 15000 },
        { rank: "11-50", star: 1500, gallery: 7500 },
        { rank: "TOP 1%", gallery: 1500 },
        { rank: "TOP 20%", gallery: 1200 },
        { rank: "TOP 50%", gallery: 750 },
        { rank: "UNRANKED (UR)", gallery: 150 }
    ];

    const regularRewards = [
        { rank: 1, star: 10000, gallery: 15000 },
        { rank: 2, star: 7000, gallery: 14000 },
        { rank: 3, star: 6000, gallery: 13000 },
        { rank: 4, star: 6000, gallery: 12000 },
        { rank: "5-10", star: 5000, gallery: 10000 },
        { rank: "11-50", star: 1000, gallery: 5000 },
        { rank: "TOP 1%", gallery: 1000 },
        { rank: "TOP 20%", gallery: 800 },
        { rank: "TOP 50%", gallery: 500 },
        { rank: "UNRANKED (UR)", gallery: 100 }
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
                                    {reward.drink && (
                                        <div className="leaderboard-rewards-reward-item drink">
                                            <img src={km} alt="Drink" className="leaderboard-rewards-reward-icon" />
                                            <span className="leaderboard-rewards-reward-amount">{reward.drink}</span>
                                        </div>
                                    )}
                                    {reward.star && (
                                        <div className="leaderboard-rewards-reward-item star">
                                            <img src={starlet} alt="Star" className="leaderboard-rewards-reward-icon" />
                                            <span className="leaderboard-rewards-reward-amount">{reward.star}</span>
                                        </div>
                                    )}
                                    {reward.gallery && (
                                        <div className="leaderboard-rewards-reward-item gallery">
                                            <img src={bcoin} alt="Gallery" className="leaderboard-rewards-reward-icon" />
                                            <span className="leaderboard-rewards-reward-amount">{reward.gallery}</span>
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

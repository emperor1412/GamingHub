import React, { useState, useEffect } from 'react';
import './LeaderboardGlobal.css';
import background from './images/background_2.png';
import shared from './Shared';
import spark from './images/Spark.png';
import RewardsPopup from './LeaderboardRewardsPopup';
import starlet from './images/starlet.png';
import premiumDiamond from './images/Premium_icon.png';
import sneakerIcon from './images/shoe_image.png';
import bCoin from './images/bCoin_icon.png';

const LeaderboardGlobal = ({ onClose, setShowProfileView, setActiveTab, checkIn, checkInData, setShowCheckInAnimation, isOpen = true, isFromProfile = false }) => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [userRank, setUserRank] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showRewardsPopup, setShowRewardsPopup] = useState(false);
    const [isSeasonEnded, setIsSeasonEnded] = useState(false); // Biến để kiểm tra season đã kết thúc

    // Mock data for now - replace with actual API call
    const mockLeaderboardData = [
        { rank: 1, username: "FIRULAIS", steps: 10000, avatar: 0, isPremium: true, rewards: [{ icon: sneakerIcon, amount: "1" }, { icon: starlet, amount: "15k" }, { icon: bCoin, amount: "7k" }] },
        { rank: 2, username: "FIRULAIS 2", steps: 2200, avatar: 1, isPremium: true, rewards: [{ icon: sneakerIcon, amount: "1" }, { icon: starlet, amount: "15k" }, { icon: bCoin, amount: "7k" }] },
        { rank: 3, username: "FIRULAIS 3", steps: 2200, avatar: 2, isPremium: false, rewards: [{ icon: sneakerIcon, amount: "1" }, { icon: starlet, amount: "15k" }, { icon: bCoin, amount: "7k" }] },
        { rank: 4, username: "FIRELAUNCHER", steps: 1203, avatar: 3, isPremium: false, rewards: [{ icon: starlet, amount: "15k" }, { icon: bCoin, amount: "7k" }] },
        { rank: 5, username: "LOUROTRAIL", steps: 1203, avatar: 4, isPremium: true, rewards: [{ icon: starlet, amount: "15k" }, { icon: bCoin, amount: "7k" }] },
        { rank: 6, username: "LUCAS_STEPN", steps: 1203, avatar: 5, isPremium: true, rewards: [{ icon: starlet, amount: "15k" }, { icon: bCoin, amount: "7k" }] },
        { rank: 7, username: "MISHAFYI", steps: 1203, avatar: 6, isPremium: false, rewards: [{ icon: starlet, amount: "15k" }, { icon: bCoin, amount: "7k" }] },
        { rank: 8, username: "PLAYER8", steps: 1203, avatar: 7, isPremium: true, rewards: [{ icon: starlet, amount: "15k" }, { icon: bCoin, amount: "7k" }] },
        { rank: 9, username: "PLAYER9", steps: 1203, avatar: 8, isPremium: false, rewards: [{ icon: starlet, amount: "15k" }, { icon: bCoin, amount: "7k" }] },
        { rank: 10, username: "PLAYER10", steps: 1203, avatar: 9, isPremium: true, rewards: [{ icon: starlet, amount: "15k" }, { icon: bCoin, amount: "7k" }] }
    ];

    const mockUserRank = {
        rank: 24,
        username: "FIRULAIS24",
        steps: 1203,
        avatar: 0,
        rewards: [
            { icon: starlet, amount: "15k" },
            { icon: bCoin, amount: "7k" }
        ]
    };

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setLeaderboardData(mockLeaderboardData);
            setUserRank(mockUserRank);
            setLoading(false);
        }, 1000);
    }, []);

    const formatSteps = (steps) => {
        return steps.toLocaleString();
    };

    if (!isOpen) return null;

    if (loading) {
        return (
            <div className={`leaderboard-popup-overlay ${isFromProfile ? 'fullscreen' : 'mainview'}`}>
                <div className="leaderboard-popup-container">
                    <div className="leaderboard-global">
                        <div className="background-container">
                            <img src={background} alt="background" />
                        </div>
                        <div className="loading-container">
                            <div className="loading-text">Loading...</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={`leaderboard-popup-overlay ${isFromProfile ? 'fullscreen' : 'mainview'}`}>
                <div className="leaderboard-popup-container">
                    <div className="leaderboard-global">
                        {/* Background */}
                        <div className="background-container">
                            <img src={background} alt="background" />
                        </div>

                        {/* Content */}
                        <div className="leaderboard-content">
                            <div className="leaderboard-global-title">
                                {/* Corner borders for title */}
                                <div className="leaderboard-corner leaderboard-top-left"></div>
                                <div className="leaderboard-corner leaderboard-top-right"></div>
                                <div className="leaderboard-corner leaderboard-bottom-left"></div>
                                <div className="leaderboard-corner leaderboard-bottom-right"></div>
                                {isSeasonEnded ? (
                                    <>
                                        <div className="title-word">SEASON</div>
                                        <div className="title-word ended-word">ENDED</div>
                                    </>
                                ) : (
                                    <>
                                        <div className="title-word">STEP</div>
                                        <div className="title-word">LEADERBOARD</div>
                                    </>
                                )}
                            </div>

                            {/* Your Rank - chỉ hiển thị khi season ended */}
                            {isSeasonEnded && (
                                <>
                            <div className="next-season-content">
                                <div className="next-season-text">
                                    NEXT SEASON BEGINS IN:
                                </div>
                                <div className="next-season-date">
                                    12/30/25 00:00 UTC
                                </div>
                            </div>
                            <div className="your-rank-section your-rank-section-ended">
                                <div className="section-title">YOUR RANK</div>
                                <div className="your-rank-card your-rank-card-ended">
                                    <div className="rank-info">
                                        <span className="rank-number">{userRank?.rank || 0}</span>
                                        <div className="user-avatar">
                                            <img 
                                                src={shared.avatars[userRank?.avatar || 0]?.src} 
                                                alt="Your Avatar" 
                                            />
                                            {/* Premium icon overlay */}
                                            {isSeasonEnded && shared.isPremiumMember && (
                                                <div className="premium-icon-overlay-your-rank">
                                                    <img src={premiumDiamond} alt="Premium" className="premium-icon-your-rank" />
                                                </div>
                                            )}
                                        </div>
                                        <span className="username">{userRank?.username || "PLAYER"}</span>
                                        {/* Reward items for season ended */}
                                        {userRank?.rewards && userRank.rewards.length > 0 && (
                                            <div className="reward-row-bottom-container">
                                                {userRank.rewards.map((reward, index) => (
                                                    <div key={index} className="reward-row reward-row-bottom">
                                                        <div className="reward-icon">
                                                            <img src={reward.icon} alt="Reward" />
                                                        </div>
                                                        {reward.amount && <span className="reward-text">{reward.amount}</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="steps-info">
                                        <span className="steps-count">{formatSteps(userRank?.steps || 0)}</span>
                                        <span className="steps-label">STEPS</span>
                                    </div>
                                </div>
                            </div>
                                </>
                            )}

                            {/* Top 3 Podium */}
                            <div className="podium-section">
                        <div className="podium-container">
                            {/* Rank 2 */}
                            <div className="podium-item rank-2">
                                <div className="rank-badge">2</div>
                                <div className="podium-avatar">
                                    <img 
                                        src={shared.avatars[leaderboardData[1]?.avatar || 0]?.src} 
                                        alt="Rank 2" 
                                    />
                                    {/* Premium icon overlay */}
                                    {isSeasonEnded && leaderboardData[1]?.isPremium && (
                                        <div className="premium-icon-overlay-podium">
                                            <img src={premiumDiamond} alt="Premium" className="premium-icon-podium" />
                                        </div>
                                    )}
                                </div>
                                <div className="podium-info">
                                    <div className="podium-username">{leaderboardData[1]?.username || "PLAYER"}</div>
                                    <div className="podium-steps">{formatSteps(leaderboardData[1]?.steps || 0)} STEPS</div>
                                </div>
                            </div>

                            {/* Rank 1 */}
                            <div className="podium-item rank-1">
                                <div className="rank-badge">1</div>
                                <div className="podium-avatar">
                                    <img 
                                        src={shared.avatars[leaderboardData[0]?.avatar || 0]?.src} 
                                        alt="Rank 1" 
                                    />
                                    {/* Premium icon overlay */}
                                    {isSeasonEnded && leaderboardData[0]?.isPremium && (
                                        <div className="premium-icon-overlay-podium">
                                            <img src={premiumDiamond} alt="Premium" className="premium-icon-podium" />
                                        </div>
                                    )}
                                </div>
                                <div className="podium-info">
                                    <div className="podium-username">{leaderboardData[0]?.username || "PLAYER"}</div>
                                    <div className="podium-steps">{formatSteps(leaderboardData[0]?.steps || 0)} STEPS</div>
                                </div>
                            </div>

                            {/* Rank 3 */}
                            <div className="podium-item rank-3">
                                <div className="rank-badge">3</div>
                                <div className="podium-avatar">
                                    <img 
                                        src={shared.avatars[leaderboardData[2]?.avatar || 0]?.src} 
                                        alt="Rank 3" 
                                    />
                                    {/* Premium icon overlay */}
                                    {isSeasonEnded && leaderboardData[2]?.isPremium && (
                                        <div className="premium-icon-overlay-podium">
                                            <img src={premiumDiamond} alt="Premium" className="premium-icon-podium" />
                                        </div>
                                    )}
                                </div>
                                <div className="podium-info">
                                    <div className="podium-username">{leaderboardData[2]?.username || "PLAYER"}</div>
                                    <div className="podium-steps">{formatSteps(leaderboardData[2]?.steps || 0)} STEPS</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                        {isSeasonEnded ? (
                            <>
                            {/* Season Ended Content - chia thành 3 phần match với top 3 */}
                            <div className="season-ended-content">
                                {leaderboardData.slice(0, 3).map((player, index) => {
                                    // Tìm sneaker reward (reward đầu tiên có sneakerIcon)
                                    const sneakerReward = player.rewards?.find(r => r.icon === sneakerIcon);
                                    // Các rewards còn lại (không phải sneaker)
                                    const otherRewards = player.rewards?.filter(r => r.icon !== sneakerIcon) || [];
                                    
                                    return (
                                        <div key={player.rank || index} className="season-ended-item">
                                            {sneakerReward && (
                                                <div className="reward-row reward-row-top">
                                                    <div className="reward-icon sneaker-icon">
                                                        <img src={sneakerReward.icon} alt="Sneaker" />
                                                    </div>
                                                    {sneakerReward.amount && <span className="reward-text">{sneakerReward.amount}</span>}
                                                </div>
                                            )}
                                            {otherRewards.length > 0 && (
                                                <div className="reward-row-bottom-container">
                                                    {otherRewards.map((reward, rewardIndex) => (
                                                        <div key={rewardIndex} className="reward-row reward-row-bottom">
                                                            <div className="reward-icon">
                                                                <img src={reward.icon} alt="Reward" />
                                                            </div>
                                                            {reward.amount && <span className="reward-text">{reward.amount}</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            </>
                        ) : (
                            <>
                                <button className="rewards-button" onClick={() => setShowRewardsPopup(true)}>
                                    {/* Sparkle icons */}
                                    <img src={spark} alt="sparkle" className="sparkle sparkle-top-left" />
                                    <img src={spark} alt="sparkle" className="sparkle sparkle-top-right" />
                                    <img src={spark} alt="sparkle" className="sparkle sparkle-bottom-left" />
                                    <img src={spark} alt="sparkle" className="sparkle sparkle-bottom-right" />
                                    <img src={spark} alt="sparkle" className="sparkle sparkle-top1" />
                                    <img src={spark} alt="sparkle" className="sparkle sparkle-top2" />
                                    <span>VIEW RANK</span>
                                    <span>REWARDS</span>
                                </button>
                                <button className="season-button" onClick={() => setIsSeasonEnded(true)}>
                                    <span>SEASON ENDS IN: 09/30/25 00:00 UTC</span>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Your Rank - chỉ hiển thị khi season chưa ended */}
                    {!isSeasonEnded && (
                        <div className="your-rank-section">
                            <div className="section-title">YOUR RANK</div>
                            <div className="your-rank-card">
                                <div className="rank-info">
                                    <span className="rank-number">{userRank?.rank || 0}</span>
                                    <div className="user-avatar">
                                        <img 
                                            src={shared.avatars[userRank?.avatar || 0]?.src} 
                                            alt="Your Avatar" 
                                        />
                                        {/* Premium icon overlay */}
                                        {isSeasonEnded && shared.isPremiumMember && (
                                            <div className="premium-icon-overlay">
                                                <img src={premiumDiamond} alt="Premium" className="premium-icon" />
                                            </div>
                                        )}
                                    </div>
                                    <span className="username">{userRank?.username || "PLAYER"}</span>
                                </div>
                                <div className="steps-info">
                                    <span className="steps-count">{formatSteps(userRank?.steps || 0)}</span>
                                    <span className="steps-label">STEPS</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Top 10 List */}
                    <div className="top-10-section">
                        <div className="section-title">TOP 10</div>
                        <div className="leaderboard-list">
                            {leaderboardData.slice(3).map((player, index) => (
                                <div key={player.rank} className="leaderboard-item">
                                    <div className="item-rank">{player.rank}</div>
                                    {/* <div className="item-avatar">
                                        <img 
                                            src={shared.avatars[player.avatar]?.src} 
                                            alt="Avatar" 
                                        />
                                    </div> */}
                                    <div className="item-username-wrapper">
                                        <div className="item-username">{player.username}</div>
                                        {/* Premium icon overlay */}
                                        {isSeasonEnded && player?.isPremium && (
                                            <div className="premium-icon-overlay-top10">
                                                <img src={premiumDiamond} alt="Premium" className="premium-icon-top10" />
                                            </div>
                                        )}
                                    </div>
                                    {/* Rewards - chỉ hiển thị khi season ended */}
                                    {isSeasonEnded && player?.rewards && player.rewards.length > 0 && (
                                        <div className="reward-row-bottom-container">
                                            {player.rewards.map((reward, rewardIndex) => (
                                                <div key={rewardIndex} className="reward-row reward-row-bottom">
                                                    <div className="reward-icon">
                                                        <img src={reward.icon} alt="Reward" />
                                                    </div>
                                                    {reward.amount && <span className="reward-text">{reward.amount}</span>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="item-steps-info">
                                        <span className="item-steps-count">{formatSteps(player.steps)}</span>
                                        <span className="item-steps-label">STEPS</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                </div>
                </div>
            </div>

            {/* Rewards Popup */}
            <RewardsPopup 
                isOpen={showRewardsPopup}
                onClose={() => setShowRewardsPopup(false)}
                userRank={userRank}
            />
        </>
    );
};

export default LeaderboardGlobal;
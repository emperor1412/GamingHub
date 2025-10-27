import React, { useState, useEffect } from 'react';
import './LeaderboardGlobal.css';
import background from './images/background_2.png';
import shared from './Shared';
import ticketIcon from './images/ticket.svg';
import premiumDiamond from './images/Premium_icon.png';
import HomeIcon_normal from './images/Home_normal.svg';
import Task_normal from './images/Task_normal.svg';
import Friends_normal from './images/Friends_normal.svg';
import Market_normal from './images/Market_normal.svg';
import ID_normal from './images/ID_normal.svg';
import spark from './images/Spark.png';
import calendar from './images/calendar.svg';
import calendar_before_checkin from './images/calendar_before_checkin.svg';
import RewardsPopup from './LeaderboardRewardsPopup';
import starlet from './images/starlet.png';
import km from './images/km.svg';
import bcoin from './images/bCoin_icon.png';

const LeaderboardGlobal = ({ onClose, setShowProfileView, setActiveTab, checkIn, checkInData, setShowCheckInAnimation }) => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [userRank, setUserRank] = useState(null);
    const [loading, setLoading] = useState(true);
    const [starlets, setStarlets] = useState(0);
    const [ticket, setTicket] = useState(0);
    const [showTextCheckIn, setShowTextCheckIn] = useState(false);
    const [showRewardsPopup, setShowRewardsPopup] = useState(false);
    const [isSeasonEnded, setIsSeasonEnded] = useState(true); // Biến để kiểm tra season đã kết thúc

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

    // Mock data for now - replace with actual API call
    const mockLeaderboardData = [
        { rank: 1, username: "FIRULAIS", steps: 10000, avatar: 0, rewards: [{ icon: starlet, amount: "15k" }, { icon: starlet, amount: "7K" }] },
        { rank: 2, username: "FIRULAIS 2", steps: 2200, avatar: 1, rewards: [{ icon: starlet, amount: "15k" }, { icon: starlet, amount: "7K" }] },
        { rank: 3, username: "FIRULAIS 3", steps: 2200, avatar: 2, rewards: [{ icon: starlet, amount: "15k" }, { icon: starlet, amount: "7K" }] },
        { rank: 4, username: "FIRELAUNCHER", steps: 1203, avatar: 3, rewards: [{ icon: starlet, amount: "15k" }, { icon: starlet, amount: "7K" }] },
        { rank: 5, username: "LOUROTRAIL", steps: 1203, avatar: 4, rewards: [{ icon: starlet, amount: "15k" }, { icon: starlet, amount: "7K" }] },
        { rank: 6, username: "LUCAS_STEPN", steps: 1203, avatar: 5, rewards: [{ icon: starlet, amount: "15k" }, { icon: starlet, amount: "7K" }] },
        { rank: 7, username: "MISHAFYI", steps: 1203, avatar: 6, rewards: [{ icon: starlet, amount: "15k" }, { icon: starlet, amount: "7K" }] },
        { rank: 8, username: "PLAYER8", steps: 1203, avatar: 7, rewards: [{ icon: starlet, amount: "15k" }, { icon: starlet, amount: "7K" }] },
        { rank: 9, username: "PLAYER9", steps: 1203, avatar: 8, rewards: [{ icon: starlet, amount: "15k" }, { icon: starlet, amount: "7K" }] },
        { rank: 10, username: "PLAYER10", steps: 1203, avatar: 9, rewards: [{ icon: starlet, amount: "15k" }, { icon: starlet, amount: "7K" }] }
    ];

    const mockUserRank = {
        rank: 24,
        username: "FIRULAIS24",
        steps: 1203,
        avatar: 0,
        rewards: [
            { icon: starlet, amount: "15k" },
            { icon: starlet, amount: "7K" }
        ]
    };

    useEffect(() => {
        setupProfileData();
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

    const getRankBorderColor = (rank) => {
        switch (rank) {
            case 1: return '#FFD700'; // Gold
            case 2: return '#C0C0C0'; // Silver
            case 3: return '#CD7F32'; // Bronze
            default: return '#464646';
        }
    };

    const getRankBackgroundGradient = (rank) => {
        switch (rank) {
            case 1: return 'linear-gradient(135deg, #FFD700, #FFA500)';
            case 2: return 'linear-gradient(135deg, #C0C0C0, #A0A0A0)';
            case 3: return 'linear-gradient(135deg, #CD7F32, #B8860B)';
            default: return 'linear-gradient(135deg, #464646, #2A2A2A)';
        }
    };

    if (loading) {
        return (
            <div className="leaderboard-global">
                <div className="background-container">
                    <img src={background} alt="background" />
                </div>
                <div className="loading-container">
                    <div className="loading-text">Loading...</div>
                </div>
            </div>
        );
    }

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
                        <img src={starlet} alt="Starlets" />
                        <span className="stat-item-text">{starlets}</span>
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
                            <div className="title-word">SEASON ENDED</div>
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
                                                    <span className="reward-text">{reward.amount}</span>
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
                                <div className="season-ended-item">
                                    <div className="reward-row reward-row-top">
                                        <div className="reward-icon">
                                            <img src={starlet} alt="Star" />
                                        </div>
                                        <span className="reward-text">7</span>
                                    </div>
                                    <div className="reward-row-bottom-container">
                                        <div className="reward-row reward-row-bottom">
                                            <div className="reward-icon">
                                                <img src={starlet} alt="Star" />
                                            </div>
                                            <span className="reward-text">15k</span>
                                        </div>
                                        <div className="reward-row reward-row-bottom">
                                            <div className="reward-icon">
                                                <img src={starlet} alt="Star" />
                                            </div>
                                            <span className="reward-text">7K</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="season-ended-item">
                                    <div className="reward-row reward-row-top">
                                        <div className="reward-icon">
                                            <img src={starlet} alt="Star" />
                                        </div>
                                        <span className="reward-text">7</span>
                                    </div>
                                    <div className="reward-row-bottom-container">
                                        <div className="reward-row reward-row-bottom">
                                            <div className="reward-icon">
                                                <img src={starlet} alt="Star" />
                                            </div>
                                            <span className="reward-text">15k</span>
                                        </div>
                                        <div className="reward-row reward-row-bottom">
                                            <div className="reward-icon">
                                                <img src={starlet} alt="Star" />
                                            </div>
                                            <span className="reward-text">7K</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="season-ended-item">
                                    <div className="reward-row reward-row-top">
                                        <div className="reward-icon">
                                            <img src={starlet} alt="Star" />
                                        </div>
                                        <span className="reward-text">7</span>
                                    </div>
                                    <div className="reward-row-bottom-container">
                                        <div className="reward-row reward-row-bottom">
                                            <div className="reward-icon">
                                                <img src={starlet} alt="Star" />
                                            </div>
                                            <span className="reward-text">15k</span>
                                        </div>
                                        <div className="reward-row reward-row-bottom">
                                            <div className="reward-icon">
                                                <img src={starlet} alt="Star" />
                                            </div>
                                            <span className="reward-text">7K</span>
                                        </div>
                                    </div>
                                </div>
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
                                <button className="season-button">
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
                                    <div className="item-username">{player.username}</div>
                                    {/* Rewards - chỉ hiển thị khi season ended */}
                                    {isSeasonEnded && player?.rewards && player.rewards.length > 0 && (
                                        <div className="reward-row-bottom-container">
                                            {player.rewards.map((reward, rewardIndex) => (
                                                <div key={rewardIndex} className="reward-row reward-row-bottom">
                                                    <div className="reward-icon">
                                                        <img src={reward.icon} alt="Reward" />
                                                    </div>
                                                    <span className="reward-text">{reward.amount}</span>
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
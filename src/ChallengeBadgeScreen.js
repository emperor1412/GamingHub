import React from 'react';
import './ChallengeBadgeScreen.css';
import starletIcon from './images/starlet.png';
import doodleExtra from './images/doodle_extra.png';
import challengesRobot from './images/challenges_robot.png';
import lockIcon from './images/lock_icon.png';
import questionIcon from './images/question_icon.png';
import badgeIncatrail from './images/trophy_4.png';

import badgeUnlocked from './images/trophy_4.png';
import badgeLocked from './images/TwoHundredStrong_Locked.png';

const ChallengeBadgeScreen = ({ onClose }) => {
    // Mock data for badges
    const badgeData = {
        explorerBadges: { earned: 4, total: 52 },
        starletsEarned: 2500,
        weeklyBadges: [
            {
                id: 1,
                name: "INCA TRAIL",
                status: "unlocked", // unlocked, locked, unknown
                badgeType: "FSL GAMER",
                badgeTitle: "JUNIOR AMBASSADOR",
                color: "green",
                img: badgeUnlocked,
                imgLocked: badgeLocked
            },
            {
                id: 2,
                name: "INCA TRAIL",
                status: "locked",
                badgeType: "FSL GAMER", 
                badgeTitle: "STARLETS CHAMPION",
                color: "silver",
                img: badgeUnlocked,
                imgLocked: badgeLocked
            },
            {
                id: 3,
                name: "INCA TRAIL",
                status: "unlocked",
                badgeType: "FSL GAMER",
                badgeTitle: "SENIOR AMBASSADOR", 
                color: "blue",
                img: badgeUnlocked,
                imgLocked: badgeLocked
            },
            {
                id: 4,
                name: "INCA TRAIL",
                status: "unknown",
                badgeType: "",
                badgeTitle: "",
                color: "silver",
                img: badgeUnlocked,
                imgLocked: badgeLocked
            }
        ]
    };

    return (
        <div className="challenge-badge-screen">
            {/* Background Pattern */}
            <div className="cbs-background-pattern"></div>
            
            {/* Main Content */}
            <div className="cbs-main-content">
                {/* Header Section */}
                <div className="cbs-header-section">
                    <div className="cbs-title-container">
                        <div className="cbs-title">YOUR EXPLORER JOURNEY</div>
                    </div>
                    
                    <div className="cbs-robot-character">
                        <img src={challengesRobot} alt="Robot Character" className="cbs-robot-image" />
                    </div>
                </div>
                
                <div className="cbs-subtitle">COLLECT BADGES FROM LEGENDARY TRAILS ACROSS THE WORLD!</div>

                {/* Summary Cards */}
                <div className="cbs-summary-cards">
                    {/* Explorer Badges Card */}
                    <div className="cbs-summary-card">
                        <div className="cbs-card-left">
                            <div className="cbs-card-header">
                                <span className="cbs-card-number">{badgeData.explorerBadges.earned}/{badgeData.explorerBadges.total}</span>
                            </div>
                            <div className="cbs-card-title">EXPLORER BADGES EARNED</div>
                        </div>
                        <div className="cbs-card-right">
                            <div className="cbs-card-icon">
                                <img src={badgeIncatrail} alt="Badge" className="cbs-badge-image cbs-badge-image-explorer" />
                            </div>
                        </div>
                    </div>

                    {/* Starlets Earned Card */}
                    <div className="cbs-summary-card">
                        <div className="cbs-card-left">
                            <div className="cbs-card-header">
                                <span className="cbs-card-number">{badgeData.starletsEarned.toLocaleString()}</span>
                            </div>
                            <div className="cbs-card-title">STARLETS EARNED</div>
                        </div>
                        <div className="cbs-card-right">
                            <div className="cbs-card-icon">
                                <img src={starletIcon} alt="Badge" className="cbs-badge-image cbs-badge-image-starlets" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Weekly Badges Section */}
                <div className="cbs-weekly-section">
                    <div className="cbs-badges-container">
                        {/* Corner Brackets */}
                        <div className="cbs-corner cbs-top-left"></div>
                        <div className="cbs-corner cbs-top-right"></div>
                        <div className="cbs-corner cbs-bottom-left"></div>
                        <div className="cbs-corner cbs-bottom-right"></div>
                        
                        <div className="cbs-weekly-header">
                            <div className="cbs-weekly-title">WEEKLY</div>
                        </div>

                        <div className="cbs-badges-grid">
                            {badgeData.weeklyBadges.map((badge, index) => (
                                <button
                                    key={badge.id}
                                    className={`cbs-badge-item cbs-badge-${badge.status}`}
                                >
                                    <div className="cbs-badge-content">
                                        <span className="cbs-badge-icon">
                                            <img 
                                                src={badge.status === 'unlocked' ? badge.img : badge.imgLocked} 
                                                alt="Badge" 
                                            />
                                        </span>
                                        {badge.status === 'locked' && (
                                            <div className="cbs-badge-status-icon cbs-badge-locked-icon">
                                                <img src={lockIcon} alt="Locked" />
                                            </div>
                                        )}
                                        {badge.status === 'unknown' && (
                                            <div className="cbs-badge-status-icon cbs-badge-unknown-icon">
                                                <img src={questionIcon} alt="Unknown" />
                                            </div>
                                        )}
                                        {/* {badge.status === 'unlocked' && (
                                            <div className="cbs-badge-status-icon">✨</div>
                                        )} */}
                                        <span className="cbs-badge-name">{badge.name}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChallengeBadgeScreen;

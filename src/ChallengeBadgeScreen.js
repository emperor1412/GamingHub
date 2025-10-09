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
import ChallengeUpdate from './ChallengeUpdate';
import ChallengeBadgeDone from './ChallengeBadgeDone';

const ChallengeBadgeScreen = ({ onClose }) => {
    const [selectedBadge, setSelectedBadge] = React.useState(null);
    const [showChallengeUpdate, setShowChallengeUpdate] = React.useState(false);
    const [showChallengeBadgeDone, setShowChallengeBadgeDone] = React.useState(false);

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
                imgLocked: badgeLocked,
                clickStatus: "ongoing" // Trạng thái sẽ hiển thị khi click
            },
            {
                id: 5,
                name: "INCA TRAIL",
                status: "unknown",
                badgeType: "",
                badgeTitle: "",
                color: "silver",
                img: badgeUnlocked,
                imgLocked: badgeLocked,
                clickStatus: "done"
            },
            {
                id: 6,
                name: "INCA TRAIL",
                status: "unknown",
                badgeType: "",
                badgeTitle: "",
                color: "silver",
                img: badgeUnlocked,
                imgLocked: badgeLocked,
                clickStatus: "incomplete"
            },
            {
                id: 7,
                name: "INCA TRAIL",
                status: "unknown",
                badgeType: "",
                badgeTitle: "",
                color: "silver",
                img: badgeUnlocked,
                imgLocked: badgeLocked,
                clickStatus: "missed"
            }
        ]
    };

    // Function to handle badge click
    const handleBadgeClick = (badge) => {
        if (badge.status === 'unknown' && badge.clickStatus) {
            if (badge.clickStatus === 'ongoing') {
                // Mở ChallengeUpdate cho ongoing challenge
                setShowChallengeUpdate(true);
            } else if (badge.clickStatus === 'done') {
                // Mở ChallengeBadgeDone cho completed challenge
                setShowChallengeBadgeDone(true);
            } else {
                // Hiển thị modal cho các status khác (incomplete, missed)
                setSelectedBadge(badge);
            }
        }
    };

    // Function to get status display text
    const getStatusText = (status) => {
        switch (status) {
            case 'ongoing':
                return 'ONGOING';
            case 'done':
                return 'COMPLETED';
            case 'incomplete':
                return 'INCOMPLETE';
            case 'missed':
                return 'MISSED';
            default:
                return '';
        }
    };

    // Function to get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'ongoing':
                return '#00F1FF';
            case 'done':
                return '#FFD700';
            case 'incomplete':
                return '#FFA500';
            case 'missed':
                return '#FF4444';
            default:
                return '#FFFFFF';
        }
    };

    // Function to handle back from ChallengeUpdate
    const handleBackFromUpdate = () => {
        setShowChallengeUpdate(false);
    };

    // Function to handle done from ChallengeUpdate
    const handleDoneFromUpdate = () => {
        setShowChallengeUpdate(false);
        // Có thể thêm logic khác nếu cần
    };

    // Function to handle back from ChallengeBadgeDone
    const handleBackFromBadgeDone = () => {
        setShowChallengeBadgeDone(false);
    };

    // Show ChallengeBadgeDone if state is true
    if (showChallengeBadgeDone) {
        return (
            <ChallengeBadgeDone
                onClose={handleBackFromBadgeDone}
                challengeData={{
                    challengeTitle: "INCA TRAIL",
                    badgeName: "TRAILBLAZER OF MACHU PICCHU",
                    stepsCompleted: 56000,
                    distance: 11,
                    starletsReward: 400,
                    challengeEndDate: "15/10/2025 23:59",
                    description: "Your path through challenges, discoveries, and untold wonders has earned you the title of"
                }}
            />
        );
    }

    // Show ChallengeUpdate if state is true
    if (showChallengeUpdate) {
        return (
            <ChallengeUpdate
                challengeData={{
                    challengeEndDate: "15/10/2025 23:59",
                    currentSteps: 15000,
                    totalSteps: 25000,
                    stepSegments: [5000, 10000, 15000, 20000, 25000]
                }}
                onDone={handleDoneFromUpdate}
                onBack={handleBackFromUpdate}
            />
        );
    }

    return (
        <div className="challenge-badge-screen">
            {/* Background Pattern */}
            <div className="cbs-background-pattern"></div>
            
            {/* Main Content */}
            <div className="cbs-main-content">
                {/* Header Section */}
                <div className="cbs-header-section">
                    {/* Corner Brackets */}
                    <div className="cbs-corner cbs-top-left"></div>
                    <div className="cbs-corner cbs-top-right"></div>
                    <div className="cbs-corner cbs-bottom-left"></div>
                    <div className="cbs-corner cbs-bottom-right"></div>
                    
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
                                    onClick={() => handleBadgeClick(badge)}
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

                {/* Status Display Modal */}
                {selectedBadge && (
                    <div className="cbs-status-modal">
                        <div className="cbs-status-content">
                            <div className="cbs-status-header">
                                <h3>{selectedBadge.name}</h3>
                                <button 
                                    className="cbs-close-btn"
                                    onClick={() => setSelectedBadge(null)}
                                >
                                    ×
                                </button>
                            </div>
                            <div 
                                className="cbs-status-display"
                                style={{ 
                                    backgroundColor: getStatusColor(selectedBadge.clickStatus),
                                    color: '#000'
                                }}
                            >
                                {getStatusText(selectedBadge.clickStatus)}
                            </div>
                            <div className="cbs-status-description">
                                {selectedBadge.clickStatus === 'ongoing' && 'Challenge is currently in progress'}
                                {selectedBadge.clickStatus === 'done' && 'Challenge has been completed successfully'}
                                {selectedBadge.clickStatus === 'incomplete' && 'Challenge was started but not finished'}
                                {selectedBadge.clickStatus === 'missed' && 'Challenge opportunity was missed'}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChallengeBadgeScreen;

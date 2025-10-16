import React from 'react';
import './ChallengeBadgeScreen.css';
import starletIcon from './images/starlet.png';
import doodleExtra from './images/doodle_extra.png';
import robotCowboyChallenges from './images/challenges_robot_cowboy.png';
import lockIcon from './images/lock_icon.png';
import questionIcon from './images/question_icon.png';
import badgeIncatrail from './images/trophy_4.png';

import badgeUnlocked from './images/trophy_4.png';
import badgeLocked from './images/TwoHundredStrong_Locked.png';
import ChallengeUpdate from './ChallengeUpdate';
import ChallengeBadgeDone from './ChallengeBadgeDone';
import ChallengeStatus from './ChallengeStatus';

// Import real data and API mock
import { mockChallengeBadgeApiResponse, mapApiStateToVisualState, getChallengeDataById } from './data/mockChallengeApi';
import ChallengeClaimReward from './ChallengeClaimReward';

const ChallengeBadgeScreen = ({ onClose }) => {
    const [selectedBadge, setSelectedBadge] = React.useState(null);
    const [selectedChallengeData, setSelectedChallengeData] = React.useState(null);
    const [showChallengeUpdate, setShowChallengeUpdate] = React.useState(false);
    const [showChallengeBadgeDone, setShowChallengeBadgeDone] = React.useState(false);
    const [showChallengeStatus, setShowChallengeStatus] = React.useState(false);
    const [showChallengeClaimReward, setShowChallengeClaimReward] = React.useState(false);
    const [challengeStatusType, setChallengeStatusType] = React.useState('incomplete');

    // Process real challenge data from API response
    const processChallengeData = () => {
        const processedData = {
            explorerBadges: { earned: 4, total: 52 },
            starletsEarned: 2500,
            weeklyBadges: [],
            monthlyBadges: [],
            yearlyBadges: []
        };

        // Process Weekly Challenges
        mockChallengeBadgeApiResponse.weekly.forEach(apiChallenge => {
            const challengeData = getChallengeDataById(apiChallenge.id, 'weekly');
            const visualState = mapApiStateToVisualState(apiChallenge.state, apiChallenge.hasReward);
            
            if (challengeData) {
                processedData.weeklyBadges.push({
                    id: apiChallenge.id,
                    title: challengeData.title,
                    visualType: visualState.visualType,
                    logicState: visualState.logicState,
                    img: badgeUnlocked,
                    imgLocked: badgeLocked
                });
            }
        });

        // Process Monthly Challenges
        mockChallengeBadgeApiResponse.monthly.forEach(apiChallenge => {
            const challengeData = getChallengeDataById(apiChallenge.id, 'monthly');
            const visualState = mapApiStateToVisualState(apiChallenge.state, apiChallenge.hasReward);
            
            if (challengeData) {
                processedData.monthlyBadges.push({
                    id: apiChallenge.id,
                    title: challengeData.title,
                    visualType: visualState.visualType,
                    logicState: visualState.logicState,
                    img: badgeUnlocked,
                    imgLocked: badgeLocked
                });
            }
        });

        // Process Yearly Challenges
        mockChallengeBadgeApiResponse.yearly.forEach(apiChallenge => {
            const challengeData = getChallengeDataById(apiChallenge.id, 'yearly');
            const visualState = mapApiStateToVisualState(apiChallenge.state, apiChallenge.hasReward);
            
            if (challengeData) {
                processedData.yearlyBadges.push({
                    id: apiChallenge.id,
                    title: challengeData.title,
                    visualType: visualState.visualType,
                    logicState: visualState.logicState,
                    img: badgeUnlocked,
                    imgLocked: badgeLocked
                });
            }
        });

        return processedData;
    };

    const badgeData = processChallengeData();

    // Function to handle badge click
    const handleBadgeClick = (badge) => {
        // Lưu challenge data để truyền cho các screens
        const challengeData = getChallengeDataById(badge.id, badge.type || 'weekly');
        console.log('Selected challenge data:', challengeData); // Debug log
        setSelectedChallengeData(challengeData);
        
        // Don't allow clicking on unknown badges
        if (badge.visualType === 'unknown') {
            return;
        }

        // Handle routing based on visual type and logic state
        switch (badge.visualType) {
            case 'unlocked':
                switch (badge.logicState) {
                    case 'on-going':
                        // Show Challenge Update Screen
                        setShowChallengeUpdate(true);
                        break;
                    case 'done-and-claimed':
                        // Show Challenge Badge Done Screen
                        setShowChallengeBadgeDone(true);
                        break;
                    case 'done-and-unclaimed':
                        // Show Challenge Claim Reward Screen
                        setShowChallengeClaimReward(true);
                        break;
                    default:
                        setSelectedBadge(badge);
                        break;
                }
                break;
                
            case 'locked':
                switch (badge.logicState) {
                    case 'unfinished':
                        // Show Challenge Status with incomplete status
                        setChallengeStatusType('incomplete');
                        setShowChallengeStatus(true);
                        break;
                    case 'unjoined':
                        // Show Challenge Status with missed status
                        setChallengeStatusType('missed');
                        setShowChallengeStatus(true);
                        break;
                    default:
                        setSelectedBadge(badge);
                        break;
                }
                break;
                
            default:
                setSelectedBadge(badge);
                break;
        }
    };

    // Function to get status display text
    const getStatusText = (logicState) => {
        switch (logicState) {
            case 'on-going':
                return 'ONGOING';
            case 'done-and-claimed':
                return 'COMPLETED';
            case 'done-and-unclaimed':
                return 'CLAIM REWARD';
            case 'unfinished':
                return 'INCOMPLETE';
            case 'unjoined':
                return 'MISSED';
            case 'nextbadge':
                return 'NEXT BADGE';
            default:
                return '';
        }
    };

    // Function to get status color
    const getStatusColor = (logicState) => {
        switch (logicState) {
            case 'on-going':
                return '#00F1FF';
            case 'done-and-claimed':
                return '#FFD700';
            case 'done-and-unclaimed':
                return '#00FF00';
            case 'unfinished':
                return '#FFA500';
            case 'unjoined':
                return '#FF4444';
            case 'nextbadge':
                return '#9B59B6';
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

    // Function to handle back from ChallengeClaimReward
    const handleBackFromClaimReward = () => {
        setShowChallengeClaimReward(false);
    };

    // Function to handle done from ChallengeClaimReward
    const handleDoneFromClaimReward = () => {
        setShowChallengeClaimReward(false);
        // Có thể thêm logic khác nếu cần
    };

    // Function to handle back from ChallengeStatus
    const handleBackFromStatus = () => {
        setShowChallengeStatus(false);
    };

    // Show ChallengeClaimReward if state is true
    if (showChallengeClaimReward) {
        return (
            <ChallengeClaimReward
                challengeData={selectedChallengeData ? {
                    stepsCompleted: selectedChallengeData.stepsEst || 99999,
                    distanceKm: selectedChallengeData.distanceKm || 9999,
                    badgeName: `${selectedChallengeData.title}`,
                    challengeTitle: selectedChallengeData.shortTitle,
                    starletsReward: 400,
                    challengeEndDate: selectedChallengeData.dateEnd || "DD/MM/YYYY 23:59",
                    description: selectedChallengeData.description || "##########################",
                    location: selectedChallengeData.location || "Unknown Location"
                } : {}}
                onClaimRewards={handleDoneFromClaimReward}
                onBack={handleBackFromClaimReward}
            />
        );
    }

    // Show ChallengeBadgeDone if state is true
    if (showChallengeBadgeDone) {
        return (
            <ChallengeBadgeDone
                onClose={handleBackFromBadgeDone}
                challengeData={selectedChallengeData ? {
                    challengeTitle: selectedChallengeData.shortTitle,
                    badgeName: `${selectedChallengeData.title}`,
                    stepsCompleted: selectedChallengeData.stepsEst || 99999,
                    distance: selectedChallengeData.distanceKm || 9999,
                    starletsReward: 400, // Có thể lấy từ API
                    challengeEndDate: selectedChallengeData.dateEnd || "DD/MM/YYYY 23:59",
                    description: selectedChallengeData.description || "#######################################################"
                } : {}}
            />
        );
    }

    // Show ChallengeStatus if state is true
    if (showChallengeStatus) {
        return (
            <ChallengeStatus
                status={challengeStatusType}
                onClose={handleBackFromStatus}
                challengeData={selectedChallengeData ? {
                    challengeTitle: selectedChallengeData.title,
                    stepsCompleted: challengeStatusType === 'incomplete' ? 23000 : 15000,
                    failDescription: selectedChallengeData.failDescription || "The challenge proved to be tougher than expected."
                } : {}}
            />
        );
    }

    // Show ChallengeUpdate if state is true
    if (showChallengeUpdate) {
        return (
            <ChallengeUpdate
                challengeData={selectedChallengeData ? {
                    challengeEndDate: `${selectedChallengeData.dateEnd} 23:59` || "DD/MM/YYYY 23:59",
                    stepsEst: selectedChallengeData.stepsEst || 9999,
                    distanceKm: selectedChallengeData.distanceKm || 9999,
                    title: selectedChallengeData.title || "########",
                    shortTitle: selectedChallengeData.shortTitle || "########",
                    description: selectedChallengeData.description || "#####################################################",
                    location: selectedChallengeData.location || "######",
                    starletsReward: 400,
                    type: selectedChallengeData.type || "WEEKLY"
                } : {}}
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
                        <img src={robotCowboyChallenges} alt="Robot Character" className="cbs-robot-image" />
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
                                    className={`cbs-badge-item cbs-badge-${badge.visualType}`}
                                    onClick={() => handleBadgeClick(badge)}
                                >
                                    <div className="cbs-badge-content">
                                        <span className="cbs-badge-icon">
                                            <img 
                                                src={badge.visualType === 'unlocked' ? badge.img : badge.imgLocked} 
                                                alt="Badge" 
                                            />
                                        </span>
                                        {badge.visualType === 'locked' && (
                                            <div className="cbs-badge-status-icon cbs-badge-locked-icon">
                                                <img src={lockIcon} alt="Locked" />
                                            </div>
                                        )}
                                        {badge.visualType === 'unknown' && (
                                            <div className="cbs-badge-status-icon cbs-badge-unknown-icon">
                                                <img src={questionIcon} alt="Unknown" />
                                            </div>
                                        )}
                                        {/* {badge.visualType === 'unlocked' && (
                                            <div className="cbs-badge-status-icon">✨</div>
                                        )} */}
                                        <span className="cbs-badge-name">{badge.title}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Monthly Badges Section */}
                <div className="cbs-weekly-section">
                    <div className="cbs-badges-container">
                        {/* Corner Brackets */}
                        <div className="cbs-corner cbs-top-left"></div>
                        <div className="cbs-corner cbs-top-right"></div>
                        <div className="cbs-corner cbs-bottom-left"></div>
                        <div className="cbs-corner cbs-bottom-right"></div>
                        
                        <div className="cbs-weekly-header">
                            <div className="cbs-weekly-title">MONTHLY</div>
                        </div>

                        <div className="cbs-badges-grid">
                            {badgeData.monthlyBadges.map((badge, index) => (
                                <button
                                    key={badge.id}
                                    className={`cbs-badge-item cbs-badge-${badge.visualType}`}
                                    onClick={() => handleBadgeClick(badge)}
                                >
                                    <div className="cbs-badge-content">
                                        <span className="cbs-badge-icon">
                                            <img 
                                                src={badge.visualType === 'unlocked' ? badge.img : badge.imgLocked} 
                                                alt="Badge" 
                                            />
                                        </span>
                                        {badge.visualType === 'locked' && (
                                            <div className="cbs-badge-status-icon cbs-badge-locked-icon">
                                                <img src={lockIcon} alt="Locked" />
                                            </div>
                                        )}
                                        {badge.visualType === 'unknown' && (
                                            <div className="cbs-badge-status-icon cbs-badge-unknown-icon">
                                                <img src={questionIcon} alt="Unknown" />
                                            </div>
                                        )}
                                        <span className="cbs-badge-name">{badge.title}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Yearly Badges Section */}
                <div className="cbs-weekly-section">
                    <div className="cbs-badges-container">
                        {/* Corner Brackets */}
                        <div className="cbs-corner cbs-top-left"></div>
                        <div className="cbs-corner cbs-top-right"></div>
                        <div className="cbs-corner cbs-bottom-left"></div>
                        <div className="cbs-corner cbs-bottom-right"></div>
                        
                        <div className="cbs-weekly-header">
                            <div className="cbs-weekly-title">YEARLY</div>
                        </div>

                        <div className="cbs-badges-grid">
                            {badgeData.yearlyBadges.map((badge, index) => (
                                <button
                                    key={badge.id}
                                    className={`cbs-badge-item cbs-badge-${badge.visualType}`}
                                    onClick={() => handleBadgeClick(badge)}
                                >
                                    <div className="cbs-badge-content">
                                        <span className="cbs-badge-icon">
                                            <img 
                                                src={badge.visualType === 'unlocked' ? badge.img : badge.imgLocked} 
                                                alt="Badge" 
                                            />
                                        </span>
                                        {badge.visualType === 'locked' && (
                                            <div className="cbs-badge-status-icon cbs-badge-locked-icon">
                                                <img src={lockIcon} alt="Locked" />
                                            </div>
                                        )}
                                        {badge.visualType === 'unknown' && (
                                            <div className="cbs-badge-status-icon cbs-badge-unknown-icon">
                                                <img src={questionIcon} alt="Unknown" />
                                            </div>
                                        )}
                                        <span className="cbs-badge-name">{badge.title}</span>
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
                                <h3>{selectedBadge.title}</h3>
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
                                    backgroundColor: getStatusColor(selectedBadge.logicState),
                                    color: '#000'
                                }}
                            >
                                {getStatusText(selectedBadge.logicState)}
                            </div>
                            <div className="cbs-status-description">
                                {(() => {
                                    const visualType = selectedBadge.visualType;
                                    const logicState = selectedBadge.logicState;
                                    
                                    if (visualType === 'unlocked') {
                                        switch (logicState) {
                                            case 'on-going':
                                                return 'Challenge is currently in progress';
                                            case 'done-and-claimed':
                                                return 'Challenge has been completed and rewards claimed';
                                            case 'done-and-unclaimed':
                                                return 'Challenge completed but rewards not claimed yet';
                                            default:
                                                return 'Unlocked badge available';
                                        }
                                    } else if (visualType === 'locked') {
                                        switch (logicState) {
                                            case 'unfinished':
                                                return 'Challenge was started but not finished';
                                            case 'unjoined':
                                                return 'Challenge opportunity was missed';
                                            default:
                                                return 'This badge is locked';
                                        }
                                    } else if (visualType === 'unknown') {
                                        if (logicState === 'nextbadge') {
                                            return 'This is the next badge to be revealed';
                                        }
                                    }
                                    return 'Status unknown';
                                })()}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChallengeBadgeScreen;

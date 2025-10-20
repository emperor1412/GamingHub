                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    import React, { useState } from 'react';
import './ChallengeBadgeCollection.css';
import backIcon from './images/back.svg';
import lockIcon from './images/lock_icon.png';
import questionIcon from './images/question_icon.png';
import badgeUnlocked from './images/trophy_4.png';
import badgeLocked from './images/TwoHundredStrong_Locked.png';

// Import existing components for badge details
import ChallengeUpdate from './ChallengeUpdate';
import ChallengeBadgeDone from './ChallengeBadgeDone';
import ChallengeStatus from './ChallengeStatus';
import ChallengeClaimReward from './ChallengeClaimReward';

// Import mock data
import { mockChallengeBadgeApiResponse, mapApiStateToVisualState, getChallengeDataById } from './data/mockChallengeApi';
import shared from './Shared';

const ChallengeBadgeCollection = ({ onClose }) => {
    const [selectedBadge, setSelectedBadge] = useState(null);
    const [selectedChallengeData, setSelectedChallengeData] = useState(null);
    const [showChallengeUpdate, setShowChallengeUpdate] = useState(false);
    const [showChallengeBadgeDone, setShowChallengeBadgeDone] = useState(false);
    const [showChallengeStatus, setShowChallengeStatus] = useState(false);
    const [showChallengeClaimReward, setShowChallengeClaimReward] = useState(false);
    const [challengeStatusType, setChallengeStatusType] = useState('incomplete');

    // Process all challenges from API response
    const processAllChallenges = () => {
        const allBadges = [];

        // Process Weekly Challenges
        mockChallengeBadgeApiResponse.weekly.forEach(apiChallenge => {
            const challengeData = getChallengeDataById(apiChallenge.id, 'weekly');
            const visualState = mapApiStateToVisualState(apiChallenge.state, apiChallenge.hasReward);
            
            if (challengeData) {
                allBadges.push({
                    id: apiChallenge.id,
                    title: challengeData.title,
                    shortTitle: challengeData.shortTitle,
                    visualType: visualState.visualType,
                    logicState: visualState.logicState,
                    img: badgeUnlocked,
                    imgLocked: badgeLocked,
                    type: 'weekly',
                    trailName: 'INCA TRAIL' // Default trail name, can be from API
                });
            }
        });

        // Process Monthly Challenges
        mockChallengeBadgeApiResponse.monthly.forEach(apiChallenge => {
            const challengeData = getChallengeDataById(apiChallenge.id, 'monthly');
            const visualState = mapApiStateToVisualState(apiChallenge.state, apiChallenge.hasReward);
            
            if (challengeData) {
                allBadges.push({
                    id: apiChallenge.id,
                    title: challengeData.title,
                    shortTitle: challengeData.shortTitle,
                    visualType: visualState.visualType,
                    logicState: visualState.logicState,
                    img: badgeUnlocked,
                    imgLocked: badgeLocked,
                    type: 'monthly',
                    trailName: 'INCA TRAIL'
                });
            }
        });

        // Process Yearly Challenges
        mockChallengeBadgeApiResponse.yearly.forEach(apiChallenge => {
            const challengeData = getChallengeDataById(apiChallenge.id, 'yearly');
            const visualState = mapApiStateToVisualState(apiChallenge.state, apiChallenge.hasReward);
            
            if (challengeData) {
                allBadges.push({
                    id: apiChallenge.id,
                    title: challengeData.title,
                    shortTitle: challengeData.shortTitle,
                    visualType: visualState.visualType,
                    logicState: visualState.logicState,
                    img: badgeUnlocked,
                    imgLocked: badgeLocked,
                    type: 'yearly',
                    trailName: 'INCA TRAIL'
                });
            }
        });

        return allBadges;
    };

    const allBadges = processAllChallenges();

    // Function to handle badge click
    const handleBadgeClick = async (badge) => {
        // Don't allow clicking on unknown badges
        if (badge.visualType === 'unknown') {
            return;
        }

        // Handle routing based on visual type and logic state
        switch (badge.visualType) {
            case 'unlocked':
                switch (badge.logicState) {
                    case 'on-going':
                        // Call API to get challenge detail for ongoing challenges
                        try {
                            const result = await shared.getChallengeDetail(badge.id);
                            
                            if (result.success) {
                                const challengeDetail = result.data;
                                const challengeData = getChallengeDataById(badge.id, badge.type);
                                
                                // Combine API data with mock detail for missing fields
                                const combinedChallengeData = {
                                    id: challengeDetail.id,
                                    title: (challengeDetail.name || (challengeData?.title) || '').trim(),
                                    shortTitle: (challengeData?.shortTitle) || (challengeDetail.name || '').trim(),
                                    type: badge.type?.toUpperCase() || "WEEKLY",
                                    entryFee: challengeDetail.price,
                                    reward: challengeDetail.price * 2, // Reward is double the entry fee
                                    stepsEst: challengeDetail.step,
                                    distanceKm: challengeData?.distanceKm,
                                    description: challengeData?.description,
                                    location: challengeData?.location,
                                    dateStart: challengeData?.dateStart,
                                    dateEnd: challengeData?.dateEnd,
                                    // API data
                                    state: challengeDetail.state,
                                    currentSteps: challengeDetail.currSteps,
                                    totalSteps: challengeDetail.step,
                                    startTime: challengeDetail.startTime,
                                    endTime: challengeDetail.endTime
                                };
                                
                                setSelectedChallengeData(combinedChallengeData);
                                setShowChallengeUpdate(true);
                            } else {
                                console.error('Failed to get challenge detail:', result.error);
                                // Fallback to original behavior
                                const challengeData = getChallengeDataById(badge.id, badge.type);
                                setSelectedChallengeData(challengeData);
                                setShowChallengeUpdate(true);
                            }
                        } catch (error) {
                            console.error('Error fetching challenge detail:', error);
                            // Fallback to original behavior
                            const challengeData = getChallengeDataById(badge.id, badge.type);
                            setSelectedChallengeData(challengeData);
                            setShowChallengeUpdate(true);
                        }
                        break;
                    case 'done-and-claimed':
                        // Show Challenge Badge Done Screen
                        const challengeDataClaimed = getChallengeDataById(badge.id, badge.type);
                        setSelectedChallengeData(challengeDataClaimed);
                        setShowChallengeBadgeDone(true);
                        break;
                    case 'done-and-unclaimed':
                        // Show Challenge Claim Reward Screen
                        const challengeDataUnclaimed = getChallengeDataById(badge.id, badge.type);
                        setSelectedChallengeData(challengeDataUnclaimed);
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
                    badgeName: `${selectedChallengeData.shortTitle}`,
                    challengeTitle: selectedChallengeData.shortTitle,
                    starletsReward: 400,
                    challengeEndDate: selectedChallengeData.dateEnd || "DD/MM/YYYY 23:59",
                    description: selectedChallengeData.description || "##########################",
                    location: selectedChallengeData.location || "Unknown Location"
                } : {}}
                onClaimRewards={handleDoneFromClaimReward}
                onBack={handleBackFromClaimReward}
                onViewBadges={() => {
                    // Close the claim reward screen and stay on badge collection
                    setShowChallengeClaimReward(false);
                }}
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
                    badgeName: `${selectedChallengeData.shortTitle}`,
                    stepsCompleted: selectedChallengeData.stepsEst || 99999,
                    distance: selectedChallengeData.distanceKm || 9999,
                    starletsReward: 400,
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
                    challengeTitle: selectedChallengeData.shortTitle,
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
                    // API data
                    currentSteps: selectedChallengeData.currentSteps || 0,
                    totalSteps: selectedChallengeData.totalSteps || selectedChallengeData.stepsEst || 0,
                    endTime: selectedChallengeData.endTime || 0,
                    startTime: selectedChallengeData.startTime || 0,
                    // Additional fields
                    stepsEst: selectedChallengeData.stepsEst || 0,
                    distanceKm: selectedChallengeData.distanceKm || 0,
                    title: selectedChallengeData.title || "Challenge",
                    shortTitle: selectedChallengeData.shortTitle || "Challenge",
                    description: selectedChallengeData.description || "Complete the challenge to earn rewards!",
                    location: selectedChallengeData.location || "Unknown",
                    starletsReward: selectedChallengeData.reward || 0,
                    type: selectedChallengeData.type || "WEEKLY",
                    challengeEndDate: selectedChallengeData.dateEnd ? `${selectedChallengeData.dateEnd} 23:59` : "DD/MM/YYYY 23:59"
                } : {}}
                onDone={handleDoneFromUpdate}
                onBack={handleBackFromUpdate}
                onViewBadges={() => {
                    // Close the update screen and stay on badge collection
                    setShowChallengeUpdate(false);
                }}
            />
        );
    }

    return (
        <div className="challenge-badge-collection">
            {/* Back Button */}
            <button className="back-button back-button-alignment" onClick={onClose}>
                <img src={backIcon} alt="Back" />
            </button>
            
            {/* Background Pattern */}
            <div className="challenge-badge-collection-background-pattern"></div>
            
            {/* Main Content */}
            <div className="challenge-badge-collection-main-content">
                {/* Header Section */}
                <div className="challenge-badge-collection-header">
                    {/* Corner Brackets */}
                    <div className="challenge-badge-collection-corner challenge-badge-collection-top-left"></div>
                    <div className="challenge-badge-collection-corner challenge-badge-collection-top-right"></div>
                    <div className="challenge-badge-collection-corner challenge-badge-collection-bottom-left"></div>
                    <div className="challenge-badge-collection-corner challenge-badge-collection-bottom-right"></div>
                    
                    <div className="challenge-badge-collection-title-container">
                        <div className="badge-text">BADGE</div>
                        <div className="collection-text">COLLECTION</div>
                    </div>
                </div>

                {/* Badges Grid */}
                <div className="challenge-badges-grid">
                    {allBadges.map((badge, index) => (
                        <button
                            key={badge.id}
                            className={`challenge-badge-item challenge-badge-${badge.visualType}`}
                            onClick={() => handleBadgeClick(badge)}
                        >
                            <div className="challenge-badge-content">
                                <span className="challenge-badge-icon">
                                    <img 
                                        src={badge.visualType === 'unlocked' ? badge.img : badge.imgLocked} 
                                        alt="Badge" 
                                    />
                                </span>
                                {badge.visualType === 'locked' && (
                                    <div className="challenge-badge-status-icon challenge-badge-locked-icon">
                                        <img src={lockIcon} alt="Locked" />
                                    </div>
                                )}
                                {badge.visualType === 'unknown' && (
                                    <div className="challenge-badge-status-icon challenge-badge-unknown-icon">
                                        <img src={questionIcon} alt="Unknown" />
                                    </div>
                                )}
                                <span className="challenge-badge-name">{badge.shortTitle}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Status Display Modal */}
            {selectedBadge && (
                <div className="challenge-badge-status-modal">
                    <div className="challenge-badge-status-content">
                        <div className="challenge-badge-status-header">
                            <h3>{selectedBadge.shortTitle}</h3>
                            <button 
                                className="challenge-badge-close-btn"
                                onClick={() => setSelectedBadge(null)}
                            >
                                ×
                            </button>
                        </div>
                        <div 
                            className="challenge-badge-status-display"
                            style={{ 
                                backgroundColor: getStatusColor(selectedBadge.logicState),
                                color: '#000'
                            }}
                        >
                            {getStatusText(selectedBadge.logicState)}
                        </div>
                        <div className="challenge-badge-status-description">
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
    );
};

export default ChallengeBadgeCollection;

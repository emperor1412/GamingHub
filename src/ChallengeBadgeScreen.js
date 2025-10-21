import React from 'react';
import './ChallengeBadgeScreen.css';
import starletIcon from './images/starlet.png';
import doodleExtra from './images/doodle_extra.png';
import robotCowboyChallenges from './images/challenges_robot_cowboy.png';
import backIcon from './images/back.svg';
import defaultBadgeImage from './images/trophy_4.png';

// Import badge image mapper
import { getBadgeImage, getLockIcon, getQuestionIcon } from './utils/badgeImageMapper';
import ChallengeUpdate from './ChallengeUpdate';
import ChallengeBadgeDone from './ChallengeBadgeDone';
import ChallengeStatus from './ChallengeStatus';
import ChallengeInfo from './ChallengeInfo';
import ChallengeJoinConfirmation from './ChallengeJoinConfirmation';

// Import real data and API mock
import { mockChallengeBadgeApiResponse, mapApiStateToVisualState, getChallengeDataById } from './data/mockChallengeApi';
import ChallengeClaimReward from './ChallengeClaimReward';
import shared from './Shared';

const ChallengeBadgeScreen = ({ onClose, onExplorerBadgesClick }) => {
    const [selectedBadge, setSelectedBadge] = React.useState(null);
    const [selectedChallengeData, setSelectedChallengeData] = React.useState(null);
    const [showChallengeUpdate, setShowChallengeUpdate] = React.useState(false);
    const [showChallengeBadgeDone, setShowChallengeBadgeDone] = React.useState(false);
    const [showChallengeStatus, setShowChallengeStatus] = React.useState(false);
    const [showChallengeClaimReward, setShowChallengeClaimReward] = React.useState(false);
    const [showChallengeInfo, setShowChallengeInfo] = React.useState(false);
    const [showChallengeJoinConfirmation, setShowChallengeJoinConfirmation] = React.useState(false);
    const [challengeStatusType, setChallengeStatusType] = React.useState('incomplete');
    
    // API state management
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [apiChallenges, setApiChallenges] = React.useState([]);
    const [challengeEarnedData, setChallengeEarnedData] = React.useState({
        starlets: 0,
        badges: 0,
        challenges: 0
    });

    // Fetch challenges and earned data from API
    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                // Fetch both APIs in parallel
                const [challengesResult, earnedResult] = await Promise.all([
                    shared.getChallengesBadgeView(),
                    shared.getChallengeEarned()
                ]);
                
                // Handle challenges data
                if (challengesResult.success) {
                    console.log('API challenges loaded:', challengesResult.data);
                    setApiChallenges(challengesResult.data);
                } else {
                    console.error('Failed to load challenges:', challengesResult.error);
                    setError(challengesResult.error);
                    // Fallback to mock data on error
                    setApiChallenges(mockChallengeBadgeApiResponse.weekly.concat(
                        mockChallengeBadgeApiResponse.monthly,
                        mockChallengeBadgeApiResponse.yearly
                    ));
                }

                // Handle earned data
                if (earnedResult.success) {
                    console.log('Challenge earned data loaded:', earnedResult.data);
                    // API returns object directly, not array
                    const earnedData = earnedResult.data || { starlets: 0, badges: 0, challenges: 0 };
                    setChallengeEarnedData(earnedData);
                } else {
                    console.error('Failed to load earned data:', earnedResult.error);
                    // Keep default values on error
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
                // Fallback to mock data on error
                setApiChallenges(mockChallengeBadgeApiResponse.weekly.concat(
                    mockChallengeBadgeApiResponse.monthly,
                    mockChallengeBadgeApiResponse.yearly
                ));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Process real challenge data from API response
    const processChallengeData = () => {
        const processedData = {
            explorerBadges: { 
                earned: challengeEarnedData.badges || 0, 
                total: challengeEarnedData.challenges || 0 
            },
            starletsEarned: challengeEarnedData.starlets || 0,
            weeklyBadges: [],
            monthlyBadges: [],
            yearlyBadges: []
        };

        // Process API challenges data
        apiChallenges.forEach(apiChallenge => {
            // Determine challenge type based on type field from API
            let challengeType = 'weekly';
            if (apiChallenge.type === 2) {
                challengeType = 'monthly';
            } else if (apiChallenge.type === 3) {
                challengeType = 'yearly';
            } else if (apiChallenge.type === 1) {
                challengeType = 'weekly';
            }
            // Fallback to ID-based detection if type field is not available
            else if (apiChallenge.id >= 10001 && apiChallenge.id <= 10012) {
                challengeType = 'monthly';
            } else if (apiChallenge.id >= 100001 && apiChallenge.id <= 100003) {
                challengeType = 'yearly';
            }

            const challengeData = getChallengeDataById(apiChallenge.id, challengeType);
            const visualState = mapApiStateToVisualState(apiChallenge.state, apiChallenge.hasReward);
            
            if (challengeData) {
                const badgeData = {
                    id: apiChallenge.id,
                    title: challengeData.title,
                    shortTitle: challengeData.shortTitle,
                    visualType: visualState.visualType,
                    logicState: visualState.logicState,
                    img: getBadgeImage(apiChallenge.id), // Same image for both states
                    type: challengeType
                };

                // Add to appropriate category based on type
                if (challengeType === 'weekly') {
                    processedData.weeklyBadges.push(badgeData);
                } else if (challengeType === 'monthly') {
                    processedData.monthlyBadges.push(badgeData);
                } else if (challengeType === 'yearly') {
                    processedData.yearlyBadges.push(badgeData);
                }
            }
        });

        // Sort badges by ID to maintain consistent order
        processedData.weeklyBadges.sort((a, b) => a.id - b.id);
        processedData.monthlyBadges.sort((a, b) => a.id - b.id);
        processedData.yearlyBadges.sort((a, b) => a.id - b.id);

        return processedData;
    };

    const badgeData = processChallengeData();

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
                                const challengeData = getChallengeDataById(badge.id, badge.type || 'weekly');
                                
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
                                
                                // Determine which view to show based on API state (same logic as ChallengesMenu)
                                if (challengeDetail.state === 10) {
                                    // State_Joining = 10 -> User has joined -> go to Challenge Update
                                    setShowChallengeUpdate(true);
                                } else if (challengeDetail.state === 20) {
                                    // State_Expired = 20 -> Challenge expired
                                    console.log('Challenge expired');
                                    setSelectedBadge(badge);
                                } else if (challengeDetail.state === 30) {
                                    // State_Complete = 30 -> User completed challenge (can claim reward)
                                    console.log('Challenge completed - can claim reward');
                                    setShowChallengeClaimReward(true);
                                } else if (challengeDetail.state === 40) {
                                    // State_RewardClaimed = 40 -> User claimed the reward
                                    console.log('Challenge completed and reward claimed');
                                    setShowChallengeBadgeDone(true);
                                } else {
                                    // User hasn't joined -> show ChallengeInfo
                                    setShowChallengeInfo(true);
                                }
                            } else {
                                console.error('Failed to get challenge detail:', result.error);
                                // Fallback to original behavior
                                setSelectedBadge(badge);
                            }
                        } catch (error) {
                            console.error('Error fetching challenge detail:', error);
                            // Fallback to original behavior
                            setSelectedBadge(badge);
                        }
                        break;
                    case 'done-and-claimed':
                        // Show Challenge Badge Done Screen
                        const challengeDataClaimed = getChallengeDataById(badge.id, badge.type || 'weekly');
                        setSelectedChallengeData(challengeDataClaimed);
                        setShowChallengeBadgeDone(true);
                        break;
                    case 'done-and-unclaimed':
                        // Show Challenge Claim Reward Screen
                        const challengeDataUnclaimed = getChallengeDataById(badge.id, badge.type || 'weekly');
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
                        // Call API to get challenge detail for incomplete challenges
                        try {
                            const result = await shared.getChallengeDetail(badge.id);
                            
                            if (result.success) {
                                const challengeDetail = result.data;
                                const challengeData = getChallengeDataById(badge.id, badge.type || 'weekly');
                                
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
                                    endTime: challengeDetail.endTime,
                                    failDescription: challengeData?.failDescription || "The challenge proved to be tougher than expected."
                                };
                                
                                setSelectedChallengeData(combinedChallengeData);
                                setChallengeStatusType('incomplete');
                                setShowChallengeStatus(true);
                            } else {
                                console.error('Failed to get challenge detail:', result.error);
                                // Fallback to original behavior
                                setChallengeStatusType('incomplete');
                                setShowChallengeStatus(true);
                            }
                        } catch (error) {
                            console.error('Error fetching challenge detail:', error);
                            // Fallback to original behavior
                            setChallengeStatusType('incomplete');
                            setShowChallengeStatus(true);
                        }
                        break;
                    case 'unjoined':
                        // Call API to get challenge detail for missed challenges
                        try {
                            const result = await shared.getChallengeDetail(badge.id);
                            
                            if (result.success) {
                                const challengeDetail = result.data;
                                const challengeData = getChallengeDataById(badge.id, badge.type || 'weekly');
                                
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
                                    endTime: challengeDetail.endTime,
                                    failDescription: challengeData?.failDescription || "You didn't join this challenge."
                                };
                                
                                setSelectedChallengeData(combinedChallengeData);
                                setChallengeStatusType('missed');
                                setShowChallengeStatus(true);
                            } else {
                                console.error('Failed to get challenge detail:', result.error);
                                // Fallback to original behavior
                                setChallengeStatusType('missed');
                                setShowChallengeStatus(true);
                            }
                        } catch (error) {
                            console.error('Error fetching challenge detail:', error);
                            // Fallback to original behavior
                            setChallengeStatusType('missed');
                            setShowChallengeStatus(true);
                        }
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

    // Function to handle back from ChallengeInfo
    const handleBackFromInfo = () => {
        setShowChallengeInfo(false);
    };

    // Function to handle join challenge from ChallengeInfo
    const handleJoinChallenge = () => {
        // Show ChallengeJoinConfirmation page
        setShowChallengeJoinConfirmation(true);
    };

    // Function to handle back from ChallengeJoinConfirmation
    const handleBackFromConfirmation = () => {
        setShowChallengeJoinConfirmation(false);
    };

    // Function to handle confirm join
    const handleConfirmJoin = () => {
        // This will be handled by API
        console.log('handleConfirmJoin called - API will handle the logic');
        setShowChallengeJoinConfirmation(false);
    };

    // Function to handle Explorer Badges Card click
    const handleExplorerBadgesClick = () => {
        if (onExplorerBadgesClick) {
            onExplorerBadgesClick();
        }
    };

    // Show ChallengeJoinConfirmation if state is true
    if (showChallengeJoinConfirmation && selectedChallengeData) {
        return (
            <ChallengeJoinConfirmation 
                challengeData={{
                    id: selectedChallengeData.id,
                    steps: selectedChallengeData.stepsEst,
                    days: selectedChallengeData.type === 'WEEKLY' ? 7 : selectedChallengeData.type === 'MONTHLY' ? 30 : 365,
                    starletsCost: selectedChallengeData.entryFee,
                    badgeName: "EXPLORER BADGE",
                    challengeEndDate: selectedChallengeData.dateEnd ? `${selectedChallengeData.dateEnd} 13:00 UTC` : "DD/MM/YY HH:MM",
                    type: selectedChallengeData.type.toLowerCase()
                }}
                onJoinChallenge={handleConfirmJoin}
                onBack={handleBackFromConfirmation}
                onViewBadges={() => {
                    // Close the confirmation screen and stay on badge screen
                    setShowChallengeJoinConfirmation(false);
                }}
                onShowError={() => {
                    // Handle error case
                    setShowChallengeJoinConfirmation(false);
                }}
            />
        );
    }

    // Show ChallengeInfo if state is true
    if (showChallengeInfo && selectedChallengeData) {
        return (
            <ChallengeInfo
                challenge={selectedChallengeData}
                onClose={handleBackFromInfo}
                onJoinChallenge={handleJoinChallenge}
            />
        );
    }

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
                onViewBadges={() => {
                    // Close the claim reward screen and stay on badge screen
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
                    stepsCompleted: selectedChallengeData.currentSteps || 0,
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
                    // Close the update screen and stay on badge screen
                    setShowChallengeUpdate(false);
                }}
            />
        );
    }

    // Show loading state
    if (loading) {
        return (
            <div className="challenge-badge-screen">
                {/* Back Button */}
                <button className="back-button back-button-alignment" onClick={onClose}>
                    <img src={backIcon} alt="Back" />
                </button>
                
                {/* Loading Content */}
                <div className="cbs-main-content">
                    <div className="cbs-loading-container">
                        <div className="cbs-loading-spinner"></div>
                        <div className="cbs-loading-text">Loading challenges...</div>
                    </div>
                </div>
            </div>
        );
    }

    // Show error state
    if (error && apiChallenges.length === 0) {
        return (
            <div className="challenge-badge-screen">
                {/* Back Button */}
                <button className="back-button back-button-alignment" onClick={onClose}>
                    <img src={backIcon} alt="Back" />
                </button>
                
                {/* Error Content */}
                <div className="cbs-main-content">
                    <div className="cbs-error-container">
                        <div className="cbs-error-text">Failed to load challenges</div>
                        <div className="cbs-error-details">{error}</div>
                        <button 
                            className="cbs-retry-button"
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="challenge-badge-screen">
            {/* Back Button */}
            <button className="back-button back-button-alignment" onClick={onClose}>
                <img src={backIcon} alt="Back" />
            </button>
            
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
                    <button className="cbs-summary-card cbs-summary-card-clickable" onClick={handleExplorerBadgesClick}>
                        <div className="cbs-card-left">
                            <div className="cbs-card-header">
                                <span className="cbs-card-number">
                                    {loading ? '...' : `${badgeData.explorerBadges.earned}/${badgeData.explorerBadges.total}`}
                                </span>
                            </div>
                            <div className="cbs-card-title">EXPLORER BADGES EARNED</div>
                        </div>
                        <div className="cbs-card-right">
                            <div className="cbs-card-icon">
                                <img src={defaultBadgeImage} alt="Badge" className="cbs-badge-image cbs-badge-image-explorer" />
                            </div>
                        </div>
                    </button>

                    {/* Starlets Earned Card */}
                    <div className="cbs-summary-card">
                        <div className="cbs-card-left">
                            <div className="cbs-card-header">
                                <span className="cbs-card-number">
                                    {loading ? '...' : badgeData.starletsEarned.toLocaleString()}
                                </span>
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
                                        <span className={`cbs-badge-icon ${badge.visualType === 'locked' ? 'cbs-badge-locked' : badge.visualType === 'unknown' ? 'cbs-badge-unknown' : ''}`}>
                                            <img 
                                                src={badge.img} 
                                                alt="Badge" 
                                            />
                                        </span>
                                        {badge.visualType === 'locked' && (
                                            <div className="cbs-badge-status-icon cbs-badge-locked-icon">
                                                <img src={getLockIcon()} alt="Locked" />
                                            </div>
                                        )}
                                        {badge.visualType === 'unknown' && (
                                            <div className="cbs-badge-status-icon cbs-badge-unknown-icon">
                                                <img src={getQuestionIcon()} alt="Unknown" />
                                            </div>
                                        )}
                                        {/* {badge.visualType === 'unlocked' && (
                                            <div className="cbs-badge-status-icon">✨</div>
                                        )} */}
                                        <span className="cbs-badge-name">{badge.shortTitle}</span>
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
                                        <span className={`cbs-badge-icon ${badge.visualType === 'locked' ? 'cbs-badge-locked' : badge.visualType === 'unknown' ? 'cbs-badge-unknown' : ''}`}>
                                            <img 
                                                src={badge.img} 
                                                alt="Badge" 
                                            />
                                        </span>
                                        {badge.visualType === 'locked' && (
                                            <div className="cbs-badge-status-icon cbs-badge-locked-icon">
                                                <img src={getLockIcon()} alt="Locked" />
                                            </div>
                                        )}
                                        {badge.visualType === 'unknown' && (
                                            <div className="cbs-badge-status-icon cbs-badge-unknown-icon">
                                                <img src={getQuestionIcon()} alt="Unknown" />
                                            </div>
                                        )}
                                        <span className="cbs-badge-name">{badge.shortTitle}</span>
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
                                        <span className={`cbs-badge-icon ${badge.visualType === 'locked' ? 'cbs-badge-locked' : badge.visualType === 'unknown' ? 'cbs-badge-unknown' : ''}`}>
                                            <img 
                                                src={badge.img} 
                                                alt="Badge" 
                                            />
                                        </span>
                                        {badge.visualType === 'locked' && (
                                            <div className="cbs-badge-status-icon cbs-badge-locked-icon">
                                                <img src={getLockIcon()} alt="Locked" />
                                            </div>
                                        )}
                                        {badge.visualType === 'unknown' && (
                                            <div className="cbs-badge-status-icon cbs-badge-unknown-icon">
                                                <img src={getQuestionIcon()} alt="Unknown" />
                                            </div>
                                        )}
                                        <span className="cbs-badge-name">{badge.shortTitle}</span>
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

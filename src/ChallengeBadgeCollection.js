                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    import React, { useState } from 'react';
import './ChallengeBadgeCollection.css';
import backIcon from './images/back.svg';

// Import badge image mapper
import { getBadgeImage, getLockIcon, getQuestionIcon } from './utils/badgeImageMapper';

// Import existing components for badge details
import ChallengeUpdate from './ChallengeUpdate';
import ChallengeBadgeDone from './ChallengeBadgeDone';
import ChallengeStatus from './ChallengeStatus';
import ChallengeClaimReward from './ChallengeClaimReward';
import ChallengeInfo from './ChallengeInfo';
import ChallengeJoinConfirmation from './ChallengeJoinConfirmation';

// Import helper functions
import { mapApiStateToVisualState, getChallengeDataById } from './data/mockChallengeApi';
import shared from './Shared';

const ChallengeBadgeCollection = ({ onClose }) => {
    const [selectedBadge, setSelectedBadge] = useState(null);
    const [selectedChallengeData, setSelectedChallengeData] = useState(null);
    const [showChallengeUpdate, setShowChallengeUpdate] = useState(false);
    const [showChallengeBadgeDone, setShowChallengeBadgeDone] = useState(false);
    const [showChallengeStatus, setShowChallengeStatus] = useState(false);
    const [showChallengeClaimReward, setShowChallengeClaimReward] = useState(false);
    const [showChallengeInfo, setShowChallengeInfo] = useState(false);
    const [showChallengeJoinConfirmation, setShowChallengeJoinConfirmation] = useState(false);
    const [challengeStatusType, setChallengeStatusType] = useState('incomplete');
    const [allBadges, setAllBadges] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reloadTrigger, setReloadTrigger] = useState(0);

    // Process challenges from API response
    const processChallengesFromApi = (apiChallenges) => {
        const processedBadges = [];

        apiChallenges.forEach(apiChallenge => {
            // Determine challenge type based on ID ranges
            let challengeType = 'weekly';
            if (apiChallenge.id >= 10001 && apiChallenge.id <= 10012) {
                challengeType = 'monthly';
            } else if (apiChallenge.id >= 100001) {
                challengeType = 'yearly';
            }

            const challengeData = getChallengeDataById(apiChallenge.id, challengeType);
            const visualState = mapApiStateToVisualState(apiChallenge.state, apiChallenge.hasReward);
            
            if (challengeData) {
                processedBadges.push({
                    id: apiChallenge.id,
                    title: challengeData.title,
                    shortTitle: challengeData.shortTitle,
                    visualType: visualState.visualType,
                    logicState: visualState.logicState,
                    img: getBadgeImage(apiChallenge.id),
                    type: challengeType,
                    trailName: 'INCA TRAIL' // Default trail name, can be from API
                });
            } else {
                // Fallback for challenges not found in local data
                processedBadges.push({
                    id: apiChallenge.id,
                    title: apiChallenge.name || 'Unknown Challenge',
                    shortTitle: apiChallenge.name || 'Unknown',
                    visualType: visualState.visualType,
                    logicState: visualState.logicState,
                    img: getBadgeImage(apiChallenge.id),
                    type: challengeType,
                    trailName: 'INCA TRAIL'
                });
            }
        });

        return processedBadges;
    };

    // Load badges from API
    React.useEffect(() => {
        const loadBadges = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const result = await shared.getBadgesEarned();
                
                if (result.success) {
                    const processedBadges = processChallengesFromApi(result.data);
                    setAllBadges(processedBadges);
                } else {
                    setError(result.error || 'Failed to load badges');
                    console.error('Failed to load badges:', result.error);
                }
            } catch (err) {
                setError('Network error occurred');
                console.error('Error loading badges:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadBadges();
    }, [reloadTrigger]);

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
                                
                                // Determine which view to show based on API state (same logic as ChallengesMenu)
                                if (challengeDetail.state === 10) {
                                    // State_Joining = 10 -> User has joined -> go to Challenge Update
                                    setShowChallengeUpdate(true);
                                } else if (challengeDetail.state === 20) {
                                    // State_Expired = 20 -> Challenge expired
                                    console.log('Challenge expired');
                                    // Call API to get challenge detail for expired challenges
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
                                        endTime: challengeDetail.endTime,
                                        failDescription: challengeData?.failDescription || "Challenge expired."
                                    };
                                    
                                    setSelectedChallengeData(combinedChallengeData);
                                    setChallengeStatusType('missed');
                                    setShowChallengeStatus(true);
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
                        // Call API to get challenge detail for claimed challenges
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
                                setShowChallengeBadgeDone(true);
                            } else {
                                console.error('Failed to get challenge detail:', result.error);
                                // Fallback to original behavior
                                const challengeDataClaimed = getChallengeDataById(badge.id, badge.type);
                                setSelectedChallengeData(challengeDataClaimed);
                                setShowChallengeBadgeDone(true);
                            }
                        } catch (error) {
                            console.error('Error fetching challenge detail:', error);
                            // Fallback to original behavior
                            const challengeDataClaimed = getChallengeDataById(badge.id, badge.type);
                            setSelectedChallengeData(challengeDataClaimed);
                            setShowChallengeBadgeDone(true);
                        }
                        break;
                    case 'done-and-unclaimed':
                        // Call API to get challenge detail for unclaimed challenges
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
                                setShowChallengeClaimReward(true);
                            } else {
                                console.error('Failed to get challenge detail:', result.error);
                                // Fallback to original behavior
                                const challengeDataUnclaimed = getChallengeDataById(badge.id, badge.type);
                                setSelectedChallengeData(challengeDataUnclaimed);
                                setShowChallengeClaimReward(true);
                            }
                        } catch (error) {
                            console.error('Error fetching challenge detail:', error);
                            // Fallback to original behavior
                            const challengeDataUnclaimed = getChallengeDataById(badge.id, badge.type);
                            setSelectedChallengeData(challengeDataUnclaimed);
                            setShowChallengeClaimReward(true);
                        }
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
                    // Close the confirmation screen and stay on badge collection
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
                    id: selectedChallengeData.id, // ✅ Thêm challengeId
                    stepsCompleted: selectedChallengeData.stepsEst || 99999,
                    distanceKm: selectedChallengeData.distanceKm || 9999,
                    badgeName: `${selectedChallengeData.shortTitle}`,
                    challengeTitle: selectedChallengeData.shortTitle,
                    starletsReward: selectedChallengeData.reward || 400, // ✅ Sử dụng reward từ API
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
                    starletsReward: selectedChallengeData.reward || 400, // ✅ Sử dụng reward từ API
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
                    {isLoading ? (
                        <div className="challenge-badges-loading">
                            <div className="loading-spinner"></div>
                            <p>Loading badges...</p>
                        </div>
                    ) : error ? (
                        <div className="challenge-badges-error">
                            <p>Error loading badges: {error}</p>
                            <button 
                                className="retry-button"
                                onClick={() => {
                                    setReloadTrigger(prev => prev + 1);
                                }}
                            >
                                Retry
                            </button>
                        </div>
                    ) : allBadges.length === 0 ? (
                        <div className="challenge-badges-empty">
                            <p>No badges available</p>
                        </div>
                    ) : (
                        allBadges.map((badge, index) => (
                            <button
                                key={badge.id}
                                className={`challenge-badge-item challenge-badge-${badge.visualType}`}
                                onClick={() => handleBadgeClick(badge)}
                            >
                                <div className="challenge-badge-content">
                                    <span className={`challenge-badge-icon ${badge.visualType === 'locked' ? 'challenge-badge-locked' : badge.visualType === 'unknown' ? 'challenge-badge-unknown' : ''}`}>
                                        <img 
                                            src={badge.img} 
                                            alt="Badge" 
                                        />
                                    </span>
                                    {badge.visualType === 'locked' && (
                                        <div className="challenge-badge-status-icon challenge-badge-locked-icon">
                                                    <img src={getLockIcon()} alt="Locked" />
                                        </div>
                                    )}
                                    {badge.visualType === 'unknown' && (
                                        <div className="challenge-badge-status-icon challenge-badge-unknown-icon">
                                                    <img src={getQuestionIcon()} alt="Unknown" />
                                        </div>
                                    )}
                                    <span className="challenge-badge-name">{badge.shortTitle}</span>
                                </div>
                            </button>
                        ))
                    )}
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

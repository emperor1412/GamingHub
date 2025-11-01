import React, { useState, useEffect, useCallback } from 'react';
import './ChallengesMenu.css';
import robotCowboyChallenges from './images/challenges_robot_cowboy.png';
import backIcon from './images/back.svg';
import starletIcon from './images/starlet.png';
import premiumIcon from './images/Premium_icon.png';
import stepIcon from './images/step_icon.png';
import lockIconChallenge from './images/lock_icon_challenge.png';

import { 
    getCurrentChallenge, 
    getUserData, 
    hasJoinedChallenge, 
    hasEnoughStarlets, 
    joinChallenge 
} from './data/challengesData';
import { mockCurrentChallengeDataApiResponse, getChallengeDataById } from './data/mockChallengeApi';
import ChallengeInfo from './ChallengeInfo';
import ChallengeJoinConfirmation from './ChallengeJoinConfirmation';
import ChallengeUpdate from './ChallengeUpdate';
import ChallengeError from './ChallengeError';
import ChallengeBadgeScreen from './ChallengeBadgeScreen';
import ChallengeBadgeCollection from './ChallengeBadgeCollection';
import shared from './Shared';
import { popup } from '@telegram-apps/sdk';

const WELCOME_FLAG_KEY = 'challengesWelcomeShown';
const CHALLENGE_START_DATE_UTC = new Date('2025-11-03T00:00:00Z'); // November 3, 2025 0:00 UTC

const ChallengesMenu = ({ onClose, onDataRefresh }) => {
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [showChallengeJoinConfirmation, setShowChallengeJoinConfirmation] = useState(false);
    const [showChallengeUpdate, setShowChallengeUpdate] = useState(false);
    const [showChallengeError, setShowChallengeError] = useState(false);
    const [selectedChallengeType, setSelectedChallengeType] = useState(null);
    const [showBadgeScreen, setShowBadgeScreen] = useState(false);
    const [showBadgeCollection, setShowBadgeCollection] = useState(false);
    const [apiChallenges, setApiChallenges] = useState([]); // from /api/app/challengeList
    const [isLoadingChallenges, setIsLoadingChallenges] = useState(false);
    const [challengeDetails, setChallengeDetails] = useState({}); // Cache for challenge details
    const [hasApiError, setHasApiError] = useState(false); // Track API error state
    const [showWelcome, setShowWelcome] = useState(false); // Welcome overlay state
    const [isBeforeStartDate, setIsBeforeStartDate] = useState(false); // Track if before Nov 3, 2025

    // Function to check if current date is before Nov 3, 2025 0:00 UTC
    const checkIfBeforeStartDate = () => {
        const now = new Date();
        return now < CHALLENGE_START_DATE_UTC;
    };

    // Function to fetch challenges from badge view API (for before start date)
    const fetchChallengesFromBadgeView = async () => {
        try {
            setIsLoadingChallenges(true);
            const result = await shared.getBadgesEarned();
            
            if (result.success && result.data) {
                // Filter challenges with state = 0 and map them to apiChallenges format
                const upcomingChallenges = result.data
                    .filter(challenge => challenge.state === 0)
                    .map(challenge => ({
                        id: challenge.id,
                        name: challenge.name,
                        type: challenge.type,
                        price: challenge.price,
                        step: challenge.step,
                        state: 0,
                        startTime: challenge.startTime,
                        endTime: challenge.endTime
                    }));
                
                setApiChallenges(upcomingChallenges);
                console.log('[badge view challenges]', upcomingChallenges);
                
                // Set challenge details with state 0
                const detailsMap = {};
                upcomingChallenges.forEach(challenge => {
                    detailsMap[challenge.id] = {
                        id: challenge.id,
                        name: challenge.name,
                        state: 0,
                        price: challenge.price,
                        step: challenge.step,
                        startTime: challenge.startTime,
                        endTime: challenge.endTime
                    };
                });
                setChallengeDetails(detailsMap);
            } else {
                console.error('Failed to fetch badge view challenges:', result.error);
                setHasApiError(true);
            }
        } catch (e) {
            console.error('[badge view] error', e);
            setHasApiError(true);
        } finally {
            setIsLoadingChallenges(false);
        }
    };

    // Function to fetch challenge list
    const fetchChallengeList = async (depth = 0) => {
        if (depth > 3) {
            console.error('fetchChallengeList: too many retries');
            setHasApiError(true);
            setIsLoadingChallenges(false);
            return;
        }

        try {
            setIsLoadingChallenges(true);
            const token = (shared && shared.loginData && shared.loginData.token) ? shared.loginData.token : '';
            const url = `${shared.server_url}/api/app/challengeList?token=${token}`;
            const res = await fetch(url, { method: 'GET' });
            const json = await res.json();
            
            if (json && json.code === 0 && Array.isArray(json.data)) {
                setApiChallenges(json.data);
                console.log('[challengeList]', json.data);
                
                // Fetch challenge details for each challenge
                const detailsPromises = json.data.map(async (challenge) => {
                    try {
                        const result = await shared.getChallengeDetail(challenge.id);
                        if (result.success) {
                            return { id: challenge.id, detail: result.data };
                        }
                    } catch (error) {
                        console.error(`Error fetching detail for challenge ${challenge.id}:`, error);
                    }
                    return null;
                });
                
                const detailsResults = await Promise.all(detailsPromises);
                const detailsMap = {};
                detailsResults.forEach(result => {
                    if (result) {
                        detailsMap[result.id] = result.detail;
                    }
                });
                setChallengeDetails(detailsMap);
                console.log('[challengeDetails]', detailsMap);
            } else if (json.code === 102001 || json.code === 102002) {
                console.log('[challengeList] token expired, attempting to re-login');
                const result = await shared.login(shared.initData);
                if (result.success) {
                    console.log('[challengeList] re-login successful, retrying');
                    return fetchChallengeList(depth + 1);
                } else {
                    console.error('[challengeList] re-login failed:', result.error);
                    setHasApiError(true);
                }
            } else {
                console.warn('[challengeList] unexpected response', json);
                setHasApiError(true);
            }
        } catch (e) {
            console.error('[challengeList] error', e);
            setHasApiError(true);
        } finally {
            setIsLoadingChallenges(false);
        }
    };

    // Fetch 3 challenges from backend (challengeList or badge view depending on date)
    useEffect(() => {
        const beforeStartDate = checkIfBeforeStartDate();
        setIsBeforeStartDate(beforeStartDate);
        
        if (beforeStartDate) {
            // Before Nov 3, 2025 - fetch from badge view
            fetchChallengesFromBadgeView();
        } else {
            // After Nov 3, 2025 - use regular challenge list
            fetchChallengeList();
        }
    }, []);

    // Listen for data refresh requests
    useEffect(() => {
        if (onDataRefresh) {
            const beforeStartDate = checkIfBeforeStartDate();
            if (beforeStartDate) {
                fetchChallengesFromBadgeView();
            } else {
                fetchChallengeList();
            }
        }
    }, [onDataRefresh]);

    // Show welcome overlay only once per app session
    useEffect(() => {
        try {
            const shown = sessionStorage.getItem(WELCOME_FLAG_KEY);
            if (!shown) {
                setShowWelcome(true);
                sessionStorage.setItem(WELCOME_FLAG_KEY, '1');
            }
        } catch (e) {
            // Fallback if sessionStorage is unavailable
            setShowWelcome(true);
        }
    }, []);

    // Prevent body scroll when welcome overlay is shown
    useEffect(() => {
        if (showWelcome) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        // Cleanup function to restore scroll when component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showWelcome]);

    const getApiChallengeByType = (typeInt) => {
        return apiChallenges.find(c => c.type === typeInt);
    };

    const mapTypeStringToInt = (t) => {
        switch (t) {
            case 'weekly': return 1;
            case 'monthly': return 2;
            case 'yearly': return 3;
            default: return 0;
        }
    };

    // Helper function to get current challenge from API mock (only if no API error)
    const getCurrentChallengeFromApi = (challengeType) => {
        // Removed mock data fallback - only use real API data
        return null;
    };

    // Helper function to get font size based on text length
    const getFontSizeByTextLength = (text) => {
        const textLength = text.length;
        if (textLength > 35) {
            return '10px';
        } else if (textLength > 23) {
            return '12px';
        } else {
            return '14px';
        }
    };

    // Helper function to calculate days until start date
    const getDaysUntilStart = (startTime) => {
        if (!startTime) return 0;
        const start = new Date(startTime * 1000); // Convert Unix timestamp to JS date
        const now = new Date();
        const diffTime = start - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    };

    // Helper function to check challenge conditions
    const getChallengeState = (challengeType) => {
        const challenge = getCurrentChallengeFromApi(challengeType);
        
        // Get user data from shared
        const userLevel = shared.userProfile?.level || 0;
        const isPremiumUser = shared.isPremiumMember || false;
        const apiItem = getApiChallengeByType(mapTypeStringToInt(challengeType));
        
        // Check conditions in order of priority
        let isDisabled = false;
        let disabledReason = '';
        let subReason = '';
        

        // 1. Premium pass required for weekly and yearly challenges
         if ((challengeType === 'weekly' || challengeType === 'yearly') && !isPremiumUser) {
            isDisabled = true;
            disabledReason = 'PREMIUM PASS USER CHALLENGE';
        }
        // 2. Level required
        else if (userLevel < 10 && !isPremiumUser) {
            isDisabled = true;
            disabledReason = `ACCOUNT LVL 10 REQUIRED TO UNLOCK`;
        }
        // 3. Challenge completed (state 40) - check from cached challenge details
        else if (apiItem && challengeDetails[apiItem.id]?.state === 40) {
            isDisabled = true;
            disabledReason = 'CHALLENGE ACHIEVED';
            subReason = '(Check explorer journey to view your badge)';
        }
        
        return { isDisabled, disabledReason, subReason };
    };

    const handleNotReadyChallengeClick = async () => {
        try {
            await popup.open({
                title: 'Event not started',
                message: `Challenges open Monday! \nStock up on Starlets, lace up, and get ready to bank your steps!`,
                buttons: [{ id: 'ok', type: 'default', text: 'OK' }],
            });
        } catch (error) {
            console.error('Error showing popup:', error);
        }
    };

    const handleChallengeClick = async (challengeType) => {

        const beforeStartDate = checkIfBeforeStartDate();
        setIsBeforeStartDate(beforeStartDate);

        if (beforeStartDate) {
            await handleNotReadyChallengeClick();
            return;
        }

        const state = getChallengeState(challengeType);
        const apiItem = getApiChallengeByType(mapTypeStringToInt(challengeType));
        
        // Don't allow click if challenge is completed and reward claimed (state 40)
        if (apiItem && apiItem.state === 40) {
            return; // Don't do anything for completed challenges
        }
        
        // Only allow click if not disabled and we have API data
        if (!state.isDisabled && apiItem) {
            try {
                // Call API to get challenge detail
                const result = await shared.getChallengeDetail(apiItem.id);
                const challengeData = getChallengeDataById(apiItem.id, apiItem.type || 'weekly');

                if (result.success) {
                    const challengeDetail = result.data;
                    
                    // Use only API data - no mock fallback
                    const challenge = {
                        id: challengeDetail.id,
                        title: (challengeDetail.name || '').trim(),
                        shortTitle: (challengeData.shortTitle || '').trim(),
                        type: challengeType.toUpperCase(),
                        entryFee: challengeDetail.price,
                        reward: challengeDetail.price * 2, // Reward is double the entry fee
                        stepsEst: challengeDetail.step,
                        // API data only
                        state: challengeDetail.state,
                        currentSteps: challengeDetail.currSteps,
                        totalSteps: challengeDetail.step,
                        startTime: challengeDetail.startTime,
                        endTime: challengeDetail.endTime
                    };
                    
                    setSelectedChallenge(challenge);
                    setSelectedChallengeType(challengeType);
                    
                    // Determine which view to show based on state
                    if (challengeDetail.state === 10) {
                        // State_Joining = 10 -> User has joined -> go to Challenge Update
                        setShowChallengeUpdate(true);
                    } else if (challengeDetail.state === 20) {
                        // State_Expired = 20 -> Challenge expired
                        console.log('Challenge expired');
                        // You can show an error or different view here
                    } else if (challengeDetail.state === 30) {
                        // State_Complete = 30 -> User completed challenge (can claim reward) -> go to Challenge Update
                        console.log('Challenge completed - can claim reward');
                        setShowChallengeUpdate(true);
                    } else if (challengeDetail.state === 40) {
                        // State_RewardClaimed = 40 -> User claimed the reward -> show dimmed button
                        console.log('Challenge completed and reward claimed');
                        // Don't show any screen, just keep the challenge card dimmed
                    } else {
                        // User hasn't joined -> go to Challenge Info
                        // ChallengeInfo will be shown automatically
                    }
                } else {
                    console.error('Failed to get challenge detail:', result.error);
                    // No fallback - just return without showing any screen
                }
            } catch (error) {
                console.error('Error fetching challenge detail:', error);
                // No fallback - just return without showing any screen
            }
        }
    };

    const handleJoinChallenge = () => {
        // Show ChallengeJoinConfirmation page
        setShowChallengeJoinConfirmation(true);
    };

    const handleConfirmJoin = () => {
        // This function is no longer needed since API handles the logic
        // But keeping it for backward compatibility
        console.log('handleConfirmJoin called - API will handle the logic');
    };

    const handleShowError = () => {
        // Show error screen when API returns not enough starlets
        setShowChallengeJoinConfirmation(false);
        setShowChallengeError(true);
    };

    const handleBackFromConfirmation = () => {
        // Go back to ChallengeInfo
        setShowChallengeJoinConfirmation(false);
    };

    const handleBackFromUpdate = () => {
        // Go back to challenges menu
        setShowChallengeUpdate(false);
        setSelectedChallenge(null);
        setSelectedChallengeType(null);
        
        // Refresh challenge list to update state
        fetchChallengeList();
    };

    const handleBackFromUpdateAfterJoin = () => {
        // After joining challenge, go back to challenges menu (skip ChallengeInfo)
        setShowChallengeUpdate(false);
        setShowChallengeJoinConfirmation(false);
        setSelectedChallenge(null);
        setSelectedChallengeType(null);
        
        // Refresh challenge list to update state (show "Active" indicator)
        fetchChallengeList();
    };

    const handleDoneFromUpdate = () => {
        // Handle done action from ChallengeUpdate
        console.log('Done from ChallengeUpdate');
        setShowChallengeUpdate(false);
        setSelectedChallenge(null);
        setSelectedChallengeType(null);
        
        // Refresh challenge list to update state
        fetchChallengeList();
    };

    const handleGoToMarket = () => {
        // Close error and go to market
        setShowChallengeError(false);
        setSelectedChallenge(null);
        setSelectedChallengeType(null);
        
        // Navigate to market tab
        if (shared.setActiveTab) {
            shared.setActiveTab('market');
        } else {
            console.error('setActiveTab function not available');
        }
    };

    const handleBackFromError = () => {
        // Go back to ChallengeInfo
        setShowChallengeError(false);
    };

    const handleExplorerJourney = () => {
        setShowBadgeScreen(true);
    };

    const handleBackFromBadgeScreen = () => {
        setShowBadgeScreen(false);
        
        const beforeStartDate = checkIfBeforeStartDate();
        setIsBeforeStartDate(beforeStartDate);
        
        if (beforeStartDate) {
            // Before Nov 3, 2025 - fetch from badge view
            fetchChallengesFromBadgeView();
        } else {
            // After Nov 3, 2025 - use regular challenge list
            fetchChallengeList();
        }
    };

    const handleExplorerBadgesClick = () => {
        setShowBadgeCollection(true);
    };

    const handleBackFromBadgeCollection = () => {
        setShowBadgeCollection(false);
        
        // Refresh challenge list to update state
        fetchChallengeList();
    };

    const handleViewBadges = () => {
        // Close any open screens and show badge screen
        setShowChallengeUpdate(false);
        setShowChallengeJoinConfirmation(false);
        setShowChallengeError(false);
        setSelectedChallenge(null);
        setSelectedChallengeType(null);
        setShowBadgeScreen(true);
    };

    const handleWelcomeClose = () => {
        setShowWelcome(false);
    };

    // Function to handle data refresh from child components
    const handleDataRefresh = React.useCallback(() => {
        // Refresh challenge list data
        const beforeStartDate = checkIfBeforeStartDate();
        if (beforeStartDate) {
            fetchChallengesFromBadgeView();
        } else {
            fetchChallengeList();
        }
    }, []); // Empty dependency array to prevent recreation

    // Show BadgeCollection if user clicked Explorer Badges
    if (showBadgeCollection) {
        return (
            <ChallengeBadgeCollection
                onClose={handleBackFromBadgeCollection}
            />
        );
    }

    // Show ChallengeBadgeScreen if user clicked Explorer Journey
    if (showBadgeScreen) {
        return (
            <ChallengeBadgeScreen
                onClose={handleBackFromBadgeScreen}
                onExplorerBadgesClick={handleExplorerBadgesClick}
                onDataRefresh={handleDataRefresh}
            />
        );
    }

    // Show ChallengeError if user doesn't have enough starlets
    if (showChallengeError) {
        return (
            <ChallengeError
                onGoToMarket={handleGoToMarket}
                onBack={handleBackFromError}
            />
        );
    }

    // Show ChallengeUpdate if user has joined challenge
    if (showChallengeUpdate && selectedChallenge) {
        return (
            <ChallengeUpdate
                challengeData={{
                    // API data only
                    id: selectedChallenge.id,
                    currentSteps: selectedChallenge.currentSteps || 0,
                    totalSteps: selectedChallenge.totalSteps || selectedChallenge.stepsEst || 0,
                    endTime: selectedChallenge.endTime || 0,
                    startTime: selectedChallenge.startTime || 0,
                    stepsEst: selectedChallenge.stepsEst,
                    title: selectedChallenge.title,
                    shortTitle: selectedChallenge.shortTitle,
                    starletsReward: selectedChallenge.reward,
                    type: selectedChallenge.type || "WEEKLY"
                }}
                onDone={handleDoneFromUpdate}
                onBack={handleBackFromUpdate}
                onViewBadges={handleViewBadges}
                onDataRefresh={handleDataRefresh}
            />
        );
    }

    // Show ChallengeJoinConfirmation if user clicked join
    if (showChallengeJoinConfirmation && selectedChallenge) {
        return (
            <ChallengeJoinConfirmation 
                challengeData={{
                    id: selectedChallenge.id,
                    steps: selectedChallenge.stepsEst,
                    days: selectedChallengeType === 'weekly' ? 7 : selectedChallengeType === 'monthly' ? 30 : 365,
                    starletsCost: selectedChallenge.entryFee,
                    badgeName: "EXPLORER BADGE",
                    endTime: selectedChallenge.endTime,
                    type: selectedChallengeType
                }}
                onJoinChallenge={handleConfirmJoin}
                onBack={handleBackFromConfirmation}
                onBackAfterJoin={handleBackFromUpdateAfterJoin}
                onViewBadges={handleViewBadges}
                onShowError={handleShowError}
                onDataRefresh={handleDataRefresh}
            />
        );
    }

    // Show ChallengeInfo if a challenge is selected
    if (selectedChallenge) {
        return (
            <ChallengeInfo 
                challenge={selectedChallenge}
                onClose={() => {
                    setSelectedChallenge(null);
                    setSelectedChallengeType(null);
                }}
                onJoinChallenge={handleJoinChallenge}
            />
        );
    }

    // Show error state if API failed
    if (hasApiError) {
        return (
            <div className="challenges-menu">
                {/* Header */}
                <button className="challenges-back-button" onClick={onClose}>
                    <img src={backIcon} alt="Back" />
                </button>
                
                {/* Error Content */}
                <div className="challenges-content">
                    <div className="challenges-error-container">
                        <div className="challenges-error-text">Failed to load challenges</div>
                        <div className="challenges-error-details">Please check your connection and try again</div>
                        <button 
                            className="challenges-retry-button"
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
        <div className="challenges-menu">
            {/* Welcome Overlay */}
            {showWelcome && (
                <div className="challenges-welcome-overlay">
                    <div className="challenges-welcome-content">
                        {/* Title Section */}
                        <div className="welcome-header">
                            <div className="challenges-title">
                                <div className="title-border">
                                    <div className="challenges-welcome-title-text">WELCOME TO CHALLENGES</div>
                                    <div className="challenges-corner challenges-top-left"></div>
                                    <div className="challenges-corner challenges-top-right"></div>
                                    <div className="challenges-corner challenges-bottom-left"></div>
                                    <div className="challenges-corner challenges-bottom-right"></div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Body Text Section */}
                        <div className="challenges-welcome-body">
                            <div className="challenges-welcome-text challenges-welcome-text-white">
                                TRAVEL ACROSS MOUNTAINS, COASTLINES, AND CITIES AS YOU TAKE ON EPIC TRAILS AND EARN UNIQUE BADGES FOR YOUR ACHIEVEMENTS.
                            </div>
                            <div className="challenges-welcome-text challenges-welcome-text-cyan">
                                WEEKLY, MONTHLY, AND YEARLY CHALLENGES AWAIT.
                            </div>
                            
                            {/* Membership Boxes */}
                            <div className="challenges-welcome-membership-box">
                                <div className="challenges-welcome-box-left">
                                    NON-PREMIUM MEMBERS
                                </div>
                                <div className="challenges-welcome-box-right">
                                    CAN JOIN MONTHLY CHALLENGES ONCE THEY REACH LEVEL 10.
                                </div>
                            </div>

                            <div className="challenges-welcome-membership-box">
                                <div className="challenges-welcome-box-left has-icon">
                                    <img src={premiumIcon} alt="Premium" className="premium-icon" />
                                    PREMIUM MEMBERS
                                </div>
                                <div className="challenges-welcome-box-right">
                                    UNLOCK ALL CHALLENGES AND COLLECT EVERY BADGE.
                                </div>
                            </div>

                            {/* Starlets Section */}
                            <div className="challenges-welcome-starlets-section">
                                <div className="challenges-welcome-starlets-icon">
                                    <img alt="Starlets" src={starletIcon}/>
                                    <div className="starlets-x2-badge">X2</div>
                                </div>
                                <div className="challenges-welcome-starlets-text">
                                    <span>SPEND STARLETS TO ENTER - AND IF YOU FINISH THE CHALLENGE WITHIN THE SET TIMEFRAME, YOU'LL EARN DOUBLE YOUR STARLETS BACK.</span>
                                </div>
                            </div>

                            <div className="challenges-welcome-text challenges-welcome-text-cyan">
                                READY TO START YOUR ADVENTURE?
                            </div>
                        </div>
                        
                        {/* CTA Button */}
                        <button className="challenges-welcome-cta-btn" onClick={handleWelcomeClose}>
                            PROCEED TO CHALLENGES
                        </button>
                        
                        {/* Premium Button - Only for non-premium users */}
                        {!shared.isPremiumMember && (
                            <button 
                                className="challenges-welcome-premium-btn" 
                                onClick={() => {
                                    handleWelcomeClose();
                                    // Navigate to Premium or Market
                                    if (shared.setView) {
                                        shared.setView('premium');
                                    } else if (shared.setActiveTab) {
                                        shared.setActiveTab('market');
                                    }
                                }}
                            >
                                <div className="premium-btn-content">
                                    <img src={premiumIcon} alt="Premium" className="premium-btn-icon" />
                                    <div className="premium-btn-main">
                                        <span className="premium-btn-text-large">UPGRADE TO</span>
                                        <span className="premium-btn-text-large">PREMIUM MEMBERSHIP</span>
                                    </div>
                                </div>
                            </button>
                        )}
                        
                        {/* Bottom Navigation Bar */}
                        <div className="challenges-welcome-bottom-nav">
                            <div className="challenges-welcome-nav-icon challenges-welcome-nav-selected">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" stroke="#00FFFF" strokeWidth="2" fill="none"/>
                                </svg>
                            </div>
                            <div className="challenges-welcome-nav-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" stroke="white" strokeWidth="2" fill="none"/>
                                </svg>
                            </div>
                            <div className="challenges-welcome-nav-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <div className="challenges-welcome-nav-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V19C17 19.6 16.6 20 16 20H8C7.4 20 7 19.6 7 19V13M17 13H7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <div className="challenges-welcome-nav-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="white" strokeWidth="2"/>
                                    <circle cx="12" cy="16" r="1" fill="white"/>
                                    <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="white" strokeWidth="2"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <button className="challenges-back-button" onClick={onClose}>
                <img src={backIcon} alt="Back" />
            </button>
            
            <div className="challenges-header">
                <div className="challenges-title">
                    <div className="title-border">
                        <span>CHALLENGES</span>
                        <div className="challenges-corner challenges-top-left"></div>
                        <div className="challenges-corner challenges-top-right"></div>
                        <div className="challenges-corner challenges-bottom-left"></div>
                        <div className="challenges-corner challenges-bottom-right"></div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="challenges-content">
                {/* Challenge Cards */}
                <div className="challenge-cards">
                    {/* Weekly Challenge */}
                    <div 
                        className={`challenge-card ${getChallengeState('weekly').isDisabled ? 'locked' : ''} ${getApiChallengeByType(1)?.state === 40 ? 'completed' : ''}`}
                        onClick={() => handleChallengeClick('weekly')}
                    >
                        {(() => {
                            const weeklyState = getChallengeState('weekly');
                            const weeklyApi = getApiChallengeByType(1);
                            const weeklyChallenge = getCurrentChallengeFromApi('weekly');
                            const weeklyChallengeState = weeklyApi ? challengeDetails[weeklyApi.id]?.state : null;
                            
                            if (weeklyState.isDisabled) {
                                return (
                                    <div className="challenge-lock-overlay">
                                        {weeklyState.subReason ? (
                                            <div className="lock-text-container">
                                                <div className="lock-text">{weeklyState.disabledReason}</div>
                                                <div className="lock-subtext">{weeklyState.subReason}</div>
                                            </div>
                                        ) : (
                                            <div className="lock-text">{weeklyState.disabledReason}</div>
                                        )}
                                    </div>
                                );
                            } else if (weeklyChallengeState === 40) {
                                return (
                                    <div className="challenge-completed-overlay">
                                        <div className="completed-text">CHALLENGE HAS COMPLETED</div>
                                    </div>
                                );
                            } else {
                                return (
                                    <>
                                        <div className="challenge-info">
                                            <div className="challenge-type">WEEKLY CHALLENGE:</div>
                                            {weeklyApi ? (
                                                <>
                                                    <div className="challenge-name" style={{ fontSize: getFontSizeByTextLength(weeklyApi.name || '') }}>
                                                        {(weeklyApi.name || '').toUpperCase()}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="challenge-name">NO CHALLENGE AVAILABLE</div>
                                            )}
                                        </div>
                                        {weeklyApi && (
                                            <>
                                                {isBeforeStartDate ? (
                                                    <div className="challenge-reward">
                                                        <span className="reward-amount challenge-start-date">STARTS MON</span>
                                                        <img src={lockIconChallenge} alt="Locked" className="starlet-icon" />
                                                    </div>
                                                ) : weeklyChallengeState === 10 || weeklyChallengeState === 30 ? (
                                                    <div className="challenge-active">
                                                        <span className="active-text">Active</span>
                                                        <img src={stepIcon} alt="Step" className="step-icon-active" />
                                                    </div>
                                                ) : (
                                                    <div className="challenge-reward">
                                                        <span className="reward-amount">{weeklyApi.price}</span>
                                                        <img src={starletIcon} alt="Starlet" className="starlet-icon" />
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </>
                                );
                            }
                        })()}
                    </div>

                    {/* Monthly Challenge */}
                    <div 
                        className={`challenge-card ${getChallengeState('monthly').isDisabled ? 'locked' : ''} ${getApiChallengeByType(2)?.state === 40 ? 'completed' : ''}`}
                        onClick={() => handleChallengeClick('monthly')}
                    >
                        {(() => {
                            const monthlyState = getChallengeState('monthly');
                            const monthlyApi = getApiChallengeByType(2);
                            const monthlyChallenge = getCurrentChallengeFromApi('monthly');
                            const monthlyChallengeState = monthlyApi ? challengeDetails[monthlyApi.id]?.state : null;
                            
                            if (monthlyState.isDisabled) {
                                return (
                                    <div className="challenge-lock-overlay">
                                        {monthlyState.subReason ? (
                                            <div className="lock-text-container">
                                                <div className="lock-text">{monthlyState.disabledReason}</div>
                                                <div className="lock-subtext">{monthlyState.subReason}</div>
                                            </div>
                                        ) : (
                                            <div className="lock-text">{monthlyState.disabledReason}</div>
                                        )}
                                    </div>
                                );
                            } else if (monthlyChallengeState === 40) {
                                return (
                                    <div className="challenge-completed-overlay">
                                        <div className="completed-text">CHALLENGE HAS COMPLETED</div>
                                    </div>
                                );
                            } else {
                                return (
                                    <>
                                        <div className="challenge-info">
                                            <div className="challenge-type">MONTHLY CHALLENGE:</div>
                                            {monthlyApi ? (
                                                <>
                                                    <div className="challenge-name" style={{ fontSize: getFontSizeByTextLength(monthlyApi.name || '') }}>
                                                        {(monthlyApi.name || '').toUpperCase()}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="challenge-name">NO CHALLENGE AVAILABLE</div>
                                            )}
                                        </div>
                                        {monthlyApi && (
                                            <>
                                                {isBeforeStartDate ? (
                                                    <div className="challenge-reward">
                                                        <span className="reward-amount challenge-start-date">STARTS MON</span>
                                                        <img src={lockIconChallenge} alt="Locked" className="starlet-icon" />
                                                    </div>
                                                ) : monthlyChallengeState === 10 || monthlyChallengeState === 30 ? (
                                                    <div className="challenge-active">
                                                        <span className="active-text">Active</span>
                                                        <img src={stepIcon} alt="Step" className="step-icon-active" />
                                                    </div>
                                                ) : (
                                                    <div className="challenge-reward">
                                                        <span className="reward-amount">{monthlyApi.price}</span>
                                                        <img src={starletIcon} alt="Starlet" className="starlet-icon" />
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </>
                                );
                            }
                        })()}
                    </div>

                    {/* Yearly Challenge */}
                    <div 
                        className={`challenge-card ${getChallengeState('yearly').isDisabled ? 'locked' : ''} ${getApiChallengeByType(3)?.state === 40 ? 'completed' : ''}`}
                        onClick={() => handleChallengeClick('yearly')}
                    >
                        {(() => {
                            const yearlyState = getChallengeState('yearly');
                            const yearlyApi = getApiChallengeByType(3);
                            const yearlyChallenge = getCurrentChallengeFromApi('yearly');
                            const yearlyChallengeState = yearlyApi ? challengeDetails[yearlyApi.id]?.state : null;
                            
                            if (yearlyState.isDisabled) {
                                return (
                                    <div className="challenge-lock-overlay">
                                        {yearlyState.subReason ? (
                                            <div className="lock-text-container">
                                                <div className="lock-text">{yearlyState.disabledReason}</div>
                                                <div className="lock-subtext">{yearlyState.subReason}</div>
                                            </div>
                                        ) : (
                                            <div className="lock-text">{yearlyState.disabledReason}</div>
                                        )}
                                    </div>
                                );
                            } else if (yearlyChallengeState === 40) {
                                return (
                                    <div className="challenge-completed-overlay">
                                        <div className="completed-text">CHALLENGE HAS COMPLETED</div>
                                    </div>
                                );
                            } else {
                                return (
                                    <>
                                        <div className="challenge-info">
                                            <div className="challenge-type">YEARLY CHALLENGE:</div>
                                            {yearlyApi ? (
                                                <>
                                                    <div className="challenge-name" style={{ fontSize: getFontSizeByTextLength(yearlyApi.name || '') }}>
                                                        {(yearlyApi.name || '').toUpperCase()}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="challenge-name">NO CHALLENGE AVAILABLE</div>
                                            )}
                                        </div>
                                        {yearlyApi && (
                                            <>
                                                {isBeforeStartDate ? (
                                                    <div className="challenge-reward">
                                                        <span className="reward-amount challenge-start-date">STARTS MON</span>
                                                        <img src={lockIconChallenge} alt="Locked" className="starlet-icon" />
                                                    </div>
                                                ) : yearlyChallengeState === 10 || yearlyChallengeState === 30 ? (
                                                    <div className="challenge-active">
                                                        <span className="active-text">Active</span>
                                                        <img src={stepIcon} alt="Step" className="step-icon-active" />
                                                    </div>
                                                ) : (
                                                    <div className="challenge-reward">
                                                        <span className="reward-amount">{yearlyApi.price}</span>
                                                        <img src={starletIcon} alt="Starlet" className="starlet-icon" />
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </>
                                );
                            }
                        })()}
                    </div>

                    {/* Explorer Journey Button */}
                    <div className="challenge-card" onClick={handleExplorerJourney}>
                        <div className="challenge-info">
                            <div className="challenge-name-explorer">YOUR EXPLORER JOURNEY</div>
                        </div>
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>

                {/* Badges Section */}
                <div className="badges-section">
                    <div className="badges-content">
                        <div className="robot-illustration">
                            <img
                                src={robotCowboyChallenges}
                                alt="Robot Character"
                                className="robot-image"
                            />
                            <div className="robot-corner robot-top-left"></div>
                            <div className="robot-corner robot-top-right"></div>
                            <div className="robot-corner robot-bottom-left"></div>
                            <div className="robot-corner robot-bottom-right"></div>
                        </div>

                        <div className="unlock-badges-button">
                            <span className="unlock-badges-button-text">UNLOCK</span>
                            <span className="unlock-badges-button-text">EXPLORER</span>
                            <span className="unlock-badges-button-text">BADGES</span>
                        </div>
                    </div>

                    <div className="description-box">
                        <p>WALK, RUN, OR MOVE YOUR WAY THROUGH EPIC JOURNEYS INSPIRED BY FAMOUS TRAILS AND ADVENTURES.</p>
                    </div>

                    <div className="instruction-text">
                        <p>Complete the required steps to conquer the challenge and unlock milestones along the way!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChallengesMenu;

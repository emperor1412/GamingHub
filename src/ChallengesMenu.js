import React, { useState } from 'react';
import './ChallengesMenu.css';
import robotCowboyChallenges from './images/challenges_robot_cowboy.png';
import backIcon from './images/back.svg';
import starletIcon from './images/starlet.png';
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

const ChallengesMenu = ({ onClose, userLevel = 0, isPremiumUser = false }) => {
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [showChallengeJoinConfirmation, setShowChallengeJoinConfirmation] = useState(false);
    const [showChallengeUpdate, setShowChallengeUpdate] = useState(false);
    const [showChallengeError, setShowChallengeError] = useState(false);
    const [selectedChallengeType, setSelectedChallengeType] = useState(null);
    const [showBadgeScreen, setShowBadgeScreen] = useState(false);

    // Helper function to get current challenge from API mock
    const getCurrentChallengeFromApi = (challengeType) => {
        const apiResponse = mockCurrentChallengeDataApiResponse[challengeType];
        if (apiResponse) {
            const detailedData = getChallengeDataById(apiResponse.id, challengeType);
            if (detailedData) {
                return {
                    ...detailedData,
                    entryFee: apiResponse.price,
                    reward: apiResponse.price * 2, // Reward is double the entry fee
                    levelRequired: 2,
                    needPremium: challengeType === 'monthly',
                    currentSteps: 0,
                    isCompleted: false
                };
            }
        }
        return null;
    };

    // Helper function to check challenge conditions
    const getChallengeState = (challengeType) => {
        const challenge = getCurrentChallengeFromApi(challengeType);
        
        // Check conditions in order of priority
        let isDisabled = false;
        let disabledReason = '';
        
        // 1. Level required
        if (userLevel < challenge.levelRequired) {
            isDisabled = true;
            disabledReason = `ACCOUNT LVL ${challenge.levelRequired} REQUIRED TO UNLOCK`;
        }
        // 2. Premium pass required
        else if (challenge.needPremium && !isPremiumUser) {
            isDisabled = true;
            disabledReason = 'PREMIUM PASS USER CHALLENGE';
        }

        isDisabled = false;
        
        return { isDisabled, disabledReason };
    };

    const handleChallengeClick = (challengeType) => {
        const challenge = getCurrentChallengeFromApi(challengeType);
        const state = getChallengeState(challengeType);
        
        // Only allow click if not disabled
        if (!state.isDisabled) {
            setSelectedChallenge(challenge);
            setSelectedChallengeType(challengeType);
            
            // Check if user has already joined this challenge
            if (hasJoinedChallenge(challengeType)) {
                // User has joined -> go to Challenge Update
                setShowChallengeUpdate(true);
            } else {
                // User hasn't joined -> go to Challenge Info
                // ChallengeInfo will be shown automatically
            }
        }
    };

    const handleJoinChallenge = () => {
        // Show ChallengeJoinConfirmation page
        setShowChallengeJoinConfirmation(true);
    };

    const handleConfirmJoin = () => {
        // Check if user has enough starlets
        const challenge = getCurrentChallengeFromApi(selectedChallengeType);
        const requiredStarlets = challenge.entryFee;
        
        if (hasEnoughStarlets(requiredStarlets)) {
            // User has enough starlets -> join challenge and go to Challenge Update
            joinChallenge(selectedChallengeType);
            setShowChallengeJoinConfirmation(false);
            setShowChallengeUpdate(true);
        } else {
            // User doesn't have enough starlets -> show error
            setShowChallengeJoinConfirmation(false);
            setShowChallengeError(true);
        }
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
    };

    const handleDoneFromUpdate = () => {
        // Handle done action from ChallengeUpdate
        console.log('Done from ChallengeUpdate');
        setShowChallengeUpdate(false);
        setSelectedChallenge(null);
        setSelectedChallengeType(null);
    };

    const handleGoToMarket = () => {
        // Close error and go to market (you can implement market navigation here)
        setShowChallengeError(false);
        setSelectedChallenge(null);
        setSelectedChallengeType(null);
        // You can add navigation to market here
        console.log('Navigate to market');
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
    };

    // Show ChallengeBadgeScreen if user clicked Explorer Journey
    if (showBadgeScreen) {
        return (
            <ChallengeBadgeScreen
                onClose={handleBackFromBadgeScreen}
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
                    challengeEndDate: selectedChallenge.dateEnd ? `${selectedChallenge.dateEnd} 23:59` : "DD/MM/YYYY 23:59",
                    stepsEst: selectedChallenge.stepsEst,
                    distanceKm: selectedChallenge.distanceKm,
                    title: selectedChallenge.title,
                    shortTitle: selectedChallenge.shortTitle,
                    description: selectedChallenge.description,
                    location: selectedChallenge.location,
                    starletsReward: selectedChallenge.reward,
                    type: selectedChallenge.type || "WEEKLY",
                    currentSteps: 100,
                    totalSteps: 500
                }}
                onDone={handleDoneFromUpdate}
                onBack={handleBackFromUpdate}
            />
        );
    }

    // Show ChallengeJoinConfirmation if user clicked join
    if (showChallengeJoinConfirmation && selectedChallenge) {
        return (
            <ChallengeJoinConfirmation 
                challengeData={{
                    steps: selectedChallenge.stepsEst,
                    days: 7, // You can calculate this based on dateStart and dateEnd
                    starletsCost: selectedChallenge.entryFee,
                    badgeName: "EXPLORER BADGE",
                    challengeEndDate: selectedChallenge.dateEnd ? `${selectedChallenge.dateEnd} 13:00 UTC` : "DD/MM/YY HH:MM"
                }}
                onJoinChallenge={handleConfirmJoin}
                onBack={handleBackFromConfirmation}
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

    return (
        <div className="challenges-menu">
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
                        className={`challenge-card ${getChallengeState('weekly').isDisabled ? 'locked' : ''}`}
                        onClick={() => handleChallengeClick('weekly')}
                    >
                        {(() => {
                            const weeklyState = getChallengeState('weekly');
                            const weeklyChallenge = getCurrentChallengeFromApi('weekly');
                            
                            if (weeklyState.isDisabled) {
                                return (
                                    <div className="challenge-lock-overlay">
                                        <div className="lock-text">{weeklyState.disabledReason}</div>
                                    </div>
                                );
                            } else {
                                return (
                                    <>
                                        <div className="challenge-info">
                                            <div className="challenge-type">WEEKLY CHALLENGE:</div>
                                            <div className="challenge-name">{weeklyChallenge.title.toUpperCase()}</div>
                                        </div>
                                        <div className="challenge-reward">
                                            <span className="reward-amount">{weeklyChallenge.reward}</span>
                                            <img src={starletIcon} alt="Starlet" className="starlet-icon" />
                                        </div>
                                    </>
                                );
                            }
                        })()}
                    </div>

                    {/* Monthly Challenge */}
                    <div 
                        className={`challenge-card ${getChallengeState('monthly').isDisabled ? 'locked' : ''}`}
                        onClick={() => handleChallengeClick('monthly')}
                    >
                        {(() => {
                            const monthlyState = getChallengeState('monthly');
                            const monthlyChallenge = getCurrentChallengeFromApi('monthly');
                            
                            if (monthlyState.isDisabled) {
                                return (
                                    <div className="challenge-lock-overlay">
                                        <div className="lock-text">{monthlyState.disabledReason}</div>
                                    </div>
                                );
                            } else {
                                return (
                                    <>
                                        <div className="challenge-info">
                                            <div className="challenge-type">MONTHLY CHALLENGE:</div>
                                            <div className="challenge-name">{monthlyChallenge.title.toUpperCase()}</div>
                                        </div>
                                        <div className="challenge-reward">
                                            <span className="reward-amount">{monthlyChallenge.reward}</span>
                                            <img src={starletIcon} alt="Starlet" className="starlet-icon" />
                                        </div>
                                    </>
                                );
                            }
                        })()}
                    </div>

                    {/* Yearly Challenge */}
                    <div 
                        className={`challenge-card ${getChallengeState('yearly').isDisabled ? 'locked' : ''}`}
                        onClick={() => handleChallengeClick('yearly')}
                    >
                        {(() => {
                            const yearlyState = getChallengeState('yearly');
                            const yearlyChallenge = getCurrentChallengeFromApi('yearly');
                            
                            if (yearlyState.isDisabled) {
                                return (
                                    <div className="challenge-lock-overlay">
                                        <div className="lock-text">{yearlyState.disabledReason}</div>
                                    </div>
                                );
                            } else {
                                return (
                                    <>
                                        <div className="challenge-info">
                                            <div className="challenge-type">YEARLY CHALLENGE:</div>
                                            <div className="challenge-name">{yearlyChallenge.title.toUpperCase()}</div>
                                        </div>
                                        <div className="challenge-reward">
                                            <span className="reward-amount">{yearlyChallenge.reward}</span>
                                            <img src={starletIcon} alt="Starlet" className="starlet-icon" />
                                        </div>
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

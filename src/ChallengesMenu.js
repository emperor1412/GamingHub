import React, { useState } from 'react';
import './ChallengesMenu.css';
import robotChallenges from './images/challenges_robot.png';
import starletExtra from './images/Starlets_Ticket_Extra.png';
import doodleExtra from './images/doodle_extra.png';
import background from './images/background_2.png';
import backIcon from './images/back.svg';
import starletIcon from './images/starlet.png';
import { getCurrentChallenge } from './data/challengesData';
import ChallengeInfo from './ChallengeInfo';

const ChallengesMenu = ({ onClose, userLevel = 0, isPremiumUser = false }) => {
    const [selectedChallenge, setSelectedChallenge] = useState(null);

    // Helper function to check challenge conditions
    const getChallengeState = (challengeType) => {
        const challenge = getCurrentChallenge(challengeType);
        
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
        const challenge = getCurrentChallenge(challengeType);
        const state = getChallengeState(challengeType);
        
        // Only allow click if not disabled
        if (!state.isDisabled) {
            setSelectedChallenge(challenge);
        }
    };

    const handleJoinChallenge = () => {
        // Handle join challenge logic here
        console.log('Joining challenge:', selectedChallenge);
        // You can add your join logic here
    };

    // Show ChallengeInfo if a challenge is selected
    if (selectedChallenge) {
        return (
            <ChallengeInfo 
                challenge={selectedChallenge}
                onClose={() => setSelectedChallenge(null)}
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
                            const weeklyChallenge = getCurrentChallenge('weekly');
                            
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
                            const monthlyChallenge = getCurrentChallenge('monthly');
                            
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
                            const yearlyChallenge = getCurrentChallenge('yearly');
                            
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
                    <div className="challenge-card">
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
                                src={robotChallenges}
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

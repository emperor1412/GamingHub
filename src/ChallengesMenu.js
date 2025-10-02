import React from 'react';
import './ChallengesMenu.css';
import robotChallenges from './images/challenges_robot.png';
import starletExtra from './images/Starlets_Ticket_Extra.png';
import doodleExtra from './images/doodle_extra.png';
import background from './images/background_2.png';
import backIcon from './images/back.svg';
import starletIcon from './images/starlet.png';

const ChallengesMenu = ({ onClose }) => {
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
                    <div className="challenge-card">
                        <div className="challenge-info">
                            <div className="challenge-type">WEEKLY CHALLENGE:</div>
                            <div className="challenge-name">THE INCA TRAIL</div>
                        </div>
                        <div className="challenge-reward">
                            <span className="reward-amount">200</span>
                            <img src={starletIcon} alt="Starlet" className="starlet-icon" />
                        </div>
                    </div>

                    <div className="challenge-card">
                        <div className="challenge-info">
                            <div className="challenge-type">MONTHLY CHALLENGE:</div>
                            <div className="challenge-name">THE GRAND CANYON</div>
                        </div>
                        <div className="challenge-reward">
                            <span className="reward-amount">600</span>
                            <img src={starletIcon} alt="Starlet" className="starlet-icon" />
                        </div>
                    </div>

                    <div className="challenge-card">
                        <div className="challenge-info">
                            <div className="challenge-type">YEARLY CHALLENGE:</div>
                            <div className="challenge-name">THE SILK ROAD EXPEDITION</div>
                        </div>
                        <div className="challenge-reward">
                            <span className="reward-amount">2000</span>
                            <img src={starletIcon} alt="Starlet" className="starlet-icon" />
                        </div>
                    </div>

                    {/* Explorer Journey Button */}
                    <div className="challenge-card">
                        <div className="challenge-info">
                            <div className="challenge-name">YOUR EXPLORER JOURNEY</div>
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

            {/* Bottom Navigation */}
            <div className="bottom-navigation">
                <div className="nav-icon">💬</div>
                <div className="nav-icon">📦</div>
                <div className="nav-icon">👥</div>
                <div className="nav-icon">🛒</div>
                <div className="nav-icon">0</div>
            </div>
        </div>
    );
};

export default ChallengesMenu;

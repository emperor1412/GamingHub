import React, { useEffect, useState, useRef } from 'react';
import iconMarty from './images/Meet Marty 1.png';
import background from './images/background.png';
import shadow from './images/shadow.png';
import backIcon from './images/back.svg';
import './Share.css';
import './LevelUp.css';
import { shareStory } from '@telegram-apps/sdk';
import shared from './Shared';

const LevelUp = ({ onClose }) => {
    const progress = 0; // This could come from props or state
    const [showLevelUpButton, setShowLevelUpButton] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);

    const onClickLevelUp = () => {
        console.log('Level up clicked');
        setShowOverlay(true);
    }

    const onClickShareStory = async () => {
        console.log('Share story clicked');
        if (shareStory.isSupported()) {
            const url = 'https://pub-8bab4a9dfe21470ebad9203e437e2292.r2.dev/miniGameHub/hHinjx/xY6gECBXlMiE1Z95dGmuh/3Pqzg/tEcJ1P3s=.png';
            shareStory(url, {
                text: 'ONLY LEGENDS REACH LEVEL 5! 🏆',
            });
            setShowOverlay(false);
        }
    };

    const setup = () => {
        const kmPoint = shared.getKMPoint();
        const currentRequired = shared.userProfile.levelPoint;
        if (kmPoint >= currentRequired) {
            setShowLevelUpButton(true);
            progress = (kmPoint - currentRequired) * 100;
        }
    };

    useEffect(() => {
        setup();
    }, []);

    return (
        <div className="level-up-container">
            <button className="levelUp-back back-button-alignment" onClick={onClose}>
                <img src={backIcon} alt="Back" />
            </button>

            <div className="level-up-scroll-container">
                <div className="level-content">
                    <h2 className="level-header">YOU NEED 9,000 KM POINTS TO REACH THE NEXT LEVEL.</h2>
          
                    <div className="marty-card-outer">
                        <div className='marty-gradient-layer'></div>
                        <div className="marty-card">
                            <img src={iconMarty} alt="Marty" className="marty-image" />
                            <img src={shadow} alt="Shadow" className="marty-shadow" />
                            <div className="level-info">
                                <div className="level-label">LV 4</div>
                                <div className="progress-bar">
                                    <div 
                                        className="progress" 
                                        style={{
                                            width: `${progress}%`,
                                            '--progress-value': `"${progress}%"`
                                        }} 
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {showLevelUpButton ? 
                            <button className="level-up-button" onClick={() => onClickLevelUp()}>Level up</button>
                        : 
                        (
                            <button className="level-up-lock-button">Level up</button>
                        )
                        } 
                    </div>

                    {showLevelUpButton ? 
                    (
                        <div className="points-info">
                            <div className="points-text-content">PROCEED TO THE NEXT LEVEL TO:</div>
                            <div><span className="points-text-content">• UNLOCK 3 EXTRA SCRATCH-ABLE TICKETS</span></div>
                            <div><span className="points-text-content">• REDUCE COOL DOWN PERIOD</span></div>
                            <div><span className="points-text-content">• ACCESS EXCLUSIVE PFPS, AND MORE</span></div>
                        </div>
                    )
                    :
                    (
                        <div className="points-info">
                            <div className="points-text-content">EARN KM POINTS BY:</div>
                            <div className="points-item">DAILY CHECK-IN: <span className="points-text-content">KEEP YOUR STREAK!</span></div>
                            <div className="points-item">TICKETS: <span className="points-text-content">TRY YOUR LUCK AND WIN MORE POINTS</span></div>
                            <div className="points-item">TASKS: <span className="points-text-content">ENGAGE WITH TASKS TO UNLOCK REWARDS.</span></div>
                        </div>
                    )}
                </div>
            </div>

            {showOverlay && (
                <div className="level-up-overlay-container" onClick={() => setShowOverlay(false)}>
                    <div className="level-up-overlay-content" onClick={e => e.stopPropagation()}>
                        <div className="level-up-overlay-promotion">
                            CONGRATULATIONS!<br />
                            ONLY LEGENDS REACH LEVEL 5!
                        </div>

                        <div className="level-up-overlay-icon-container">
                            <img src={iconMarty} alt="Marty" className="level-up-overlay-icon" />
                            <div className='stars' style={{top: 176, left: -32}}>
                                <img src={shared.starImages.star1} alt="Star" className="single-star single-star-1" />
                                <img src={shared.starImages.star2} alt="Star" className="single-star single-star-2" />
                                <img src={shared.starImages.star3} alt="Star" className="single-star single-star-3" />
                                <img src={shared.starImages.star4} alt="Star" className="single-star single-star-4" />
                                <img src={shared.starImages.star5} alt="Star" className="single-star single-star-5" />
                            </div>
                        </div>
                        
                        <button className="level-up-share-story-button" onClick={onClickShareStory}>
                            Share To Story 200 KM Points
                        </button>
                        <button className="level-up-okay-button" onClick={() => setShowOverlay(false)}>
                            Okay
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LevelUp;
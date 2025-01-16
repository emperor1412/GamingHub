import React, { useEffect, useState, useRef } from 'react';
import iconMarty from './images/Meet Marty 1.png';
import background from './images/background.png';
import shadow from './images/shadow.png';
import hinh_thang_vuong from './images/hinh_thang_vuong.svg';
import backIcon from './images/back.svg';
import single_star from './images/single_star.svg';
import './Share.css';
import './LevelUp.css';
import { shareStory } from '@telegram-apps/sdk';
import shared from './Shared';
import lv1 from './images/lv1.png';
import lv2 from './images/lv2.png';
import lv3 from './images/lv3.png';
import lv4 from './images/lv4.png';
import lv5 from './images/lv5.png';
import lv6 from './images/lv6.png';
import lv7 from './images/lv7.png';

const LevelUp = ({ onClose }) => {
    const [showLevelUpButton, setShowLevelUpButton] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [progress, setProgress] = useState(0);

    const getLevelImage = (level) => {
        const iconImages = [iconMarty, lv1, lv2, lv3, lv4, lv5, lv6, lv7];
        if (level >= iconImages.length) return lv7;
        return iconImages[level];
    };

    const onClickLevelUp = async () => {
        console.log('Level up clicked');

        try {
            const response = await fetch(`${shared.server_url}/api/app/levelUp?token=${shared.loginData.token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Level up response:', data);
                
                if (data.code === 0) {
                    console.log('Level up successful');                    
                    
                    // Get updated profile data with retries
                    await shared.getProfileWithRetry();
                    setShowOverlay(true);

                } else if (data.code === 102001 || data.code === 102002) {
                    console.log('Token expired, attempting to re-login');
                    const loginResult = await shared.login(shared.initData);
                    if (loginResult.success) {
                        // Retry the level up call after successful re-login
                        onClickLevelUp();
                    } else {
                        console.error('Re-login failed:', loginResult.error);
                    }
                } else {
                    console.error('Level up failed:', data.msg);
                }
            } else {
                console.error('Level up request failed:', response);
            }
        } catch (error) {
            console.error('Error during level up:', error);
        }
    };

    const onClickShareStory = async () => {
        console.log('Share story clicked');
        
        if (shareStory.isSupported()) {
            const url = 'https://pub-8bab4a9dfe21470ebad9203e437e2292.r2.dev/miniGameHub/d9TU6egFvXYRLHbtZF8DJ4APfhwxBkVTllH+3Vp57zY=.png';
            shareStory(url, {
                text: `ONLY LEGENDS REACH LEVEL ${shared.userProfile.level}! 🏆`,
            });
            setShowOverlay(false);
            
            try {
                const response = await fetch(`${shared.server_url}/api/app/sharingStory?token=${shared.loginData.token}&type=1`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Share story API response:', data);

                    if (data.code === 0) {
                        console.log('Story shared successfully');
                    } else if (data.code === 102001 || data.code === 102002) {
                        console.log('Token expired, attempting to re-login');
                        const loginResult = await shared.login(shared.initData);
                        if (loginResult.success) {
                            // Retry the API call after successful re-login
                            onClickShareStory();
                        } else {
                            console.error('Re-login failed:', loginResult.error);
                        }
                    } else {
                        console.error('Share story failed:', data.msg);
                    }
                } else {
                    console.error('Share story request failed:', response);
                }
            } catch (error) {
                console.error('Error sharing story:', error);
            }
        }
    };

    const setup = () => {
        const starlets = shared.getStarlets();
        const currentRequired = shared.userProfile.levelPoint;
        console.log('Starlets:', starlets, 'Current Required:', currentRequired);
        setProgress(Math.min((starlets / currentRequired) * 100, 100));
        console.log('Progress:', progress);

        setShowLevelUpButton(starlets >= currentRequired);
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
                    <h2 className="level-header">YOU NEED {shared.userProfile.levelPoint} STARLETS TO REACH THE NEXT LEVEL.</h2>
          
                    <div className="marty-card-outer">
                        <div className='marty-gradient-layer'></div>
                        <div className="marty-card">
                            <img src={getLevelImage(shared.userProfile.level)} alt="Marty" className="marty-image" />
                            {/* <img src={shadow} alt="Shadow" className="marty-shadow" /> */}
                            <div className="level-info">
                                <div className="level-label">LV {shared.userProfile.level}</div>
                                <div className="progress-bar">
                                    <div 
                                        className="progress" 
                                        style={{
                                            width: `${progress}%`,
                                            '--progress-value': `"${Math.floor(progress)}%"`
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
                            <div className="points-text-content-title">PROCEED TO THE NEXT LEVEL TO:</div>
                            <div className="points-icon-text-container"><img src={shared.mappingIcon[10010]} alt="Ticket Icon" className="points-icon-levelup" /><span className="points-text-content"> UNLOCK 3 EXTRA SCRATCH-ABLE TICKETS</span></div>
                            {/* <div><span className="points-text-content">• REDUCE COOL DOWN PERIOD</span></div> */}
                            {/* <div className='points-icon-text-container'><span className="points-text-content">• ACCESS EXCLUSIVE PFPS, AND MORE</span></div> */}
                            <div className="points-icon-text-container"><img src={single_star} alt="Ticket Icon" className="points-icon-levelup" /><span className="points-text-content"> ACCESS EXCLUSIVE PFPS, AND MORE</span></div>
                        </div>
                    )
                    :
                    (
                        <div className="points-info">
                            <div className="points-text-content">EARN STARLETS BY:</div>
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
                            ONLY LEGENDS REACH LEVEL {shared.userProfile.level}!
                        </div>

                        <div className="level-up-overlay-icon-container">
                            <img src={getLevelImage(shared.userProfile.level)} alt="Marty" className="level-up-overlay-icon" />
                            <div className='stars' style={{top: 176, left: -32}}>
                                <img src={shared.starImages.star1} alt="Star" className="single-star single-star-1" />
                                <img src={shared.starImages.star2} alt="Star" className="single-star single-star-2" />
                                <img src={shared.starImages.star3} alt="Star" className="single-star single-star-3" />
                                <img src={shared.starImages.star4} alt="Star" className="single-star single-star-4" />
                                <img src={shared.starImages.star5} alt="Star" className="single-star single-star-5" />
                            </div>
                        </div>
                        
                        <div className='share-story-div'>
                        <button className="level-up-share-story-button" onClick={() => {
                                onClickShareStory();
                                setup();
                            }}>
                            Share To Story 20 Starlets
                        </button>
                        </div>
                        <button className="level-up-okay-button" onClick={() => {
                            setShowOverlay(false);
                            setup();
                        }}>
                            Okay
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LevelUp;
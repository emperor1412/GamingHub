import React, { useEffect, useState, useRef } from 'react';
import iconMarty from './images/Meet Marty 1.png';
import background from './images/background.png';
import shadow from './images/shadow.png';
import hinh_thang_vuong from './images/hinh_thang_vuong.svg';
import backIcon from './images/back.svg';
import './Share.css';
import './LevelUp.css';
import { shareStory } from '@telegram-apps/sdk';
import shared from './Shared';

const LevelUp = ({ onClose }) => {
    const [showLevelUpButton, setShowLevelUpButton] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [progress, setProgress] = useState(0);

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
                    const getProfileWithRetry = async (depth = 0) => {
                        if (depth > 3) {
                            console.error('Get profile data failed after 3 attempts');
                            return;
                        }

                        const profileResult = await shared.getProfileData(shared.loginData);
                        if (!profileResult.success) {
                            if (profileResult.needRelogin) {
                                console.log('Token expired while getting profile, attempting to re-login');
                                const loginResult = await shared.login(shared.initData);
                                if (loginResult.success) {
                                    return getProfileWithRetry(depth + 1);
                                } else {
                                    console.error('Re-login failed while getting profile:', loginResult.error);
                                }
                            } else {
                                console.error('Failed to get updated profile data:', profileResult.error);
                            }
                        }
                    };

                    await getProfileWithRetry();
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
            const url = 'https://pub-8bab4a9dfe21470ebad9203e437e2292.r2.dev/miniGameHub/hHinjx/xY6gECBXlMiE1Z95dGmuh/3Pqzg/tEcJ1P3s=.png';
            shareStory(url, {
                text: 'ONLY LEGENDS REACH LEVEL 5! 🏆',
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
        const kmPoint = shared.getKMPoint();
        const currentRequired = shared.userProfile.levelPoint;
        console.log('KM Point:', kmPoint, 'Current Required:', currentRequired);
        setProgress(Math.min((kmPoint / currentRequired) * 100, 100));
        console.log('Progress:', progress);

        if (kmPoint >= currentRequired) {
            setShowLevelUpButton(true);
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
                    <h2 className="level-header">YOU NEED {shared.userProfile.levelPoint} KM POINTS TO REACH THE NEXT LEVEL.</h2>
          
                    <div className="marty-card-outer">
                        <div className='marty-gradient-layer'></div>
                        <div className="marty-card">
                            <img src={iconMarty} alt="Marty" className="marty-image" />
                            <img src={shadow} alt="Shadow" className="marty-shadow" />
                            <div className="level-info">
                                <div className="level-label">LV {shared.userProfile.level}</div>
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
                            ONLY LEGENDS REACH LEVEL {shared.userProfile.level}!
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
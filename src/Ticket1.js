import React, { useEffect, useState, useRef } from 'react';
import ticketIcon from './images/ticket.svg';
// import kmIcon from './images/km.svg';
import starletIcon from './images/starlet.png';
import scratch_ticket_svg from './images/ticket_scratch_icon.svg';
import scratch_ticket from './images/ticket_scratch_icon.png';
import ticket_scratched from './images/ticket_scratched.png';
import circle_dotted from './images/circle_dotted.svg';
import './Ticket1.css';
import locker from './images/locker.png';
import Ticket2 from './Ticket2';
import back from './images/back.svg';
import lock_icon from "./images/ticket_lock_icon.svg";
import shared from './Shared';
import { popup } from '@telegram-apps/sdk';
import LevelUp from './LevelUp';
import unlock from './images/unlock.png';
import { trackUserAction, trackOverlayView, trackOverlayExit } from './analytics';

const Ticket1 = ({ starletsData, getProfileData, onClose }) => {
    const [rowCount, setRowCount] = useState(0);
    const [needsPadding, setNeedsPadding] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showTicket2, setShowTicket2] = useState(false);
    const [ticket, setTicket] = useState(0);
    const [starlets, setStarlets] = useState(0);
    const [slotNum, setSlotNum] = useState(0);
    const [slotUseNum, setSlotUseNum] = useState(0);
    const [showTimer, setShowTimer] = useState(false);
    const [expireTime, setExpireTime] = useState(0);
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 });
    const [progress, setProgress] = useState(50);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [showOverlayClaimSuccess, setShowOverlayClaimSuccess] = useState(false);
    const [showTimerOverlay, setShowTimerOverlay] = useState(false);

    const setupProfileData = async () => {
        console.log('Ticket 1 setupProfileData');
        await getProfileData();

        if (!shared.userProfile || !shared.userProfile.UserToken) {
            return;
        }
        const userTicket = shared.userProfile.UserToken.find(token => token.prop_id === 10010);
        const userStarlets = shared.userProfile.UserToken.find(token => token.prop_id === 10020);
        if (userTicket) {
            setStarlets(userStarlets.num);
            setTicket(userTicket.num);
            // setTicket(1);
            
        }
    };

/*
url: /app/ticketSlot
Request:
Response:
{
    "code": 0,
    "data": {
        "slotNum": 15,
        "slotUseNum": 1,
        "levelUpNum": 18,
        "time": 1735344000000
    }
}
*/

    const getTicketSlotData = async (depth = 0) => {
        const maxRetries = 3;
        const retryDelay = 1000; // 1 second delay between retries

        try {
            const response = await fetch(`${shared.server_url}/api/app/ticketSlot?token=${shared.loginData.token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.code === 0) {
                console.log('Ticket slot data:', data.data);
                return data.data;
            } else if (data.code === 102001 || data.code === 102002) {
                console.log('Token expired, attempting to re-login');
                const loginResult = await shared.login(shared.initData);
                if (loginResult.success) {
                    console.log('Re-login successful, retrying ticket slot fetch');
                    return getTicketSlotData(depth + 1);
                } else {
                    if (popup.open.isAvailable()) {
                        const promise = popup.open({
                            title: 'Error',
                            message: `Re-login failed: ${loginResult.error}`,
                            buttons: [{ id: 'my-id', type: 'default', text: 'OK' }],
                        });
                        await promise;
                    }
                    return null;
                }
            } else {
                if (popup.open.isAvailable()) {
                    const promise = popup.open({
                        title: 'Error',
                        message: `Server returned error code: ${data.code}`,
                        buttons: [{ id: 'my-id', type: 'default', text: 'OK' }],
                    });
                    await promise;
                }
                return null;
            }
        } catch (error) {
            console.error(`Attempt ${depth + 1} failed:`, error);
            
            if (depth < maxRetries) {
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                // Retry with incremented depth
                return getTicketSlotData(depth + 1);
            }
            
            // If all retries failed, show popup
            if (popup.open.isAvailable()) {
                const promise = popup.open({
                    title: 'Error Getting Ticket Slot Data',
                    message: `Failed after ${maxRetries} attempts: ${error.message}`,
                    buttons: [{ id: 'my-id', type: 'default', text: 'OK' }],
                });
                await promise;
            }
            return null;
        }
    };

    const setUp = async () => {
        const ticketSlotData = await getTicketSlotData();
        if (ticketSlotData) {
            setExpireTime(ticketSlotData.time);
            setSlotNum(ticketSlotData.slotNum);
            setSlotUseNum(ticketSlotData.slotUseNum);
            // setTicket( Math.min(ticketSlotData.slotNum - ticketSlotData.slotUseNum, shared.getTicket()));
            setTicket(shared.getTicket());
            setStarlets(shared.getStarlets());

            
            let row = Math.ceil(ticketSlotData.levelUpNum / 3);
            if (row < 3) {
                row = 3;
            }
            setRowCount(row);
            setNeedsPadding(row < 4);
        }
        else {
            setTicket(0);
        }
    };

    useEffect(() => {
        console.log('Ticket 1 useEffect');
        setUp();
    }, []);

    useEffect(() => {
        let intervalId;
        if (showTimer && expireTime) {
            const updateTimer = () => {
                const now = Date.now();
                const diff = Math.max(0, expireTime - now);
                const totalSeconds = Math.floor(diff / 1000);
                
                // Update time display
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;
                
                setTimeLeft({
                    hours,
                    minutes,
                    seconds,
                    totalSeconds
                });

                // Calculate progress
                const totalDuration = 24 * 60 * 60; // 24 hours in seconds
                let remainingPercent = 1 - totalSeconds / totalDuration;                
                // remainingPercent = 0.85;
                const progress = remainingPercent * 360; // 0-360 degrees
                
                // console.log('angle:', progress, '\remainingPercent:', remainingPercent);

                // Generate and apply clip-path
                const clipPath = getCircularClipPath(progress);
                const progressCircle = document.querySelector('.timer-progress-circle');
                if (progressCircle) {
                    progressCircle.style.setProperty('--clip-path', clipPath);
                }

                const timerDot = document.querySelector('.timer-dot');
                if (timerDot) {
                    timerDot.style.setProperty('--progress-angle', `${progress}deg`);
                }

                if (diff <= 0) {
                    clearInterval(intervalId);
                    setShowTimer(false);
                }
            };

            updateTimer();
            intervalId = setInterval(updateTimer, 1000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [showTimer, expireTime]);

    const handleTimerClick = () => {
        trackUserAction('ticket_timer_clicked', {
            slots_used: slotUseNum,
            total_slots: slotNum,
            time_left_seconds: timeLeft.totalSeconds
        }, shared.loginData?.userId);
        setShowTimer(true);
    };

    const handleScratchClick = (index) => {
        trackUserAction('ticket_scratch_clicked', {
            slot_index: index,
            slots_used: slotUseNum,
            total_slots: slotNum,
            tickets_remaining: ticket
        }, shared.loginData?.userId);
        setShowOverlay(true);
    };

    const handleLockedSlotClick = (index) => {
        trackUserAction('ticket_locked_slot_clicked', {
            slot_index: index,
            current_slots: slotNum,
            user_level: shared.userProfile.level
        }, shared.loginData?.userId);
    };

    const handleLevelUpClick = () => {
        trackUserAction('level_up_from_ticket', {
            current_slots: slotNum,
            slots_used: slotUseNum,
            user_level: shared.userProfile.level
        }, shared.loginData?.userId);
        setShowLevelUp(true);
    };

    const renderTicketRow = (startIndex) => (
        <div className="scratch-grid-row" key={startIndex}>
            {[0, 1, 2].map(offset => {
                const index = startIndex + offset;
                const isUnlocked = index < slotNum;
                const isScratched = index >= Math.min(ticket, slotNum - slotUseNum);

                return isUnlocked ? (
                    isScratched ? (
                        <div key={index} className="scratch-item unlocked" onClick={handleTimerClick}>
                            <div className='scratch-item-border'>   
                                <div className='scratch-item-background'></div>
                            </div>
                            <img src={ticket_scratched} alt="Lock" className='scratch-item-ticket-icon' />
                        </div>  
                    ) : (
                        <button 
                            key={index} 
                            className="scratch-item unlocked"
                            onClick={() => handleScratchClick(index)}
                        >
                            <div className='scratch-item-border'>   
                                <div className='scratch-item-background'></div>
                            </div>
                            <img src={scratch_ticket} alt="Scratch" className='scratch-item-ticket-icon' />
                        </button>
                    )
                ) : (
                    <button 
                        key={index} 
                        className="scratch-item locked"
                        onClick={() => handleLockedSlotClick(index)}
                    >
                        <div className='scratch-item-border'>   
                            <div className='scratch-item-background'></div>
                        </div>
                        <img src={lock_icon} alt="Lock" className='scratch-item-ticket-icon' />
                    </button>
                );
            })}
        </div>
    );

    const getCircularClipPath = (progress) => {
        // Normalize progress to 0-1 range
        const normalizedProgress = Math.min(Math.max(progress / 360, 0), 1);
        
        // Always start from center
        const points = ['50% 50%'];
        
        // Always include top center point
        points.push('50% 0%');
        
        // Calculate intermediate points
        const steps = 360; // Number of points to create smooth circle
        const currentSteps = Math.ceil(normalizedProgress * steps);
        
        for (let i = 0; i <= currentSteps; i++) {
            const angle = (i / steps) * 2 * Math.PI;
            const x = 50 + 50 * Math.sin(angle);
            const y = 50 - 50 * Math.cos(angle);
            points.push(`${x}% ${y}%`);
        }
        
        return `polygon(${points.join(', ')})`;
    };

    const onCloseLevelup = async () => {
        await shared.getProfileWithRetry();
        setShowLevelUp(false);
        setUp();
    }

    // Track overlay views
    useEffect(() => {
        if (showOverlayClaimSuccess) {
            trackOverlayView('ticket_claim_success', shared.loginData?.link, 'ticket');
        }
    }, [showOverlayClaimSuccess]);

    const handleCloseSuccessOverlay = () => {
        trackOverlayExit('ticket_claim_success', shared.loginData?.link, 'ticket');
        setShowOverlayClaimSuccess(false);
    };

    // Track timer overlay
    useEffect(() => {
        if (showTimerOverlay) {
            trackOverlayView('ticket_timer', shared.loginData?.link, 'ticket');
        }
    }, [showTimerOverlay]);

    const handleCloseTimerOverlay = () => {
        trackOverlayExit('ticket_timer', shared.loginData?.link, 'ticket');
        setShowTimerOverlay(false);
    };

    return (
        // implement show loading here

        <>
            {showLoading && (
                <div className="loading-overlay">
                    LOADING...
                </div>
            )}
            {showTicket2 ? (
                <Ticket2 onClose={async () => {                
                    setShowTicket2(false);
                    setShowOverlay(false);
                    setShowLoading(true);
                    await setupProfileData();
                    setUp();
                    setShowLoading(false);
                }} />
            ) : showLevelUp ? (
                <LevelUp onClose={onCloseLevelup} />
            ) : (
                <>
                    <div className="ticket1-container">
                        <header className="ticket-header">
                            <button className="back-button back-button-alignment" onClick={onClose}>
                                <img src={back} alt="Back" />
                            </button>
                            <div className="header-stats">
                                <div className="stat-item-main">
                                    <img src={ticketIcon} alt="Tickets" />
                                    <span className='stat-item-main-text'>{ticket}</span>
                                </div>
                                <div className="stat-item-main">
                                    <img src={starletIcon} alt="Starlets" />
                                    <span className='stat-item-main-text'>{starlets}</span>
                                </div>
                            </div>
                        </header>

                        {showTimer ? (
                            <>
                            
                            <div className="timer-overlay">
                                <div className="timer-message">
                                    YOUR TICKET IS LOCKED, UNLOCK MORE TICKET SLOTS BY LEVELING UP YOUR ACCOUNT OR WAIT FOR THE TIMER TO RUN OUT.
                                </div>
                                <div className="timer-circle">
                                    <img src={circle_dotted} alt="Timer Background" className="timer-circle-bg" />
                                    <div className="timer-progress-circle" style={{ '--progress-angle': `${progress}deg` }}>
                                        <div className="timer-dot" style={{ '--progress-angle': `${progress}deg` }}></div>
                                    </div>
                                    <div className="timer-content">
                                        <div className="timer-text">
                                            {String(timeLeft.hours).padStart(2, '0')}:
                                            {String(timeLeft.minutes).padStart(2, '0')}:
                                            {String(timeLeft.seconds).padStart(2, '0')}
                                        </div>
                                        <div className="timer-subtext">
                                            Time Remaining: {timeLeft.hours} {timeLeft.hours === 1 ? 'hour' : 'hours'}, {timeLeft.minutes} {timeLeft.minutes === 1 ? 'minute' : 'minutes'}, {timeLeft.seconds} {timeLeft.seconds === 1 ? 'second' : 'seconds'}
                                        </div>
                                    </div>
                                </div>
                                <div className="timer-buttons">
                                    <button className="timer-button primary" onClick={handleLevelUpClick}>LEVEL UP</button>
                                    <div className="level-up-description">
                                        EARN MORE REWARDS AND FEATURES BY LEVELING UP!
                                    </div>
                                    <button className="timer-button secondary" onClick={() => setShowTimer(false)}>DONE</button>
                                </div>
                            </div>
                            <header className="ticket-header">
                                <button className="back-button back-button-alignment" onClick={() => setShowTimer(false)}>
                                    <img src={back} alt="Back" />
                                </button>
                                <div className="header-stats">
                                    <div className="stat-item-main">
                                        <img src={ticketIcon} alt="Tickets" />
                                        <span className='stat-item-main-text'>{ticket}</span>
                                    </div>
                                    <div className="stat-item-main">
                                        <img src={starletIcon} alt="Starlets" />
                                        <span className='stat-item-main-text'>{starlets}</span>
                                    </div>
                                </div>
                            </header>
                        </>
                        ) 
                        : (
                            <div className="scratch-content">
                                <div className="scratch-grid-container">
                                    <div className="scratch-header">
                                        SCRATCH
                                    </div>
                                    <div className="scratch-grid" style={needsPadding ? { paddingBottom: '16vh' } : {}}>
                                        {[...Array(rowCount)].map((_, i) => renderTicketRow(i * 3))}
                                    </div>
                                    <div className="scratch-status">
                                        <div className="scratch-status-text"> <span className='scratch-status-text-count'>{slotUseNum}/{slotNum} </span> TICKETS SCRATCHED TODAY!</div>
                                        <div className="scratch-status-subtext"><img src={unlock} alt="Unlock" className="unlock-icon" /> UNLOCK 3 MORE SLOTS BY LEVELING UP TO LEVEL {shared.userProfile.level + 1}!</div>
                                    </div>
                                </div>


                                <div className="info-box-ticket">
                                    Earn extra tickets by inviting friends or completing daily tasks. The more you engage, the more rewards you unlock!
                                </div>
                            </div>
                        )}
                    </div>

                    {showOverlay && (
                        <div className="overlay-ticket1" onClick={() => setShowOverlay(false)}>
                            <div className="overlay-content-ticket1" onClick={e => e.stopPropagation()}>
                                {/* <div className="overlay-text-ticket1">
                                    TEST YOUR KNOWLEDGE OF POPULAR CRYPTO SLANG TERMS! SELECT THE CORRECT MEANING FOR EACH TERM BELOW.
                                </div> */}
                                
                                <img src={scratch_ticket_svg} alt="Scratch Ticket" className="overlay-ticket1-img" />
                                <div className="overlay-buttons-ticket1">
                                    <button className="overlay-button-ticket1 primary" onClick={() => setShowTicket2(true)}>
                                        SCRATCH 1 TICKET
                                    </button>
                                    <button className="overlay-button-ticket1 secondary" disabled='true'>
                                        SCRATCH ALL TICKETS
                                        <img src={lock_icon} alt="Locked" className="overlay-button-ticket1-lock" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {showOverlayClaimSuccess && (
                        <div className="overlay-ticket1">
                            <div className="overlay-content-ticket1">
                                {/* ... existing overlay content ... */}
                                <button 
                                    className="overlay-button-ticket1" 
                                    onClick={handleCloseSuccessOverlay}
                                >
                                    DONE
                                </button>
                            </div>
                        </div>
                    )}
                    {showTimerOverlay && (
                        <div className="overlay-ticket1">
                            <div className="overlay-content-ticket1">
                                {/* ... existing timer overlay content ... */}
                                <button 
                                    className="overlay-button-ticket1" 
                                    onClick={handleCloseTimerOverlay}
                                >
                                    OKAY
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default Ticket1;

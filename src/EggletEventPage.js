import React, { useState, useEffect } from 'react';
import './EggletEventPage.css';
import shared from './Shared';
import back from './images/back.svg';
import ticketIcon from './images/ticket.svg';
import starletIcon from './images/starlet.png';
import eggletLogo from './images/Egglets_Logo.png';
import scratching from './images/Egglet_Image_1.png';
import buying from './images/Egglet_Image_2.png';
import inviting from './images/Egglet_Image_3.png';
import levelUp from './images/Egglet_Image_4.png';
import fslLogo from './images/FSLID_Login_Logo.png';
import mooarLogo from './images/MooAR_Login_Logo.png';
import loggedInLogo from './images/FSL_MooAR_Logined.png';
import eggIcon from './images/eggs_event-points-icon.png';
import calendar from './images/calendar.svg';
import calendar_before_checkin from './images/calendar.svg';
import { trackUserAction } from './analytics';
import AccountLinkPopup from './AccountLinkPopup';

/*url: /app/eventPointData
Request:
Response:
{
    "code": 0,
    "data": {
        "points": 15,
        "mooarFlag": false,
        "eventStart": true,
        "eventEnd": false
    }
} */

const EggletEventPage = ({ onClose, setShowProfileView, setShowCheckInView, checkInData }) => {
    const [eventPoints, setEventPoints] = useState(0);
    const [starlets, setStarlets] = useState(0);
    const [ticket, setTicket] = useState(0);
    const [userLevel, setUserLevel] = useState(1);
    const [eggletsProgress, setEggletsProgress] = useState({
        current: 0,
        total: 2000000
    });
    const [loading, setLoading] = useState(false);
    const [showAccountPopup, setShowAccountPopup] = useState(false);
    const [accountLinkType, setAccountLinkType] = useState(null);
    const [mooarFlag, setMooarFlag] = useState(false);
    const [fslFlag, setFslFlag] = useState(false);
    const [eventActive, setEventActive] = useState(false);
    const [showTextCheckIn, setShowTextCheckIn] = useState(false);

    const calculateLevelGain = (level) => {
        if (level < 2) return 0;
        if (level > 50) return 109;
        return 15 + (level - 2) * 2;
    };

    // Calculate what check-in display to show based on time of day
    const calculateCheckInDisplay = () => {
        if (!shared.checkInData || !shared.checkInData.lastTime) {
            console.log('No check-in data available, showing CHECK-IN TODAY');
            return true;
        }
        
        try {
            const lastTime = new Date(shared.checkInData.lastTime);
            const now = new Date();
            const nextCheckInTime = new Date(now);
            nextCheckInTime.setUTCDate(now.getUTCDate() + 1);
            nextCheckInTime.setUTCHours(0, 0, 0, 0);
            const remaining = nextCheckInTime - now;

            if (remaining > 0) {
                console.log('After check-in state, remaining: ' + remaining);
                return false; // Show streakDay number
            } else {
                console.log('Before check-in state, remaining: ' + remaining);
                return true; // Show CHECK-IN TODAY
            }
        } catch (e) {
            console.error('Error calculating check-in display:', e);
            return true; // Default to CHECK-IN TODAY on error
        }
    };

    useEffect(() => {
        console.log('EggletEventPage mounted');
        // Initialize data
        setupData();
        
        // Track event page view
        trackUserAction('egglet_event_page_viewed', {}, shared.loginData?.userId);
        
        // Check if user is in check-in state - to match MainView behavior
        let myTimeout;
        try {
            console.log('EggletEventPage useEffect - checkInData:', checkInData);
            if (checkInData && checkInData.lastTime) {
                const lastTime = new Date(checkInData.lastTime);
                console.log('EggletEventPage useEffect - lastTime:', lastTime);
                
                const now = new Date();
                const nextCheckInTime = new Date(now);
                nextCheckInTime.setUTCDate(now.getUTCDate() + 1);
                nextCheckInTime.setUTCHours(0, 0, 0, 0);
                const remaining = nextCheckInTime - now;
                console.log('EggletEventPage useEffect - remaining:', remaining);

                if (remaining > 0) {
                    console.log('EggletEventPage useEffect: after check-in state, remaining: ' + remaining);
                    setShowTextCheckIn(false);
                    myTimeout = setTimeout(() => setShowTextCheckIn(true), remaining);
                } else {
                    console.log('EggletEventPage useEffect: before check-in state, remaining: ' + remaining);
                    setShowTextCheckIn(true);
                }
            } else {
                // Default to showing "CHECK-IN TODAY" if no check-in data
                console.log('EggletEventPage useEffect: No check-in data available');
                setShowTextCheckIn(true);
            }
        } catch (e) {
            console.log('EggletEventPage useEffect error:', e);
            // Default to showing "CHECK-IN TODAY" on error
            setShowTextCheckIn(true);
        }

        return () => {
            if (myTimeout) clearTimeout(myTimeout);
        };
    }, [checkInData]);

    const fetchEventPointData = async (depth = 0) => {
        if (depth > 3) {
            console.error('Get event point data failed after 3 attempts');
            return null;
        }
        
        try {
            const response = await fetch(`${shared.server_url}/api/app/eventPointData?token=${shared.loginData.token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Event point data:', data);

                if (data.code === 0) {
                    return data.data;
                } else if (data.code === 102001 || data.code === 102002) {
                    console.error('Token expired, attempting to re-login');
                    const loginResult = await shared.login(shared.initData);
                    if (loginResult.success) {
                        return fetchEventPointData(depth + 1);
                    } else {
                        console.error('Re-login failed:', loginResult.error);
                        shared.showPopup({ message: 'Failed to fetch event data. Please try again later.' });
                    }
                } else {
                    console.error('Failed to fetch event data:', data.msg);
                    shared.showPopup({ message: `Error: ${data.msg}` });
                }
            } else {
                console.error('Event point data response error:', response);
                shared.showPopup({ message: 'Network error. Please try again later.' });
            }
        } catch (error) {
            console.error('Error fetching event point data:', error);
            shared.showPopup({ message: 'Failed to connect to server. Please check your connection.' });
        }
        
        return null;
    };

    // Function to fetch global egglets progress (could be a separate API endpoint)
    // This is a placeholder - implement the actual API call if available
    const fetchGlobalEggletsProgress = async (depth = 0) => {
        if (depth > 3) {
            console.error('Get global egglets progress failed after 3 attempts');
            return null;
        }
        
        try {
            // For now, we'll return dummy data as this API may not exist yet
            // In a real implementation, this would be replaced with an actual API call
            // such as:
            /*
            const response = await fetch(`${shared.server_url}/api/app/globalEggletsProgress?token=${shared.loginData.token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.code === 0) {
                    return data.data;
                } else if (data.code === 102001 || data.code === 102002) {
                    // Handle token expiration
                    const loginResult = await shared.login(shared.initData);
                    if (loginResult.success) {
                        return fetchGlobalEggletsProgress(depth + 1);
                    }
                }
            }
            */
            
            // For demo, return hardcoded values
            return {
                current: 500000,
                total: 2000000
            };
        } catch (error) {
            console.error('Error fetching global egglets progress:', error);
            return null;
        }
    };

    const setupData = async () => {
        setLoading(true);
        
        try {
            // Get user's tickets and starlets
            if (shared.userProfile && shared.userProfile.UserToken) {
                const userTicket = shared.userProfile.UserToken.find(token => token.prop_id === 10010);
                const userStarlets = shared.userProfile.UserToken.find(token => token.prop_id === 10020);
                
                if (userTicket) setTicket(userTicket.num);
                if (userStarlets) setStarlets(userStarlets.num);
            }
            
            // Get user's level from shared.userProfile
            if (shared.userProfile) {
                setUserLevel(shared.userProfile.level || 1);
                // Check if user has FSL ID
                setFslFlag(!!shared.userProfile.fslId);
            }
            
            // Fetch event points data
            const eventData = await fetchEventPointData();
            if (eventData) {
                setEventPoints(eventData.points);
                setMooarFlag(eventData.mooarFlag);
                // Check if event is active (eventStart is true and eventEnd is false)
                const isEventActive = eventData.eventStart && !eventData.eventEnd; 
                setEventActive(isEventActive);
                
                // If event is not active, don't fetch additional data
                if (!isEventActive) {
                    console.log('Event is not active, skipping additional data fetch');
                    return;
                }
                
                // Fetch global egglets progress 
                const progressData = await fetchGlobalEggletsProgress();
                if (progressData) {
                    setEggletsProgress(progressData);
                }
            } else {
                // Handle case where event data couldn't be fetched
                console.error('Failed to fetch event data');
                setEventActive(false);
                // Show an error message about event data
                shared.showPopup({
                    type: 0,
                    message: 'Unable to load event data. Please try again later.'
                });
            }
            
        } catch (error) {
            console.error('Error fetching egglet event data:', error);
            shared.showPopup({ 
                type: 0, 
                message: 'Failed to load event data. Please try again later.' 
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFSLIDClick = () => {
        if (!fslFlag) {
            setAccountLinkType('fsl');
            setShowAccountPopup(true);
            trackUserAction('egglet_fsl_link_clicked', {}, shared.loginData?.userId);
        }
    };

    const handleMOOARClick = () => {
        if (!mooarFlag) {
            setAccountLinkType('mooar');
            setShowAccountPopup(true);
            trackUserAction('egglet_mooar_link_clicked', {}, shared.loginData?.userId);
        }
    };

    const closeAccountPopup = () => {
        setShowAccountPopup(false);
    };

    const progressPercentage = Math.min((eggletsProgress.current / eggletsProgress.total) * 100, 100);
    const progressPercentageDisplay = Math.min((eggletsProgress.current / eggletsProgress.total) * 100, 97.7);

    // Function to handle check-in click
    const onClickCheckIn = async () => {
        console.log('EggletEventPage onClickCheckIn');
        try {
            if (!shared.loginData) {
                console.log('Login data not available');
                shared.showPopup({ 
                    type: 0, 
                    message: 'Please log in to check in.' 
                });
                return;
            }
            
            // Directly use the shared.checkIn which should be populated from the app parent
            if (shared.checkIn) {
                const result = await shared.checkIn(shared.loginData);
                console.log('CheckIn Response:', result);
                setShowCheckInView(true);
            } else {
                console.log('Check-in function not available');
                onClose();
            }
        } catch (error) {
            console.error('Error during check-in:', error);
            shared.showPopup({ 
                type: 0, 
                message: 'Failed to check in. Please try again later.' 
            });
        }
    };

    return (
        <div className="eggs_egglet-event-container">
            {loading && (
                <div className="eggs_loading-overlay">
                    LOADING...
                </div>
            )}
            
            {!eventActive && (
                <div className="eggs_event-inactive-overlay">
                    <div className="eggs_event-inactive-message">
                        Event is not active
                    </div>
                    <button 
                        className="eggs_back-to-main-button"
                        onClick={onClose}
                    >
                        Return to Main Page
                    </button>
                </div>
            )}
            
                        
            <header className="eggs_egglet-event-header">
                <button 
                    className="back-button"
                    onClick={onClose}
                >
                    <img src={back} alt="Back" />
                </button>
                <div className="stats-main">
                    <button 
                        className="stat-item-main"
                        onClick={() => {
                            // Show Profile using setShowProfileView
                            setShowProfileView(true);
                        }}
                    >
                        <img src={ticketIcon} alt="Tickets" />
                        <span className='stat-item-main-text'>{ticket}</span>
                    </button>
                    <button 
                        className="stat-item-main"
                        onClick={() => {
                            // Show Profile using setShowProfileView
                            setShowProfileView(true);
                        }}
                    >
                        <img src={starletIcon} alt="Starlets" />
                        <span className='stat-item-main-text'>{starlets}</span>
                    </button>
                    <div className="stat-item-main">
                        <button className="stat-button" onClick={onClickCheckIn}>
                            <img src={showTextCheckIn ? calendar_before_checkin : calendar} alt="Calendar" />
                            <div className="check-in-text">
                                {showTextCheckIn ? (
                                    <>
                                        <span>CHECK-IN</span>
                                        <span>TODAY</span>
                                    </>
                                ) : (
                                    <span className='stat-item-main-text'>{checkInData?.streakDay || "0"}</span>
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            {/* Only show content when event is active */}
            {eventActive && (
                <div className="eggs_egglet-event-content">
                    <div className="eggs_event-points-bar">
                        <span className="eggs_event-points-label">EVENT POINTS</span>
                        <div className="eggs_event-points-value-display">
                            <div className="eggs_event-points-icon">
                                <img src={eggIcon} alt="Egglet Event" />
                            </div>
                            <span className="eggs_event-points-value">{eventPoints.toString().padStart(6, '0')}</span>
                        </div>
                    </div>
                    
                    <div className="eggs_global-egglets-section">
                        <div className="eggs_corner-frame">
                            <div className="eggs_corner eggs_top-left"></div>
                            <div className="eggs_corner eggs_top-right"></div>
                            <div className="eggs_corner eggs_bottom-left"></div>
                            <div className="eggs_corner eggs_bottom-right"></div>
                            
                            <div className="eggs_global-egglets-title">
                                <div className="eggs_claim-indicators">
                                    <span className={`eggs_claim-indicator ${fslFlag || eggletsProgress.current >= eggletsProgress.total ? 'completed' : ''}`}>
                                        {eggletsProgress.current >= eggletsProgress.total ? (
                                            "✓"
                                        ) : fslFlag ? (
                                            <img src={loggedInLogo} alt="FSL ID Logged" className="eggs_indicator-logo logged-in" />
                                        ) : (
                                            <img src={fslLogo} onClick={handleFSLIDClick} alt="FSL ID" className="eggs_indicator-logo" />
                                        )}
                                    </span>
                                    <span className={`eggs_claim-indicator ${mooarFlag ? 'completed' : ''}`}>
                                        {mooarFlag ? (
                                            <img src={loggedInLogo} alt="MOOAR Logged" className="eggs_indicator-logo logged-in" />
                                        ) : (
                                            <img src={mooarLogo} onClick={handleMOOARClick} alt="MOOAR" className="eggs_indicator-logo" />
                                        )}
                                    </span>
                                </div>
                            </div>
                            
                            {/* <div className="eggs_progress-bar-container">
                                <div className="eggs_progress-bar">
                                    <div 
                                        className="eggs_progress-fill" 
                                        style={{ 
                                            width: `${progressPercentageDisplay}%`,
                                            clipPath: progressPercentage >= 99 
                                                ? 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' 
                                                : 'polygon(0 0, 100% 0, 90% 100%, 0% 100%)',
                                            borderRadius: progressPercentage >= 99 
                                                ? '25px'
                                                : '25px 0 0 25px',
                                        }}
                                    >
                                        <div className="eggs_progress-text">
                                        {progressPercentage}%
                                    </div>
                                    </div>
                                    
                                </div>
                            </div> */}
                            
                            <div className="eggs_egglets-info-container">
                                <div className="eggs_egglets-info">
                                    <div className="eggs_egglets-balloons">
                                        <img src={eggletLogo} alt="Egglet Logo" className="eggs_egglet-balloons-image" />
                                    </div>
                                    <h3 className="eggs_egglets-title">GAIN POINTS +</h3>
                                    <h3 className="eggs_egglets-title">EARN EGGLETS</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="eggs_points-methods-section">
                        <div className="eggs_points-method">
                            <img src={scratching} alt="Scratching Tickets" className="eggs_method-image" />
                            <h4 className="eggs_method-title">SCRATCHING TICKETS</h4>
                            <div className="eggs_method-details">
                                <div className="eggs_method-detail">1 Ticket = 3</div>
                            </div>
                        </div>
                        
                        <div className="eggs_points-method">
                            <img src={buying} alt="Buying Starlets" className="eggs_method-image" />
                            <h4 className="eggs_method-title">BUYING STARLETS</h4>
                            <div className="eggs_method-details">
                                <div className="eggs_method-detail">500 = 20</div>
                                <div className="eggs_method-detail">1500 = 50</div>
                                <div className="eggs_method-detail">5000 = 120</div>
                            </div>
                        </div>
                        
                        <div className="eggs_points-method">
                            <img src={inviting} alt="Inviting Friends" className="eggs_method-image" />
                            <h4 className="eggs_method-title">INVITING FRIENDS</h4>
                            <div className="eggs_method-details">
                                <div className="eggs_method-detail">NORMAL USER = 5</div>
                                <div className="eggs_method-detail">PREMIUM USER = 15</div>
                                <div className="eggs_method-detail">MAX 6 FRIENDS PER DAY</div>
                            </div>
                        </div>
                        
                        <div className="eggs_points-method">
                            <img src={levelUp} alt="Level Up" className="eggs_method-image" />
                            <h4 className="eggs_method-title">LEVEL UP</h4>
                            <div className="eggs_method-details">
                                <div className="eggs_method-detail">NEXT LEVEL UP</div>
                                <div className="eggs_method-detail">GAIN = {calculateLevelGain(userLevel)}</div>
                            </div>
                        </div>
                    </div>
                               
                    <div className="eggs_auth-logos">
                        <div className="eggs_auth-logo-button"></div>
                        <div className="eggs_auth-logo-button"></div>
                    </div>
                </div>
            )}

            {/* Account Link Popup */}
            <AccountLinkPopup 
                isOpen={showAccountPopup} 
                onClose={closeAccountPopup} 
                linkType={accountLinkType} 
            />
        </div>
    );
};

export default EggletEventPage; 
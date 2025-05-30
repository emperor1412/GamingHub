import React, { useEffect, useState, useRef } from 'react';
// import Frame4556 from './images/Frame4556.png';
import locker from './images/locker.png';
// import locker from './images/locker.svg';
import leaderboard from './images/leaderboard.svg';
import stepn_background from './images/stepn_background.png';
// import leaderboard from './images/leaderboard.png';
import ticketIcon from './images/ticket.svg';
// import km from './images/km.svg';
import starlet from './images/starlet.png';
import calendar from './images/calendar.png';
// import calendar_before_checkin from './images/calendar_before_checkin.svg';
import calendar_before_checkin from './images/calendar.png';

import eventSnoopDogg from './images/snoop_dogg_raffle.svg';
// import eventSnoopDogg from './images/snoop_dogg_raffle.png';
import './MainView.css';
import my_ticket from './images/my_ticket.png';
// import LFGO from './images/LFGO.svg';
import LFGO from './images/LFGO.png';
// import morchigame from './images/morchigame.png';
import morchigame from './images/morchigame.svg';
import comingsoon from './images/Coming soon-05.png';
import tadokami from './images/Tadokami_Logo.png'
import checkout from './images/checkout.svg';
import eggletLogo from './images/Egglets_Logo.png';
import eggletBackground from './images/Egglets_Background.png';

import { popup, openLink } from '@telegram-apps/sdk';

import shared from './Shared';
import { trackUserAction } from './analytics';
import EggletEventPopup from './EggletEventPopup';
import EggletEventPage from './EggletEventPage';

let isMouseDown = false;
let startX;
let startDragX;
let startDragTime;
let scrollLeft;

const MainView = ({ checkInData, setShowCheckInAnimation, checkIn, setShowCheckInView, setShowProfileView, setShowTicketView, setShowBankStepsView, getProfileData}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showTextCheckIn, setShowTextCheckIn] = useState(false);
    const [starlets, setStarlets] = useState(0);
    const [ticket, setTicket] = useState(0);
    const [eventData, setEventData] = useState([]);
    const carouselRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const intervalRef = useRef(null);
    const [showEggletPopup, setShowEggletPopup] = useState(false);
    const [showEggletPage, setShowEggletPage] = useState(false);
    const [eventActive, setEventActive] = useState(false);
    const [showedEggletToday, setShowedEggletToday] = useState(false);
    
    // Set to true to disable daily checking and always show popup when event is active
    const isMockup = false;

    // const [scrollLeft, setScrollLeft] = useState(0);
    // const [startX, setStartX] = useState(0);
    // const [startDragX, setStartDragX] = useState(0);
    // const [startDragTime, setStartDragTime] = useState(0);

    /*
userProfile : {
    "tUserId": "5000076292",
    "tName": "Kaka Lala",
    "tUserName": "",
    "fslId": 0,
    "pictureIndex": 3,
    "link": 21201,
    "claimRecord": [
        {
            "id": 7,
            "uid": 21201,
            "type": 20010,
            "state": 1,
            "num": 4000,
            "ctime": 1731661421159,
            "ltime": 1731661420158
        },
        {
            "id": 6,
            "uid": 21201,
            "type": 30010,
            "state": 0,
            "num": 1,
            "ctime": 1731661773099,
            "ltime": 1731661773095
        },
        {
            "id": 5,
            "uid": 21201,
            "type": 40010,
            "state": 0,
            "num": 1,
            "ctime": 1731661773098,
            "ltime": 1731661773095
        },
        {
            "id": 4,
            "uid": 21201,
            "type": 30020,
            "state": 0,
            "num": 1,
            "ctime": 1731661773097,
            "ltime": 1731661773095
        },
        {
            "id": 3,
            "uid": 21201,
            "type": 30010,
            "state": 0,
            "num": 1,
            "ctime": 1731661773096,
            "ltime": 1731661773095
        },
        {
            "id": 2,
            "uid": 21201,
            "type": 30020,
            "state": 0,
            "num": 1,
            "ctime": 1731661773095,
            "ltime": 1731661773095
        },
        {
            "id": 1,
            "uid": 21201,
            "type": 20020,
            "state": 1,
            "num": 9000,
            "ctime": 1731661420158,
            "ltime": 1731661420158
        }
    ],
    "UserToken": [
        {
            "uid": 21201,
            "prop_id": 10010,
            "chain": 0,
            "num": 251,
            "lock_num": 0,
            "ableNum": 251
        },
        {
            "uid": 21201,
            "prop_id": 10020,
            "chain": 0,
            "num": 12200,
            "lock_num": 0,
            "ableNum": 12200
        },
        {
            "uid": 21201,
            "prop_id": 20010,
            "chain": 0,
            "num": 50000,
            "lock_num": 0,
            "ableNum": 50000
        },
        {
            "uid": 21201,
            "prop_id": 20020,
            "chain": 0,
            "num": 100000,
            "lock_num": 0,
            "ableNum": 100000
        }
    ]
}

url: /app/getEvents
Request:
	
Response:
	weight //For sorting, the one with larger weight is at the front, and the one with larger id is at the front if the weight is the same.
	state -1.delete 0.close 1.open
{
    "code": 0,
    "data": [
        {
            "id": 333292,
            "name": "eventName1",
            "description": "eventDescription",
            "url": "https://x.com/realDonaldTrump/status/1853995861497307624",
            "img": "http://dummyimage.com/400x400",
            "weight": 5,
            "state": 1,
            "time": 1733129996995
        }
    ]
}

    */

    const getEvents = async (depth = 0) => {
        if (depth > 3) {
            console.log('getEvents: too many retries');
            return;
        }

        try {
            const data = await shared.api.getEvents(shared.loginData.token);
            console.log('Events data:', data);
            if (data.code === 0) {
                setEventData(data.data);
            }
            else if (data.code === 102002 || data.code === 102001) {
                console.log('Token expired, attempting to refresh...');
                const result = await shared.login(shared.initData);
                if (result.success) {
                    getEvents(depth + 1);
                }
                else {
                    console.error('Login failed:', result.error);
                }
            }
        } catch (error) {
            console.error('Error getting events:', error);
        }
    };

    const onClickCheckIn = async () => {
        console.log('onClickCheckIn');
        const result = await checkIn(shared.loginData);
        if(result == 1) {
            setShowCheckInAnimation(true);
        }
        else if(result == 0) {
            setShowCheckInAnimation(false);
            setShowCheckInView(true);
        }
        else {

        }
    }

    const onClickOpenGame = async () => {
        try {
            trackUserAction('minigame_clicked', {
                game_name: 'Tadokami',
                game_url: shared.game_link,
            }, shared.loginData?.link);
            
            // Use Telegram WebApp API to open the mini app directly within Telegram
            if (window.Telegram?.WebApp?.openTelegramLink) {
                // This method will open the link within Telegram without launching a browser
                window.Telegram.WebApp.openTelegramLink(shared.game_link);
            } else {
                // Fallback to SDK method if the direct method isn't available
                openLink(shared.game_link);
            }
        } catch (e) {
            console.log('Error opening Tadokami game:', e);
            // Fallback in case of error
            openLink(shared.game_link);
        }
    }

    const setupProfileData = async () => {
        await getProfileData();
        const userStarlets = shared.userProfile.UserToken.find(token => token.prop_id === 10020);
        if (userStarlets) {
            setStarlets(userStarlets.num);
        }

        const userTicket = shared.userProfile.UserToken.find(token => token.prop_id === 10010);
        if (userTicket) {
            setTicket(userTicket.num);
        }
    };

    const setupEvents = async () => {
        try {
            await getEvents();
        } catch (error) {
            console.error('Error setting up events:', error);
            setEventData([]); // Ensure eventData is an empty array on error
        }
    };

    // Fetch event status data
    const fetchEventStatus = async (depth = 0) => {
        if (depth > 3) {
            console.log('fetchEventStatus: too many retries');
            return;
        }

        try {
            const data = await shared.api.getEventPointData(shared.loginData.token);
            console.log('Event status data:', data);
            if (data.code === 0) {
                const eventActive = data.data.eventActive;
                setEventActive(eventActive);
                return eventActive;
            }
            else if (data.code === 102002 || data.code === 102001) {
                console.log('Token expired, attempting to refresh...');
                const result = await shared.login(shared.initData);
                if (result.success) {
                    return fetchEventStatus(depth + 1);
                }
                else {
                    console.error('Login failed:', result.error);
                    return false;
                }
            }
            return false;
        } catch (error) {
            console.error('Error fetching event status:', error);
            return false;
        }
    };

    // Check if the Egglet popup should be shown (once daily)
    const checkEggletPopup = async () => {
        // If in mockup mode, skip daily checking
        if (isMockup) {
            console.log('Mockup mode: Skipping daily check for egglet popup');
            await updateEventStatus(true);
            return;
        }
        
        // Regular daily checking logic
        const lastPopupTimeStr = localStorage.getItem('lastEggletPopupTime');
        
        if (lastPopupTimeStr) {
            const lastPopupTime = new Date(lastPopupTimeStr);
            const now = new Date();
            
            // Check if it's still the same day (using UTC to match check-in logic)
            const isSameDay = 
                lastPopupTime.getUTCFullYear() === now.getUTCFullYear() &&
                lastPopupTime.getUTCMonth() === now.getUTCMonth() &&
                lastPopupTime.getUTCDate() === now.getUTCDate();
                
            if (isSameDay) {
                console.log('Egglet popup already shown today, not showing again');
                setShowedEggletToday(true);
                // Still fetch event status to update other UI elements
                await updateEventStatus();
                return;
            }
        }
        
        // Not shown today or never shown, proceed with checking event status
        await updateEventStatus(true);
    };
    
    // Separate function to update event status and conditionally show popup
    const updateEventStatus = async (showPopupIfActive = false) => {
        // Fetch event status to determine if popup should be shown
        const eventData = await fetchEventStatus();
        
        if (eventData) {
            // Only show popup if eventStart is true and eventEnd is false
            const isEventActive = eventData.eventStart && !eventData.eventEnd;
            setEventActive(isEventActive);
            
            if (isEventActive && showPopupIfActive) {
                console.log('Showing Egglet popup - event is active');
                setShowEggletPopup(true);
                
                // Only save last popup time if not in mockup mode
                if (!isMockup) {
                    localStorage.setItem('lastEggletPopupTime', new Date().toISOString());
                    setShowedEggletToday(true);
                }
            } else if (!isEventActive) {
                console.log('Egglet popup not shown - event is not active');
                setShowEggletPopup(false);
            }
        } else {
            console.error('Failed to fetch event status data');
            setEventActive(false);
            setShowEggletPopup(false);
        }
    };

    const closeEggletPopup = () => {
        setShowEggletPopup(false);
        // Track that user has seen the popup
        trackUserAction('egglet_popup_closed', {}, shared.loginData?.link);
    };

    useEffect(() => {
        setupProfileData();
        setupEvents();
        
        // Check if we should show Egglet popup (once daily logic)
        // Small timeout to let the page load first
        setTimeout(() => {
            checkEggletPopup();
        }, 500);
    }, []);
    
    // Reset egglet popup flag at midnight
    useEffect(() => {
        // Skip this useEffect if in mockup mode
        if (isMockup) {
            console.log('Mockup mode: Skipping midnight reset for egglet popup');
            return;
        }
        
        let resetTimeout;
        
        const setupResetTimeout = () => {
            // Calculate time until next midnight (UTC)
            const now = new Date();
            const nextMidnight = new Date(now);
            nextMidnight.setUTCDate(now.getUTCDate() + 1);
            nextMidnight.setUTCHours(0, 0, 0, 0);
            const timeUntilMidnight = nextMidnight - now;
            
            console.log('Setting timeout to reset egglet popup flag in', timeUntilMidnight, 'ms');
            
            // Set timeout to reset popup flag at midnight
            resetTimeout = setTimeout(() => {
                console.log('Resetting egglet popup flag at midnight');
                setShowedEggletToday(false);
                // Check if popup should be shown again (e.g., if user is still using the app past midnight)
                checkEggletPopup();
                // Setup the next day's reset
                setupResetTimeout();
            }, timeUntilMidnight);
        };
        
        // Initial setup
        setupResetTimeout();
        
        // Cleanup on unmount
        return () => clearTimeout(resetTimeout);
    }, []);

    const startAutoScroll = () => {
        if (!intervalRef.current) {
            intervalRef.current = setInterval(() => {
                if (carouselRef.current) {
                    const slides = carouselRef.current.children;
                    const visibleSlideIndex = Array.from(slides).findIndex(slide => {
                        const rect = slide.getBoundingClientRect();
                        return rect.left > 0 && rect.left < (window.innerWidth / 2);
                    });

                    if (visibleSlideIndex !== -1) {
                        setCurrentSlide(visibleSlideIndex);
                    }

                    if (visibleSlideIndex < slides.length - 1) {
                        setCurrentSlide(visibleSlideIndex + 1);
                        slides[visibleSlideIndex + 1].scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest',
                            inline: 'start'
                        });
                    } else {
                        setCurrentSlide(0);
                        slides[0].scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest',
                            inline: 'start'
                        });
                    }
                }
            }, 10000);
        }
    };

    const stopAutoScroll = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    useEffect(() => {
        startAutoScroll();
        return () => stopAutoScroll();
    }, []);

    useEffect(() => {
        // console.log('MainView useEffect, checkInData: ' + checkInData);
        let myTimeout;
        try {
            let lastTime = new Date(checkInData.lastTime);
            
            const now = new Date();
            const nextCheckInTime = new Date(now);
            nextCheckInTime.setUTCDate(now.getUTCDate() + 1);
            nextCheckInTime.setUTCHours(0, 0, 0, 0);
            const remaining = nextCheckInTime - now;

            if(remaining > 0) {
                console.log('MainView useEffect: after check-in state, remaining: ' + remaining);
                setShowTextCheckIn(false);
                myTimeout = setTimeout(() => setShowTextCheckIn(true), remaining);
            }
            else {
                console.log('MainView useEffect: before check-in state, remaining: ' + remaining);
                setShowTextCheckIn(true);
            }
            
        }
        catch (e) {
            console.log(e);
        }

        return () => clearTimeout(myTimeout);
    }, []);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        isMouseDown = true;
        const carousel = carouselRef.current;
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
        stopAutoScroll();

        startDragX = e.pageX;
        startDragTime = Date.now();
    };

    const handleMouseMove = (e) => {
        // if (!isDragging) return;
        // console.log('handleMouseMove, isMouseDown:', isMouseDown);
        if (!isMouseDown) return;

        stopAutoScroll();
        e.preventDefault();
        const carousel = carouselRef.current;
        const x = e.pageX - carousel.offsetLeft;
        const distance = x - startX;
        
        // Smoother scrolling with requestAnimationFrame
        requestAnimationFrame(() => {
            carousel.scrollLeft = scrollLeft - distance;
        });
    };

    const handleMouseUp = (e) => {
        try {
            setIsDragging(false); 
            isMouseDown = false;

            const moveDistance = Math.abs(e.pageX - startDragX);
            const moveTime = Date.now() - startDragTime;

            const isClick = moveDistance < 5 && moveTime < 200;

            /*
            if (carouselRef.current) {
                const carousel = carouselRef.current;
                const slides = carousel.children;
                const currentScroll = carousel.scrollLeft;
                const itemWidth = carousel.offsetWidth;
                
                const targetCard = Math.round(currentScroll / itemWidth);
                const safeTargetCard = Math.min(Math.max(targetCard, 0), slides.length - 1);
                
                setCurrentSlide(safeTargetCard);

                if (!isClick) {
                    requestAnimationFrame(() => {
                        slides[safeTargetCard].scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest',
                            inline: 'start'
                        });
                    });
                }
            }
                */
            startAutoScroll();
        }
        catch (e) {
            console.log(e);
        }
    };

    const handleMouseLeave = () => {
        // console.log('handleMouseLeave, isMouseDown:', isMouseDown);

        if (isMouseDown) {
            handleMouseUp();
        }
        else {
            isMouseDown = false;
            setIsDragging(false);
            startAutoScroll();
        }

    };

    const handleTouchStart = (e) => {
        setIsDragging(true);
        stopAutoScroll();
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;        
    };

    const handleTouchEnd = () => {
        handleMouseUp();
    };

    // In MainView.js
    const handleWheel = (e) => {
        // If it's a vertical scroll (deltaY), let it propagate to parent
        
        // e.preventDefault();
        
        if (Math.abs(e.deltaY) > 0 || Math.abs(e.deltaX) > 0) {
            // Only handle horizontal scrolling
            if (carouselRef.current) {
                carouselRef.current.scrollLeft += e.deltaY;
            }
        }
        else {
            // handleMouseUp();
        }
    };

    return (
        <>
            <header className="stats-header">
                <button 
                    className="profile-pic-main"
                    onClick={() => setShowProfileView(true)}
                >
                    <img 
                    src={shared.avatars[shared.userProfile ? shared.userProfile.pictureIndex : 0]?.src} 
                    alt="Profile" />
                </button>
                <div className="level-badge" onClick={() => setShowProfileView(true)}>
                    LV.{shared.userProfile ? shared.userProfile.level || 0 : 0}
                </div>
                <div className="stats-main">
                    <button 
                        className="stat-item-main"
                        onClick={() => setShowProfileView(true)}
                    >
                        <img src={ticketIcon} alt="Stat 1" />
                        <span className='stat-item-main-text'>{ticket}</span>
                    </button>
                    <button 
                        className="stat-item-main"
                        onClick={() => setShowProfileView(true)}
                    >
                        <img src={starlet} alt="Starlets" />
                        <span className='stat-item-main-text'>{starlets}</span>
                    </button>
                    <div className="stat-item-main">
                        <button className="stat-button" onClick={() => onClickCheckIn()}>
                            <img src={showTextCheckIn ? calendar_before_checkin : calendar} alt="Stat 1" />
                            <div className="check-in-text">
                                {showTextCheckIn ? (
                                    <>
                                        <span>CHECK-IN</span>
                                        <span>TODAY</span>
                                    </>
                                ) : (
                                    <span className='stat-item-main-text'>{checkInData != null ? checkInData.streakDay : "0"}</span>
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            <div className="scrollable-content">
                <section className="tickets-section">
                    {/* <button className="ticket-card" onClick={() => setShowTicketView(true)}>
                        <img
                            // src={Frame4556}
                            src = {my_ticket}
                            alt="My Tickets"
                            className="ticket-card-image-main"
                        />
                    </button> */}

                    <button className="ticket-button" onClick={() => setShowTicketView(true)}>
                        <div className='ticket-button-image-container'>
                            <img
                                src={my_ticket}
                                alt="My Tickets"
                                className="ticket-button-image"
                            />
                            <div className='ticket-button-container-border'></div>
                            {/* <div className="ticket-button-content"> */}
                                <h3 className="event-card-title">MY TICKETS</h3>
                                <p className="event-card-subtitle">Scratch Tickets and Unlock <br></br>Rewards!</p>
                                <div className="check-out-button">
                                    Scratch Tickets
                                </div>
                            {/* </div> */}
                        </div>
                    </button>
                </section>

                {/* Egglet Event Section - only shown if event is active */}
                {eventActive && (
                    <section className="egglet-section">
                        <button className="egglet-button" onClick={() => setShowEggletPage(true)}>
                            <div className="egglet-event-content">
                                <div className="egglet-title"><span>EARN EGGLETS</span></div>
                                <div className="egglet-date">17 – 27 APRIL</div>
                            </div>
                            <div className="egglet-event-tag">EGGLET EVENT</div>
                        </button>
                    </section>
                )}

                <section className="locked-sections">
                    <button className="locked-card" onClick={() => onClickOpenGame()}>
                        <div className='locked-card-image-container'>
                            <img
                                // src={`${process.env.PUBLIC_URL}/images/Frame4561.png`}
                                // src={Frame4561}
                                src={tadokami}
                                alt="Tadokami "
                                className="locked-card-image minigames"
                            /> 
                            <div className='ticket-button-container-border'></div>
                            {/* <div className='coming-soon-button'>Pre-Alpha</div> */}
                            <div className='locked-card-text'></div>
                        </div>
                        {/* <img
                            src={locker}
                            alt="Locker"
                            className="locker-icon"
                        /> */}
                    </button>

                    <button className="locked-card" onClick={() => setShowBankStepsView(true)}>
                        <div className='locked-card-image-container'>
                            <img
                                // src={`${process.env.PUBLIC_URL}/images/Frame4561.png`}
                                src={stepn_background}
                                alt="Leaderboard Coming Soon"
                                className="locked-card-image"
                            />
                            <div className='ticket-button-container-border'></div>
                            <div className='check-out-button'>Bank Steps</div>
                            <div className='locked-card-text'>STEPN</div>
                        </div>
                        {/* <img
                            src={locker}
                            alt="Locker"
                            className="locker-icon"
                        /> */}
                    </button>
                </section>

                <section className="events-section">
                    <div 
                        className={`events-carousel ${isDragging ? 'dragging' : ''}`}
                        ref={carouselRef}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                        onMouseMove={handleMouseMove}
                        onWheel={handleWheel}
                    >
                        {Array.isArray(eventData) && eventData.map((event, index) => (
                            <button 
                                key={index} 
                                className="event-card" 
                                onClick={(e) => {
                                    try {
                                        const moveDistance = Math.abs(e.pageX - startDragX);
                                        const moveTime = Date.now() - startDragTime;
                                        
                                        if (moveDistance < 2 && moveTime < 200) {
                                            trackUserAction('banner_clicked', {
                                                banner_index: index,
                                                banner_name: event.name,
                                                banner_url: event.url
                                            }, shared.loginData?.link);
                                            openLink(event.url);
                                        }
                                    }
                                    catch (e) {
                                        console.log(e);
                                    }
                                }}
                            >
                                <img
                                    src={event.img}
                                    alt={event.name}
                                    className="event-card-image"
                                />
                                <div className="event-card-content">
                                    <div className="check-out-button">
                                        Check out
                                        <img src={checkout} alt="Arrow" />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="carousel-dots">
                        {Array.isArray(eventData) && eventData.map((_, index) => (
                            <button
                                key={index}
                                className={`carousel-dot ${currentSlide === index ? 'active' : ''}`}
                                onClick={() => {
                                    setCurrentSlide(index);
                                    carouselRef.current.children[index].scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'nearest',
                                        inline: 'start'
                                    });
                                }}
                            />
                        ))}
                    </div>
                </section>
            </div>

            {/* EggletEventPage component */}
            {showEggletPage && <EggletEventPage 
                onClose={() => setShowEggletPage(false)} 
                setShowProfileView={setShowProfileView}
                setShowCheckInView={setShowCheckInView}
                checkInData={checkInData}
            />}

            {/* Egglet Event Popup - only shown if event is active */}
            {eventActive && <EggletEventPopup isOpen={showEggletPopup} onClose={closeEggletPopup} />}
        </>
    );
};

export default MainView;
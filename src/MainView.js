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
import dailyTasks from './images/one_shot.png';
import checkout from './images/checkout.svg';
import eggletLogo from './images/Egglets_Logo.png';
import eggletBackground from './images/Egglets_Background.png';

import { popup } from '@telegram-apps/sdk';

import shared from './Shared';
import { trackLineConversion, trackUserAction } from './analytics';
import EggletEventPopup from './EggletEventPopup';
import EggletEventPage from './EggletEventPage';
import { t, getCurrentLanguage, setLanguage } from './utils/localization';

import liff from '@line/liff';

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
    const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());
    const [showIdTokenPopup, setShowIdTokenPopup] = useState(false);
    
    // Daily task states
    const [dailyTaskId, setDailyTaskId] = useState(null);
    const [dailyTaskStatus, setDailyTaskStatus] = useState(1); // Default: completed (disabled)
    const [dailyTaskData, setDailyTaskData] = useState(null);
    
    // Set to true to disable daily checking and always show popup when event is active
    const isMockup = false;

    // const [scrollLeft, setScrollLeft] = useState(0);
    // const [startX, setStartX] = useState(0);
    // const [startDragX, setStartDragX] = useState(0);
    // const [startDragTime, setStartDragTime] = useState(0);

    // url: /app/getDailyTask
    // Request:
    // Response:
    // {
    //     "code": 0,
    //     "data": 1048109
    // }

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
        let retVal = [];
        console.log('getEvents...');
        try {
            const response = await fetch(`${shared.server_url}/api/app/getEvents?token=${shared.loginData.token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('getEvents Response:', response);

            if (response.ok) {
                const data = await response.json();
                console.log('getEvents Data:', data);                
                
                if (data.code === 0) {
                    console.log('getEvents: success');
                    retVal = data.data;
                }
                else if (data.code === 102001 || data.code === 102002) {
                    console.log('getEvents: login again');                    
                    const result = await shared.login();
                    if (result) {
                        retVal = getEvents(depth + 1);
                    }
                }
                else {
                    alert('Error\n\nSomething went wrong');
                }
            }
            else {
                console.log('getEvents Response not ok:', response);
            }
        }
        catch (e) {
            console.error('getEvents error:', e);
        }        
        return retVal;
    }

    const onClickCheckIn = async () => {
        trackLineConversion('Check_In_Click');
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

            trackLineConversion('Tadokami_Game_Click');
            
            // Open LIFF URL
            liff.openWindow({
                url: shared.game_link,
                external: false
            });
        } catch (e) {
            console.log('Error opening LIFF:', e);
            // Fallback to browser
            shared.openExternalLink(shared.game_link);
        }
    }

    const onClickDailyTasks = async () => {
        try {
            if (dailyTaskId) {
                // Store the daily task ID in shared object so Tasks component can access it
                shared.autoStartTaskId = dailyTaskId;
                // Navigate to Tasks view
                shared.setActiveTab('tasks');
            } else {
                console.log('No daily task available');
            }
        } catch (e) {
            console.error('Error opening daily tasks:', e);
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

    const getDailyTask = async (depth = 0) => {
        if (depth > 3) {
            console.log('getDailyTask: too many retries');
            return;
        }
        
        console.log('getDailyTask...');
        try {
            const response = await fetch(`${shared.server_url}/api/app/getDailyTask?token=${shared.loginData.token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('getDailyTask Response:', response);

            if (response.ok) {
                const data = await response.json();
                console.log('getDailyTask Data:', data);                
                
                if (data.code === 0) {
                    console.log('getDailyTask: success, task ID:', data.data);
                    setDailyTaskId(data.data);
                    // Fetch task details to get status
                    await fetchDailyTaskDetails(data.data);
                }
                else if (data.code === 102001 || data.code === 102002) {
                    console.log('getDailyTask: login again');                    
                    const result = await shared.login();
                    if (result) {
                        getDailyTask(depth + 1);
                    }
                }
                else {
                    console.log('getDailyTask error:', data);
                }
            }
            else {
                console.log('getDailyTask Response not ok:', response);
            }
        }
        catch (e) {
            console.error('getDailyTask error:', e);
        }        
    };

    const fetchDailyTaskDetails = async (taskId, depth = 0) => {
        if (depth > 3) {
            console.log('fetchDailyTaskDetails: too many retries');
            return;
        }
        
        try {
            const response = await fetch(`${shared.server_url}/api/app/taskData?token=${shared.loginData.token}&id=${taskId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Daily task details:', data);
                
                if (data.code === 0) {
                    setDailyTaskData(data.data);
                    // Only enable button if task is not completed (state 0)
                    // Otherwise keep it disabled (state 1)
                    setDailyTaskStatus(data.data.state);
                }
                else if (data.code === 102001 || data.code === 102002) {
                    console.log('fetchDailyTaskDetails: login again');
                    const result = await shared.login();
                    if (result) {
                        fetchDailyTaskDetails(taskId, depth + 1);
                    }
                }
                else {
                    console.log('fetchDailyTaskDetails error:', data);
                }
            }
            else {
                console.log('fetchDailyTaskDetails Response not ok:', response);
            }
        }
        catch (e) {
            console.error('fetchDailyTaskDetails error:', e);
        }
    };

    const setupEvents = async () => {
        const events = await getEvents();
        console.log('setupEvents:', events);
        setEventData(events);
    };

    // Fetch event status data
    const fetchEventStatus = async (depth = 0) => {
        if (depth > 3) {
            console.error('Get event status failed after 3 attempts');
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
                console.log('Event status data:', data);

                if (data.code === 0) {
                    return data.data;
                } else if (data.code === 102001 || data.code === 102002) {
                    console.error('Token expired, attempting to re-login');
                    const loginResult = await shared.login(shared.initData);
                    if (loginResult.success) {
                        return fetchEventStatus(depth + 1);
                    } else {
                        console.error('Re-login failed:', loginResult.error);
                    }
                } else {
                    console.error('Failed to fetch event status:', data.msg);
                }
            } else {
                console.error('Event status response error:', response);
            }
        } catch (error) {
            console.error('Error fetching event status:', error);
        }
        
        return null;
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

    const toggleLanguage = () => {
        const newLang = currentLanguage === 'en' ? 'ja' : 'en';
        setLanguage(newLang);
    };

    const copyIdToken = async () => {
        try {
            const idToken = shared.loginData?.token || 'No token available';
            
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(idToken);
            } else {
                // Fallback for older browsers or non-secure contexts
                const textArea = document.createElement('textarea');
                textArea.value = idToken;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                textArea.remove();
            }
            
            // Show success message
            alert('ID Token copied to clipboard!');
            setShowIdTokenPopup(false);
        } catch (err) {
            console.error('Failed to copy ID Token:', err);
            alert('Failed to copy ID Token. Please try again.');
        }
    };

    const openIdTokenPopup = () => {
        setShowIdTokenPopup(true);
    };

    useEffect(() => {
        setupProfileData();
        setupEvents();
        getDailyTask();
        
        // Check if we should show Egglet popup (once daily logic)
        // Small timeout to let the page load first
        setTimeout(() => {
            checkEggletPopup();
        }, 500);
    }, []);
    
    // Add useEffect to listen for data refresh trigger from App component
    useEffect(() => {
        // This will run when dataRefreshTrigger changes (after focus/unfocus reload)
        if (shared.userProfile) {
            console.log('MainView: Updating currency display after data refresh');
            const userStarlets = shared.userProfile.UserToken.find(token => token.prop_id === 10020);
            if (userStarlets) {
                setStarlets(userStarlets.num);
            }

            const userTicket = shared.userProfile.UserToken.find(token => token.prop_id === 10010);
            if (userTicket) {
                setTicket(userTicket.num);
            }
        }
    }, [getProfileData]); // This will trigger when getProfileData function reference changes (which happens when dataRefreshTrigger changes)
    
    // Add useEffect to refresh daily task data when user profile changes
    useEffect(() => {
        if (shared.userProfile && dailyTaskId) {
            console.log('MainView: Refreshing daily task status after data refresh');
            fetchDailyTaskDetails(dailyTaskId);
        }
    }, [shared.userProfile, dailyTaskId]);

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
                    onClick={() => {
                        setShowProfileView(true);
                        trackLineConversion('Profile_Click');
                    }}
                >
                    <img 
                    src={shared.avatars[shared.userProfile ? shared.userProfile.pictureIndex : 0]?.src} 
                    alt="Profile" />
                </button>
                <div className="level-badge" onClick={() => {
                    setShowProfileView(true);
                    trackLineConversion('Level_Badge_Click');
                    }}>
                    {t('LEVEL_ABBR')} {shared.userProfile ? shared.userProfile.level || 0 : 0}
                </div>
                <div className="stats-main">
                    <button 
                        className="stat-item-main"
                        onClick={() => {
                            setShowProfileView(true)
                            trackLineConversion('Ticket_Usage');
                        }}
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
                                        <span>{t('CHECK_IN')}</span>
                                        <span>{t('TODAY')}</span>
                                    </>
                                ) : (
                                    <span className='stat-item-main-text'>{checkInData != null ? checkInData.streakDay : "0"}</span>
                                )}
                            </div>
                        </button>
                    </div>
                </div>
                <button 
                    className="language-toggle"
                    onClick={toggleLanguage}
                    title={t('LANGUAGE')}
                >
                    {currentLanguage === 'en' ? '🇯🇵' : '🇺🇸'}
                </button>
                {/* <button 
                    className="id-token-toggle"
                    onClick={openIdTokenPopup}
                    title="Copy ID Token"
                >
                    🔑
                </button> */}
            </header>

            <div className="scrollable-content">
            <section className="tickets-section">
                    <button className="ticket-button" onClick={() => onClickOpenGame()}>
                        <div className='ticket-button-image-container'>
                            <img
                                src={tadokami}
                                alt="My Tickets"
                                className="ticket-button-image"
                            />
                            <div className='ticket-button-container-border'></div>
                            {/* <div className="ticket-button-content"> */}
                                {/* <h3 className="event-card-title">TADOKAMI</h3>
                                <p className="event-card-subtitle">Is now live</p> */}
                            {/* </div> */}
                        </div>
                    </button>
                </section>


                {/* Egglet Event Section - only shown if event is active */}
                {eventActive && (
                    <section className="egglet-section">
                        <button className="egglet-button" onClick={() => setShowEggletPage(true)}>
                            <div className="egglet-event-content">
                                                            <div className="egglet-title"><span>{t('EARN_EGGLETS')}</span></div>
                            <div className="egglet-date">17 – 27 APRIL</div>
                            </div>
                            <div className="egglet-event-tag">EGGLET EVENT</div>
                        </button>
                    </section>
                )}

                <section className="locked-sections">
                    <button 
                        className={`locked-card ${dailyTaskStatus === 1 ? 'sold-out' : ''}`} 
                        onClick={() => dailyTaskStatus !== 1 && onClickDailyTasks()}
                        disabled={dailyTaskStatus === 1}
                    >
                        <div className='locked-card-image-container'>
                            <img
                                src={dailyTasks}
                                alt="Daily Tasks"
                                className="locked-card-image minigames"
                                style={{ opacity: dailyTaskStatus === 1 ? 0.5 : 1 }}
                            /> 
                            <div className='ticket-button-container-border'></div>
                            {/* <div className='coming-soon-button'>Pre-Alpha</div> */}
                            <div className='locked-card-text'></div>
                        </div>
                        {dailyTaskStatus === 1 && (
                            <div className="sold-out-overlay">{t('DONE')}</div>
                        )}
                        {/* <img
                            src={locker}
                            alt="Locker"
                            className="locker-icon"
                        /> */}
                    </button>

                    <button className="locked-card" onClick={() => 
                    {
                        setShowBankStepsView(true)
                        trackLineConversion('Bank_Steps_Click');
                    }}>
                        <div className='locked-card-image-container'>
                            <img
                                // src={`${process.env.PUBLIC_URL}/images/Frame4561.png`}
                                src={stepn_background}
                                alt="Leaderboard Coming Soon"
                                className="locked-card-image"
                            />
                            <div className='ticket-button-container-border'></div>
                            <div className='check-out-button'>{t('BANK_STEPS')}</div>
                        </div>
                        {/* <img
                            src={locker}
                            alt="Locker"
                            className="locker-icon"
                        /> */}
                    </button>
                </section>

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
                                <h3 className="event-card-title">{t('MY_TICKETS')}</h3>
                                <p className="event-card-subtitle">{t('SCRATCH_TICKETS_REWARDS')}</p>
                                <div className="check-out-button ticket">
                                    {t('SCRATCH_TICKETS')}
                                </div>
                            {/* </div> */}
                        </div>
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
                        // onTouchStart={handleTouchStart}
                        // onTouchMove={handleTouchMove}
                        // onTouchEnd={handleMouseUp}
                        onWheel={handleWheel}  // Add this handler
                    >
                        {eventData.map((event, index) => (
                            <button 
                                key={index} 
                                className="event-card" 
                                onClick={(e) => {
                                    trackLineConversion('Event_Card_Click');
                                    try {
                                        const moveDistance = Math.abs(e.pageX - startDragX);
                                        const moveTime = Date.now() - startDragTime;
                                        
                                        if (moveDistance < 2 && moveTime < 200) {
                                            trackUserAction('banner_clicked', {
                                                banner_index: index,
                                                banner_name: event.name,
                                                banner_url: event.url
                                            }, shared.loginData?.link);
                                            shared.openExternalLink(event.url);
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
                                    {/* <h3 className="event-card-title">{event.name}</h3>
                                    <p className="event-card-subtitle">{event.description}</p> */}
                                    <div className="check-out-button">
                                        {t('CHECK_OUT')}
                                        <img src={checkout} alt="Arrow" />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="carousel-dots">
                        {eventData.map((_, index) => (
                            <button
                                key={index}
                                className={`carousel-dot ${currentSlide === index ? 'active' : ''}`}
                                onClick={() => {
                                    trackLineConversion('Event_Card_Click');
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

            {/* ID Token Popup */}
            {showIdTokenPopup && (
                <div className="id-token-popup-overlay" onClick={() => setShowIdTokenPopup(false)}>
                    <div className="id-token-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="id-token-popup-header">
                            <h3>Copy ID Token</h3>
                            <button 
                                className="id-token-close-btn"
                                onClick={() => setShowIdTokenPopup(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="id-token-content">
                            <p>Click the button below to copy your ID Token to clipboard:</p>
                            <div className="id-token-display">
                                <code>{shared.loginData?.token || 'No token available'}</code>
                            </div>
                            <button 
                                className="id-token-copy-btn"
                                onClick={copyIdToken}
                            >
                                Copy ID Token
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MainView;
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
import flipping_stars from './images/FlippingStarBanner.png';
// import LFGO from './images/LFGO.svg';
import LFGO from './images/LFGO.png';
// import morchigame from './images/morchigame.png';
import morchigame from './images/morchigame.svg';
import comingsoon from './images/Coming soon-05.png';
import tadokami from './images/Tadokami_Logo.png';
import marketplace from './images/MARKETPLACE.png';
import dailyTasks from './images/one_shot.2827c4f3c969098979d4.png';
import checkout from './images/checkout.svg';
import eggletLogo from './images/Egglets_Logo.png';
import eggletBackground from './images/Egglets_Background.png';

import { popup, openLink } from '@telegram-apps/sdk';

import shared from './Shared';
import { trackUserAction } from './analytics';
import EggletEventPopup from './EggletEventPopup';
import EggletEventPage from './EggletEventPage';
import IntroducePremium from './IntroducePremium';
import Premium from './Premium';
import premiumBg from './images/Premium_background_buy.png';
import premiumDiamond from './images/Premium_icon.png';

let isMouseDown = false;
let startX;
let startDragX;
let startDragTime;
let scrollLeft;

const MainView = ({ checkInData, setShowCheckInAnimation, checkIn, setShowCheckInView, setShowProfileView, setShowTicketView, setShowBankStepsView, setShowFlippingStarsView, getProfileData}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showTextCheckIn, setShowTextCheckIn] = useState(false);
    const [starlets, setStarlets] = useState(0);
    const [ticket, setTicket] = useState(0);
    const [totalFlips, setTotalFlips] = useState(0);
    const [jackpotValue, setJackpotValue] = useState(0);
    const [eventData, setEventData] = useState([]);
    const carouselRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const intervalRef = useRef(null);
    const [showEggletPopup, setShowEggletPopup] = useState(false);
    const [showEggletPage, setShowEggletPage] = useState(false);
    const [showIntroducePremium, setShowIntroducePremium] = useState(false);
    const [showPremium, setShowPremium] = useState(false);
    const [isCheckingPremiumStatus, setIsCheckingPremiumStatus] = useState(true);

    // Fetch total flips from API
    const fetchTotalFlips = async () => {
        try {
            if (!shared.loginData?.token) {
                console.log('No login token available for totalFlips API');
                return;
            }
            
            const url = `${shared.server_url}/api/app/totalFlips?token=${shared.loginData.token}`;
            console.log('Fetching total flips from:', url);
            
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                console.log('Total flips API response:', data);
                
                // Handle API response format: {"code": 0, "data": {"totalFlips": 1859, "userFlips": 27}}
                if (data.code === 0 && data.data !== undefined) {
                    if (typeof data.data === 'object' && data.data.totalFlips !== undefined) {
                        setTotalFlips(data.data.totalFlips);
                        console.log('✅ Found totalFlips in data.data.totalFlips:', data.data.totalFlips);
                    } else if (typeof data.data === 'number') {
                        // Fallback for old format: {"code": 0, "data": 159}
                        setTotalFlips(data.data);
                        console.log('✅ Found totalFlips in data.data (number):', data.data);
                    } else {
                        console.log('Unexpected totalFlips API response format:', data);
                    }
                } else {
                    console.log('Unexpected totalFlips API response format:', data);
                }
            } else {
                console.error('Total flips API response not ok:', response.status);
            }
        } catch (error) {
            console.error('Error fetching total flips:', error);
        }
    };

    // Fetch jackpot value from API
    const fetchJackpotValue = async () => {
        try {
            if (!shared.loginData?.token) {
                console.log('No login token available for jackpot API');
                return;
            }
            
            const url = `${shared.server_url}/api/app/getJackpotValue?token=${shared.loginData.token}`;
            console.log('Fetching jackpot value from:', url);
            
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                console.log('Jackpot value API response:', data);
                
                // Handle API response format: {"code": 0, "data": 34947}
                if (data.code === 0 && data.data !== undefined) {
                    setJackpotValue(data.data);
                    console.log('✅ Found jackpot value in data.data:', data.data);
                } else {
                    console.log('Unexpected jackpot API response format:', data);
                }
            } else {
                console.error('Jackpot value API response not ok:', response.status);
            }
        } catch (error) {
            console.error('Error fetching jackpot value:', error);
        }
    };

    const [eventActive, setEventActive] = useState(false);
    const [showedEggletToday, setShowedEggletToday] = useState(false);
    
    // Daily task states
    const [dailyTaskId, setDailyTaskId] = useState(null);
    const [dailyTaskStatus, setDailyTaskStatus] = useState(1); // Default: completed (disabled)
    const [dailyTaskData, setDailyTaskData] = useState(null);
    
    // Set to true to disable daily checking and always show popup when event is active
    const isMockup = false;

    // Function to navigate to marketplace with starlet tab
    const onClickMarketplace = () => {
        // Set the initial market tab to 'starlet'
        shared.setInitialMarketTab('starlet');
        // Navigate to market tab
        shared.setActiveTab('market');
    };

    // Premium membership status
    const [isPremiumMember, setIsPremiumMember] = useState(false);
    
    // Set setIsPremiumMember function to shared so other components can use it
    useEffect(() => {
        shared.setIsPremiumMember = setIsPremiumMember;
        shared.setShowPremium = () => setShowPremium(true);
    }, []);
    
    // Check if we should auto-open Premium popup when returning to home
    useEffect(() => {
        if (shared.shouldOpenPremiumOnHome) {
            console.log('Auto-opening Premium popup after successful purchase');
            // Reset flag
            shared.shouldOpenPremiumOnHome = false;
            // Open Premium popup
            setShowPremium(true);
        }
    }, []); // Run once on mount
    
    // Function to check premium membership status (lightweight version)
    const checkPremiumStatus = async () => {
        try {
            setIsCheckingPremiumStatus(true);

            if (!shared.loginData?.token) {
                console.log('No login token available for premium status check');
                return;
            }
            
            const url = `${shared.server_url}/api/app/getPremiumStatus?token=${shared.loginData.token}`;
            const response = await fetch(url);
            
            if (response.ok) {
                const data = await response.json();
                if (data.code === 0) {
                    const newPremiumStatus = data.data || false;
                    
                    setIsPremiumMember(newPremiumStatus);
                    shared.isPremiumMember = newPremiumStatus; // Update shared state
                    console.log('Premium status updated:', newPremiumStatus);
                    console.log('shared.isPremiumMember:', shared.isPremiumMember);
                    
                    // Auto-adjust avatar if premium status changed and avatar doesn't match
                    if (shared.userProfile && shared.userProfile.pictureIndex >= 13 && shared.userProfile.pictureIndex <= 15 && !newPremiumStatus) {
                        console.log('Premium status is false but user has premium avatar, auto-adjusting...');
                        const adjustResult = await shared.autoAdjustAvatar(getProfileData);
                        if (adjustResult.success) {
                            console.log('Avatar auto-adjusted:', adjustResult.message);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error checking premium status:', error);
        } finally {
            setIsCheckingPremiumStatus(false);
            console.log('Premium check completed, isCheckingPremiumStatus set to false');
        }
    };
    
    const onClickPremium = () => {
        console.log('onClickPremium called');
        console.log('isCheckingPremiumStatus:', isCheckingPremiumStatus);
        console.log('shared.isPremiumMember:', shared.isPremiumMember);
        
        if (isCheckingPremiumStatus) {
            console.log('Premium check in progress, returning early');
            return; // Disable khi đang loading
        }
        
        if (shared.isPremiumMember) {
            console.log('User is premium member, opening Premium page');
            setShowPremium(true); // Mở trang Premium
        } else {
            console.log('User is not premium member, opening IntroducePremium page');
            setShowIntroducePremium(true); // Mở trang IntroducePremium
        }
    };

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
                    const promise = popup.open({
                        title: 'Error Getting Events',
                        message: `Error code:${JSON.stringify(data)}`,
                        buttons: [{ id: 'my-id', type: 'default', text: 'OK' }],
                    });
                    const buttonId = await promise;
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

    const onClickDailyTasks = async () => {
        try {
            if (dailyTaskId) {
                // Check if task has expired
                if (dailyTaskData && dailyTaskData.endTime) {
                    const currentTime = Date.now();
                    if (currentTime > dailyTaskData.endTime) {
                        // Task has expired, show popup
                        await shared.showPopup({
                            type: 0,
                            message: 'Task has expired'
                        });
                        return;
                    }
                }
                
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

    // OPTIMIZED: Add function to refresh all MainView content (similar to Market.js pattern)
    // This function can be called when needed to refresh all data without duplicating API calls
    const refreshMainViewContent = async () => {
        try {
            console.log('MainView: Refreshing all content...');
            
            // Refresh profile data
            await setupProfileData();
            
            // Refresh events
            await setupEvents();
            
            // Refresh daily task
            await getDailyTask();
            
            // Note: fetchTotalFlips() is handled by interval, no need to call here
            // Note: checkEggletPopup() should only be called once daily, not on refresh
            
            console.log('MainView: All content refreshed successfully');
        } catch (error) {
            console.error('MainView: Failed to refresh content:', error);
        }
    };

    /*
    API CALL OPTIMIZATION SUMMARY (following Market.js pattern):
    
    BEFORE:
    - fetchTotalFlips() called twice: once in main useEffect + once in interval useEffect
    - fetchDailyTaskDetails() called twice: once in getDailyTask() + once when dailyTaskId changes
    - checkEggletPopup() called twice: once in main useEffect + once at midnight reset
    
    AFTER:
    - fetchTotalFlips() called only in interval useEffect (includes initial call)
    - fetchDailyTaskDetails() duplicate call prevented with timeout and dependency optimization
    - checkEggletPopup() midnight call delayed to prevent immediate duplicate
    - Added refreshMainViewContent() function for manual refresh when needed
    
    RESULT: Reduced from ~6 API calls to ~3 API calls on component mount
    */

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
    // COMMENTED OUT: Egglet event is currently closed
    const fetchEventStatus = async (depth = 0) => {
        /* if (depth > 3) {
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
        */
        return null;
    };

    // Check if the Egglet popup should be shown (once daily)
    // COMMENTED OUT: Egglet event is currently closed
    const checkEggletPopup = async () => {
        /* // If in mockup mode, skip daily checking
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
        await updateEventStatus(true); */
        console.log('Egglet event is currently closed - checkEggletPopup disabled');
    };
    
    // Separate function to update event status and conditionally show popup
    // COMMENTED OUT: Egglet event is currently closed
    const updateEventStatus = async (showPopupIfActive = false) => {
        /* // Fetch event status to determine if popup should be shown
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
        } */
        console.log('Egglet event is currently closed - updateEventStatus disabled');
        setEventActive(false);
        setShowEggletPopup(false);
    };

    const closeEggletPopup = () => {
        setShowEggletPopup(false);
        // Track that user has seen the popup
        trackUserAction('egglet_popup_closed', {}, shared.loginData?.link);
    };

    // Main useEffect to fetch all data on component mount
    // OPTIMIZED: Following Market.js pattern to prevent duplicate API calls
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Load initial MainView data
                await setupProfileData();
                await setupEvents();
                await getDailyTask();
                
                // Check premium status
                await checkPremiumStatus();
                
                // OPTIMIZED: Remove duplicate fetchTotalFlips() call here since interval will handle it
                // fetchTotalFlips(); // ← Removed to prevent duplicate call
                
                // Check if we should show Egglet popup (once daily logic)
                // Small timeout to let the page load first
                setTimeout(() => {
                    checkEggletPopup();
                }, 500);
            } catch (error) {
                console.error('MainView: Failed to fetch initial data:', error);
            }
        };

        fetchAllData();
    }, []);

    // Auto-refresh total flips every 30 seconds (includes initial call)
    useEffect(() => {
        // Call immediately on mount, then set interval
        fetchTotalFlips();
        
        const interval = setInterval(() => {
            fetchTotalFlips();
        }, 60000); // 30 seconds

        return () => clearInterval(interval);
    }, []);

    // Auto-refresh jackpot value every 30 seconds (includes initial call)
    useEffect(() => {
        // Call immediately on mount, then set interval
        fetchJackpotValue();
        
        const interval = setInterval(() => {
            fetchJackpotValue();
        }, 60000); // 30 seconds

        return () => clearInterval(interval);
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
    // OPTIMIZED: Add condition to prevent duplicate calls when dailyTaskId changes right after getDailyTask()
    useEffect(() => {
        if (shared.userProfile && dailyTaskId) {
            console.log('MainView: Refreshing daily task status after data refresh');
            // Add a small delay to prevent duplicate call when dailyTaskId just got set by getDailyTask()
            const timeoutId = setTimeout(() => {
                fetchDailyTaskDetails(dailyTaskId);
            }, 100); // Small delay to prevent immediate duplicate call
            
            return () => clearTimeout(timeoutId);
        }
    }, [shared.userProfile]); // Remove dailyTaskId from dependencies to prevent duplicate call when it changes

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
                // OPTIMIZED: Only check popup if user is still actively using the app
                // Check if popup should be shown again (e.g., if user is still using the app past midnight)
                // Add a small delay to prevent immediate duplicate call
                setTimeout(() => {
                    checkEggletPopup();
                }, 1000); // 1 second delay
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
                <div className="profile-pic-container">
                    <button 
                        className="profile-pic-main"
                        onClick={() => setShowProfileView(true)}
                    >
                        <img 
                        src={shared.avatars[shared.userProfile ? shared.userProfile.pictureIndex : 0]?.src} 
                        alt="Profile" />
                    </button>
                    {/* Premium icon overlay */}
                    {shared.isPremiumMember && (
                        <div className="premium-icon-overlay">
                            <img src={premiumDiamond} alt="Premium" className="premium-icon" />
                        </div>
                    )}
                </div>
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
                    <button className="ticket-button" onClick={() => setShowFlippingStarsView(true)}>
                        <div className='ticket-button-image-container'>
                            <img
                                src={flipping_stars}
                                alt="Flipping Stars"
                                className="ticket-button-image"
                            />
                            <div className='ticket-button-container-border'></div>
                        </div>
                        <div className="ticket-total-flips">
                            <span className="ticket-total-flips-label">GLOBAL FLIPS</span>
                            <span className="ticket-total-flips-count">{totalFlips.toString().padStart(8, '0')}</span>
                        </div>
                        <div className="ticket-total-jackpot">
                            <span className="ticket-total-jackpot-label">GRAND JACKPOT</span>
                            <span className="ticket-total-jackpot-count">{jackpotValue.toString().padStart(8, '0')}</span>
                        </div>
                    </button>
                </section>

                {/* <section className="tickets-section">
                    <button className="ticket-button" onClick={() => onClickMarketplace()}>
                        <div className='ticket-button-image-container'>
                            <img
                                src={marketplace}
                                alt="My Tickets"
                                className="ticket-button-image"
                            />
                            <div className='ticket-button-container-border'></div>
                        </div>
                    </button>
                </section> */}
                
                

                <section className="tickets-section">
                    <button className="ticket-button" onClick={() => onClickOpenGame()}>
                        <div className='ticket-button-image-container'>
                            <img
                                src={tadokami}
                                alt="My Tickets"
                                className="ticket-button-image"
                            />
                            <div className='ticket-button-container-border'></div>
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
                            <div className="sold-out-overlay">COMPLETED</div>
                        )}
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
                            <div className='check-out-button'>BANK STEPS</div>
                            {/* <div className='locked-card-text'>STEPN</div> */}
                        </div>
                        {/* <img
                            src={locker}
                            alt="Locker"
                            className="locker-icon"
                        /> */}
                    </button>

                    {/* <button className="locked-card" onClick={() => setShowFlippingStarsView(true)}>
                        <div className='locked-card-image-container'>
                            <div className="flipping-stars-card-bg">
                                <div className="flipping-stars-title">FLIPPING STARS</div>
                                <div className="flipping-stars-subtitle">Flip coins & win rewards!</div>
                            </div>
                            <div className='ticket-button-container-border'></div>
                            <div className='check-out-button'>PLAY NOW</div>
                        </div>
                    </button> */}
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
                                <h3 className="event-card-title">MY TICKETS</h3>
                                <p className="event-card-subtitle">Scratch<br></br> Tickets and <br></br> Unlock <br></br>Rewards!</p>
                                <div className="check-out-button ticket">
                                    Scratch Tickets
                                </div>
                            {/* </div> */}
                        </div>
                    </button>
                </section>

                <section className="tickets-section">
                    <button 
                        className={`ticket-button premium-button ${isCheckingPremiumStatus ? 'disabled' : ''}`} 
                        onClick={() => onClickPremium()}
                        disabled={isCheckingPremiumStatus}
                    >
                        <div className='ticket-button-image-container'>
                            <img
                                src={premiumBg}
                                alt="Premium Background"
                                className="ticket-button-image"
                            />
                            <div className='ticket-button-container-border'></div>
                            
                            {/* Premium Text */}
                            <div className="premium-text">PREMIUM</div>
                        </div>
                        
                        {/* Premium Diamond */}
                        <div className="premium-diamond-container">
                            <img
                                src={premiumDiamond}
                                alt="Premium Diamond"
                                className="premium-diamond"
                            />
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
                                    {/* <h3 className="event-card-title">{event.name}</h3>
                                    <p className="event-card-subtitle">{event.description}</p> */}
                                    <div className="check-out-button">
                                        Check out
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
            
            {/* Premium Popup */}
            <Premium 
                isOpen={showPremium} 
                onClose={async () => {
                    setShowPremium(false);
                    // Refresh all data when closing premium to match Market → MainView behavior
                    await getProfileData();
                    await checkPremiumStatus();
                    await fetchTotalFlips();
                }}
            />
            
            {/* Introduce Premium Popup */}
            <IntroducePremium 
                isOpen={showIntroducePremium} 
                onClose={() => setShowIntroducePremium(false)}
                onSelectPlan={(plan) => {
                    console.log('Selected plan:', plan);
                    setShowIntroducePremium(false);
                    // Navigation will be handled by IntroducePremium component itself
                }}
                isFromProfile={false}
            />
        </>
    );
};

export default MainView;
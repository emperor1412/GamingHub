import React, { useEffect, useState, useRef } from 'react';
// import Frame4556 from './images/Frame4556.png';
import locker from './images/locker.png';
// import locker from './images/locker.svg';
import leaderboard from './images/leaderboard.svg';
// import leaderboard from './images/leaderboard.png';
import ticketIcon from './images/ticket.svg';
import km from './images/km.svg';
import calendar from './images/calendar.svg';
// import calendar_before_checkin from './images/calendar_before_checkin.svg';
import calendar_before_checkin from './images/calendar.svg';

import eventSnoopDogg from './images/snoop_dogg_raffle.svg';
// import eventSnoopDogg from './images/snoop_dogg_raffle.png';
import './MainView.css';
import my_ticket from './images/my_ticket.svg';
// import LFGO from './images/LFGO.svg';
import LFGO from './images/LFGO.png';
// import morchigame from './images/morchigame.png';
import morchigame from './images/morchigame.svg';
import checkout from './images/checkout.svg';

import { popup, openLink } from '@telegram-apps/sdk';

import shared from './Shared';

let isMouseDown = false;
let startX;
let startDragX;
let startDragTime;
let scrollLeft;

const MainView = ({ checkInData, setShowCheckInAnimation, checkIn, setShowCheckInView, setShowProfileView, setShowTicketView, getProfileData}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showTextCheckIn, setShowTextCheckIn] = useState(false);
    const [kmpoint, setKmpoint] = useState(0);
    const [ticket, setTicket] = useState(0);
    const [eventData, setEventData] = useState([]);
    const carouselRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const intervalRef = useRef(null);

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

    const setupProfileData = async () => {
        await getProfileData();
        const userKMPoint = shared.userProfile.UserToken.find(token => token.prop_id === 10020);
        if (userKMPoint) {
            setKmpoint(userKMPoint.num);
        }

        const userTicket = shared.userProfile.UserToken.find(token => token.prop_id === 10010);
        if (userTicket) {
            setTicket(userTicket.num);
        }
    };

    const setupEvents = async () => {
        const events = await getEvents();
        console.log('setupEvents:', events);
        setEventData(events);
    };

    useEffect(() => {
        setupProfileData();
        setupEvents();
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
            const timeDifference = now - lastTime;
            const interval = 60 * 1000 * 60 * 24;  // 24 hours
            const remaining = interval - timeDifference;

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
                        <img src={km} alt="Stat 1" />
                        <span className='stat-item-main-text'>{kmpoint}</span>
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

                    <button className="ticket-button" onClick={() => {
                            setShowTicketView(true);
                        }}>
                        <img
                            src={my_ticket}
                            alt="My Tickets"
                            className="ticket-button-image"
                        />
                        <div className="ticket-button-content">
                            <h3 className="event-card-title">MY TICKETS</h3>
                            <p className="event-card-subtitle">Scratch tickets to get <br></br>rewards</p>
                            <div className="check-out-button">
                                Scratch Tickets
                            </div>
                        </div>
                    </button>
                </section>

                <section className="locked-sections">
                    <button className="locked-card">
                        <img
                            // src={`${process.env.PUBLIC_URL}/images/Frame4561.png`}
                            // src={Frame4561}
                            src={morchigame}
                            alt="Morchi Game Coming Soon"
                            className="locked-card-image"
                        />
                        <img
                            src={locker}
                            alt="Locker"
                            className="locker-icon"
                        />
                    </button>

                    <button className="locked-card">
                        <img
                            // src={`${process.env.PUBLIC_URL}/images/Frame4561.png`}
                            src={leaderboard}
                            alt="Leaderboard Coming Soon"
                            className="locked-card-image"
                        />
                        <img
                            src={locker}
                            alt="Locker"
                            className="locker-icon"
                        />
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
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleMouseUp}
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
        </>
    );
};

export default MainView;
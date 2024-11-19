import React, { useEffect, useState, useRef } from 'react';
// import Frame4556 from './images/Frame4556.png';
import locker from './images/locker.png';
// import locker from './images/locker.svg';
import leaderboard from './images/leaderboard.svg';
// import leaderboard from './images/leaderboard.png';
import ticket from './images/ticket.svg';
import km from './images/km.svg';
import calendar from './images/calendar.svg';
import calendar_before_checkin from './images/calendar_before_checkin.svg';
// import avatar from './images/avatar.svg';
import avatar from './images/avatar.png';
import eventSnoopDogg from './images/snoop_dogg_raffle.svg';
// import eventSnoopDogg from './images/snoop_dogg_raffle.png';
import './MainView.css';
import my_ticket from './images/my_ticket.svg';
// import LFGO from './images/LFGO.svg';
import LFGO from './images/LFGO.png';
// import morchigame from './images/morchigame.png';
import morchigame from './images/morchigame.svg';

import { popup } from '@telegram-apps/sdk';

const MainView = ({ user, loginData, checkInData, setShowCheckInAnimation, checkIn, setShowCheckInView}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showTextCheckIn, setShowTextCheckIn] = useState(false);
    const carouselRef = useRef(null);

    const onClickCheckIn = async () => {
        console.log('onClickCheckIn');
        const success = await checkIn(loginData);
        if(success) {
            setShowCheckInAnimation(true);
        }
        else {
            setShowCheckInAnimation(false);
            setShowCheckInView(true);
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (carouselRef.current) {
                const slides = carouselRef.current.children;
                const visibleSlideIndex = Array.from(slides).findIndex(slide => {
                    const rect = slide.getBoundingClientRect();
                    return rect.left >= 0 && rect.right <= window.innerWidth;
                });

                if (visibleSlideIndex < slides.length - 1) {
                    
                    setCurrentSlide(visibleSlideIndex);
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

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        console.log('MainView useEffect, checkInData: ' + checkInData);
        let myTimeout;
        try {
            let lastTime = new Date(checkInData.lastTime);
            
            const now = new Date();
            const timeDifference = now - lastTime;
            const twoMinutes = 2 * 60 * 1000;
            const remaining = twoMinutes - timeDifference;

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

    return (
        <>
            <header className="stats-header">
                <div className="profile-pic">
                    <img src={avatar} alt="Profile" />
                </div>
                <div className="stats">
                    <div className="stat-item">
                        <img src={ticket} alt="Stat 1" />
                        <span>3</span>
                    </div>
                    <div className="stat-item">
                        <img src={km} alt="Stat 1" />
                        <span>24.4</span>
                    </div>
                    <div className="stat-item">
                        <button className="stat-button" onClick={() => onClickCheckIn()}>
                            <img src={showTextCheckIn ? calendar_before_checkin : calendar} alt="Stat 1" />
                            <div className="check-in-text">
                                {showTextCheckIn ? (
                                    <>
                                        <span>CHECK-IN</span>
                                        <span>TODAY</span>
                                    </>
                                ) : (
                                    <span style={{ fontSize: '16px' }}>{checkInData != null ? checkInData.streakDay : "0"}</span>
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            <div className="scrollable-content">
                <section className="tickets-section">
                    {/* <button className="ticket-card" onClick={() => checkIn()}> */}
                    <button className="ticket-card">
                        <img
                            // src={Frame4556}
                            src = {my_ticket}
                            alt="My Tickets"
                            className="ticket-card-image"
                        />
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
                    <div className="events-carousel" ref={carouselRef}>
                        <button className="event-card">
                            <img
                                src={eventSnoopDogg}
                                alt="Events"
                                className="event-card-image"
                            />
                        </button>
                        <button className="event-card">
                            <img
                                src={eventSnoopDogg}
                                alt="Events"
                                className="event-card-image"
                            />
                        </button>
                        <button className="event-card">
                            <img
                                src={eventSnoopDogg}
                                alt="Events"
                                className="event-card-image"
                            />
                        </button>
                        <button className="event-card">
                            <img
                                src={eventSnoopDogg}
                                alt="Events"
                                className="event-card-image"
                            />
                        </button>
                        <button className="event-card">
                            <img
                                src={eventSnoopDogg}
                                alt="Events"
                                className="event-card-image"
                            />
                        </button>
                    </div>
                </section>
            </div>
        </>
    );
};

export default MainView;
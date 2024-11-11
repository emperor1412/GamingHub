import React, { useEffect, useState, useRef } from 'react';
import Frame4556 from './images/Frame4556.png';
import Frame4561 from './images/Frame4561.png';
import locker from './images/locker.png';
import leaderboard from './images/leaderboard.svg';
import ticket from './images/ticket.svg';
import km from './images/km.svg';
import calendar from './images/calendar.svg';
import avatar from './images/avatar.svg';
import eventSnoopDogg from './images/snoop_dogg_raffle.svg';
import './MainView.css';
import my_ticket from './images/my_ticket.svg';
import LFGO from './images/LFGO.svg';

const MainView = ({ iser }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const carouselRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (carouselRef.current) {
                const slides = carouselRef.current.children;
                if (currentSlide < slides.length - 1) {
                    setCurrentSlide(currentSlide + 1);
                    slides[currentSlide + 1].scrollIntoView({
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
    }, [currentSlide]);

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
                        <img src={calendar} alt="Stat 1" />
                        <span>75</span>
                    </div>
                </div>
            </header>

            <div className="scrollable-content">
                <section className="tickets-section">
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
                            src={LFGO}
                            alt="LFGO Coming Soon"
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
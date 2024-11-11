import React, { useEffect, useState } from 'react';
import Frame4556 from './images/Frame4556.png';
import Frame4561 from './images/Frame4561.png';
import locker from './images/locker.png';
import leaderboard from './images/leaderboard.png';

const MainView = ({ iser }) => {
    return (
        <>
            <header className="stats-header">
                <div className="profile-pic">
                    <img src="/profile-placeholder.png" alt="Profile" />
                </div>
                <div className="stats">
                    <div className="stat-item">
                        <span>3</span>
                        <img src="/stat-icon-1.svg" alt="Stat 1" />
                    </div>
                    <div className="stat-item">
                        <span>24.4</span>
                        <img src="/stat-icon-2.svg" alt="Stat 2" />
                    </div>
                    <div className="stat-item">
                        <span>75</span>
                        <img src="/stat-icon-3.svg" alt="Stat 3" />
                    </div>
                </div>
            </header>

            <div className="scrollable-content">
                <section className="tickets-section">
                    <button className="ticket-card">
                        <img
                            src={Frame4556}
                            alt="My Tickets"
                            className="ticket-card-image"
                        />
                    </button>
                </section>

                <section className="locked-sections">
                    <button className="locked-card">
                        <img
                            // src={`${process.env.PUBLIC_URL}/images/Frame4561.png`}
                            src={Frame4561}
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

                <section className="raffle-section">
                    <div className="raffle-card">
                        <h2>SNOOP DOGG RAFFLE <span className="new-tag">NEW!</span></h2>
                        <p>BLENDING WITH YOUR SHOES FOR BETTER RESULTS</p>
                        <button className="purple-button">Check out</button>
                    </div>
                </section>
            </div>
        </>
    );
};

export default MainView;
import React, { useState } from 'react';
import './CheckIn.css';
import ticket from './images/ticket.svg';
// import km from './images/km.svg';
import starlet from './images/starlet.png';
import checkmark from './images/checkmark.svg';

import shared from './Shared';
import { trackUserAction, trackLineConversion } from './analytics';

const CheckIn = ({ checkInData, onClose, setShowCheckInAnimation }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /*
    checkInData =
    {
        "isCheckIn": true,
        "lastTime": 1731653914000,
        "checkInDay": 1,
        "beginningTime": 1731653914000,
        "streakDay": 1,
        "checkInDays": [
            1731653914000
        ],
        "dayRewards": [
            {
                "day": 1,
                "starlets": 50,
                "ticket": 1
            },
            {
                "day": 2,
                "starlets": 50,
                "ticket": 1
            },
            {
                "day": 3,
                "starlets": 50,
                "ticket": 1
            },
            {
                "day": 4,
                "starlets": 50,
                "ticket": 1
            },
            {
                "day": 5,
                "starlets": 50,
                "ticket": 1
            },
            {
                "day": 6,
                "starlets": 50,
                "ticket": 1
            },
            {
                "day": 7,
                "starlets": 50,
                "ticket": 2
            }
        ],
        "calls": 88
    }
        */

    let days = [];
    try {
        const daySuffixes = ['ST', 'ND', 'RD', 'TH', 'TH', 'TH', 'TH'];
        days = checkInData.dayRewards.map((reward, index) => {
            const isActive = index + 1 <= checkInData.checkInDay;
            return {
                day: reward.day,
                label: daySuffixes[index],
                status: isActive ? 'active' : 'inactive',
                starlets: reward.kmPoint,
                ticket: reward.ticket
            };
        });
    }
    catch (error) {
        console.error(error);
        days = [
            {
                day: 1,
                label: 'ST',
                status: 'inactive',
                starlets: 50,
                ticket: 1
            },
            {
                day: 2,
                label: 'ND',
                status: 'inactive',
                starlets: 50,
                ticket: 1
            },
            {
                day: 3,
                label: 'RD',
                status: 'inactive',
                starlets: 50,
                ticket: 1
            },
            {
                day: 4,
                label: 'TH',
                status: 'inactive',
                starlets: 50,
                ticket: 1
            },
            {
                day: 5,
                label: 'TH',
                status: 'inactive',
                starlets: 50,
                ticket: 1
            },
            {
                day: 6,
                label: 'TH',
                status: 'inactive',
                starlets: 50,
                ticket: 1
            },
            {
                day: 7,
                label: 'TH',
                status: 'inactive',
                starlets: 50,
                ticket: 2
            }
        ]
    }

    const handleCheckIn = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${shared.server_url}/api/app/checkIn?token=${shared.loginData.token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (data.code === 0) {
                // Track successful check-in
                trackUserAction('check_in_success', {
                    check_in_date: new Date().toISOString(),
                    rewards: data.rewards
                }, shared.loginData?.userId);

                // Track LINE conversion for check-in
                trackLineConversion('Check_In');

                setShowCheckInAnimation(true);
                setTimeout(() => {
                    setShowCheckInAnimation(false);
                    onClose();
                }, 3000);
            } else {
                setError(data.message || 'Check-in failed');
            }
        } catch (error) {
            console.error('Check-in error:', error);
            setError('Failed to check in. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkin-container">
            <div className="checkin-header">
                <div className="avatar-container">
                    <img src={shared.avatars[shared.userProfile ? shared.userProfile.pictureIndex : 0]?.src} 

                    alt="User avatar" className="avatar" />
                </div>
                <div className="content-container">
                    <div className="streak-info">
                        <p className="streak-text">LOG IN STREAK</p>
                        <h1 className="streak-days">{checkInData.streakDay} <span className="days-text">{checkInData.streakDay === 1 ? 'DAY' : 'DAYS'}</span></h1>
                    </div>
                </div>
            </div>

            <div className="days-grid">
                {days.map((day, index) => {
                    const isActive = index + 1 <= checkInData.checkInDay;
                    const isLastActive = index + 1 === checkInData.checkInDay;
                    return (
                        <div key={index} className={`day-card ${day.status} ${isLastActive ? 'last-active' : ''}`}>
                            {day.status === 'active' && (
                                <img src={checkmark} alt="Completed" className="checkmark-icon" />
                            )}
                            <div className="day-number">
                                <div className="number-group">
                                    <span className="number">{day.day}</span>
                                    <span className="suffix">{day.label}</span>
                                </div>
                                <span className="label">DAY</span>
                            </div>
                            <div className="rewards">
                                <div className="reward">
                                    <img src={ticket} alt="Ticket" />
                                    <span className='reward-text-checkin'>{day.ticket}</span>
                                </div>
                                <div className="reward">
                                    <img src={starlet} alt="Starlets" />
                                    <span className='reward-text-checkin'>{day.starlets}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <button className="okay-button-checkin" onClick={onClose}>
                Okay
            </button>
        </div>
    );
};

export default CheckIn;

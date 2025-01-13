import React from 'react';
import './CheckIn.css';
import ticket from './images/ticket.svg';
// import km from './images/km.svg';
import km from './images/starlet.png';
import checkmark from './images/checkmark.svg';

import shared from './Shared';

const CheckIn = ({ checkInData, onClose }) => {

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
                "kmPoint": 50,
                "ticket": 1
            },
            {
                "day": 2,
                "kmPoint": 50,
                "ticket": 1
            },
            {
                "day": 3,
                "kmPoint": 50,
                "ticket": 1
            },
            {
                "day": 4,
                "kmPoint": 50,
                "ticket": 1
            },
            {
                "day": 5,
                "kmPoint": 50,
                "ticket": 1
            },
            {
                "day": 6,
                "kmPoint": 50,
                "ticket": 1
            },
            {
                "day": 7,
                "kmPoint": 50,
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
                kmPoint: reward.kmPoint,
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
                kmPoint: 50,
                ticket: 1
            },
            {
                day: 2,
                label: 'ND',
                status: 'inactive',
                kmPoint: 50,
                ticket: 1
            },
            {
                day: 3,
                label: 'RD',
                status: 'inactive',
                kmPoint: 50,
                ticket: 1
            },
            {
                day: 4,
                label: 'TH',
                status: 'inactive',
                kmPoint: 50,
                ticket: 1
            },
            {
                day: 5,
                label: 'TH',
                status: 'inactive',
                kmPoint: 50,
                ticket: 1
            },
            {
                day: 6,
                label: 'TH',
                status: 'inactive',
                kmPoint: 50,
                ticket: 1
            },
            {
                day: 7,
                label: 'TH',
                status: 'inactive',
                kmPoint: 50,
                ticket: 2
            }
        ]
    }


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
                                    <img src={km} alt="Distance" />
                                    <span className='reward-text-checkin'>{day.kmPoint}</span>
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

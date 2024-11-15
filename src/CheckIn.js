import React from 'react';
import './CheckIn.css';
import ticket from './images/ticket.svg';
import km from './images/km.svg';
import avatar from './images/avatar_big.svg';
import checkmark from './images/checkmark.svg';

const CheckIn = ({ onClose }) => {
  const days = [
    { day: 1, label: 'ST', status: 'active' },
    { day: 2, label: 'ND', status: 'active' },
    { day: 3, label: 'RD', status: 'active' },
    { day: 4, label: 'TH', status: 'inactive' },
    { day: 5, label: 'TH', status: 'inactive' },
    { day: 6, label: 'TH', status: 'inactive' },
    { day: 7, label: 'TH', status: 'active' }
  ];

  return (
    <div className="checkin-container">
      <div className="checkin-header">
        <div className="avatar-container">
          <img src={avatar} alt="User avatar" className="avatar" />
        </div>
        <div className="content-container">
          <div className="streak-info">
            <p className="streak-text">CHECKED IN CONTINUOUSLY</p>
            <h1 className="streak-days">3 DAYS</h1>
          </div>
        </div>
      </div>

      <div className="days-grid">
        {days.map((day, index) => (
          <div key={index} className={`day-card ${day.status}`}>
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
                <span>1</span>
              </div>
              <div className="reward">
                <img src={km} alt="Distance" />
                <span>4</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="okay-button" onClick={onClose}>
        Okay
      </button>
    </div>
  );
};

export default CheckIn;

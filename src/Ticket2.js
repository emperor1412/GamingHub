import React from 'react';
import ticketIcon from './images/ticket.svg';
import './Ticket2.css';

const Ticket2 = ({ ticketCount }) => {
    return (
        <div className="ticket-container">
            <img src={ticketIcon} alt="Ticket Icon" className="ticket-icon" />
            <span className="ticket-count">{ticketCount}</span>
        </div>
    );
};

export default Ticket2;

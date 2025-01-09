import React, { useEffect, useState, useRef } from 'react';
import ticketIcon from './images/ticket.svg';
import kmIcon from './images/km.svg';
import scratch_ticket_svg from './images/ticket_scratch_icon.svg';
import scratch_ticket from './images/ticket_scratch_icon.png';
import ticket_scratched from './images/ticket_scratched.svg';
import './Ticket1.css';
import locker from './images/locker.png';
import Ticket2 from './Ticket2';
import back from './images/back.svg';
import lock_icon from "./images/ticket_lock_icon.svg";
import shared from './Shared';
import { popup } from '@telegram-apps/sdk';

const Ticket1 = ({ kmPointData, getProfileData, onClose }) => {
    const [rowCount, setRowCount] = useState(0);
    const [needsPadding, setNeedsPadding] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showTicket2, setShowTicket2] = useState(false);
    const [ticket, setTicket] = useState(0);
    const [kmPoint, setKmPoint] = useState(0);
    const [slotNum, setSlotNum] = useState(0);
    const [slotUseNum, setSlotUseNum] = useState(0);

    const setupProfileData = async () => {
        console.log('Ticket 1 setupProfileData');
        await getProfileData();

        if (!shared.userProfile || !shared.userProfile.UserToken) {
            return;
        }
        const userTicket = shared.userProfile.UserToken.find(token => token.prop_id === 10010);
        const userKmPoint = shared.userProfile.UserToken.find(token => token.prop_id === 10020);
        if (userTicket) {
            setKmPoint(userKmPoint.num);
            setTicket(userTicket.num);
            // setTicket(1);
            
        }
    };

/*
url: /app/ticketSlot
Request:
Response:
{
    "code": 0,
    "data": {
        "slotNum": 15,
        "slotUseNum": 1,
        "levelUpNum": 18,
        "time": 1735344000000
    }
}
*/

    const getTicketSlotData = async (depth = 0) => {
        const maxRetries = 3;
        const retryDelay = 1000; // 1 second delay between retries

        try {
            const response = await fetch(`${shared.server_url}/api/app/ticketSlot?token=${shared.loginData.token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.code === 0) {
                console.log('Ticket slot data:', data.data);
                return data.data;
            } else if (data.code === 102001 || data.code === 102002) {
                console.log('Token expired, attempting to re-login');
                const loginResult = await shared.login(shared.initData);
                if (loginResult.success) {
                    console.log('Re-login successful, retrying ticket slot fetch');
                    return getTicketSlotData(depth + 1);
                } else {
                    if (popup.open.isAvailable()) {
                        const promise = popup.open({
                            title: 'Error',
                            message: `Re-login failed: ${loginResult.error}`,
                            buttons: [{ id: 'my-id', type: 'default', text: 'OK' }],
                        });
                        await promise;
                    }
                    return null;
                }
            } else {
                if (popup.open.isAvailable()) {
                    const promise = popup.open({
                        title: 'Error',
                        message: `Server returned error code: ${data.code}`,
                        buttons: [{ id: 'my-id', type: 'default', text: 'OK' }],
                    });
                    await promise;
                }
                return null;
            }
        } catch (error) {
            console.error(`Attempt ${depth + 1} failed:`, error);
            
            if (depth < maxRetries) {
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                // Retry with incremented depth
                return getTicketSlotData(depth + 1);
            }
            
            // If all retries failed, show popup
            if (popup.open.isAvailable()) {
                const promise = popup.open({
                    title: 'Error Getting Ticket Slot Data',
                    message: `Failed after ${maxRetries} attempts: ${error.message}`,
                    buttons: [{ id: 'my-id', type: 'default', text: 'OK' }],
                });
                await promise;
            }
            return null;
        }
    };

    const setUp = async () => {
        const ticketSlotData = await getTicketSlotData();
        if (ticketSlotData) {
            setSlotNum(ticketSlotData.slotNum);
            setSlotUseNum(ticketSlotData.slotUseNum);
            // setTicket( Math.min(ticketSlotData.slotNum - ticketSlotData.slotUseNum, shared.getTicket()));
            setTicket(shared.getTicket());
            setKmPoint(kmPointData);

            
            let row = Math.ceil(ticketSlotData.levelUpNum / 3);
            if (row < 3) {
                row = 3;
            }
            setRowCount(row);
            setNeedsPadding(row < 4);
        }
        else {
            setTicket(0);
        }
    };

    useEffect(() => {
        console.log('Ticket 1 useEffect');
        setUp();
    }, []);

    const renderTicketRow = (startIndex) => (
        <div className="scratch-grid-row" key={startIndex}>
            {[0, 1, 2].map(offset => {
                const index = startIndex + offset;
                const isUnlocked = index < slotNum;
                const isScratched = index >= ticket;

                return isUnlocked ? (
                    isScratched ? (
                        <div key={index} className="scratch-item unlocked">
                            <div className='scratch-item-border'>   </div>
                            <img src={ticket_scratched} alt="Lock" className='scratch-item-ticket-icon'/>
                        </div>  
                    ) : (
                        <button 
                            key={index} 
                            className="scratch-item unlocked"
                            onClick={() => {
                                console.log('Scratch ticket', index);
                                setShowOverlay(true);
                            }}
                        >
                            <div className='scratch-item-border'>   </div>
                            <img src={scratch_ticket} alt="Scratch Ticket" className='scratch-item-ticket-icon' />
                        </button>
                    )
                ) : (
                    <div key={index} className="scratch-item locked">
                        <div className='scratch-item-border'>   
                            <img src={locker} alt="Lock" className='scratch-item-locked-icon'/>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <>
            {showTicket2 ? (
                <Ticket2 onClose={() => {
                    setShowTicket2(false);
                    setShowOverlay(false);
                    setupProfileData();
                    setUp();
                    // onClose();
                }} />
            ) : (
                <>
                    <div className="ticket1-container">
                        <header className="ticket-header">
                            <button className="back-button back-button-alignment" onClick={onClose}>
                                <img src={back} alt="Back" />
                            </button>
                            <div className="header-stats">
                                <div className="stat-item-main">
                                    <img src={ticketIcon} alt="Tickets" />
                                    <span className='stat-item-main-text'>{ticket}</span>
                                </div>
                                <div className="stat-item-main">
                                    <img src={kmIcon} alt="KMPoints" />
                                    <span className='stat-item-main-text'>{kmPoint}</span>
                                </div>
                            </div>
                        </header>

                        <div className="scratch-content">
                            <div className="scratch-grid-container">
                                <div className="scratch-header">
                                    SCRATCH
                                </div>
                                <div className="scratch-grid" style={needsPadding ? { paddingBottom: '16vh' } : {}}>
                                    {[...Array(rowCount)].map((_, i) => renderTicketRow(i * 3))}
                                </div>
                            </div>

                            <div className="info-box-ticket">
                                EARN EXTRA TICKETS BY INVITING FRENS OR BY COMPLETING DAILY TASKS. THE MORE YOU ENGAGE, THE MORE REWARDS YOU'LL UNLOCK.
                            </div>
                        </div>
                    </div>

                    {showOverlay && (
                        <div className="overlay-ticket1" onClick={() => setShowOverlay(false)}>
                            <div className="overlay-content-ticket1" onClick={e => e.stopPropagation()}>
                                {/* <div className="overlay-text-ticket1">
                                    TEST YOUR KNOWLEDGE OF POPULAR CRYPTO SLANG TERMS! SELECT THE CORRECT MEANING FOR EACH TERM BELOW.
                                </div> */}
                                
                                <img src={scratch_ticket_svg} alt="Scratch Ticket" className="overlay-ticket1-img" />
                                <div className="overlay-buttons-ticket1">
                                    <button className="overlay-button-ticket1 primary" onClick={() => setShowTicket2(true)}>
                                        SCRATCH 1 TICKET
                                    </button>
                                    <button className="overlay-button-ticket1 secondary" disabled='true'>
                                        SCRATCH ALL TICKETS
                                        <img src={lock_icon} alt="Locked" className="overlay-button-ticket1-lock" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default Ticket1;

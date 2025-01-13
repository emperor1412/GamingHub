import React, { useEffect, useState } from 'react';
import "./Tasks.css";
import xIcon from './images/x-icon.svg';
import shared from './Shared';
import ticketIcon from './images/ticket.svg';
// import km from './images/km.svg';
import km from './images/starlet.png';
import calendar from './images/calendar.svg';
// import calendar_before_checkin from './images/calendar_before_checkin.svg';
import calendar_before_checkin from './images/calendar.svg';
import TasksLearn from './TasksLearn';
import { openLink } from '@telegram-apps/sdk';
import done_icon from './images/done_icon.svg';
import arrow_2 from './images/arrow_2.svg';
/*
url: /app/taskList
Request:
	
Response:
	type: 1.click url 2.learn
	weight Can be used to sort
	endTime Expiration time
	state 0.Unfinished 1.Finish
{
    "code": 0,
    "data": [
        {
            "id": 280772,
            "name": "task2",
            "url": "https://x.com/realDonaldTrump/status/1853995861497307624",
            "img": "http://dummyimage.com/400x400",
            "type": 1,
            "category": 0,
            "weight": 1,
            "endTime": 1831661420158,
            "rewardList": [
                {
                    "type": 10030,
                    "amount": 5
                }
            ],
            "state": 1
        },
        {
            "id": 59581,
            "name": "task3",
            "url": "https://x.com/realDonaldTrump/status/1853995861497307624",
            "img": "http://dummyimage.com/400x400",
            "type": 1,
            "category": 0,
            "weight": 1,
            "endTime": 1831661420158,
            "rewardList": [
                {
                    "type": 10030,
                    "amount": 7
                }
            ],
            "state": 0
        },
        {
            "id": 59582,
            "name": "task4",
            "url": "https://x.com/realDonaldTrump/status/1853995861497307624",
            "img": "http://dummyimage.com/400x400",
            "type": 1,
            "category": 0,
            "weight": 1,
            "endTime": 1831661420158,
            "rewardList": [
                {
                    "type": 10030,
                    "amount": 9
                }
            ],
            "state": 0
        },
        {
            "id": 61601,
            "name": "Introduction to DOOAR",
            "img": "http://dummyimage.com/400x400",
            "type": 2,
            "category": 1,
            "weight": 0,
            "endTime": 1831661420158,
            "rewardList": [
                {
                    "type": 10030,
                    "amount": 20
                }
            ],
            "state": 1
        },
        {
            "id": 280771,
            "name": "task1",
            "url": "https://x.com/realDonaldTrump/status/1853995861497307624",
            "img": "http://dummyimage.com/400x400",
            "type": 1,
            "category": 0,
            "weight": 0,
            "endTime": 1831661420158,
            "rewardList": [
                {
                    "type": 10030,
                    "amount": 5
                }
            ],
            "state": 0
        },
        {
            "id": 64631,
            "name": "FSL ID",
            "img": "http://dummyimage.com/400x400",
            "type": 2,
            "category": 1,
            "weight": 0,
            "endTime": 1831661420158,
            "rewardList": [
                {
                    "type": 10030,
                    "amount": 20
                }
            ],
            "state": 0
        },
        {
            "id": 66651,
            "name": "GMT",
            "img": "http://dummyimage.com/400x400",
            "type": 2,
            "category": 1,
            "weight": 0,
            "endTime": 1831661420158,
            "rewardList": [
                {
                    "type": 10030,
                    "amount": 20
                }
            ],
            "state": 1
        },
        {
            "id": 68671,
            "name": "STEPN GO ",
            "img": "http://dummyimage.com/400x400",
            "type": 2,
            "category": 1,
            "weight": 0,
            "endTime": 1831661420158,
            "rewardList": [
                {
                    "type": 10030,
                    "amount": 20
                }
            ],
            "state": 1
        },
        {
            "id": 284811,
            "name": "FSL Points",
            "img": "http://dummyimage.com/400x400",
            "type": 2,
            "category": 1,
            "weight": 0,
            "endTime": 1831661420158,
            "rewardList": [
                {
                    "type": 10030,
                    "amount": 10
                }
            ],
            "state": 1
        }
    ]
}

url: /app/taskData
Request:
	id long taskId
Response:
	type: 1.click url 2.learn
	weight Can be used to sort
	endTime Expiration time
	state 0.Unfinished 1.Finish
{
    "code": 0,
    "data": {
        "id": 61601,
        "name": "Introduction to DOOAR",
        "img": "http://dummyimage.com/400x400",
        "type": 2,
        "category": 1,
        "state": 0,
        "weight": 0,
        "endTime": 1831661420158,
        "rewardList": [
            {
                "type": 10030,
                "amount": 20
            }
        ],
        "contentList": [
            {
                "taskId": 61601,
                "pos": 0,
                "title": "Introduction to DOOAR",
                "content": "DOOAR is a decentralized exchange (DEX) launched by FSL that allows users to trade digital assets like tokens directly with each other.\nIt uses smart contracts on the Solana, Ethereum, and Binance blockchains to facilitate secure and transparent transactions.\nAs part of the FSL ecosystem, DOOAR empowers users to manage their assets without intermediaries."
            },
            {
                "taskId": 61601,
                "pos": 1,
                "title": "How DOOAR Works",
                "content": "DOOAR operates through liquidity pools, where users can provide liquidity in exchange for a share of the transaction fees.\nUsers can swap tokens directly using smart contracts, ensuring transparency and eliminating the need for a middleman.\nThe DEX is cross-chain compatible, allowing trades across Solana, Ethereum, and Binance blockchains for increased flexibility."
            },
            {
                "taskId": 61601,
                "pos": 2,
                "title": "Benefits of DOOAR",
                "content": "User Control: All transactions are user-controlled, with no central authority overseeing trades.\nTransparency: Every trade occurs through smart contracts, which are visible on the blockchain for full transparency.\n"
            }
        ],
        "question": {
            "heading": "Test your knowledge of popular crypto slang terms! Select the correct meaning for each term below.",
            "question": "What can users do on DOOAR",
            "answers": [
                "Stake tokens.",
                "Swap tokens and provide liquidity.",
                "Buy NFTs."
            ],
            "answerIndex": 1
        }
    }
}

url: /app/taskComplete
Request:
	id long taskId
	answerIndex int //learn task Need to be transmitted
Response:
{
    "code": 0,
    "data": true //learn task：Is the answer correct
}

    */


const Tasks = ({ 
    checkInData, 
    setShowCheckInAnimation, 
    checkIn, 
    setShowCheckInView, 
    setShowProfileView, 
    getProfileData 
}) => {
    const [showTextCheckIn, setShowTextCheckIn] = useState(false);
    const [kmpoint, setKmpoint] = useState(0);
    const [ticket, setTicket] = useState(0);
    const [tasksTimeLimited, setTasksTimelimited] = useState([]);
    const [tasksStandard, setTasksStandard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLearnTask, setShowLearnTask] = useState(null);
    const [timeLimitedExpanded, setTimeLimitedExpanded] = useState(true);
    const [standardTasksExpanded, setStandardTasksExpanded] = useState(true);

    const setupProfileData = async () => {
        const userKMPoint = shared.userProfile.UserToken.find(token => token.prop_id === 10020);
        if (userKMPoint) {
            setKmpoint(userKMPoint.num);
        }

        const userTicket = shared.userProfile.UserToken.find(token => token.prop_id === 10010);
        if (userTicket) {
            setTicket(userTicket.num);
        }
    };

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

    const fetchTaskList = async (depth = 0) => {
        try {
            const response = await fetch(`${shared.server_url}/api/app/taskList?token=${shared.loginData.token}`);
            if (response.ok) {
                const data = await response.json();
                console.log('Tasks List:', data);

                if (data.code === 0) {
                    const sortedTasks = data.data.sort((a, b) => b.weight - a.weight);
                    setTasksTimelimited(sortedTasks.filter(task => task.category === 0));
                    setTasksStandard(sortedTasks.filter(task => task.category === 1));
                }
                else if (data.code === 102001 || data.code === 102002) {
                    console.log('Get Task list error:', data)
                    const result = await shared.login(shared.initData);
                    if (result.success) {
                        fetchTaskList(depth + 1);
                    }
                    else {
                        console.error('Error fetching tasks:', result.error);
                    }
                }
                else {
                    console.log('Get Task list error:', data)
                }
            }
            else {
                console.error('Error fetching tasks:', response);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const completeTask = async (taskId, answerIndex, depth = 0) => { 
        if (depth > 3) {
            console.error('Complete task api failed after 3 attempts');
            return;
        }

        console.log(`Will call Complete task:${taskId} - answerIndex: ${answerIndex}`);

        let retVal;
        try {
            const response = await fetch(`${shared.server_url}/api/app/taskComplete?token=${shared.loginData.token}&id=${taskId}&answerIndex=${answerIndex}`, {
                method: 'GET',
                // body: JSON.stringify({ id: taskId })
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Task complete:', data);
                if (data.code === 0) {
                    retVal = data.data.rewardList;
                    fetchTaskList();
                }
                else if (data.code === 102001 || data.code === 102002) {
                    console.log('Complete Task error:', data)
                    const result = await shared.login(shared.initData);
                    if (result.success) {
                        completeTask(taskId, depth + 1);
                    }
                    else {
                        console.error('Error completing task:', result.error);
                    }
                }
                else {
                    console.log('Complete Task error:', data)
                }
            }
            else {
                console.error('Error completing task:', response);
            }
        } catch (error) {
            console.error('Error completing task:', error);
        }

        return retVal;
    }

    const fetchTaskDataAndShow = async (task, depth = 0) => {
        console.log('fetchTaskDataAndShow:', task);
        const response = await fetch(`${shared.server_url}/api/app/taskData?token=${shared.loginData.token}&id=${task.id}`, {
            method: 'GET',
            // body: JSON.stringify({ id: task.id })
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(response.ok) {
            try {
                const data = await response.json();
                console.log('Task data:', data);
                if (data.code === 0) {
                    setShowLearnTask(data.data);
                }
                else if (data.code === 102001 || data.code === 102002) {
                    console.log('Get Task data error:', data)
                    const result = await shared.login(shared.initData);
                    if (result.success) {
                        fetchTaskDataAndShow(task, depth + 1);
                    }
                    else {
                        console.error('Error fetching task data:', result.error);
                    }
                }
                else {
                    console.log('Get Task data error:', data)
                }
            } catch (error) {
                console.error('Error fetching task data:', error);
            }
        }
        else {
            console.error('Error fetching task data:', response);
        }
    };

    const handleStartTask = async (task) => {
        if (task.type === 1) {
            

            if (openLink.isAvailable()) {
                openLink(task.url, {
                    tryBrowser: 'chrome',
                    tryInstantView: true,
                });
            }
            else {
                window.open(task.url, '_blank');
            }

            completeTask(task.id, 0);

        } else if (task.type === 2) {
            fetchTaskDataAndShow(task);
        }
    };

    const renderTaskCard = (task) => {
        const isDone = task.state === 1;
        const isTimeLimited = task.category === 0;
        const formattedDate = new Date(task.endTime).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });

        return (
            <div className={`task-card ${isDone ? 'done': ''}`} key={task.id}>
                <img src={task.img} alt="task icon" className="platform-icon" />
                <div className="task-content">
                    <h3 className={`task-title ${isDone ? 'done' : ''}`}>{task.name}</h3>
                    <div className="task-bottom-left">
                        <div className="task-reward">
                            <img src={shared.mappingIcon[task.rewardList[0].type]} alt="KM" className={`reward-icon ${isDone ? 'done' : ''}`} />
                            <span className="reward-amount-task">{task.rewardList[0]?.amount || 0}</span>
                        </div>
                        {isTimeLimited && (<div className={`task-deadline ${isDone ? 'done': ''}`}>ENDS {formattedDate}</div>)} 
                    </div>
                </div>

                {!isDone ? (
                    <button className={`start-button`}
                            onClick={() => handleStartTask(task)}>
                        START
                    </button>
                ) : (
                    <button className="done-button">
                        <img src={done_icon} alt="Done" />
                        DONE
                    </button>
                )}
                
            </div>
        );
    };

    useEffect(() => {
        setupProfileData();
        fetchTaskList();
    }, []);

    return (
        <>
        <header className="stats-header">
                <button 
                    className="profile-pic"
                    onClick={() => setShowProfileView(true)}
                >
                    <img 
                        src={shared.avatars[shared.userProfile ? shared.userProfile.pictureIndex : 0]?.src} 
                        alt="Profile" 
                    />
                </button>
                <div className="stats">
                    <button 
                        className="stat-item"
                        onClick={() => setShowProfileView(true)}
                    >
                        <img src={ticketIcon} alt="Tickets" />
                        <span className="stat-item-text">{ticket}</span>
                    </button>
                    <button 
                        className="stat-item"
                        onClick={() => setShowProfileView(true)}
                    >
                        <img src={km} alt="KM" />
                        <span className="stat-item-text">{kmpoint}</span>
                    </button>
                    <div className="stat-item">
                        <button className="stat-button" onClick={() => onClickCheckIn()}>
                            <img src={showTextCheckIn ? calendar_before_checkin : calendar} alt="Check-in" />
                            <div className="check-in-text">
                                {showTextCheckIn ? (
                                    <>
                                        <span>CHECK-IN</span>
                                        <span>TODAY</span>
                                    </>
                                ) : (
                                    <span className="stat-item-text">{checkInData != null ? checkInData.streakDay : "0"}</span>
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            </header>
            {showLearnTask ? (
                <TasksLearn
                    task={showLearnTask}
                    onClose={() => setShowLearnTask(null)}
                    onComplete={async (task, answerIndex) => {
                        // setShowLearnTask(null);
                        const reward = await completeTask(task.id, answerIndex);
                        return reward;
                    }}
                />
            ) : (
                <>
                <div className="tasks-content">
                    <div className="tasks-inner-content">
                        <section className="tasks-section">
                            <h2 
                                className="section-title" 
                                onClick={() => setTimeLimitedExpanded(!timeLimitedExpanded)}
                            >
                                TIME-LIMITED TASKS <img src={arrow_2} className={`arrow ${timeLimitedExpanded ? 'expanded' : ''}`} alt="arrow" />
                            </h2>
                            <div className={`tasks-list ${timeLimitedExpanded ? 'expanded' : ''}`}>
                                {tasksTimeLimited.map(task => renderTaskCard(task))}
                            </div>
                        </section>

                        <section className="tasks-section">
                            <h2 
                                className="section-title" 
                                onClick={() => setStandardTasksExpanded(!standardTasksExpanded)}
                            >
                                STANDARD TASKS <img src={arrow_2} className={`arrow ${standardTasksExpanded ? 'expanded' : ''}`} alt="arrow" />
                            </h2>
                            <div className={`tasks-list ${standardTasksExpanded ? 'expanded' : ''}`}>
                                {tasksStandard.map(task => renderTaskCard(task))}
                            </div>
                        </section>
                    </div>
                </div>
                </>
            )}
        </>
    );
};

export default Tasks;

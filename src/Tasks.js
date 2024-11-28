import React, { useEffect, useState } from 'react';
import "./Tasks.css";
import xIcon from './images/x-icon.svg';
import shared from './Shared';
import ticketIcon from './images/ticket.svg';
import km from './images/km.svg';
import calendar from './images/calendar.svg';
import calendar_before_checkin from './images/calendar_before_checkin.svg';
import kmIcon from './images/km.svg';
import TasksLearn from './TasksLearn';

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
            "id": 280771,
            "name": "task1",
            "url": "https://x.com/realDonaldTrump/status/1853995861497307624",
            "img": "http://dummyimage.com/400x400",
            "type": 1,
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
            "id": 284811,
            "name": "FSL Points",
            "img": "http://dummyimage.com/400x400",
            "type": 2,
            "weight": 0,
            "endTime": 1831661420158,
            "rewardList": [
                {
                    "type": 10030,
                    "amount": 10
                }
            ],
            "state": 0
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
        "id": 284811,
        "name": "FSL Points",
        "img": "http://dummyimage.com/400x400",
        "type": 2,
        "state": 0,
        "weight": 0,
        "endTime": 1831661420158,
        "rewardList": [
            {
                "type": 10030,
                "amount": 10
            }
        ],
        "contentList": [
            {
                "taskId": 284811,
                "pos": 0,
                "title": "Introduction to FSL Points",
                "content": "FSL Points are the reward currency of the FSL ecosystem, designed to give back to the community\nUsers can earn FSL Points by engaging with various FSL products, such as STEPN, MOOAR, Gas Hero, and more\nThese points are earned as part of FSL’s commitment to rewarding community members, giving back a share of revenue to the community."
            },
            {
                "taskId": 284811,
                "pos": 1,
                "title": "How to Earn FSL Points",
                "content": "You can earn FSL Points through activities like buying and selling NFTs on MOOAR and  Gas Hero, or being active in STEPN.\nFSL Points are distributed based on user activity: for example, when a trade is made on MOOAR, the points are split between buyer and seller (80% for the seller, 20% for the buyer).\nConnecting your FSL ID to different FSL products also helps integrate your activities and maximize the points you earn."
            }
        ],
        "question": {
            "question": "What can FSL Points be used for?",
            "answers": [
                "Buying sneakers.",
                "Swapping for GMT, purchasing raffle tickets, and redeeming for merch.",
                "Playing games."
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

    const fetchTasks = async (depth = 0) => {
        try {
            const response = await fetch(`${shared.server_url}/api/app/taskList?token=${shared.loginData.token}`);
            if (response.ok) {
                const data = await response.json();
                console.log('Tasks data:', data);

                if (data.code === 0) {
                    const sortedTasks = data.data.sort((a, b) => b.weight - a.weight);
                    setTasksTimelimited(sortedTasks);
                }
                else if (data.code === 102001 || data.code === 102002) {
                    console.log('Get Task list error:', data)
                    const result = await shared.login(shared.initData);
                    if (result.success) {
                        fetchTasks(depth + 1);
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

    const fetchTaskDataAndShow = async (task, depth = 0) => {
        console.log('fetchTaskDataAndShow:', task);
        const response = await fetch(`${shared.server_url}/api/app/taskData?token=${shared.loginData.token}&id=${task.id}`, {
            method: 'POST',
            body: JSON.stringify({ id: task.id })
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
            window.open(task.url, '_blank');
        } else if (task.type === 2) {
            fetchTaskDataAndShow(task);
        }
    };

    const renderTaskCard = (task) => {
        const isDone = task.state === 1;
        const formattedDate = new Date(task.endTime).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });

        return (
            <div className="task-card" key={task.id}>
                <img src={xIcon} alt="X/Twitter" className="platform-icon" />
                <div className="task-content">
                    <h3 className="task-title">{task.name}</h3>
                    <div className="task-bottom-left">
                        <div className="task-reward">
                            <img src={kmIcon} alt="KM" className="reward-icon" />
                            <span className="reward-amount">{task.rewardList[0]?.amount || 0}</span>
                        </div>
                        <div className="task-deadline">ENDS {formattedDate}</div>
                    </div>
                </div>
                <button 
                    className={`start-button ${isDone ? 'done' : ''}`}
                    onClick={() => !isDone && handleStartTask(task)}
                >
                    {isDone ? 'DONE' : 'START'}
                </button>
            </div>
        );
    };

    useEffect(() => {
        setupProfileData();
        fetchTasks();
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
                        <span>{ticket}</span>
                    </button>
                    <button 
                        className="stat-item"
                        onClick={() => setShowProfileView(true)}
                    >
                        <img src={km} alt="KM" />
                        <span>{kmpoint}</span>
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
                                    <span style={{ fontSize: '16px' }}>{checkInData != null ? checkInData.streakDay : "0"}</span>
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            <div className="tasks-content">
                <div className="tasks-inner-content">
                    <section className="tasks-section">
                        <h2 className="section-title">TIME-LIMITED TASKS <span className="arrow">›</span></h2>
                        {tasksTimeLimited
                            .filter(task => task.endTime)
                            .map(task => renderTaskCard(task))}
                    </section>

                    <section className="tasks-section">
                        <h2 className="section-title">STANDARD TASKS <span className="arrow">›</span></h2>
                        {tasksTimeLimited
                            .filter(task => !task.endTime)
                            .map(task => renderTaskCard(task))}
                    </section>
                </div>
            </div>

            {showLearnTask && (
                <TasksLearn
                    task={showLearnTask}
                    onClose={() => setShowLearnTask(null)}
                    onComplete={() => {
                        setShowLearnTask(null);
                        fetchTasks();
                    }}
                />
            )}
        </>
    );
};

export default Tasks;

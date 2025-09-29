import React, { useEffect, useState, useCallback } from 'react';
import "./Tasks.css";
import xIcon from './images/x-icon.svg';
import shared from './Shared';
import ticketIcon from './images/ticket.svg';
// import km from './images/km.svg';
import starlet from './images/starlet.png';
import calendar from './images/calendar.png';
// import calendar_before_checkin from './images/calendar_before_checkin.svg';
import calendar_before_checkin from './images/calendar.png';
import TasksLearn from './TasksLearn';
import { openLink } from '@telegram-apps/sdk';
import done_icon from './images/done_icon.svg';
import arrow_2 from './images/arrow_2.svg';
import { trackTaskFunnel, trackTaskAttempt, trackUserAction } from './analytics';
import premiumDiamond from './images/Premium_icon.png';
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
    const [starlets, setStarlets] = useState(0);
    const [ticket, setTicket] = useState(0);
    const [tasksTimeLimited, setTasksTimelimited] = useState([]);
    const [tasksStandard, setTasksStandard] = useState([]);
    const [tasksDaily, setTasksDaily] = useState([]);
    const [tasksPartner, setTasksPartner] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLearnTask, setShowLearnTask] = useState(null);
    const [timeLimitedExpanded, setTimeLimitedExpanded] = useState(true);
    const [standardTasksExpanded, setStandardTasksExpanded] = useState(true);
    const [dailyTasksExpanded, setDailyTasksExpanded] = useState(true);
    const [partnerTasksExpanded, setPartnerTasksExpanded] = useState(true);
    const [showLoading, setShowLoading] = useState(false);

    // Helper function to extract error message from server response
    const getErrorMessage = (data, defaultMessage) => {
        if (data.msg) {
            return data.msg;
        } else if (data.message) {
            return data.message;
        } else if (data.error) {
            return data.error;
        } else if (data.data && typeof data.data === 'string') {
            return data.data;
        }
        return defaultMessage;
    };

    const setupProfileData = async () => {
        const userStarlets = shared.userProfile.UserToken.find(token => token.prop_id === 10020);
        if (userStarlets) {
            setStarlets(userStarlets.num);
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
        if (depth > 3) {
            console.error('Fetch task list failed after 3 attempts');
            await shared.showPopup({
                type: 0,
                message: 'Failed to load tasks after multiple attempts. Please try again later.'
            });
            return;
        }

        try {
            const response = await fetch(`${shared.server_url}/api/app/taskList?token=${shared.loginData.token}`);
            if (response.ok) {
                const data = await response.json();
                console.log('Tasks List:', data);

                if (data.code === 0) {
                    const sortedTasks = data.data.sort((a, b) => b.weight - a.weight);
                    
                    //#region  Add fake rewards for testing bCoin
                    // const tasksWithFakeRewards = data.data.map(task => {
                    //     // Add fake second reward for testing
                    //     if (task.rewardList && task.rewardList.length === 1) {
                    //         return {
                    //             ...task,
                    //             rewardList: [
                    //                 ...task.rewardList,
                    //                 {
                    //                     type: 10030, // Starlets type
                    //                     amount: Math.floor(Math.random() * 50) + 10 // Random amount 10-60
                    //                 }
                    //             ]
                    //         };
                    //     }
                    //     return task;
                    // });
                    
                    // const sortedTasks = tasksWithFakeRewards.sort((a, b) => b.weight - a.weight);
                    //#endregion

                    setTasksTimelimited(sortedTasks.filter(task => task.category === 0));
                    setTasksStandard(sortedTasks.filter(task => task.category === 1));
                    setTasksDaily(sortedTasks.filter(task => task.category === 2));
                    setTasksPartner(sortedTasks.filter(task => task.category === 3));
                }
                else if (data.code === 102001 || data.code === 102002) {
                    console.log('Get Task list error:', data)
                    const result = await shared.login(shared.initData);
                    if (result.success) {
                        fetchTaskList(depth + 1);
                    }
                    else {
                        console.error('Error fetching tasks:', result.error);
                        await shared.showPopup({
                            type: 0,
                            message: 'Login failed. Please try again later.'
                        });
                    }
                }
                else {
                    console.log('Get Task list error:', data)
                    const errorMessage = getErrorMessage(data, 'Failed to load tasks. Please try again later.');
                    
                    await shared.showPopup({
                        type: 0,
                        message: errorMessage
                    });
                }
            }
            else {
                console.error('Error fetching tasks:', response);
                await shared.showPopup({
                    type: 0,
                    message: 'Network error. Please check your connection and try again.'
                });
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            await shared.showPopup({
                type: 0,
                message: 'An unexpected error occurred while loading tasks. Please try again later.'
            });
        } finally {
            setLoading(false);
        }
    };

    const completeTask = useCallback(async (taskId, answerIndex, word = null, depth = 0) => { 
        if (depth > 3) {
            console.error('Complete task api failed after 3 attempts');
            await shared.showPopup({
                type: 0,
                message: 'Failed to complete task after multiple attempts. Please try again later.'
            });
            return;
        }

        console.log(`Will call Complete task:${taskId} - answerIndex: ${answerIndex} - word: ${word}`);
        setShowLoading(true);

        let retVal;
        try {
            let url = `${shared.server_url}/api/app/taskComplete?token=${shared.loginData.token}&id=${taskId}&answerIndex=${answerIndex}`;
            if (word) {
                url += `&word=${encodeURIComponent(word)}`;
            }
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Task complete:', data);
                if (data.code === 0) {
                    retVal = data.data.rewardList;
                    await shared.getProfileWithRetry();
                    setupProfileData();
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
                        await shared.showPopup({
                            type: 0,
                            message: 'Login failed. Please try again later.'
                        });
                    }
                }
                else {
                    console.log('Complete Task error:', data)
                    // Show error popup for other error codes (like task expired)
                    const errorMessage = getErrorMessage(data, 'Failed to complete task. Please try again later.');
                    
                    await shared.showPopup({
                        type: 0,
                        message: errorMessage
                    });
                }
            }
            else {
                console.error('Error completing task:', response);
                await shared.showPopup({
                    type: 0,
                    message: 'Network error. Please check your connection and try again.'
                });
            }
        } catch (error) {
            console.error('Error completing task:', error);
            await shared.showPopup({
                type: 0,
                message: 'An unexpected error occurred. Please try again later.'
            });
        } finally {
            setShowLoading(false);
        }

        return retVal;
    }, []);

    const fetchTaskDataAndShow = useCallback(async (task, depth = 0) => {
        if (depth > 3) {
            console.error('Fetch task data failed after 3 attempts');
            await shared.showPopup({
                type: 0,
                message: 'Failed to load task details after multiple attempts. Please try again later.'
            });
            return;
        }

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
                        await shared.showPopup({
                            type: 0,
                            message: 'Login failed. Please try again later.'
                        });
                    }
                }
                else {
                    console.log('Get Task data error:', data)
                    const errorMessage = getErrorMessage(data, 'Failed to load task details. Please try again later.');
                    
                    await shared.showPopup({
                        type: 0,
                        message: errorMessage
                    });
                }
            } catch (error) {
                console.error('Error fetching task data:', error);
                await shared.showPopup({
                    type: 0,
                    message: 'An unexpected error occurred while loading task details. Please try again later.'
                });
            }
        }
        else {
            console.error('Error fetching task data:', response);
            await shared.showPopup({
                type: 0,
                message: 'Network error. Please check your connection and try again.'
            });
        }
    }, []);

    const handleFinishTaskClicked = async (task) => {
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
        } else if (task.type === 4) {
            // Mini app task - open URL like mini game
            try {
                // Use Telegram WebApp API to open the mini app directly within Telegram
                if (window.Telegram?.WebApp?.openTelegramLink) {
                    // This method will open the link within Telegram without launching a browser
                    window.Telegram.WebApp.openTelegramLink(task.url);
                } else {
                    // Fallback to SDK method if the direct method isn't available
                    openLink(task.url);
                }
            } catch (e) {
                console.log('Error opening mini app task:', e);
                // Fallback in case of error
                openLink(task.url);
            }
        }
    };



    const handleStartTask = useCallback(async (task) => {
        // Track task start
        let taskType = 'quiz';
        if (task.type === 1) taskType = 'link';
        else if (task.type === 4) taskType = 'mini_app';
        else if (task.type === 5) taskType = 'share_story';
        else if (task.type === 6) taskType = 'word_input';
        
        trackTaskFunnel(task.id, taskType, 'start', {
            task_name: task.name,
            task_category: task.category === 0 ? 'time_limited' : 'standard'
        }, shared.loginData?.userId);

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

            // Track link task completion attempt
            trackTaskAttempt(task.id, 'link', true, {
                task_name: task.name,
                task_url: task.url
            }, shared.loginData?.userId);

            completeTask(task.id, 0);

        } else if (task.type === 4) {
            // Mini app task - open URL like mini game but don't complete task
            try {
                trackUserAction('minigame_clicked', {
                    game_name: task.name,
                    game_url: task.url,
                }, shared.loginData?.link);
                
                // Use Telegram WebApp API to open the mini app directly within Telegram
                if (window.Telegram?.WebApp?.openTelegramLink) {
                    // This method will open the link within Telegram without launching a browser
                    window.Telegram.WebApp.openTelegramLink(task.url);
                } else {
                    // Fallback to SDK method if the direct method isn't available
                    openLink(task.url);
                }
            } catch (e) {
                console.log('Error opening mini app task:', e);
                // Fallback in case of error
                openLink(task.url);
            }

        } else if (task.type === 2 || task.type === 3 || task.type === 5 || task.type === 6) {
            // Track task content view based on type
            let taskType = 'quiz';
            if (task.type === 5) taskType = 'share_story';
            else if (task.type === 6) taskType = 'word_input';
            
            trackTaskFunnel(task.id, taskType, 'content_view', {
                task_name: task.name
            }, shared.loginData?.userId);

            fetchTaskDataAndShow(task);
        }
    }, [completeTask, fetchTaskDataAndShow]);

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
                            {task.rewardList && task.rewardList.length > 0 ? (
                                task.rewardList.map((reward, index) => (
                                    <div key={index} className="reward-item">
                                        <img src={shared.mappingIcon[reward.type]} alt="Reward" className={`reward-icon ${isDone ? 'done' : ''}`} />
                                        <span className="reward-amount-task">{reward.amount || 0}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="reward-item">
                                    <img src={shared.mappingIcon[10030]} alt="Default" className={`reward-icon ${isDone ? 'done' : ''}`} />
                                    <span className="reward-amount-task">0</span>
                                </div>
                            )}
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
                    <button className="done-button" onClick={() => handleFinishTaskClicked(task)}>
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

    // Add useEffect to handle auto-start functionality
    useEffect(() => {
        // Check if there's a task to auto-start (from MainView daily tasks button)
        if (shared.autoStartTaskId && !showLearnTask) {
            console.log('Auto-starting task:', shared.autoStartTaskId);
            
            // Find the task in the loaded tasks
            const allTasks = [...tasksTimeLimited, ...tasksStandard, ...tasksDaily, ...tasksPartner];
            const taskToStart = allTasks.find(task => task.id === shared.autoStartTaskId);
            
            if (taskToStart) {
                console.log('Found task to auto-start:', taskToStart);
                // Clear the auto-start flag
                shared.autoStartTaskId = null;
                // Start the task
                handleStartTask(taskToStart);
            }
        }
    }, [tasksTimeLimited, tasksStandard, tasksDaily, tasksPartner, showLearnTask, handleStartTask]);

    // Add useEffect to listen for data refresh trigger from App component
    useEffect(() => {
        // This will run when dataRefreshTrigger changes (after focus/unfocus reload)
        if (shared.userProfile) {
            console.log('Tasks: Updating currency display after data refresh');
            const userStarlets = shared.userProfile.UserToken.find(token => token.prop_id === 10020);
            if (userStarlets) {
                setStarlets(userStarlets.num);
            }

            const userTicket = shared.userProfile.UserToken.find(token => token.prop_id === 10010);
            if (userTicket) {
                setTicket(userTicket.num);
            }
        }
    }, [shared.userProfile]); // This will trigger when shared.userProfile changes

    // Track when tasks are loaded and viewed
    useEffect(() => {
        if (tasksTimeLimited.length > 0 || tasksStandard.length > 0) {
            // Track task list view
            const allTasks = [...tasksTimeLimited, ...tasksStandard];
            allTasks.forEach(task => {
                let taskType = 'quiz';
                if (task.type === 1) taskType = 'link';
                else if (task.type === 4) taskType = 'mini_app';
                else if (task.type === 5) taskType = 'share_story';
                else if (task.type === 6) taskType = 'word_input';
                
                trackTaskFunnel(task.id, taskType, 'view', {
                    task_name: task.name,
                    task_category: task.category === 0 ? 'time_limited' : 'standard',
                    task_state: task.state // 0: not done, 1: done
                }, shared.loginData?.userId);
            });
        }
    }, [tasksTimeLimited, tasksStandard]);

    return (
        <>
            {showLoading && (
                <div className="loading-overlay">
                    LOADING...
                </div>
            )}
            <header className="stats-header">
                <div className="profile-pic-container">
                    <button 
                        className="profile-pic"
                        onClick={() => setShowProfileView(true)}
                    >
                        <img 
                            src={shared.avatars[shared.userProfile ? shared.userProfile.pictureIndex : 0]?.src} 
                            alt="Profile" 
                        />
                    </button>
                    {/* Premium icon overlay */}
                    {shared.isPremiumMember && (
                        <div className="premium-icon-overlay">
                            <img src={premiumDiamond} alt="Premium" className="premium-icon" />
                        </div>
                    )}
                </div>
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
                        <img src={starlet} alt="Starlets" />
                        <span className="stat-item-text">{starlets}</span>
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
                    onComplete={async (task, answerIndex, word) => {
                        if (task.type === 6) {
                            // Task type 6: send word parameter
                            const reward = await completeTask(task.id, 0, word);
                            return reward;
                        } else {
                            // Task type 2, 3, 5: send answerIndex parameter
                            const reward = await completeTask(task.id, answerIndex);
                            return reward;
                        }
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
                                {tasksTimeLimited
                                    .filter(task => task.state === 0 && task.endTime > Date.now() && task.type !== 8)
                                    .map(task => renderTaskCard(task))}
                            </div>
                        </section>

                        <section className="tasks-section">
                            <h2 
                                className="section-title" 
                                onClick={() => setStandardTasksExpanded(!standardTasksExpanded)}
                            >
                                FSL Academy <img src={arrow_2} className={`arrow ${standardTasksExpanded ? 'expanded' : ''}`} alt="arrow" />
                            </h2>
                            <div className={`tasks-list ${standardTasksExpanded ? 'expanded' : ''}`}>
                                {tasksStandard
                                    .filter(task => task.state === 0 && task.endTime > Date.now() && task.type !== 8)
                                    .map(task => renderTaskCard(task))}
                            </div>
                        </section>

                        {/* Daily Tasks section temporarily disabled
                        <section className="tasks-section">
                            <h2 
                                className="section-title" 
                                onClick={() => setDailyTasksExpanded(!dailyTasksExpanded)}
                            >
                                DAILY TASKS <img src={arrow_2} className={`arrow ${dailyTasksExpanded ? 'expanded' : ''}`} alt="arrow" />
                            </h2>
                            <div className={`tasks-list ${dailyTasksExpanded ? 'expanded' : ''}`}>
                                {tasksDaily
                                    .filter(task => task.state === 0 && task.endTime > Date.now() && task.type !== 8)
                                    .map(task => renderTaskCard(task))}
                            </div>
                        </section>
                        */}

                        <section className="tasks-section">
                            <h2 
                                className="section-title" 
                                onClick={() => setPartnerTasksExpanded(!partnerTasksExpanded)}
                            >
                                PARTNER TASKS <img src={arrow_2} className={`arrow ${partnerTasksExpanded ? 'expanded' : ''}`} alt="arrow" />
                            </h2>
                            <div className={`tasks-list ${partnerTasksExpanded ? 'expanded' : ''}`}>
                                {tasksPartner
                                    .filter(task => task.state === 0 && task.endTime > Date.now() && task.type !== 8)
                                    .map(task => renderTaskCard(task))}
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

import React, { useState, useEffect } from 'react';
import './PremiumTasks.css';
import back from './images/back.svg';
import premiumDiamond from './images/Premium_icon.png';
import loginIcon from './images/icon_gamehub.png';
import ticketIcon from './images/ticket_scratch_icon.png';
import tadokamiIcon from './images/icon_tadokami.png';
import flippinStarsIcon from './images/icon_flipping_star.png';
import friendsIcon from './images/icon_friend.png';
import bankStepsIcon from './images/banking_step_icon.png';
import stepBoostIcon from './images/icon_step_boost_ptask.png';
import shared from './Shared';

// Activity mapping constants
const Activity_Login = 1;
const Activity_Scratch = 2;
const Activity_PlayTadokami = 3;
const Activity_PlayFlippinStars = 4;
const Activity_InviteFriends = 5;
const Activity_BankSteps = 6;
const Activity_UseStepBoost = 7;

const PremiumTasks = ({ isOpen, onClose, currentXP = 0, dailyExp = 0, activitiesList = [] }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate tasks based on activitiesList from API
  const generateTasksFromActivities = (activitiesList) => {
    // Helper function to get activity count from activitiesList
    const getActivityCount = (activityType) => {
      const activity = activitiesList.find(act => act.day === activityType);
      return activity ? activity.num : 0;
    };

    const tasks = [
      {
        id: 1,
        title: "LOGIN FOR THE DAY",
        xp: 20,
        progress: getActivityCount(Activity_Login),
        total: 1,
        status: getActivityCount(Activity_Login) >= 1 ? "DONE" : "INCOMPLETE",
        icon: loginIcon,
        size: "small"
      },
      {
        id: 2,
        title: "SCRATCH A TICKET",
        xp: 20,
        progress: getActivityCount(Activity_Scratch),
        total: 1,
        status: getActivityCount(Activity_Scratch) >= 1 ? "DONE" : "INCOMPLETE",
        icon: ticketIcon,
        size: "medium"
      },
      {
        id: 3,
        title: "PLAY TADOKAMI",
        xp: 50,
        progress: getActivityCount(Activity_PlayTadokami),
        total: 1,
        status: getActivityCount(Activity_PlayTadokami) >= 1 ? "DONE" : "INCOMPLETE",
        icon: tadokamiIcon,
        size: "very-large"
      },
      {
        id: 4,
        title: "PLAY FLIPPIN STARS",
        xp: 50,
        progress: getActivityCount(Activity_PlayFlippinStars),
        total: 1,
        status: getActivityCount(Activity_PlayFlippinStars) >= 1 ? "DONE" : "INCOMPLETE",
        icon: flippinStarsIcon,
        size: "large"
      },
      {
        id: 5,
        title: "INVITE 3 FRIENDS",
        xp: 30,
        progress: getActivityCount(Activity_InviteFriends),
        total: 3,
        status: getActivityCount(Activity_InviteFriends) >= 3 ? "DONE" : "INCOMPLETE",
        icon: friendsIcon,
        size: "medium"
      },
      {
        id: 6,
        title: "BANK STEPS",
        xp: 30,
        progress: getActivityCount(Activity_BankSteps),
        total: 1,
        status: getActivityCount(Activity_BankSteps) >= 1 ? "DONE" : "INCOMPLETE",
        icon: bankStepsIcon,
        size: "small"
      },
      {
        id: 7,
        title: "USE A STEP BOOST",
        xp: 30,
        progress: getActivityCount(Activity_UseStepBoost),
        total: 1,
        status: getActivityCount(Activity_UseStepBoost) >= 1 ? "DONE" : "INCOMPLETE",
        icon: stepBoostIcon,
        size: "medium"
      }
    ];

    return tasks;
  };

  // FAKE DATA for testing (tasks only - dailyExp comes from props)
  const fetchPremiumTasksDataFake = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const fakeTasks = [
        {
          id: 1,
          title: "LOGIN FOR THE DAY",
          xp: 20,
          progress: 0,
          total: 1,
          status: "INCOMPLETE",
          icon: loginIcon,
          size: "small"
        },
        {
          id: 2,
          title: "SCRATCH A TICKET",
          xp: 20,
          progress: 0,
          total: 1,
          status: "INCOMPLETE",
          icon: ticketIcon,
          size: "medium"
        },
        {
          id: 3,
          title: "PLAY TADOKAMI",
          xp: 50,
          progress: 0,
          total: 1,
          status: "INCOMPLETE",
          icon: tadokamiIcon,
          size: "very-large"
        },
        {
          id: 4,
          title: "PLAY FLIPPIN STARS",
          xp: 50,
          progress: 0,
          total: 1,
          status: "INCOMPLETE",
          icon: flippinStarsIcon,
          size: "large"
        },
        {
          id: 5,
          title: "INVITE 3 FRIENDS",
          xp: 30,
          progress: 0,
          total: 3,
          status: "INCOMPLETE",
          icon: friendsIcon,
          size: "medium"
        },
        {
          id: 6,
          title: "BANK STEPS",
          xp: 30,
          progress: 0,
          total: 1,
          status: "INCOMPLETE",
          icon: bankStepsIcon,
          size: "small"
        },
        {
          id: 7,
          title: "USE A STEP BOOST",
          xp: 30,
          progress: 0,
          total: 1,
          status: "INCOMPLETE",
          icon: stepBoostIcon,
          size: "medium"
        }
      ];
      
      setTasks(fakeTasks);
    } catch (error) {
      console.error('Error with fake premium tasks data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Generate tasks from activitiesList if available, otherwise use fake data
      if (activitiesList && activitiesList.length > 0) {
        console.log('Using activitiesList from API:', activitiesList);
        const generatedTasks = generateTasksFromActivities(activitiesList);
        setTasks(generatedTasks);
        setLoading(false);
      } else {
        // Fallback to fake data for testing
        fetchPremiumTasksDataFake();
      }
    }
  }, [isOpen, activitiesList]);

  // Dữ liệu XP cho từng level (giống Premium.js)
  const levelData = [
    { level: 1, xpNeeded: 120, cumulativeXP: 120 },
    { level: 2, xpNeeded: 120, cumulativeXP: 240 },
    { level: 3, xpNeeded: 360, cumulativeXP: 600 },
    { level: 4, xpNeeded: 420, cumulativeXP: 1020 },
    { level: 5, xpNeeded: 460, cumulativeXP: 1480 },
    { level: 6, xpNeeded: 480, cumulativeXP: 1960 },
    { level: 7, xpNeeded: 500, cumulativeXP: 2460 },
    { level: 8, xpNeeded: 520, cumulativeXP: 2980 },
    { level: 9, xpNeeded: 540, cumulativeXP: 3520 },
    { level: 10, xpNeeded: 560, cumulativeXP: 4080 },
    { level: 11, xpNeeded: 570, cumulativeXP: 4650 },
    { level: 12, xpNeeded: 570, cumulativeXP: 5220 }
  ];

  // Tính level hiện tại dựa trên XP (giống Premium.js)
  const calculateCurrentLevel = () => {
    for (let i = levelData.length - 1; i >= 0; i--) {
      if (currentXP >= levelData[i].cumulativeXP) {
        return i + 1;
      }
    }
    return 1;
  };
  
  const calculatedLevel = calculateCurrentLevel();
  
  // Tính progress percentage dựa trên XP hiện tại (giống Premium.js)
  const getProgressPercentage = () => {
    if (currentXP >= 5220) return 100; // Max level
    
    const currentLevelIndex = calculatedLevel - 1;
    const currentLevelStartXP = currentLevelIndex > 0 ? levelData[currentLevelIndex - 1].cumulativeXP : 0;
    const currentLevelEndXP = levelData[currentLevelIndex].cumulativeXP;
    const currentLevelProgress = (currentXP - currentLevelStartXP) / (currentLevelEndXP - currentLevelStartXP);
    
    return ((currentLevelIndex + currentLevelProgress) / 12) * 100;
  };

  // Determine icon size class based on task properties
  const getIconSizeClass = (size) => {
    // Small icons for high XP tasks (50+ XP)
    if (size === 'small') {
      return 'icon-small';
    }
    // Large icons for completed tasks
    else if (size === 'large') {
      return 'icon-large';
    }
    // Medium icons for everything else
    else if (size === 'medium') {
      return 'icon-medium';
    }
    else if (size === 'very-large') {
      return 'icon-very-large';
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="premium-tasks-overlay">
        <div className="premium-tasks-container">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            color: 'white',
            fontSize: '18px',
            fontFamily: '"PP Neue Machina", sans-serif'
          }}>
            Loading Premium Tasks...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-tasks-overlay">
      {/* Back Button */}
      <button className="back-button back-button-alignment" onClick={onClose}>
        <img src={back} alt="Back" />
      </button>

      <div className="premium-tasks-container-main">
        {/* Header */}
        <div className="premium-tasks-header">
            {/* Corner borders for header */}
            <div className="premium-tasks-corner premium-tasks-top-left"></div>
            <div className="premium-tasks-corner premium-tasks-top-right"></div>
            <div className="premium-tasks-corner premium-tasks-bottom-left"></div>
            <div className="premium-tasks-corner premium-tasks-bottom-right"></div>
            
            <img src={premiumDiamond} alt="Premium Tasks" className="premium-tasks-diamond-img" />
            <div className="premium-tasks-title">
              <span className="premium-tasks-title-line">PREMIUM</span>
              <span className="premium-tasks-title-line">TASKS</span>
            </div>
          </div>
          
          {/* Progress Section */}
          <div className="premium-tasks-progress-section">
            <div className="premium-tasks-exp-label">DAILY EXP {dailyExp}/180</div>
            <div className="premium-tasks-progress">
              <div className="premium-tasks-progress-bar">
                <div className="premium-tasks-progress-fill" style={{width: `${getProgressPercentage()}%`}}></div>
                {/* Segment dividers */}
                {Array.from({ length: 11 }, (_, index) => (
                  <div 
                    key={index}
                    className="premium-tasks-segment-divider"
                    style={{left: `${((index + 1) / 12) * 100}%`}}
                  ></div>
                ))}
              </div>
            </div>
            
            {/* Level Labels */}
            <div className="premium-tasks-level-labels">
              <div className="premium-tasks-level">LEVEL 1</div>
              <div className="premium-tasks-level">LEVEL 12</div>
            </div>
          </div>

          <div className="premium-tasks-container-content">
            <div className="premium-tasks-scrollable-content">
              {/* Tasks Grid - Using pt_ prefixed classes (copied from Market.css) */}
              <div className="premium-tasks-grid">
                {tasks.map((task) => (
                  <button 
                    key={task.id} 
                    className={`pt_market-ticket-button ${task.status === 'DONE' ? 'task-done' : 'task-incomplete'}`}
                  >
                    <div className="pt_market-ticket-button-image-container">
                      <div className="pt_market-ticket-content">
                        <div className={`pt_market-ticket-icon ${getIconSizeClass(task.size)}`}>
                          <img src={task.icon} alt={task.title} />
                        </div>
                        <div className="pt_market-ticket-info">
                          <div className="pt_market-ticket-text">
                            <div className="pt_market-ticket-amount">{task.xp} XP</div>
                            <div className="pt_market-ticket-label">{task.progress}/{task.total}</div>
                          </div>
                          <div className="pt_market-ticket-bonus">
                            <span>{task.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="pt_market-ticket-price">
                        {task.title}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default PremiumTasks;


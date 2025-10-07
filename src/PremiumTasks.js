import React, { useState, useEffect } from 'react';
import './PremiumTasks.css';
import back from './images/back.svg';
import premiumDiamond from './images/Premium_icon.png';
import shared from './Shared';

// Import task icons
import loginIcon from './images/calendar.png';
import scratchIcon from './images/ticket.png';
import tadokaimiIcon from './images/Tadokami_Logo.png';
import flippingStarsIcon from './images/Flipping_stars.png';
import tasksIcon from './images/Task_selected.png';

const PremiumTasks = ({ isOpen, onClose }) => {
  const [currentXP, setCurrentXP] = useState(0);
  const [maxXP, setMaxXP] = useState(180);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fake data for testing
  const fakeTasks = [
    {
      id: 1,
      title: 'LOGIN FOR THE DAY',
      xp: 20,
      progress: 1,
      total: 1,
      status: 'DONE',
      icon: loginIcon
    },
    {
      id: 2,
      title: 'SCRATCH 1 TICKET',
      xp: 33,
      progress: 1,
      total: 1,
      status: 'DONE',
      icon: scratchIcon
    },
    {
      id: 3,
      title: 'PLAY TADOKAIMI',
      xp: 18,
      progress: 1,
      total: 1,
      status: 'DONE',
      icon: tadokaimiIcon
    },
    {
      id: 4,
      title: 'PLAY FLIPPIN STARS',
      xp: 18,
      progress: 0,
      total: 0,
      status: 'INCOMPLETE',
      icon: flippingStarsIcon
    },
    {
      id: 5,
      title: 'DO x3 TASKS',
      xp: 50,
      progress: 0,
      total: 0,
      status: 'INCOMPLETE',
      icon: tasksIcon
    },
    {
      id: 6,
      title: 'DO x6 TASKS',
      xp: 50,
      progress: 0,
      total: 0,
      status: 'INCOMPLETE',
      icon: tasksIcon
    }
  ];

  // Fetch premium tasks data from API
  const fetchPremiumTasks = async () => {
    try {
      // For now, use fake data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTasks(fakeTasks);
      setCurrentXP(72); // Example: completed 3 tasks = 20 + 33 + 18 = 71 XP (rounded to 72 for display)
      setLoading(false);
      
      // TODO: Replace with actual API call
      // if (!shared.loginData?.token) {
      //   console.log('No login token available for premium tasks API');
      //   setLoading(false);
      //   return;
      // }
      // const url = `${shared.server_url}/api/app/getPremiumTasks?token=${shared.loginData.token}`;
      // const response = await fetch(url);
      // const data = await response.json();
      // ... process data
    } catch (error) {
      console.error('Error fetching premium tasks:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPremiumTasks();
    }
  }, [isOpen]);

  // Calculate progress percentage
  const getProgressPercentage = () => {
    return (currentXP / maxXP) * 100;
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
      
      <div className="premium-tasks-container">
        {/* Header */}
        <div className="premium-tasks-header">
          {/* Corner borders */}
          <div className="premium-tasks-corner premium-tasks-top-left"></div>
          <div className="premium-tasks-corner premium-tasks-top-right"></div>
          <div className="premium-tasks-corner premium-tasks-bottom-left"></div>
          <div className="premium-tasks-corner premium-tasks-bottom-right"></div>
          
          <img src={premiumDiamond} alt="Premium Diamond" className="premium-tasks-diamond-img" />
          <div className="premium-tasks-title">
            <span className="premium-tasks-title-line">PREMIUM</span>
            <span className="premium-tasks-title-line">TASKS</span>
          </div>
        </div>
        
        {/* Daily XP Text */}
        <div className="premium-tasks-daily-xp">
          DAILY EXP {currentXP}/{maxXP}
        </div>
        
        {/* Progress Bar */}
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
        
        {/* Tasks Grid */}
        <div className="premium-tasks-grid">
          {tasks.map((task) => (
            <div key={task.id} className="premium-task-card">
              <button className="premium-task-button">
                <div className="premium-task-container">
                  {/* Top Section - Icon, XP, Progress, Status */}
                  <div className="premium-task-content">
                    <div className="premium-task-icon-wrapper">
                      <img src={task.icon} alt={task.title} className="premium-task-icon" />
                    </div>
                    <div className="premium-task-info">
                      <div className="premium-task-xp">{task.xp} XP</div>
                      <div className="premium-task-progress-status">
                        <div className="premium-task-progress-text">{task.progress}/{task.total}</div>
                        <div className={`premium-task-status premium-task-status-${task.status.toLowerCase()}`}>
                          {task.status}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom Section - Title (like Market price) */}
                  <div className="premium-task-title">
                    {task.title}
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PremiumTasks;


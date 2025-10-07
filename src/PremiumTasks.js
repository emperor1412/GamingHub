import React, { useState, useEffect } from 'react';
import './PremiumTasks.css';
import back from './images/back.svg';
import premiumDiamond from './images/Premium_icon.png';
import loginIcon from './images/icon_gamehub.png';
import ticketIcon from './images/ticket_scratch_icon.png';
import tadokamiIcon from './images/icon_tadokami.png';
import flippinStarsIcon from './images/icon_flipping_star.png';
import checkmarkIcon from './images/icon_task.png';
import shared from './Shared';

const PremiumTasks = ({ isOpen, onClose }) => {
  const [dailyExp, setDailyExp] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch premium tasks data from API
  const fetchPremiumTasksData = async () => {
    try {
      if (!shared.loginData?.token) {
        console.log('No login token available for premium tasks API');
        setLoading(false);
        return;
      }
      
      const url = `${shared.server_url}/api/app/getPremiumTasks?token=${shared.loginData.token}`;
      console.log('Fetching premium tasks from:', url);
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Premium tasks API response:', data);
        
        if (data.code === 0 && data.data) {
          setDailyExp(data.data.dailyExp || 0);
          setTasks(data.data.tasks || []);
        }
      } else {
        console.error('Premium tasks API response not ok:', response.status);
      }
    } catch (error) {
      console.error('Error fetching premium tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // FAKE DATA for testing
  const fetchPremiumTasksDataFake = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const fakeData = {
        dailyExp: 53,
        tasks: [
          {
            id: 1,
            title: "LOGIN FOR THE DAY",
            xp: 20,
            progress: 1,
            total: 1,
            status: "DONE",
            icon: loginIcon
          },
          {
            id: 2,
            title: "SCRATCH 1 TICKET",
            xp: 33,
            progress: 1,
            total: 1,
            status: "DONE",
            icon: ticketIcon
          },
          {
            id: 3,
            title: "PLAY TADOKAIII",
            xp: 18,
            progress: 0,
            total: 1,
            status: "DONE",
            icon: tadokamiIcon
          },
          {
            id: 4,
            title: "PLAY FLIPPIN STARS",
            xp: 18,
            progress: 0,
            total: 1,
            status: "INCOMPLETE",
            icon: flippinStarsIcon
          },
          {
            id: 5,
            title: "DO x3 TASKS",
            xp: 50,
            progress: 0,
            total: 3,
            status: "INCOMPLETE",
            icon: checkmarkIcon
          },
          {
            id: 6,
            title: "DO x6 TASKS",
            xp: 50,
            progress: 0,
            total: 6,
            status: "INCOMPLETE",
            icon: checkmarkIcon
          }
        ]
      };
      
      setDailyExp(fakeData.dailyExp);
      setTasks(fakeData.tasks);
    } catch (error) {
      console.error('Error with fake premium tasks data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Use fake data for testing - replace with fetchPremiumTasksData() when API is ready
      fetchPremiumTasksDataFake();
    }
  }, [isOpen]);

  // Calculate progress percentage
  const getProgressPercentage = () => {
    const maxExp = 180;
    return Math.min((dailyExp / maxExp) * 100, 100);
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
        <div className="premium-tasks-scrollable-content">
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
          
          {/* Tasks Grid - Using pt_ prefixed classes (copied from Market.css) */}
          <div className="premium-tasks-grid">
            {tasks.map((task) => (
              <button 
                key={task.id} 
                className={`pt_market-ticket-button ${task.status === 'DONE' ? 'task-done' : 'task-incomplete'}`}
              >
                <div className="pt_market-ticket-button-image-container">
                  <div className="pt_market-ticket-content">
                    <div className="pt_market-ticket-icon">
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
  );
};

export default PremiumTasks;


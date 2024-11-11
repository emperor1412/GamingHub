import React, { useEffect, useState } from 'react';
import './App.css';
import MainView from './MainView';

import HomeIcon_selected from './images/Home_selected.png';
import HomeIcon_normal from './images/Home_normal.png';

import Task_normal from './images/Task_normal.png';
import Task_selected from './images/Task_selected.png';

import Friends_normal from './images/Friends_normal.png';
import Friends_selected from './images/Friends_selected.png';

import Market_normal from './images/Market_normal.png';
import Market_selected from './images/Market_selected.png';

import ID_normal from './images/ID_normal.png';
import ID_selected from './images/ID_selected.png';

import { init, initData, miniApp, viewport, swipeBehavior, closingBehavior, retrieveLaunchParams } from '@telegram-apps/sdk';

function App() {
  const { initDataRaw } = retrieveLaunchParams();
  console.log(initDataRaw);

  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  // const swipeBehavior = useSwipeBehavior();

  useEffect(() => {
    console.log('App useEffect called');
    init();
    miniApp.ready();
    miniApp.mount();
    viewport.expand();

    closingBehavior.mount();
    closingBehavior.enableConfirmation();

    swipeBehavior.mount();        
    swipeBehavior.disableVertical();

    initData.restore();
    const temp = initData.user();
    console.log('User:', temp);

    setUser(temp);
  }, []);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <MainView 
          user={user}           
        />;      
      default:
        return <MainView 
          user={user} 
        />;
    }
  };

  return (
    <div className="App">
      <div className="app-container">
        
      {renderActiveView()}
      </div>


        
        <nav className="bottom-nav">
          <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'active' : ''}>
            <img src={activeTab === 'home' ? HomeIcon_selected : HomeIcon_normal} alt="Home" />
          </button>
          <button onClick={() => setActiveTab('tasks')} className={activeTab === 'tasks' ? 'active' : ''}>
            <img src={activeTab === 'tasks' ? Task_selected : Task_normal} alt="Tasks" />
          </button>

          <button onClick={() => setActiveTab('frens')} className={activeTab === 'frens' ? 'active' : ''}>
            <img src={activeTab === 'frens' ? Friends_selected : Friends_normal} alt="Friends" />
          </button>

          <button onClick={() => setActiveTab('market')} className={activeTab === 'market' ? 'active' : ''}>
            <img src={activeTab === 'market' ? Market_selected : Market_normal} alt="Market" />
          </button>
          <button onClick={() => setActiveTab('fslid')} className={activeTab === 'fslid' ? 'active' : ''}>
            <img src={activeTab === 'fslid' ? ID_selected : ID_normal} alt="FSLID" />
          </button>
          </nav>
    </div>
  );
}

export default App;

import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import MainView from './MainView';

import HomeIcon_selected from './images/Home_selected.svg';
import HomeIcon_normal from './images/Home_normal.svg';

import Task_normal from './images/Task_normal.svg';
import Task_selected from './images/Task_selected.svg';

import Friends_normal from './images/Friends_normal.svg';
import Friends_selected from './images/Friends_selected.svg';

import Market_normal from './images/Market_normal.svg';
import Market_selected from './images/Market_selected.svg';

import ID_normal from './images/ID_normal.svg';
import ID_selected from './images/ID_selected.svg';

// import background from './images/background.svg';
import background from './images/background.png';

import { init, initData, miniApp, viewport, swipeBehavior, closingBehavior, retrieveLaunchParams, popup } from '@telegram-apps/sdk';

function App() {
  
  const { initDataRaw } = retrieveLaunchParams();
  console.log("initDataRaw: ", initDataRaw);

  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  // const swipeBehavior = useSwipeBehavior();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Add a ref to track initialization
  const initRef = useRef(false);

  const login = async () => {
    // Check if already initialized
    if (initRef.current) {
      console.log('App already initialized');
      return;
    }
    
    try {
      setIsLoading(true);
      initRef.current = true;  // Mark as initialized
      
      console.log('Initializing app...');            

      if (initDataRaw) {
        // Here you can make an API call to your backend to verify/login the user
        try {
          let params = JSON.stringify({
            link: '1',
            initData: initDataRaw
          });
          console.log('Login params:', params);

          // Example API call (replace with your actual API endpoint)
          const response = await fetch('https://gm14.joysteps.io/api/app/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: params
          });

          console.log('Response:', response);

          if (response.ok) {
            const data = await response.json();
            console.log('Login data:', data);

            if(data.code !== 0) {
              console.log('User is not logged in');
              setIsLoggedIn(false);

              if (popup.open.isAvailable()) {
                // popup.isOpened() -> false
                const promise = popup.open({
                  title: 'Error',
                  message: data.msg,
                  buttons: [{ id: 'my-id', type: 'default', text: 'OK' }],
                });
                // popup.isOpened() -> true
                const buttonId = await promise;
                // popup.isOpened() -> false
              }

            }
            else {                
              setLoginData(data.data);
              setIsLoggedIn(true);

              if (popup.open.isAvailable()) {
                // popup.isOpened() -> false
                const promise = popup.open({
                  title: 'Success',
                  message: "Login Success",
                  buttons: [{ id: 'my-id', type: 'default', text: 'OK' }],
                });
                // popup.isOpened() -> true
                const buttonId = await promise;
                // popup.isOpened() -> false
              }
            }

          } else {
            console.error('Login failed');
            setIsLoggedIn(false);
          }

          initRef.current = false;  // Reset on error
          
        } catch (error) {
          console.error('Login error:', error);
          setIsLoggedIn(false);
        }
      }
    } catch (error) {
      console.error('Initialization error:', error);
      setIsLoggedIn(false);
      initRef.current = false;  // Reset on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('App useEffect called');
    // Initialize Telegram Mini App
    init();
    miniApp.ready();
    miniApp.mount();
    viewport.expand();

    // Setup behaviors
    closingBehavior.mount();
    closingBehavior.enableConfirmation();
    swipeBehavior.mount();        
    swipeBehavior.disableVertical();

    // Get user data
    initData.restore();
    const userData = initData.user();
    console.log('User:', userData);
    setUser(userData);

    login();
    
  }, []);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <MainView 
          user={user}           
          loginData={loginData}
        />;      
      default:
        return <MainView 
          user={user} 
          loginData={loginData}
        />;
    }
  };

  return (
    <div className="App">
      <div className="background-container">
        <img src={background} alt="background" />
      </div>
      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : !isLoggedIn ? (
        <div className="login-error">
          <div>Unable to log in. Please try again.</div>
          <button className="retry-button" onClick={login}>
            Retry
          </button>
        </div>
      ) : (
        <div className="app-container">
          {renderActiveView()}
        </div>
      )}

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

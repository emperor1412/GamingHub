import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import MainView from './MainView';
import Tasks from './Tasks';
import CheckIn from './CheckIn';
import Profile from './Profile';
import FSLIDTest from './FSLIDTest';
import Frens from './Frens';
import ScratchTest from './ScratchTest';

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
import checkInAnimation from './images/checkIn_animation.png';

import shared from './Shared';

import { init, initData, miniApp, viewport, swipeBehavior, closingBehavior, retrieveLaunchParams, popup } from '@telegram-apps/sdk';

function App() {
  
  const { initDataRaw } = retrieveLaunchParams();
  // console.log("initDataRaw: ", initDataRaw);

  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState(null);
  const [checkInData, setCheckInData] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [userProfile, setUserProfile] = useState(null);
  const [profileItems, setProfileItems] = useState([]);
  // const swipeBehavior = useSwipeBehavior();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCheckInAnimation, setShowCheckInAnimation] = useState(false);
  const [showCheckInView, setShowCheckInView] = useState(false);
  const [showProfileView, setShowProfileView] = useState(false);

  // Add a ref to track initialization
  const initRef = useRef(false);

  const checkIn = async (loginData) => {
    const now = new Date();
    console.log(`Checking in ........: ${now.toLocaleString()}`);
    
    const checkInResult = await shared.checkIn(loginData);
    
    if (checkInResult.success) {
        setCheckInData(checkInResult.data);
        
        if (checkInResult.isCheckIn) {
            console.log('Redirect to checkIn screen');
            return 1;
        }
        return 0;
    } else {
        if (checkInResult.needRelogin) {
            const loginResult = await shared.login(initDataRaw);
            if (loginResult.success) {
                setLoginData(loginResult.loginData);
                setIsLoggedIn(true);
                return await checkIn(loginResult.loginData);
            }
        }
        
        if (popup.open.isAvailable()) {
            const promise = popup.open({
                title: 'Error Checking-in',
                message: `Error: ${checkInResult.error}`,
                buttons: [{ id: 'my-id', type: 'default', text: 'OK' }],
            });
            await promise;
        }
        return 2;
    }
};

  const getProfileData = async (loginDataParam) => {
    const dataToUse = loginDataParam || loginData;
    const profileResult = await shared.getProfileData(dataToUse);
    
    if (profileResult.success) {
        setUserProfile(profileResult.userProfile);
        setProfileItems(profileResult.profileItems);
        return [profileResult.userProfile, profileResult.profileItems];
    } else {
        if (profileResult.needRelogin) {
            const loginResult = await shared.login(initDataRaw);
            if (loginResult.success) {
                setLoginData(loginResult.loginData);
                setIsLoggedIn(true);
                return await getProfileData(loginResult.loginData);
            } else {
                console.log('User is not logged in');
                setIsLoggedIn(false);
            }
        } else {
            if (popup.open.isAvailable()) {
                const promise = popup.open({
                    title: 'Error Getting Profile Data',
                    message: `Error: ${profileResult.error}`,
                    buttons: [{ id: 'my-id', type: 'default', text: 'OK' }],
                });
                await promise;
            }
        }
        return [null, []];
    }
};


  const login = async () => {
    try {
        setIsLoading(true);
        initRef.current = true;

        console.log('Initializing app...');            

        if (initDataRaw) {
            const loginResult = await shared.login(initDataRaw);
            
            if (loginResult.success) {
                setLoginData(loginResult.loginData);
                setIsLoggedIn(true);

                await getProfileData(loginResult.loginData);

                if (popup.open.isAvailable()) {
                    const promise = popup.open({
                        title: 'Success',
                        message: "Login Success",
                        buttons: [{ id: 'my-id', type: 'default', text: 'OK' }],
                    });
                    const buttonId = await promise;
                    
                    const result = await checkIn(loginResult.loginData);
                    if(result == 1) {
                        setShowCheckInAnimation(true);
                    }
                }
            } else {
                console.log('User is not logged in');
                setIsLoggedIn(false);

                if (popup.open.isAvailable()) {
                    const promise = popup.open({
                        title: 'Error',
                        message: loginResult.error,
                        buttons: [{ id: 'my-id', type: 'default', text: 'OK' }],
                    });
                    const buttonId = await promise;
                }
            }
        }
    } catch (error) {
        console.error('Initialization error:', error);
        // setIsLoggedIn(false);
    } finally {
        setIsLoading(false);
        initRef.current = false;
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
    shared.user = userData;
    setUser(userData);

    console.log("initDataRaw: ", initDataRaw);
    login();
    
  }, []);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <MainView 
          checkInData={checkInData}
          setShowCheckInAnimation={setShowCheckInAnimation}
          checkIn={checkIn}
          setShowCheckInView={setShowCheckInView}
          setShowProfileView={setShowProfileView}
          getProfileData={getProfileData}
        />;      
      case 'tasks':
        return <Tasks />;
      case 'fslid':
        return <FSLIDTest />;
      case 'frens':
        return <Frens />;
      case 'market':
        return <ScratchTest />;
      // case 'checkin':
      //   return <CheckIn onClose={() => setActiveTab('home')}/>;
      default:
        return <MainView 
          checkInData={checkInData}
          setShowCheckInAnimation={setShowCheckInAnimation}
          checkIn={checkIn}
          setShowCheckInView={setShowCheckInView}
          setShowProfileView={setShowProfileView}
          getProfileData={getProfileData}
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
      ) 
      : !isLoggedIn ? (
        <div className="login-error">
          <div>Unable to log in. Please try again.</div>
          <button className="retry-button" onClick={login}>
            Retry
          </button>
        </div>
      ) 
      : showCheckInAnimation ? (
        <div>
          <div className="app-container">
            {renderActiveView()}

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

          <button className="checkin-animation-button" onClick={() => {
            setShowCheckInAnimation(false);
            setShowCheckInView(true);
          }}>
            <div className="checkin-content">
              <img src={checkInAnimation} alt="Check In Animation" className="checkin-animation-img"/>
              <div className="checkin-text">
                <div>CHECK IN FOR</div>
                <div className="days">
                  {checkInData.streakDay} <span className="days-text">DAYS</span>
                </div>
              </div>
            </div>
          </button>
        </div>
      )
      : showCheckInView ?
      (
        <CheckIn checkInData={checkInData} onClose={() => {
          setShowCheckInView(false);
          setActiveTab('home');
        }}/>
      )
      : showProfileView ?
      (
        <Profile onClose={() => {
            setShowProfileView(false);
            setActiveTab('home');
          }}
          getProfileData={getProfileData}/>
      )
      : (
        <div className="app-container">
          {renderActiveView()}

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
            {/* <button onClick={() => setShowProfileView(true)} className={activeTab === 'fslid' ? 'active' : ''}>
              <img src={activeTab === 'fslid' ? ID_selected : ID_normal} alt="FSLID" />
            </button> */}
            <button onClick={() => setActiveTab('fslid')} className={activeTab === 'fslid' ? 'active' : ''}>
              <img src={activeTab === 'fslid' ? ID_selected : ID_normal} alt="FSLID" />
            </button>
          </nav>
        </div>
      )}

    </div>
  );
}

export default App;

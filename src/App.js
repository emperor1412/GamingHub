import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import MainView from './MainView';
import Tasks from './Tasks';
import CheckIn from './CheckIn';
import Profile from './Profile';

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
    console.log(`Checking in ........: ${now.toLocaleString()}`)
    const response = await fetch(`https://gm14.joysteps.io/api/app/checkIn?token=${loginData.token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    let retVal = 0;
    console.log('CheckIn Response:', response);
    const data = await response.json();

    try {
      console.log('CheckIn Data:', data);
      let time = new Date(data.data.lastTime);
  
      console.log(`${data.data.isCheckIn}\nCalls:${data.data.calls}\ncallTime:${now.toLocaleString()}\nlastTime: ${time.toLocaleString()}`)
      setCheckInData(data.data);

      if(data.data.isCheckIn) {
        console.log('Redirect to checkIn screen')
        retVal = 1;
        setShowCheckInAnimation(true);
      }
    }
    catch (error) {
      console.error('CheckIn error:', error);
      retVal = 2;
      if(data.code === 102001) {
        login();
      }
      else {
        const promise = popup.open({
          title: 'Error Checking-in',
          message: `Error code:${JSON.stringify(data)}`,
          buttons: [{ id: 'my-id', type: 'default', text: 'OK' }],
        });
        const buttonId = await promise;
      }
    }

    return retVal;
  };

  const getProfileData = async (loginDataParam) => {
    const dataToUse = loginDataParam || loginData;
    
    const response = await fetch(`https://gm14.joysteps.io/api/app/userData?token=${dataToUse.token}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    console.log('UserProfile Response:', response);
    const data = await response.json();

    console.log('UserProfile Data:', data);
    let userProfileData = data.data;
    try {
        shared.userProfile = userProfileData;
        setUserProfile(userProfileData);
        let profileItems = userProfileData.UserToken.map(record => ({
            icon: shared.mappingIcon[record.prop_id],
            text: shared.mappingText[record.prop_id],
            value: record.num,
            showClaim: false,
            showArrow: false
        }));

        profileItems = profileItems.concat(userProfileData.claimRecord.map(record => ({
            icon: shared.mappingIcon[record.type],
            text: shared.mappingText[record.type],
            value: record.num,
            showClaim: true,
            showArrow: true
        })));

        shared.profileItems = profileItems;
        setProfileItems(profileItems);
    }
    catch (error) {
        console.error('CheckIn error:', error);
        if (data.code === 102001) {
            // login();
        }
        else {
            const promise = popup.open({
                title: 'Error Getting Profile Data',
                message: `Error code:${JSON.stringify(data)}`,
                buttons: [{ id: 'my-id', type: 'default', text: 'OK' }],
            });
            const buttonId = await promise;
        }
    }

    return [userProfileData, profileItems];
};


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

          console.log('Login Response:', response);

          // setLoginData("");
          // setIsLoggedIn(true);
          
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
              const loginDataValue = data.data;  // Store value in local variable
              shared.loginData = loginDataValue;  // Store value in shared object

              setLoginData(loginDataValue);
              setIsLoggedIn(true);

              if (popup.open.isAvailable()) {
                const promise = popup.open({
                  title: 'Success',
                  message: "Login Success",
                  buttons: [{ id: 'my-id', type: 'default', text: 'OK' }],
                });
                const buttonId = await promise;
                checkIn(loginDataValue);  // Use local variable
                await getProfileData(loginDataValue);  // Pass login data directly
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
    shared.user = userData;
    setUser(userData);

    console.log("initDataRaw: ", initDataRaw);
    login();
    
  }, []);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <MainView 
          user={user}           
          loginData={loginData}
          checkInData={checkInData}
          setShowCheckInAnimation={setShowCheckInAnimation}
          checkIn={checkIn}
          setShowCheckInView={setShowCheckInView}
          setShowProfileView={setShowProfileView}
        />;      
      case 'tasks':
        return <Tasks />;      
      // case 'checkin':
      //   return <CheckIn onClose={() => setActiveTab('home')}/>;
      default:
        return <MainView 
          user={user} 
          loginData={loginData}
          checkInData={checkInData}
          setShowCheckInAnimation={setShowCheckInAnimation}
          checkIn={checkIn}
          setShowCheckInView={setShowCheckInView}
          setShowProfileView={setShowProfileView}
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
              <img src={checkInAnimation} alt="Check In Animation" />
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
            <button onClick={() => setShowProfileView(true)} className={activeTab === 'fslid' ? 'active' : ''}>
              <img src={activeTab === 'fslid' ? ID_selected : ID_normal} alt="FSLID" />
            </button>
          </nav>
        </div>
      )}

    </div>
  );
}

export default App;

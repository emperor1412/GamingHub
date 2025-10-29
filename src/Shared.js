import ticketIcon from './images/ticket.svg';
// import kmIcon from './images/km.svg';
import starletIcon from './images/starlet.png';
// import gmtIcon from './images/gmt.svg';
import gmtIcon from './images/GMT_1.png';
import SUT from './images/SUT.png';
import energy from './images/energy.svg';
import mooar from './images/Mooar.svg';
import streakFreeze from './images/streakFreezeIcon.png';
import stepn_go_sneaker from './images/STEPNGO_SNEAKER_BUSHWALKING_Common.png';
import stepn_go_code from './images/stepngo_code.png';
import alpha_chest from './images/Chest_Icon.png';
import step_boost from './images/Boost_Icon.png';
import bCoin from './images/bCoin_icon.png';

import avatar1 from './images/avatar_1_Dino_300px.png';
import avatar2 from './images/avatar_2_Chef_Cat_300px.png';
import avatar3 from './images/avatar_3_Bunny_300px.png';
import avatar4 from './images/avatar_4_Marty_300px.png';
import avatar5 from './images/avatar_5_Frog_Knight_300px.png';
import avatar6 from './images/avatar_6_Fox_300px.png';
import avatar7 from './images/avatar_7_Druid_300px.png';
import avatar8 from './images/avatar_8_Mooarty_300px.png';
import avatar9 from './images/avatar_9_Mog_300px.png';
import avatar10 from './images/avatar_10_Mochi_300px.png';
import avatar11 from './images/avatar_11_Miffy_300px.png';
import avatar12 from './images/avatar_12_Rogue_300px.png';
import avatar13 from './images/avatar_13_Squirrel_300px.png';
import avatar14 from './images/avatar_14_Robot_300px.png';
import avatar15 from './images/avatar_15_Pirate_Parrot_300px.png';
import avatar16 from './images/FSLGames_mysterytrophy_PFP_1.png';
import avatar17 from './images/avatar_13_Squirrel_300px.png';
import avatar18 from './images/avatar_14_Robot_300px.png';
import avatar19 from './images/avatar_15_Pirate_Parrot_300px.png';
import avatar20 from './images/Avatars/1463 FSL avatars_Cactguy.png';
import avatar21 from './images/Avatars/1463 FSL avatars_Capib.png';
import avatar22 from './images/Avatars/1463 FSL avatars_Duck Wizard.png';
import avatar23 from './images/Avatars/1463 FSL avatars_Evil Duck.png';
import avatar24 from './images/Avatars/1463 FSL avatars_Goldfishy.png';
import avatar25 from './images/Avatars/1463 FSL avatars_Hippo.png';
import avatar26 from './images/Avatars/1463 FSL avatars_PandaDJ.png';
import avatar27 from './images/Avatars/1463 FSL avatars_Pumpkin.png';
import avatar28 from './images/Avatars/1463 FSL avatars_Racoon.png';
import avatar29 from './images/Avatars/1463 FSL avatars_Skelly.png';
import avatar30 from './images/Avatars/1463 FSL avatars_Surfshark.png';
import avatar31 from './images/Avatars/1463 FSL avatars_Tree.png';
import { popup } from '@telegram-apps/sdk';
import { type } from '@testing-library/user-event/dist/type';
import FSLAuthorization from 'fsl-authorization';

import single_star from './images/single_star.svg';
import single_star_2 from './images/single_star_2.svg';
import single_star_3 from './images/single_star_3.svg';
import single_star_4 from './images/single_star_4.svg';
import single_star_5 from './images/single_star_5.svg';

const { Connection, PublicKey } = require('@solana/web3.js');
const { Web3 } = require('web3');
const tokenABI = [
    {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{"name": "", "type": "uint8"}],
        "type": "function"
    }
];

const shared = {
    server_url: 'https://gamehub.fsl.com',
    app_link: 'https://t.me/FSLGameHub_Bot/fslgamehub',
    game_link: 'https://t.me/FSLGameHub_Bot/Tadokami',
    host_environment: 'production',
    initialMarketTab: 'telegram', // Default tab for Market component
    
    // Premium membership status - shared across all components
    isPremiumMember: false,
    setIsPremiumMember: null, // Will be set by MainView component
    shouldOpenPremiumOnHome: false, // Flag to auto-open Premium when returning to home
    
    avatars : [
        { id: 0, src: avatar1 },
        { id: 1, src: avatar2 },
        { id: 2, src: avatar3 },
        { id: 3, src: avatar4 },
        { id: 4, src: avatar5 },
        { id: 5, src: avatar6 },
        { id: 6, src: avatar7 },
        { id: 7, src: avatar8 },
        { id: 8, src: avatar9 },
        { id: 9, src: avatar10 },
        { id: 10, src: avatar11 },
        { id: 11, src: avatar12 },
        { id: 12, src: avatar16 },
        { id: 13, src: avatar17 },
        { id: 14, src: avatar18 },
        { id: 15, src: avatar19 },
        { id: 16, src: avatar20 },
        { id: 17, src: avatar21 },
        { id: 18, src: avatar22 },
        { id: 19, src: avatar23 },
        { id: 20, src: avatar24 },
        { id: 21, src: avatar25 },
        { id: 22, src: avatar26 },
        { id: 23, src: avatar27 },
        { id: 24, src: avatar28 },
        { id: 25, src: avatar29 },
        { id: 26, src: avatar30 },
        { id: 27, src: avatar31 },
    ],

    mappingIcon : {
        10010: ticketIcon,
        10020: starletIcon,
        10030: bCoin,
        10110: streakFreeze,
        10120: step_boost,
        10121: step_boost,
        20010: SUT,
        20020: gmtIcon,
        30010: stepn_go_code,
        30020: mooar,
        40010: stepn_go_sneaker,
        50010: alpha_chest,
    },
    mappingText : {
        10010: 'Tickets',
        10020: 'Starlets',
        10030: 'B$',
        10110: 'Streak Freeze',
        10120: '1.5X BOOST STEPS',
        10121: '2X BOOST STEPS',
        20010: 'SUT',
        20020: 'GMT',
        30010: 'StepN GO code',
        30020: 'MOOAR+ Membership',
        40010: 'StepN GO Shoe',
        50010: 'Alpha Chest'
    },
    
    // Function to set initial market tab
    setInitialMarketTab: function(tab) {
        this.initialMarketTab = tab;
    },
    
    // Function to set initial market category for auto scroll
    // Usage examples:
    // shared.setInitialMarketCategory('premium-membership'); // Scroll to Premium Membership
    // shared.setInitialMarketCategory('freeze-streak'); // Scroll to Freeze Streak
    // shared.setInitialMarketCategory('merch-coupon'); // Scroll to Merch Coupon
    // shared.setInitialMarketCategory('step-boosts'); // Scroll to Step Boosts
    // shared.setInitialMarketCategory('telegram-0'); // Scroll to Standard Pack
    // shared.setInitialMarketCategory('telegram-10'); // Scroll to Limited Weekly Offer
    // shared.setInitialMarketCategory('telegram-20'); // Scroll to Limited Monthly Offer
    // shared.setInitialMarketCategory('telegram-30'); // Scroll to Exclusive One-Time Offer
    setInitialMarketCategory: function(category) {
        this.initialMarketCategory = category;
    },
    
    profileItems : [],
    userProfile : null,
    loginData : null,
    inviteCode: 0,
    initData : null,
    telegramUserData : null,
    fsl_binding_code : null,
    GMT: 0,
    GMT_Solana: 0,
    GMT_Polygon: 0,
    getGMT: false,
    
    // Session-based total flips counter for FlippingStars game
    totalFlips: 0,
    
    // Session-based sound settings
    isSoundEnabled: true,
    soundVolume: 0.7,
    
    // Local testing flags for jackpot simulation
    isJackpot: false,
    isAllinJackpot: false,

    // Add these to the shared object
    starImages: {
        star1: single_star,
        star2: single_star_2,
        star3: single_star_3,
        star4: single_star_4,
        star5: single_star_5
    },

    // Add setView function
    setView: null, // This will be set by the main App component

    // Add setActiveTab function
    setActiveTab: null, // This will be set by the App component

    login: async (initDataRaw) => {
        try {
            let params = JSON.stringify({
                link: `${shared.inviteCode}`,
                initData: initDataRaw
            });
            console.log('Login params:', params);

            const response = await fetch(`${shared.server_url}/api/app/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: params
            });

            console.log('Login Response:', response);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Login data:', data);

/*
data object
{
    "link": 21201,
    "token": "6z4J61p7506409405540464606_9432124300",
    "inviter": 0
}
*/
                
                if (data.code === 0) {
                    const loginDataValue = data.data;
                    shared.loginData = loginDataValue;
                    return {
                        success: true,
                        loginData: loginDataValue,
                        data: data
                    };
                } else {

                    if (data.code === 102003) {
                        const promise = popup.open({
                            title: 'Login Fail',
                            message: "Login failed",
                            buttons: [{ id: 'my-id', type: 'default', text: 'OK' }],
                        });
                        const buttonId = await promise;
                    }

                    return {
                        success: false,
                        error: data.msg,
                        data: data
                    };
                }
            } else {
                return {
                    success: false,
                    error: 'Login failed',
                    data: null
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error.message,
                data: null
            };
        }
    },

    checkIn: async (loginData) => {
        try {
            const response = await fetch(`${shared.server_url}/api/app/checkIn?token=${loginData.token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();
            console.log('CheckIn Response:', data);

            if (data.code === 0) {
                return {
                    success: true,
                    data: data.data,
                    isCheckIn: data.data.isCheckIn
                };
            } else if (data.code === 102001 || data.code === 102002) {
                return {
                    success: false,
                    error: 'Token expired',
                    needRelogin: true,
                    data: data
                };
            } else {
                return {
                    success: false,
                    error: data.msg || 'Check-in failed',
                    data: data
                };
            }
        } catch (error) {
            console.error('CheckIn error:', error);
            return {
                success: false,
                error: error.message,
                data: null
            };
        }
    },

    getProfileData: async (loginData) => {
        console.log('getProfileData called with loginData:', loginData);
        try {
            const url = `${shared.server_url}/api/app/userData?token=${loginData.token}`;
            console.log('Fetching from URL:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();
            console.log('UserProfile Response:', data);

            if (data.code === 0) {
                const userProfileData = data.data;
                shared.userProfile = userProfileData;

                const canShowClaim = [ 20010, 20020, 30020 ];

                const profileItems = [
                    ...userProfileData.UserToken.map(record => ({
                        icon: shared.mappingIcon[record.prop_id],
                        text: shared.mappingText[record.prop_id],
                        value: record.num,
                        showClaim: canShowClaim.includes(record.prop_id) && record.num > 0,
                        // showArrow: canShowClaim.includes(record.prop_id) && record.num > 0,
                        claimText: 'Claim',
                        clickAble: canShowClaim.includes(record.prop_id) && record.num > 0,
                        record: record,
                        type: record.prop_id
                    })),
                    ...userProfileData.claimRecord
                        .filter(record => record !== null)
                        .map(record => ({
                            icon: shared.mappingIcon[record.type],
                            text: shared.mappingText[record.type],
                            value: record.num,
                            showClaim: canShowClaim.includes(record.type),
                            // showArrow: canShowClaim.includes(record.type) && record.state === 0,
                            claimText: record.state === 0 ? 'Claim' : record.state === 1 ? 'Claiming' : 'Claimed',
                            clickAble: record.state === 0,
                            record: record,
                            type: record.type
                        }))
                ];

                shared.profileItems = profileItems;

                if (shared.userProfile && shared.userProfile.fslId && !shared.getGMT) {
                    shared.getGMT = true;
                    shared.getGMTBalance();
                }

                return {
                    success: true,
                    userProfile: userProfileData,
                    profileItems: profileItems,
                    data: data
                };
            } else if (data.code === 102001 || data.code === 102002) {
                return {
                    success: false,
                    error: 'Token expired',
                    needRelogin: true,
                    data: data
                };
            } else {
                return {
                    success: false,
                    error: data.msg || 'Failed to get profile data',
                    data: data
                };
            }
        } catch (error) {
            console.error('GetProfileData error:', error);
            return {
                success: false,
                error: error.message,
                data: null
            };
        }
    },

    getGMTBalance : async () => {
        if (shared.userProfile && shared.userProfile.fslId) {

            const balanceSolana = await shared.getSolanaGMTBalance(shared.userProfile.solAddr);
            shared.GMT_Solana = balanceSolana;

            const balancePolygon = await shared.getPolygonGMTBalance(shared.userProfile.evmAddr);
            shared.GMT_Polygon = balancePolygon;

            shared.GMT = shared.GMT_Solana + shared.GMT_Polygon;
        }
    },

    getProfileWithRetry: async (depth = 0) => {
        console.log(`getProfileWithRetry called with depth: ${depth}`);
        console.log('shared.loginData in getProfileWithRetry:', shared.loginData);
        
        if (depth > 3) {
            console.error('Get profile data failed after 3 attempts');
            return {
                success: false,
                error: 'Failed after 3 attempts'
            };
        }

        console.log('Calling getProfileData...');
        const profileResult = await shared.getProfileData(shared.loginData);
        console.log('getProfileData result:', profileResult);
        
        if (!profileResult.success) {
            if (profileResult.needRelogin) {
                console.log('Token expired while getting profile, attempting to re-login');
                const loginResult = await shared.login(shared.initData);
                if (loginResult.success) {
                    return shared.getProfileWithRetry(depth + 1);
                } else {
                    console.error('Re-login failed while getting profile:', loginResult.error);
                    return {
                        success: false,
                        error: loginResult.error
                    };
                }
            } else {
                console.error('Failed to get updated profile data:', profileResult.error);
                return profileResult;
            }
        }
        console.log('getProfileWithRetry returning success result');
        return profileResult;
    },

    signinFSL : async () => {
        const randKeyApi = shared.server_url + `/api/app/randKey?token=${shared.loginData.token}`;
        console.log('RandKey API:', randKeyApi);

        fetch(randKeyApi, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => response.json()).then(async data => {
            console.log('RandKey Response:', data);

            if (data.code === 102001 || data.code === 102002) {
                console.log('Token expired, re-login');
                const loginResult = await shared.login(shared.initData);
                if (loginResult.success) {
                    console.log('Login success, fetch key again');
                    shared.signinFSL();
                }
                else {
                    console.error('Login failed:', loginResult.error);
                    // show popup 
                    // if (loginResult.error) {
                        const promise = popup.open({
                            title: 'bind FSL Fail',
                            message: loginResult.error,
                            buttons: [{ id: 'my-id', type: 'default', text: 'OK' }],
                        });
                        // const buttonId = await promise;
                    // }
                }
                return;
            }
            

            const state = data.data;
            // return;
            const REDIRECT_URL = shared.server_url + '/api/app/fslCallback';

            console.log('State:', state, '\nRedirect URL:', REDIRECT_URL);

            const fslAuthorization = FSLAuthorization.init({
                responseType: 'code', // 'code' or 'token'
                appKey: 'MiniGame',
                redirectUri: REDIRECT_URL, // https://xxx.xxx.com
                scope: 'basic', // Grant Scope
                state: state,
                usePopup: true, // Popup a window instead of jump to
                isApp: true,
                domain: 'https://9ijsflpfgm3.joysteps.io/'
            });

            fslAuthorization.signInV2();

        });
    },

    getStarlets : () => {
        const retVal = shared.userProfile.UserToken.find(item => item.prop_id === 10020);
        return retVal?.num || 0;
    },

    getTicket : () => {
        const retVal = shared.userProfile.UserToken.find(item => item.prop_id === 10010);
        return retVal?.num || 0;
    },

    getBcoin : () => {
        const retVal = shared.userProfile.UserToken.find(item => item.prop_id === 10030);
        return retVal?.num || 0;
    },

    // Functions to manage total flips counter
    getTotalFlips : () => {
        return shared.totalFlips;
    },

    incrementTotalFlips : () => {
        shared.totalFlips += 1;
        console.log('Total flips incremented to:', shared.totalFlips);
        return shared.totalFlips;
    },

    resetTotalFlips : () => {
        shared.totalFlips = 0;
        console.log('Total flips reset to 0');
    },

    // Functions to manage sound settings
    getSoundEnabled : () => {
        return shared.isSoundEnabled;
    },

    setSoundEnabled : (enabled) => {
        shared.isSoundEnabled = enabled;
        console.log('Sound enabled set to:', enabled);
    },

    getSoundVolume : () => {
        return shared.soundVolume;
    },

    setSoundVolume : (volume) => {
        shared.soundVolume = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
        console.log('Sound volume set to:', shared.soundVolume);
    },

    // Jackpot testing functions
    getIsJackpot : () => {
        return shared.isJackpot;
    },

    setIsJackpot : (value) => {
        shared.isJackpot = Boolean(value);
        console.log('Jackpot test flag set to:', shared.isJackpot);
    },

    getIsAllinJackpot : () => {
        return shared.isAllinJackpot;
    },

    setIsAllinJackpot : (value) => {
        shared.isAllinJackpot = Boolean(value);
        console.log('All-in jackpot test flag set to:', shared.isAllinJackpot);
    },

    getSolanaGMTBalance : async (walletAddress) => {
        console.log('Get Solana GMT balance for wallet:', walletAddress);

        // Check if wallet address is valid
        if (!walletAddress) {
            console.log('No wallet address provided');
            return 0;
        }

        // GMT token mint address on Solana
        const GMT_MINT = new PublicKey('7i5KKsX2weiTkry7jA4ZwSuXGhs5eJBEjY8vVxR4pfRx');
        
        try {
            // Initialize connection with commitment
            const connection = new Connection('https://lb2.stepn.com/', 'confirmed');
            const wallet = new PublicKey(walletAddress);

            // Get token accounts by owner
            const accounts = await connection.getParsedTokenAccountsByOwner(
                wallet,
                { mint: GMT_MINT }
            );

            console.log('GMT accounts Solana:', accounts);

            if (accounts.value.length > 0) {
                // Get the first account's balance
                const balance = accounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
                console.log('GMT balance Solana:', balance);
                return balance;
            }
            return 0;
        } catch (error) {
            console.error('Error getting Solana GMT balance:', error);
            return 0;
        }
    },

    getPolygonGMTBalance : async (walletAddress) => {
        console.log('Get Polygon GMT balance for wallet:', walletAddress);

        if (!walletAddress) {
            console.log('No wallet address provided');
            return 0;
        }

        const GMT_CONTRACT = '0x714DB550b574b3E927af3D93E26127D15721D4C2';
        
        try {
            const web3 = new Web3('https://lb5.stepn.com/');
            const contract = new web3.eth.Contract(tokenABI, GMT_CONTRACT);

            try {
                // First get the token decimals
                const decimals = await contract.methods.decimals().call();
                console.log('GMT token decimals:', decimals);

                const balance = await Promise.race([
                    contract.methods.balanceOf(walletAddress).call(),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Timeout')), 10000)
                    )
                ]);

                console.log('GMT balance Polygon (raw):', balance);
                
                if (balance !== undefined) {
                    // Convert BigInt values to strings before calculation
                    const balanceNum = Number(balance.toString());
                    const decimalsNum = Number(decimals.toString());
                    const formattedBalance = balanceNum / Math.pow(10, decimalsNum);
                    console.log('GMT balance Polygon (formatted):', formattedBalance);
                    return formattedBalance;
                }
                return 0;
            } catch (error) {
                console.error('Error getting Polygon GMT balance:', error);
                return 0;
            }
        } catch (error) {
            console.error('Error initializing Web3:', error);
            return 0;
        }
    },

    // type: 0 - error, 1 - notice
    showPopup: async ({ type = 0, message = '', title = type === 0 ? 'Error' : 'Notice' }) => {
        if (popup.open.isAvailable()) {
            const promise = popup.open({
                title: title,
                message: message,
                buttons: [{ id: 'my-id', type: 'default', text: 'OK' }],
            });
            await promise;
        }
    },

    // New function to handle share story task completion (type = 5)
    completeShareStoryTask: async (shareType, depth = 0) => {
        if (depth > 3) {
            console.error('Complete share story task failed after 3 attempts');
            return false;
        }

        try {
            // First, get the task list to find available type = 5 tasks
            const response = await fetch(`${shared.server_url}/api/app/taskList?token=${shared.loginData.token}`);
            
            if (response.ok) {
                const data = await response.json();
                
                if (data.code === 0) {
                    // Find available type = 5 tasks that are not completed
                    const availableShareTasks = data.data.filter(task => 
                        task.type === 5 && 
                        task.state === 0 && 
                        task.endTime > Date.now()
                    );

                    if (availableShareTasks.length > 0) {
                        // Complete the first available share task
                        const taskToComplete = availableShareTasks[0];
                        console.log('Completing share story task:', taskToComplete.id);
                        
                        const completeResponse = await fetch(
                            `${shared.server_url}/api/app/taskComplete?token=${shared.loginData.token}&id=${taskToComplete.id}&answerIndex=0`, 
                            {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }
                        );

                        if (completeResponse.ok) {
                            const completeData = await completeResponse.json();
                            
                            if (completeData.code === 0) {
                                console.log('Share story task completed successfully');
                                // Refresh user profile to get updated rewards
                                await shared.getProfileWithRetry();
                                return true;
                            } else if (completeData.code === 102001 || completeData.code === 102002) {
                                console.log('Token expired, attempting to re-login');
                                const result = await shared.login(shared.initData);
                                if (result.success) {
                                    return shared.completeShareStoryTask(shareType, depth + 1);
                                }
                            } else {
                                console.error('Complete share story task failed:', completeData);
                            }
                        }
                    } else {
                        console.log('No available share story tasks found');
                    }
                } else if (data.code === 102001 || data.code === 102002) {
                    console.log('Token expired, attempting to re-login');
                    const result = await shared.login(shared.initData);
                    if (result.success) {
                        return shared.completeShareStoryTask(shareType, depth + 1);
                    }
                } else {
                    console.error('Get task list failed:', data);
                }
            } else {
                console.error('Get task list request failed:', response);
            }
        } catch (error) {
            console.error('Error completing share story task:', error);
        }
        
        return false;
    },

    // API function to get challenges for badge view
    getChallengesBadgeView: async (depth = 0) => {
        if (depth > 3) {
            console.error('getChallengesBadgeView failed after 3 attempts');
            return {
                success: false,
                error: 'Failed after 3 attempts'
            };
        }

        try {
            console.log('Fetching challenges badge view...');
            
            const response = await fetch(`${shared.server_url}/api/app/challengesBadgeView?token=${shared.loginData.token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('getChallengesBadgeView Response:', response);
            
            if (response.ok) {
                const data = await response.json();
                console.log('getChallengesBadgeView Data:', data);
                
                if (data.code === 0) {
                    console.log('getChallengesBadgeView: success');
                    return {
                        success: true,
                        data: data.data
                    };
                }
                else if (data.code === 102001 || data.code === 102002) {
                    console.log('getChallengesBadgeView: login again');
                    const result = await shared.login(shared.initData);
                    if (result) {
                        return await shared.getChallengesBadgeView(depth + 1);
                    }
                }
                else {
                    console.log('getChallengesBadgeView error:', data);
                    return {
                        success: false,
                        error: data.msg || 'Unknown error'
                    };
                }
            }
            else {
                console.log('getChallengesBadgeView Response not ok:', response);
                return {
                    success: false,
                    error: 'Network error'
                };
            }
        }
        catch (e) {
            console.error('getChallengesBadgeView error:', e);
            return {
                success: false,
                error: e.message || 'Network error'
            };
        }
    },

    // API function to get challenge detail
    getChallengeDetail: async (challengeId, depth = 0) => {
        if (depth > 3) {
            console.error('getChallengeDetail failed after 3 attempts');
            return {
                success: false,
                error: 'Failed after 3 attempts'
            };
        }

        try {
            console.log('Fetching challenge detail for ID:', challengeId);
            
            const response = await fetch(`${shared.server_url}/api/app/challengeDetail?token=${shared.loginData.token}&challengeId=${challengeId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('getChallengeDetail Response:', response);
            
            if (response.ok) {
                const data = await response.json();
                console.log('getChallengeDetail Data:', data);
                
                if (data.code === 0) {
                    console.log('getChallengeDetail: success');
                    return {
                        success: true,
                        data: data.data
                    };
                }
                else if (data.code === 102001 || data.code === 102002) {
                    console.log('getChallengeDetail: login again');
                    const result = await shared.login(shared.initData);
                    if (result) {
                        return await shared.getChallengeDetail(challengeId, depth + 1);
                    }
                }
                else {
                    console.log('getChallengeDetail error:', data);
                    return {
                        success: false,
                        error: data.msg || 'Unknown error'
                    };
                }
            }
            else {
                console.log('getChallengeDetail Response not ok:', response);
                return {
                    success: false,
                    error: 'Network error'
                };
            }
        }
        catch (e) {
            console.error('getChallengeDetail error:', e);
            return {
                success: false,
                error: e.message || 'Network error'
            };
        }
    },

    // API function to join challenge
    joinChallenge: async (challengeId, depth = 0) => {
        if (depth > 3) {
            console.error('joinChallenge failed after 3 attempts');
            return {
                success: false,
                error: 'Failed after 3 attempts'
            };
        }

        try {
            console.log('Joining challenge with ID:', challengeId);
            
            const response = await fetch(`${shared.server_url}/api/app/joinChallenge?token=${shared.loginData.token}&challengeId=${challengeId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('joinChallenge Response:', response);
            
            if (response.ok) {
                const data = await response.json();
                console.log('joinChallenge Data:', data);
                
                if (data.code === 0) {
                    console.log('joinChallenge: success');
                    return {
                        success: true,
                        data: data
                    };
                }
                else if (data.code === 102001 || data.code === 102002) {
                    console.log('joinChallenge: login again');
                    const result = await shared.login(shared.initData);
                    if (result) {
                        return await shared.joinChallenge(challengeId, depth + 1);
                    }
                }
                else if (data.code === 210001) {
                    console.log('joinChallenge: not enough starlets');
                    return {
                        success: false,
                        error: 'not_enough_starlets',
                        message: data.msg || 'Not enough starlets'
                    };
                }
                else {
                    console.log('joinChallenge error:', data);
                    return {
                        success: false,
                        error: data.msg || 'Unknown error'
                    };
                }
            }
            else {
                console.log('joinChallenge Response not ok:', response);
                return {
                    success: false,
                    error: 'Network error'
                };
            }
        }
        catch (e) {
            console.error('joinChallenge error:', e);
            return {
                success: false,
                error: e.message || 'Network error'
            };
        }
    },

    // API function to complete challenge
    completeChallenge: async (challengeId, depth = 0) => {
        if (depth > 3) {
            console.error('completeChallenge failed after 3 attempts');
            return {
                success: false,
                error: 'Failed after 3 attempts'
            };
        }

        try {
            console.log('Completing challenge with ID:', challengeId);
            
            const response = await fetch(`${shared.server_url}/api/app/completeChallenge?token=${shared.loginData.token}&challengeId=${challengeId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('completeChallenge Response:', response);
            
            if (response.ok) {
                const data = await response.json();
                console.log('completeChallenge Data:', data);
                
                if (data.code === 0) {
                    console.log('completeChallenge: success');
                    return {
                        success: true,
                        data: data.data // This will be the starlets reward amount
                    };
                }
                else if (data.code === 102001 || data.code === 102002) {
                    console.log('completeChallenge: login again');
                    const result = await shared.login(shared.initData);
                    if (result) {
                        return await shared.completeChallenge(challengeId, depth + 1);
                    }
                }
                else {
                    console.log('completeChallenge error:', data);
                    return {
                        success: false,
                        error: data.msg || 'Unknown error'
                    };
                }
            }
            else {
                console.log('completeChallenge Response not ok:', response);
                return {
                    success: false,
                    error: 'Network error'
                };
            }
        }
        catch (e) {
            console.error('completeChallenge error:', e);
            return {
                success: false,
                error: e.message || 'Network error'
            };
        }
    },

    // New function to handle coin flip game
    flipCoin: async (isHeads, betAmount, allin = false, depth = 0) => {
        if (depth > 3) {
            console.error('Flip coin failed after 3 attempts');
            return {
                success: false,
                error: 'Failed after 3 attempts'
            };
        }

        try {
            console.log('Flip coin params:', { head: isHeads, amount: betAmount, allin: allin });

            // Thêm timeout 10 giây
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 giây

            // PlayFlip api real
            const response = await fetch(`${shared.server_url}/api/app/playFlip?token=${shared.loginData.token}&head=${isHeads}&amount=${betAmount}&allin=${allin}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: controller.signal // Thêm signal để có thể abort
            });

            // TestPlayFlip api fake
            // const response = await fetch(`${shared.server_url}/api/app/testPlayFlip?token=${shared.loginData.token}&head=${isHeads}&amount=${betAmount}&allin=${allin}&isJackpot=true&isAllinJackpot=false`, {
            //     method: 'GET',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     signal: controller.signal // Thêm signal để có thể abort
            // });

            
            clearTimeout(timeoutId); // Clear timeout nếu thành công

            console.log('Flip coin Response:', response);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Flip coin data:', data);

                if (data.code === 0) {
                    await shared.getProfileWithRetry();
                    
                    return {
                        success: true,
                        data: data.data,
                        isWin: data.data.success || data.data.isJackpot || data.data.isAllinJackpot,
                        reward: data.data.isJackpot ? data.data.jackpotNum : data.data.reward
                    };
                } else if (data.code === 102001 || data.code === 102002) {
                    console.log('Token expired, attempting to re-login');
                    const result = await shared.login(shared.initData);
                    if (result.success) {
                        return shared.flipCoin(isHeads, betAmount, allin, depth + 1);
                    } else {
                        return {
                            success: false,
                            error: 'Token expired and re-login failed',
                            data: data
                        };
                    }
                } else {
                    return {
                        success: false,
                        error: data.msg || 'Flip coin failed',
                        data: data
                    };
                }
            } else {
                return {
                    success: false,
                    error: 'Flip coin request failed',
                    data: null
                };
            }
        } catch (error) {
            // Xử lý timeout error
            if (error.name === 'AbortError') {
                return {
                    success: false,
                    error: 'Request timeout - server took too long to respond (10s)',
                    data: null
                };
            }
            
            console.error('Flip coin error:', error);
            return {
                success: false,
                error: error.message,
                data: null
            };
        }
    },

    // New function to handle step boost activation
    useStepBoost: async (boostType, depth = 0) => {
        if (depth > 3) {
            console.error('Use step boost failed after 3 attempts');
            return {
                success: false,
                error: 'Failed after 3 attempts'
            };
        }

        try {
            // Map boost type to propType
            const propTypeMapping = {
                '1.5x': 10120,
                '2x': 10121
            };

            const propType = propTypeMapping[boostType];
            if (!propType) {
                return {
                    success: false,
                    error: 'Invalid boost type'
                };
            }

            console.log('Use step boost params:', { boostType, propType });

            // Add timeout to prevent hanging requests
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const response = await fetch(`${shared.server_url}/api/app/useStepBoost?token=${shared.loginData.token}&propType=${propType}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId); // Clear timeout if successful

            console.log('Use step boost Response:', response);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Use step boost data:', data);

                if (data.code === 0) {
                    // Refresh user profile to get updated data - use a separate call to avoid recursion
                    try {
                        await shared.getProfileWithRetry();
                    } catch (profileError) {
                        console.warn('Failed to refresh profile after step boost activation:', profileError);
                        // Don't fail the entire operation if profile refresh fails
                    }
                    
                    return {
                        success: true,
                        data: data.data,
                        boostType: boostType,
                        propType: propType
                    };
                } else if (data.code === 102001 || data.code === 102002) {
                    console.log('Token expired, attempting to re-login');
                    const result = await shared.login(shared.initData);
                    if (result.success) {
                        return shared.useStepBoost(boostType, depth + 1);
                    } else {
                        return {
                            success: false,
                            error: 'Token expired and re-login failed',
                            data: data
                        };
                    }
                } else {
                    return {
                        success: false,
                        error: data.msg || 'Use step boost failed',
                        data: data
                    };
                }
            } else {
                return {
                    success: false,
                    error: 'Use step boost request failed',
                    data: null
                };
            }
        } catch (error) {
            // Handle timeout error specifically
            if (error.name === 'AbortError') {
                console.error('Use step boost timeout');
                return {
                    success: false,
                    error: 'Request timeout - server took too long to respond',
                    data: null
                };
            }
            
            console.error('Use step boost error:', error);
            return {
                success: false,
                error: error.message,
                data: null
            };
        }
    },

    // API function to get badges earned (all challenges in Badge Collection view)
    getBadgesEarned: async (depth = 0) => {
        if (depth > 3) {
            console.error('getBadgesEarned failed after 3 attempts');
            return {
                success: false,
                error: 'Failed after 3 attempts'
            };
        }

        try {
            console.log('Fetching badges earned...');
            
            const response = await fetch(`${shared.server_url}/api/app/badgesEarned?token=${shared.loginData.token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('getBadgesEarned Response:', response);
            
            if (response.ok) {
                const data = await response.json();
                console.log('getBadgesEarned Data:', data);
                
                if (data.code === 0) {
                    console.log('getBadgesEarned: success');
                    return {
                        success: true,
                        data: data.data
                    };
                }
                else if (data.code === 102001 || data.code === 102002) {
                    console.log('getBadgesEarned: login again');
                    const result = await shared.login(shared.initData);
                    if (result.success) {
                        return await shared.getBadgesEarned(depth + 1);
                    }
                }
                else {
                    console.log('getBadgesEarned error:', data);
                    return {
                        success: false,
                        error: data.msg || 'Unknown error'
                    };
                }
            }
            else {
                console.log('getBadgesEarned Response not ok:', response);
                return {
                    success: false,
                    error: 'Network error'
                };
            }
        }
        catch (e) {
            console.error('getBadgesEarned error:', e);
            return {
                success: false,
                error: e.message || 'Network error'
            };
        }
    },

    // API function to get challenge earned data (starlets and badges earned)
    getChallengeEarned: async (depth = 0) => {
        if (depth > 3) {
            console.error('getChallengeEarned failed after 3 attempts');
            return {
                success: false,
                error: 'Failed after 3 attempts'
            };
        }

        try {
            console.log('Fetching challenge earned data...');
            
            const response = await fetch(`${shared.server_url}/api/app/challengeEarned?token=${shared.loginData.token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('getChallengeEarned Response:', response);
            
            if (response.ok) {
                const data = await response.json();
                console.log('getChallengeEarned Data:', data);
                
                if (data.code === 0) {
                    console.log('getChallengeEarned: success');
                    return {
                        success: true,
                        data: data.data
                    };
                }
                else if (data.code === 102001 || data.code === 102002) {
                    console.log('getChallengeEarned: login again');
                    const result = await shared.login(shared.initData);
                    if (result.success) {
                        return await shared.getChallengeEarned(depth + 1);
                    }
                }
                else {
                    console.log('getChallengeEarned error:', data);
                    return {
                        success: false,
                        error: data.msg || 'Unknown error'
                    };
                }
            }
            else {
                console.log('getChallengeEarned Response not ok:', response);
                return {
                    success: false,
                    error: 'Network error'
                };
            }
        }
        catch (e) {
            console.error('getChallengeEarned error:', e);
            return {
                success: false,
                error: e.message || 'Network error'
            };
        }
    },

    // Auto-adjust avatar if it's premium but user doesn't have premium membership
    autoAdjustAvatar: async (getProfileData) => {
        if (!shared.userProfile || !shared.loginData?.token) {
            return { success: false, error: 'No user profile or login data' };
        }

        // Check if current avatar is premium (13-27) but user doesn't have premium membership
        if (shared.userProfile.pictureIndex >= 13 && shared.userProfile.pictureIndex <= 27 && !shared.isPremiumMember) {
            console.log(`Avatar ${shared.userProfile.pictureIndex} is premium but user doesn't have premium membership`);
            
            // Find the lowest available avatar index
            let minAvailableIndex = 0;
            
            // Always use avatar 0 (the smallest/basic avatar)
            minAvailableIndex = 0;
            
            // Set to the lowest available avatar and auto-save
            if (minAvailableIndex >= 0) {
                console.log(`Auto-adjusting avatar from ${shared.userProfile.pictureIndex} to ${minAvailableIndex}`);
                
                try {
                    // Auto-save the avatar change
                    const response = await fetch(`${shared.server_url}/api/app/changePicture?token=${shared.loginData.token}&index=${minAvailableIndex}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    
                    const data = await response.json();
                    console.log('Auto-save avatar response:', data);
                    
                    if (data.code === 0) {
                        // Refresh profile data to get updated pictureIndex
                        if (getProfileData) {
                            await getProfileData();
                        } else {
                            await shared.getProfileWithRetry();
                        }
                        console.log('Avatar auto-saved successfully');
                        
                        return {
                            success: true,
                            adjustedFrom: shared.userProfile.pictureIndex,
                            adjustedTo: minAvailableIndex,
                            message: `Avatar auto-adjusted from ${shared.userProfile.pictureIndex} to ${minAvailableIndex}`
                        };
                    } else {
                        console.error('Failed to auto-save avatar:', data);
                        return {
                            success: false,
                            error: data.msg || 'Failed to auto-save avatar',
                            data: data
                        };
                    }
                } catch (error) {
                    console.error('Error auto-saving avatar:', error);
                    return {
                        success: false,
                        error: error.message
                    };
                }
            }
        }
        
        return { success: false, message: 'No adjustment needed' };
    }

};

export default shared;
import ticketIcon from './images/ticket.svg';
// import kmIcon from './images/km.svg';
import starletIcon from './images/starlet.png';
// import gmtIcon from './images/gmt.svg';
import gmtIcon from './images/GMT_1.png';
import SUT from './images/SUT.png';
import energy from './images/energy.svg';
import mooar from './images/Mooar.svg';
import stepn_go_sneaker from './images/STEPNGO_SNEAKER_BUSHWALKING_Common.png';
import stepn_go_code from './images/stepngo_code.png';
import alpha_chest from './images/Chest_Icon.png';
import { shareStory } from '@telegram-apps/sdk';
import { trackStoryShare } from './analytics';
import { t } from './utils/localization';

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
import { popup } from '@telegram-apps/sdk';
import { type } from '@testing-library/user-event/dist/type';
import FSLAuthorization from 'fsl-authorization';
import liff from '@line/liff';

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
    server_url: 'https://gm14.joysteps.io',
    app_link: 'https://miniapp.line.me/2007739332-39PNxppa',
    game_link: 'https://miniapp.line.me/2007739328-AXQNennQ',
    host_environment: 'test',
    
    // LINE LIFF Configuration
    liff: {
        liffId: '2007739332-39PNxppa',
        inspectorOrigin: 'wss://f39acd71cac5.ngrok-free.app',
        withLoginOnExternalBrowser: true
    },
    
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
    ],

    mappingIcon : {
        10010: ticketIcon,
        10020: starletIcon,
        10030: energy,
        20010: SUT,
        20020: gmtIcon,
        30010: stepn_go_code,
        30020: mooar,
        40010: stepn_go_sneaker,
        50010: alpha_chest
    },
    getMappingText: (type) => {
        const mapping = {
            10010: t('TICKETS_TEXT'),
            10020: t('STARLETS_TEXT'),
            10030: t('ENERGY_TEXT'),
            20010: t('SUT_TEXT'),
            20020: t('GMT_TEXT'),
            30010: t('STEPN_GO_CODE_TEXT'),
            30020: t('MOOAR_MEMBERSHIP_TEXT'),
            40010: t('STEPN_GO_SHOE_TEXT'),
            50010: t('ALPHA_CHEST_TEXT')
        };
        return mapping[type] || 'Unknown';
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

    taskId: null,
    treasureHuntId: null,
    treasureHuntAppId: null,

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
                idToken: initDataRaw
            });
            console.log('Login params:', params);

            const response = await fetch(`${shared.server_url}/api/app/lineLogin`, {
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
                        alert('Login Fail\n\nLogin failed');
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
                        text: shared.getMappingText(record.prop_id),
                        value: record.num,
                        showClaim: canShowClaim.includes(record.prop_id) && record.num > 0,
                        // showArrow: canShowClaim.includes(record.prop_id) && record.num > 0,
                        claimText: t('CLAIM'),
                        clickAble: canShowClaim.includes(record.prop_id) && record.num > 0,
                        record: record,
                        type: record.prop_id
                    })),
                    ...userProfileData.claimRecord
                        .filter(record => record !== null)
                        .map(record => ({
                            icon: shared.mappingIcon[record.type],
                            text: shared.getMappingText(record.type),
                            value: record.num,
                            showClaim: canShowClaim.includes(record.type),
                            // showArrow: canShowClaim.includes(record.type) && record.state === 0,
                            claimText: record.state === 0 ? t('CLAIM') : record.state === 1 ? t('CLAIMING') : t('CLAIMED'),
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

        try {
            const response = await fetch(randKeyApi, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            console.log('RandKey Response:', data);

            if (data.code === 102001 || data.code === 102002) {
                console.log('Token expired, re-login');
                const loginResult = await shared.login(shared.initData);
                if (loginResult.success) {
                    console.log('Login success, fetch key again');
                    return shared.signinFSL();
                }
                else {
                    console.error('Login failed:', loginResult.error);
                    alert('bind FSL Fail\n\n' + loginResult.error);
                }
                return;
            }
            
            const state = data.data;
            const REDIRECT_URL = shared.server_url + '/api/app/lineFslCallback';

            console.log('State:', state, '\nRedirect URL:', REDIRECT_URL);

            // Initialize FSL Authorization - now returns Promise
            const fslAuthorization = await FSLAuthorization.init({
                responseType: 'code', // 'code' or 'token'
                appKey: 'LineMiniGame',
                redirectUri: REDIRECT_URL, // https://xxx.xxx.com
                scope: 'basic', // Grant Scope
                state: state,
                usePopup: true, // Popup a window instead of jump to
                isApp: false, // Set to false to force external browser
                domain: 'https://9ijsflpfgm3.joysteps.io/'
            });

            await fslAuthorization.signInV2();

        } catch (error) {
            console.error('FSL signin failed:', error);
            alert('FSL signin failed: ' + error.message);
        }
    },

    getStarlets : () => {
        const retVal = shared.userProfile.UserToken.find(item => item.prop_id === 10020);
        return retVal?.num || 0;
    },

    getTicket : () => {
        const retVal = shared.userProfile.UserToken.find(item => item.prop_id === 10010);
        return retVal?.num || 0;
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
        alert(title + '\n\n' + message);
    },

    // Add helper function for story sharing with referral
    shareStoryWithReferral: async (type, media, text, buttonText = 'Join Now') => {
        if (!shared.loginData?.link) {
            console.error('No referral link available');
            return false;
        }

        const inviteLink = `${shared.app_link}?startParam=invite_${shared.loginData.link}`;
        const shareText = `${text}\n\n${inviteLink}`;

        try {
            await shareStory({
                media: media,
                text: shareText,
                button_text: buttonText,
            });

            // Track analytics
            trackStoryShare(type, {
                invite_link: inviteLink,
                has_referral: true,
                share_type: 'story_with_referral'
            }, shared.loginData?.userId);

            return true;
        } catch (error) {
            console.error('Error sharing story with referral:', error);
            return false;
        }
    },

    // Redirect to GameHubPayment with user data only
    redirectToGameHubPayment: async () => {
        try {
            console.log('🚀 Redirecting to GameHubPayment...');
            
            // Use the new method that refreshes token first
            const result = await shared.openGameHubPayment(shared.userProfile);
            
            if (result.success) {
                console.log('✅ GameHubPayment opened successfully');
                return result;
            } else {
                console.error('❌ Failed to open GameHubPayment:', result.error);
                alert('Failed to open GameHubPayment: ' + result.error);
                return result;
            }
        } catch (error) {
            console.error('❌ Error redirecting to GameHubPayment:', error);
            alert('Error opening GameHubPayment: ' + error.message);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // NOTE: verifyFSLID method has been removed in fsl-authorization v1.1.1-beta.55+
    // The verifyFSLID method is no longer available in the new SDK version
    // If FSL ID verification is needed, it should be handled server-side
    
    /* DEPRECATED - verifyFSLID method removed from new SDK
    verifyFSLID: async (fslId) => {
        console.warn('verifyFSLID method is deprecated and removed from fsl-authorization SDK');
        return {
            success: false,
            error: 'verifyFSLID method is no longer supported'
        };
    },
    */

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

    // Complete treasure hunt task (type = 7) and open redirect URL externally
    completeTreasureHuntTask: async (treasureHuntType, depth = 0) => {
        if (depth > 3) {
            console.error('Complete treasure hunt task failed after 3 attempts');
            return false;
        }

        try {
            // Fetch task list
            const response = await fetch(`${shared.server_url}/api/app/taskList?token=${shared.loginData.token}`);
            if (!response.ok) {
                console.error('Get task list request failed:', response);
                return false;
            }

            const data = await response.json();
            if (data.code === 102001 || data.code === 102002) {
                console.log('Token expired, attempting to re-login');
                const result = await shared.login(shared.initData);
                if (result.success) {
                    return shared.completeTreasureHuntTask(treasureHuntType, depth + 1);
                }
                return false;
            }

            if (data.code !== 0) {
                console.error('Get task list failed:', data);
                return false;
            }

            // Find first available type=7 task with matching treasureHuntType and appid
            const now = Date.now();
            const candidate = (data.data || []).find((task) => {
                if (task.type !== 7 || task.state !== 0 || task.endTime <= now) return false;
                if (!task.taskHuntData) return false;

                try {
                    const payload = typeof task.taskHuntData === 'string'
                        ? JSON.parse(task.taskHuntData)
                        : task.taskHuntData;
                    
                    // Check if treasureHuntType matches
                    if (Number(payload?.treasureHuntType) !== Number(treasureHuntType)) return false;
                    
                    // Check if appid matches the stored value (id is user-specific, so we don't compare it)
                    if (payload?.appid !== shared.treasureHuntAppId) return false;
                    
                    return true;
                } catch (e) {
                    return false;
                }
            });

            if (!candidate) {
                console.log('No matching treasure hunt task found for type:', treasureHuntType, 'with appid:', shared.treasureHuntAppId);
                return false;
            }

            // Parse redirectUrl
            let redirectUrl = '';
            let huntPayload = null;
            try {
                huntPayload = typeof candidate.taskHuntData === 'string'
                    ? JSON.parse(candidate.taskHuntData)
                    : candidate.taskHuntData;
            } catch (e) {
                huntPayload = null;
            }

            // Prefer redirectUrl from taskHuntData
            if (huntPayload && typeof huntPayload?.redirectUrl === 'string') {
                redirectUrl = huntPayload.redirectUrl;
            }

            // Fallback: try to extract from candidate.url (can be JSON string or direct URL)
            if (!redirectUrl && candidate.url) {
                try {
                    if (typeof candidate.url === 'string') {
                        // Try JSON first
                        try {
                            const urlPayload = JSON.parse(candidate.url);
                            if (typeof urlPayload?.redirectUrl === 'string') {
                                redirectUrl = urlPayload.redirectUrl;
                            }
                        } catch (ignore) {
                            // Not JSON, treat as direct URL if it looks like a URL
                            if (/^https?:\/\//i.test(candidate.url)) {
                                redirectUrl = candidate.url;
                            }
                        }
                    } else if (typeof candidate.url === 'object' && candidate.url !== null) {
                        if (typeof candidate.url.redirectUrl === 'string') {
                            redirectUrl = candidate.url.redirectUrl;
                        }
                    }
                } catch (e) {
                    console.error('Failed to parse candidate.url for treasure hunt task:', e);
                }
            }

            // Complete the task
            const completeResponse = await fetch(
                `${shared.server_url}/api/app/taskComplete?token=${shared.loginData.token}&id=${candidate.id}&answerIndex=0`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (!completeResponse.ok) {
                console.error('Complete treasure hunt task request failed:', completeResponse);
                return false;
            }

            const completeData = await completeResponse.json();
            if (completeData.code === 102001 || completeData.code === 102002) {
                console.log('Token expired on complete, attempting to re-login');
                const result = await shared.login(shared.initData);
                if (result.success) {
                    return shared.completeTreasureHuntTask(treasureHuntType, depth + 1);
                }
                return false;
            }

            if (completeData.code !== 0) {
                console.error('Complete treasure hunt task failed:', completeData);
                return false;
            }

            // Optionally refresh profile
            try { await shared.getProfileWithRetry(); } catch (e) {}

            // Open redirect URL externally if present (ensure id/appid present)
            if (redirectUrl && typeof redirectUrl === 'string') {
                try {
                    const urlObj = new URL(redirectUrl, window.location.origin);
                    
                    // Luôn thêm id và appid vào URL
                    // id: lấy từ URL khi user mở app (shared.treasureHuntId)
                    // appid: lấy từ taskHuntData trả về từ server
                    urlObj.searchParams.set('id', shared.treasureHuntId);
                    urlObj.searchParams.set('appid', huntPayload?.appid || shared.treasureHuntAppId);
                    
                    // Kiểm tra xem có đủ cả id và appid không
                    if (!shared.treasureHuntId || !huntPayload?.appid) {
                        console.error('Missing required parameters: id or appid, cannot open redirect URL');
                        return false;
                    }

                    shared.openExternalLinkWithFallback(urlObj.toString());
                } catch (e) {
                    console.error('Failed to construct redirect URL:', e);
                    return false;
                }
            }

            return true;
        } catch (error) {
            console.error('Error completing treasure hunt task:', error);
            return false;
        }
    },

    // Complete treasure hunt task but do NOT open the link; return the redirect URL
    completeTreasureHuntTaskSilent: async (treasureHuntType, depth = 0) => {
        if (depth > 3) {
            console.error('Complete treasure hunt task (silent) failed after 3 attempts');
            return '';
        }

        try {
            // Fetch task list
            const response = await fetch(`${shared.server_url}/api/app/taskList?token=${shared.loginData.token}`);
            if (!response.ok) {
                console.error('Get task list request failed:', response);
                return '';
            }

            const data = await response.json();
            if (data.code === 102001 || data.code === 102002) {
                console.log('Token expired, attempting to re-login');
                const result = await shared.login(shared.initData);
                if (result.success) {
                    return shared.completeTreasureHuntTaskSilent(treasureHuntType, depth + 1);
                }
                return '';
            }

            if (data.code !== 0) {
                console.error('Get task list failed:', data);
                return '';
            }

            // Find first available type=7 task with matching treasureHuntType and appid
            const now = Date.now();
            const candidate = (data.data || []).find((task) => {
                if (task.type !== 7 || task.state !== 0 || task.endTime <= now) return false;
                if (!task.taskHuntData) return false;

                try {
                    const payload = typeof task.taskHuntData === 'string'
                        ? JSON.parse(task.taskHuntData)
                        : task.taskHuntData;
                    
                    // Check if treasureHuntType matches
                    if (Number(payload?.treasureHuntType) !== Number(treasureHuntType)) return false;
                    
                    // Check if appid matches the stored value (id is user-specific, so we don't compare it)
                    if (payload?.appid !== shared.treasureHuntAppId) return false;
                    
                    return true;
                } catch (e) {
                    return false;
                }
            });

            if (!candidate) {
                console.log('No matching treasure hunt task found for type:', treasureHuntType, 'with appid:', shared.treasureHuntAppId);
                return '';
            }

            // Parse taskHuntData to get huntPayload
            let huntPayload = null;
            try {
                huntPayload = typeof candidate.taskHuntData === 'string'
                    ? JSON.parse(candidate.taskHuntData)
                    : candidate.taskHuntData;
            } catch (e) {
                huntPayload = null;
            }

            // Validate appid (should already be validated above, but double-check)
            if (!huntPayload?.appid) {
                console.error('Missing app ID in treasure hunt task data');
                return '';
            }

            // Parse redirectUrl from validated huntPayload only
            let redirectUrl = '';

            if (huntPayload && typeof huntPayload?.redirectUrl === 'string') {
                redirectUrl = huntPayload.redirectUrl;
            }

            // Complete the task
            const completeResponse = await fetch(
                `${shared.server_url}/api/app/taskComplete?token=${shared.loginData.token}&id=${candidate.id}&answerIndex=0`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (!completeResponse.ok) {
                console.error('Complete treasure hunt task request failed:', completeResponse);
                return '';
            }

            const completeData = await completeResponse.json();
            if (completeData.code === 102001 || completeData.code === 102002) {
                console.log('Token expired on complete, attempting to re-login');
                const result = await shared.login(shared.initData);
                if (result.success) {
                    return shared.completeTreasureHuntTaskSilent(treasureHuntType, depth + 1);
                }
                return '';
            }

            if (completeData.code !== 0) {
                console.error('Complete treasure hunt task failed:', completeData);
                return '';
            }

            try { await shared.getProfileWithRetry(); } catch (e) {}

            if (redirectUrl) {
                try {
                    const urlObj = new URL(redirectUrl, window.location.origin);
                    
                    // Luôn thêm id và appid vào URL
                    // id: lấy từ URL khi user mở app (shared.treasureHuntId)
                    // appid: lấy từ taskHuntData trả về từ server
                    urlObj.searchParams.set('id', shared.treasureHuntId);
                    urlObj.searchParams.set('appid', huntPayload.appid);
                    
                    // Kiểm tra xem có đủ cả id và appid không
                    if (!shared.treasureHuntId || !huntPayload.appid) {
                        console.error('Missing required parameters: id or appid, cannot return redirect URL');
                        return '';
                    }
                    
                    return urlObj.toString();
                } catch (e) {
                    console.error('Error constructing redirect URL:', e);
                    return '';
                }
            }

            return '';
        } catch (error) {
            console.error('Error completing treasure hunt task (silent):', error);
            return '';
        }
    },

    // Resolve treasure hunt redirect URL without opening it
    getTreasureHuntRedirectUrl: async (treasureHuntType, depth = 0) => {
        if (depth > 3) {
            console.error('Get treasure hunt redirect URL failed after 3 attempts');
            return null;
        }

        try {
            const response = await fetch(`${shared.server_url}/api/app/taskList?token=${shared.loginData.token}`);
            if (!response.ok) {
                console.error('Get task list request failed:', response);
                return null;
            }

            const data = await response.json();
            if (data.code === 102001 || data.code === 102002) {
                console.log('Token expired, attempting to re-login');
                const result = await shared.login(shared.initData);
                if (result.success) {
                    return shared.getTreasureHuntRedirectUrl(treasureHuntType, depth + 1);
                }
                return null;
            }

            if (data.code !== 0) {
                console.error('Get task list failed:', data);
                return null;
            }

            const now = Date.now();
            const candidate = (data.data || []).find((task) => {
                if (task.type !== 7 || task.state !== 0 || task.endTime <= now) return false;
                if (!task.taskHuntData) return false;
                try {
                    const payload = typeof task.taskHuntData === 'string' ? JSON.parse(task.taskHuntData) : task.taskHuntData;
                    
                    // Check if treasureHuntType matches
                    if (Number(payload?.treasureHuntType) !== Number(treasureHuntType)) return false;
                    
                    // Check if appid matches the stored value (id is user-specific, so we don't compare it)
                    if (payload?.appid !== shared.treasureHuntAppId) return false;
                    
                    return true;
                } catch (e) {
                    return false;
                }
            });

            if (!candidate) {
                console.log('No matching treasure hunt task found for type:', treasureHuntType, 'with appid:', shared.treasureHuntAppId);
                return null;
            }

            let redirectUrl = '';
            let huntPayload = null;
            try {
                huntPayload = typeof candidate.taskHuntData === 'string' ? JSON.parse(candidate.taskHuntData) : candidate.taskHuntData;
            } catch (e) {
                huntPayload = null;
            }

            if (huntPayload && typeof huntPayload?.redirectUrl === 'string') {
                redirectUrl = huntPayload.redirectUrl;
            }

            if (redirectUrl) {
                try {
                    const urlObj = new URL(redirectUrl, window.location.origin);
                    
                    // Luôn thêm id và appid vào URL
                    // id: lấy từ URL khi user mở app (shared.treasureHuntId)
                    // appid: lấy từ taskHuntData trả về từ server
                    urlObj.searchParams.set('id', shared.treasureHuntId);
                    urlObj.searchParams.set('appid', huntPayload?.appid || shared.treasureHuntAppId);
                    
                    // Kiểm tra xem có đủ cả id và appid không
                    if (!shared.treasureHuntId || !huntPayload?.appid) {
                        console.error('Missing required parameters: id or appid');
                        return null;
                    }
                    
                    // Trả về object chứa cả redirectUrl và taskId
                    return {
                        redirectUrl: urlObj.toString(),
                        taskId: candidate.id  // Thêm taskId của treasure hunt task
                    };
                } catch (e) {
                    console.error('Error constructing redirect URL:', e);
                    return null;
                }
            }

            return null;
        } catch (error) {
            console.error('Error resolving treasure hunt redirect URL:', error);
            return null;
        }
    },

    // Utility function to open links in external browser
    openExternalLink: (url) => {
        try {
            if (window.liff && liff.isInClient()) {
                liff.openWindow({
                    url: url,
                    external: true
                });
            } else {
                window.open(url, '_blank');
            }
        } catch (error) {
            console.error('Error opening external link:', error);
            // Fallback to window.open
            window.open(url, '_blank');
        }
    },

    // Utility function to open links in external browser with better error handling
    openExternalLinkWithFallback: (url) => {
        try {
            if (window.liff && liff.isInClient()) {
                liff.openWindow({
                    url: url,
                    external: true
                });
            } else {
                window.open(url, '_blank');
            }
        } catch (error) {
            console.error('Error opening external link:', error);
            // Fallback to window.open
            window.open(url, '_blank');
        }
    },

    // Utility function to open links in in-app browser
    openInAppLink: (url) => {
        try {
            if (window.liff && liff.isInClient()) {
                liff.openWindow({
                    url: url,
                    external: false
                });
            } else {
                window.open(url, '_blank');
            }
        } catch (error) {
            console.error('Error opening in-app link:', error);
            // Fallback to window.open
            window.open(url, '_blank');
        }
    },

    // Add method to refresh token by calling login again
    refreshToken: async () => {
        try {
            console.log('🔄 Refreshing token...');
            console.log('🔍 Using shared.initData:', shared.initData);
            
            if (!shared.initData) {
                throw new Error('No initData available for token refresh. Please ensure you are logged in.');
            }
            
            const loginResult = await shared.login(shared.initData);
            if (loginResult.success) {
                console.log('✅ Token refreshed successfully');
                return {
                    success: true,
                    loginData: loginResult.loginData
                };
            } else {
                console.error('❌ Failed to refresh token:', loginResult.error);
                return {
                    success: false,
                    error: loginResult.error
                };
            }
        } catch (error) {
            console.error('❌ Token refresh error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // Add method to open GameHubPayment with fresh token
    openGameHubPayment: async (userData) => {
        try {
            console.log('🚀 Opening GameHubPayment...');
            console.log('🔍 Using shared.initData:', shared.initData);
            
            if (!shared.initData) {
                throw new Error('No initData available for GameHubPayment. Please ensure you are logged in.');
            }
            
            // First refresh token to ensure it's valid for 10 minutes
            const refreshResult = await shared.refreshToken(shared.initData);
            if (!refreshResult.success) {
                throw new Error('Failed to refresh token: ' + refreshResult.error);
            }
            
            // Prepare data to pass to GameHubPayment
            const gameHubData = {
                fslId: userData.fslId || userData.id,
                telegramFirstName: userData.telegramFirstName || userData.name,
                platform: userData.platform || 'telegram',
                telegramUID: userData.telegramUID,
                telegramUsername: userData.telegramUsername,
                userProfile: userData.userProfile || {}
            };
            
            // Encode user data and token
            const encodedUserData = btoa(JSON.stringify(gameHubData));
            const token = refreshResult.loginData.token;
            
            // Open GameHubPayment in new window/tab
            const gameHubUrl = `https://hoangdevgames.github.io/GameHubPayment/?source=gaminghub&userData=${encodedUserData}&token=${token}`;
            
            console.log('🔗 Opening GameHubPayment URL:', gameHubUrl);
            
            // Open in new window
            const gameHubWindow = window.open(
                gameHubUrl,
                'GameHubPayment',
                'width=1200,height=800,scrollbars=yes,resizable=yes'
            );
            
            if (gameHubWindow) {
                console.log('✅ GameHubPayment opened successfully');
                return {
                    success: true,
                    window: gameHubWindow
                };
            } else {
                throw new Error('Failed to open GameHubPayment window');
            }
            
        } catch (error) {
            console.error('❌ Failed to open GameHubPayment:', error);
            alert('Failed to open GameHubPayment: ' + error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

};

export default shared;
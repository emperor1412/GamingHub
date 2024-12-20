import ticketIcon from './images/ticket.svg';
import kmIcon from './images/km.svg';
import gmtIcon from './images/gmt.svg';
import SUT from './images/SUT.png';
import energy from './images/energy.svg';
import mooar from './images/Mooar.png';
import stepn_go_sneaker from './images/STEPNGO_SNEAKER_BUSHWALKING_Common.png';
import stepn_go_code from './images/stepngo_code.png';

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
import { popup } from '@telegram-apps/sdk';
import { type } from '@testing-library/user-event/dist/type';
import FSLAuthorization from 'fsl-authorization';

import single_star from './images/single_star.svg';
import single_star_2 from './images/single_star_2.svg';
import single_star_3 from './images/single_star_3.svg';
import single_star_4 from './images/single_star_4.svg';
import single_star_5 from './images/single_star_5.svg';

const shared = {
    server_url: 'https://gm14.joysteps.io',
    app_link: 'https://t.me/TestFSL_bot/fslhub',
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
    ],

    mappingIcon : {
        10010: ticketIcon,
        10020: kmIcon,
        10030: energy,
        20010: SUT,
        20020: gmtIcon,
        30010: stepn_go_code,
        30020: mooar,
        40010: stepn_go_sneaker
    },
    mappingText : {
        10010: 'Tickets',
        10020: 'KM Points',
        10030: 'Energy',
        20010: 'SUT',
        20020: 'GMT',
        30010: 'StepN GO code',
        30020: 'MOOAR+ Membership',
        40010: 'StepN GO Shoe'
    },
    
    profileItems : [],
    userProfile : null,
    loginData : null,
    inviteCode: 0,
    initData : null,
    user : null,
    fsl_binding_code : null,

    // Add these to the shared object
    starImages: {
        star1: single_star,
        star2: single_star_2,
        star3: single_star_3,
        star4: single_star_4,
        star5: single_star_5
    },

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
        try {
            const response = await fetch(`${shared.server_url}/api/app/userData?token=${loginData.token}`, {
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

                const profileItems = [
                    ...userProfileData.UserToken.map(record => ({
                        icon: shared.mappingIcon[record.prop_id],
                        text: shared.mappingText[record.prop_id],
                        value: record.num,
                        showClaim: false,
                        showArrow: false,
                        record: record,
                        type: record.prop_id
                    })),
                    ...userProfileData.claimRecord.map(record => ({
                        icon: shared.mappingIcon[record.type],
                        text: shared.mappingText[record.type],
                        value: record.num,
                        showClaim: true,
                        showArrow: true,
                        record: record,
                        type: record.type
                    }))
                ];

                shared.profileItems = profileItems;
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
                domain: 'https://gm3.joysteps.io/'
            });

            fslAuthorization.signInV2();

        });
    }
};

export default shared;
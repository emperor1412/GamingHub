import ticketIcon from './images/ticket.svg';
import kmIcon from './images/km.svg';
import gmtIcon from './images/gmt.svg';
import SUT from './images/SUT.png';
import energy from './images/energy.png';

import avatar1 from './images/avatar1.svg';
import avatar2 from './images/avatar2.svg';
import avatar3 from './images/avatar3.svg';

const shared = {
    avatars : [
        { id: 0, src: avatar1 },
        { id: 1, src: avatar2 },
        { id: 2, src: avatar3 },
        { id: 3, src: avatar1 },
        { id: 4, src: avatar2 },
        { id: 5, src: avatar3 },
        { id: 6, src: avatar1 },
        { id: 7, src: avatar2 },
        { id: 8, src: avatar3 },
        { id: 9, src: avatar1 },
        { id: 10, src: avatar2 },
        { id: 11, src: avatar3 },
    ],

    mappingIcon : {
        10010: ticketIcon,
        10020: kmIcon,
        10030: energy,
        20010: SUT,
        20020: gmtIcon,
        30010: gmtIcon,
        30020: gmtIcon,
        40010: gmtIcon
    },
    mappingText : {
        10010: 'Ticket',
        10020: 'KM Point',
        10030: 'Energy',
        20010: 'SUT',
        20020: 'GMT',
        30010: 'StepN GO code',
        30020: 'MOOAR Membership',
        40010: 'StepN GO Shoe'
    },
    profileItems : [],
    userProfile : null,
    loginData : null,
    user : null,

    login: async (initDataRaw) => {
        try {
            let params = JSON.stringify({
                link: '1',
                initData: initDataRaw
            });
            console.log('Login params:', params);

            const response = await fetch('https://gm14.joysteps.io/api/app/login', {
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
            const response = await fetch(`https://gm14.joysteps.io/api/app/checkIn?token=${loginData.token}`, {
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
            const response = await fetch(`https://gm14.joysteps.io/api/app/userData?token=${loginData.token}`, {
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
                        record: record
                    })),
                    ...userProfileData.claimRecord.map(record => ({
                        icon: shared.mappingIcon[record.type],
                        text: shared.mappingText[record.type],
                        value: record.num,
                        showClaim: true,
                        showArrow: true,
                        record: record
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
    }
};

export default shared;
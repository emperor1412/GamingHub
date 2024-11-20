import React, { useEffect, useState, useRef } from 'react';
import './Profile.css';
import backIcon from './images/back.svg';
import accountIcon from './images/account.svg';
import ticketIcon from './images/ticket.svg';
import kmIcon from './images/km.svg';
import gmtIcon from './images/gmt.svg';
import arrowIcon from './images/arrow.svg';
import SUT from './images/SUT.png';
import energy from './images/energy.png';
// import ID_normal from './images/ID_normal.svg';
import ID_selected from './images/ID_selected.svg';

import avatar1 from './images/avatar1.svg';
import avatar2 from './images/avatar2.svg';
import avatar3 from './images/avatar3.svg';

import ProfileAvatarSelector from './ProfileAvatarSelector';

import { popup } from '@telegram-apps/sdk';

const Profile = ({ onClose, user, loginData, login }) => {
    const [showAvatarSelector, setShowAvatarSelector] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [profileItems, setProfileItems] = useState([]);

    const avatars = [
        // Add your avatar image imports here
        // Example: { id: 1, src: avatar1 }
        { id: 0, src: avatar1 },
        { id: 1, src: avatar2 },
        { id: 2, src: avatar3 }
    ];
    const mappingIcon = {
        10010: ticketIcon,
        10020: kmIcon,
        10030: energy,
        20010: SUT,
        20020: gmtIcon,
        30010: gmtIcon,
        30020: gmtIcon,
        40010: gmtIcon
    };
    const mappingText = {
        10010: 'Ticket',
        10020: 'KM Point',
        10030: 'Energy',
        20010: 'SUT',
        20020: 'GMT',
        30010: 'StepN GO code',
        30020: 'MOOAR MemberShip',
        40010: 'StepN GO Shoe'
    };

    const getProfileData = async () => {
        const response = await fetch(`https://gm14.joysteps.io/api/app/userData?token=${loginData.token}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        console.log('UserProfile Response:', response);
        const data = await response.json();

        try {
            console.log('UserProfile Data:', data);
            let userProfileData = data.data;
            setUserProfile(userProfileData);
            let profileItems = userProfileData.UserToken.map(record => ({
                icon: mappingIcon[record.prop_id],
                text: mappingText[record.prop_id],
                value: record.num,
                showClaim: false,
                showArrow: false
            }));

            profileItems = profileItems.concat(userProfileData.claimRecord.map(record => ({
                icon: mappingIcon[record.type],
                text: mappingText[record.type],
                value: record.num,
                showClaim: true,
                showArrow: true
            })));
            setProfileItems(profileItems);
        }
        catch (error) {
            console.error('CheckIn error:', error);
            if (data.code === 102001) {
                login();
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

        /*
        userProfile: {
            "tUserId": "5000076292",
            "tName": "Kaka Lala",
            "tUserName": "",
            "fslId": 0,
            "pictureIndex": 0,
            "link": 21201,
            "claimRecord": [
                {
                    "id": 7,
                    "uid": 21201,
                    "type": 20010,
                    "state": 1,
                    "num": 4000,
                    "ctime": 1731661421159,
                    "ltime": 1731661420158
                },
                {
                    "id": 6,
                    "uid": 21201,
                    "type": 30010,
                    "state": 0,
                    "num": 1,
                    "ctime": 1731661773099,
                    "ltime": 1731661773095
                },
                {
                    "id": 5,
                    "uid": 21201,
                    "type": 40010,
                    "state": 0,
                    "num": 1,
                    "ctime": 1731661773098,
                    "ltime": 1731661773095
                },
                {
                    "id": 4,
                    "uid": 21201,
                    "type": 30020,
                    "state": 0,
                    "num": 1,
                    "ctime": 1731661773097,
                    "ltime": 1731661773095
                },
                {
                    "id": 3,
                    "uid": 21201,
                    "type": 30010,
                    "state": 0,
                    "num": 1,
                    "ctime": 1731661773096,
                    "ltime": 1731661773095
                },
                {
                    "id": 2,
                    "uid": 21201,
                    "type": 30020,
                    "state": 0,
                    "num": 1,
                    "ctime": 1731661773095,
                    "ltime": 1731661773095
                },
                {
                    "id": 1,
                    "uid": 21201,
                    "type": 20020,
                    "state": 1,
                    "num": 9000,
                    "ctime": 1731661420158,
                    "ltime": 1731661420158
                }
            ],
            "UserToken": [
                {
                    "uid": 21201,
                    "prop_id": 10010,
                    "chain": 0,
                    "num": 173,
                    "lock_num": 0,
                    "ableNum": 173
                },
                {
                    "uid": 21201,
                    "prop_id": 10020,
                    "chain": 0,
                    "num": 8450,
                    "lock_num": 0,
                    "ableNum": 8450
                },
                {
                    "uid": 21201,
                    "prop_id": 20010,
                    "chain": 0,
                    "num": 50000,
                    "lock_num": 0,
                    "ableNum": 50000
                },
                {
                    "uid": 21201,
                    "prop_id": 20020,
                    "chain": 0,
                    "num": 100000,
                    "lock_num": 0,
                    "ableNum": 100000
                }
            ]
        } */

        
    };

    useEffect(() => {
        getProfileData();
    }, []);

    return (
        <div className="app-container">

            {
                showAvatarSelector ? (
                    <ProfileAvatarSelector
                        onClose={() => setShowAvatarSelector(false)}
                        onSelect={(avatar) => {
                            console.log('Selected avatar:', avatar);
                        }}
                        user={user}
                        userProfile={userProfile}
                    />
                )
                    : <div className="profile-container">
                        <div className="profile-header">
                            <button className="profile-back" onClick={onClose}>
                                <img src={backIcon} alt="Back" />
                            </button>
                            <div className="profile-user">
                                <img
                                    src={avatars[0]?.src}
                                    alt="Avatar"
                                    className="profile-avatar"
                                />
                                <div>
                                    <div className="profile-username">RUNNER</div>
                                    <div className="profile-id">
                                        <img src={ID_selected} alt="FSL ID" className="profile-id-icon" />
                                        4CH4H9W2...AaCFChF
                                    </div>
                                </div>
                                <button className="profile-user-arrow" onClick={() => setShowAvatarSelector(true)}>
                                    <img src={arrowIcon} alt="Open Avatar Selector" />
                                </button>
                            </div>
                        </div>

                        <div className="profile-content-wrapper">
                            <div className="profile-content">
                                {profileItems.map((item, index) => (
                                    <div key={index} className="profile-item">
                                        <div className="profile-item-left">
                                            <img src={item.icon} alt="" className="profile-item-icon" />
                                            <span className="profile-item-text">{item.text}</span>
                                        </div>
                                        <div className="profile-item-right">
                                            {item.showClaim && (
                                                <button className="profile-claim">Claim</button>
                                            )}
                                            <span className="profile-item-value">{item.value}</span>
                                        </div>
                                        {item.showArrow && (
                                            <img src={arrowIcon} alt="" className="profile-item-arrow" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="profile-info-box">
                            Earn extra rewards by inviting frens or by completing daily tasks. The more you engage, the more rewards you'll unlock.
                        </div>
                    </div>
            }
        </div>
    );
};

export default Profile;

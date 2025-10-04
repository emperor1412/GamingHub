import React from 'react';
import './ProfileTokenDetailView.css';
import starletIcon from './images/starlet.png';
import bCoinIcon from './images/bCoin_icon.png';
import collectiblesIcon from './images/ticket_scratch_icon.png';
import gmtIcon from './images/GMT_1.png';
import alphaChestIcon from './images/Chest_Icon.png';
import mooarIcon from './images/Mooar.svg';
import freezeStreakIcon from './images/streakFreezeIcon.png';

const ProfileTokenDetailView = ({ 
  isOpen, 
  onClose,
  tokenType = 'starlets' // 'starlets', 'bcoin', 'tickets', 'gmt', 'alphaChest', 'mooar', 'freezeStreak'
}) => {
  // Token configuration
  const tokenConfig = {
    starlets: {
      icon: starletIcon,
      title: 'STARLETS',
      description: 'STARLETS ARE THE CORE POINTS SYSTEM INSIDE FSL GAME HUB.',
      earningTitle: 'HOW TO EARN STARLETS',
      earningMethods: [
        'DAILY CHECK-INS',
        'BANK STEPS WITH STEPN',
        'PLAYING TADOKAMI',
        'COMPLETING TASKS',
        'SCRATCHING TICKETS',
        'CLAIM IN THE MARKET'
      ]
    },
    bcoin: {
      icon: bCoinIcon,
      title: 'B$',
      description: 'B$ ARE A SPECIAL RESOURCE YOU EARN IN FSL GAME HUB AND USE ACROSS MINI-GAMES.',
      earningTitle: 'HOW TO GET B$',
      earningMethods: [
        'DAILY CHECK-INS',
        'COMPLETING TASKS',
        'SCRATCHING TICKETS',
        'SPECIAL GAMEHUB REWARDS'
      ]
    },
    tickets: {
      icon: collectiblesIcon,
      title: 'TICKETS',
      description: 'EARN TICKETS FROM YOUR DAILY CHECK-INS AND BY INVITING FRIENDS.',
      subDescription: 'SCRATCH \'EM AND REVEAL GREAT REWARDS.',
      earningMethods: [
      ]
    },
    gmt: {
      icon: gmtIcon,
      title: 'GMT',
      description: 'GMT IS THE CORE TOKEN IN THE FSL ECOSYSTEM.',
      subDescription: 'EARN IT BY SCRATCHING TICKETS, JOINING EVENTS, AND COMPLETING SPECIAL ACTIVITIES.',
      earningTitle: 'YOU CAN WITHDRAW ONCE YOU\'VE REACHED 50 GMT. MAKE SURE YOUR FSL ID IS CONNECTED TO UNLOCK WITHDRAWALS.',
      earningMethods: [
      ]
    },
    alphaChest: {
      icon: alphaChestIcon,
      title: 'ALPHA CHESTS',
      description: 'ALPHA CHESTS ARE EXCLUSIVE REWARDS YOU UNLOCK BY PLAYING TADOKAMI',
      subDescription: 'DEFEAT THE CHAPTER BOSS TO RECEIVE AN ALPHA CHEST. EACH VICTORY MARKS A MILESTONE IN YOUR JOURNEY.',
      earningMethods: [
      ]
    },
    mooar: {
      icon: mooarIcon,
      title: 'MOOAR+',
      description: 'MOOAR+ MEMBERSHIP IS A PREMIUM SUBSCRIPTION SERVICE OFFERED BY MOOAR.',
      subDescription: 'DESIGNED TO ELEVATE YOUR NFT EXPERIENCE, MOOAR+ PROVIDES SUBCRIBERS WITH EXCLUSIVE PERKS.',
      earningMethods: [
      ]
    },
    freezeStreak: {
      icon: freezeStreakIcon,
      title: 'FREEZE STREAK',
      description: 'FREEZE STREAK PROTECTS YOUR LOGIN STREAK WHEN YOU MISS A DAY!',
      subDescription: 'THE FIRST TIME YOU USE ONE, YOU\'LL UNLOCK A SPECIAL TROPHY.',
      earningMethods: [
      ]
    }
  };

  // Only render when open
  if (!isOpen) return null;

  const config = tokenConfig[tokenType] || tokenConfig.starlets;

  return (
    <>
      <div className="starlets-detail-overlay" onClick={onClose}>
        <div
          className="starlets-detail-popup"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Corner borders */}
          <div className="mk-corner mk-top-left"></div>
          <div className="mk-corner mk-top-right"></div>
          <div className="mk-corner mk-bottom-left"></div>
          <div className="mk-corner mk-bottom-right"></div>

          {/* Main content */}
          <div className="starlets-detail-body">
            {/* Token icon */}
            <div className="starlets-detail-header">
              <div className="starlets-detail-icon-container">
                <img
                  src={config.icon}
                  alt={`${config.title} icon`}
                  className="starlets-detail-icon"
                />
              </div>
            </div>

            {/* Content area */}
            <div className="starlets-detail-content">
              <div className="starlets-detail-title">
                {config.title}
              </div>
              
              <div className="starlets-detail-description">
                {config.description}
              </div>

              {config.subDescription && (
              <div className="starlets-detail-description">
                {config.subDescription}
              </div>
              )}
              <div className="starlets-detail-earning-section">
                {config.earningTitle && (
                <div className="starlets-detail-earning-title">
                  {config.earningTitle}
                </div>
                )}
                <div className="starlets-detail-earning-list">
                  {config.earningMethods.map((method, index) => (
                    <div key={index} className="starlets-detail-earning-item">
                      <span className="starlets-detail-bullet"></span>
                      <span className="starlets-detail-earning-text">{method}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* OKAY button */}
          <div className="starlets-detail-actions">
            <button className="starlets-detail-okay-button" onClick={onClose}>
              OKAY
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileTokenDetailView;

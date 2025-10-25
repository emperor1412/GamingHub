import React, { useState } from 'react';
import './ChallengeJoinConfirmation.css';
import ChallengeUpdate from './ChallengeUpdate';
import shared from './Shared';
import challenges_robot from './images/challenges_robot.png';
import starlet from './images/starlet.png';
import trophy_4 from './images/trophy_4.png';
import backIcon from './images/back.svg';

const ChallengeJoinConfirmation = ({ 
  challengeData, 
  onJoinChallenge, 
  onBack,
  onBackAfterJoin, // New prop for handling back after join
  onViewBadges,
  onShowError
}) => {
  const [showChallengeUpdate, setShowChallengeUpdate] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [challengeDetailData, setChallengeDetailData] = useState(null);
  const [hasJoinedChallenge, setHasJoinedChallenge] = useState(false); // Track if user has joined
  const {
    steps = 56000,
    days: inputDays,
    starletsCost = 200,
    badgeName = "EXPLORER BADGE",
    challengeEndDate = "DD/MM/YY HH:MM",
    endTime = null, // ← Thêm endTime từ API
    id: challengeId,
    type = "WEEKLY"
  } = challengeData || {};

  // Calculate days based on challenge type
  const days = inputDays || (type === 'weekly' ? 7 : type === 'monthly' ? 30 : 365);

  // Format end time from API (consistent with ChallengeUpdate.js and ChallengeInfo.js)
  const formatEndDate = (endTime) => {
    console.log('ChallengeInfo - endTime received:', endTime);
    console.log('ChallengeInfo - challenge object:', challengeData);
    if (!endTime || endTime === 0) return challengeData.dateEnd + ' HH:MM UTC';
    const date = new Date(endTime);
    console.log('ChallengeInfo - converted date:', date);
    return date.toLocaleDateString('en-GB') + ' ' + date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const handleJoinChallenge = async () => {
    if (!challengeId) {
      console.error('No challenge ID provided');
      return;
    }

    setIsJoining(true);
    
    try {
      const result = await shared.joinChallenge(challengeId);
      
      if (result.success) {
        // Successfully joined challenge - now get challenge detail
        console.log('Successfully joined challenge, fetching details...');
        setHasJoinedChallenge(true); // Mark that user has joined
        
        const detailResult = await shared.getChallengeDetail(challengeId);
        
        if (detailResult.success) {
          const challengeDetail = detailResult.data;
          
          // Combine API data with original challenge data
          const combinedData = {
            id: challengeDetail.id,
            title: (challengeDetail.name || challengeData.title || '').trim(),
            shortTitle: challengeData.shortTitle || (challengeDetail.name || '').trim(),
            type: challengeData.type || "WEEKLY",
            entryFee: challengeDetail.price,
            reward: challengeDetail.price * 2,
            stepsEst: challengeDetail.step,
            distanceKm: challengeData.distanceKm,
            description: challengeData.description,
            location: challengeData.location,
            dateStart: challengeData.dateStart,
            dateEnd: challengeData.dateEnd,
            // API data
            state: challengeDetail.state,
            currentSteps: challengeDetail.currSteps,
            totalSteps: challengeDetail.step,
            startTime: challengeDetail.startTime,
            endTime: challengeDetail.endTime
          };
          
          setChallengeDetailData(combinedData);
          setShowChallengeUpdate(true);
        } else {
          console.error('Failed to get challenge detail after join:', detailResult.error);
          // Fallback to original data
          setChallengeDetailData(challengeData);
          setShowChallengeUpdate(true);
        }
      } else if (result.error === 'not_enough_starlets') {
        // Show error screen for not enough starlets
        console.log('Not enough starlets to join challenge');
        if (onShowError) {
          onShowError();
        }
      } else {
        // Other errors - show Telegram popup with backend error message
        console.error('Failed to join challenge:', result.error);
        await shared.showPopup({
          type: 0, // Error type
          title: 'Join Challenge Failed',
          message: result.error || 'Failed to join challenge. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error joining challenge:', error);
      // Show Telegram popup for unexpected errors
      await shared.showPopup({
        type: 0, // Error type
        title: 'Join Challenge Failed',
        message: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsJoining(false);
    }
  };

  const handleDoneFromUpdate = () => {
    setShowChallengeUpdate(false);
    // After completing challenge, go back to ChallengesMenu
    if (onBack) {
      onBack();
    }
  };

  const handleBackFromUpdate = () => {
    console.log('ChallengeJoinConfirmation - handleBackFromUpdate called');
    console.log('hasJoinedChallenge:', hasJoinedChallenge);
    console.log('onBackAfterJoin exists:', !!onBackAfterJoin);
    
    setShowChallengeUpdate(false);
    // After joining challenge, go back to the original view (ChallengesMenu/BadgeScreen/BadgeCollection)
    // Don't go back to ChallengeInfo as user has already joined
    if (hasJoinedChallenge && onBackAfterJoin) {
      console.log('Calling onBackAfterJoin');
      // If user has joined, go back to the original view (skip ChallengeInfo)
      onBackAfterJoin();
    } else {
      console.log('Not calling onBackAfterJoin - hasJoinedChallenge:', hasJoinedChallenge, 'onBackAfterJoin exists:', !!onBackAfterJoin);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  // Show ChallengeUpdate if state is true
  if (showChallengeUpdate) {
    return (
      <ChallengeUpdate
        challengeData={challengeDetailData ? {
          // API data
          id: challengeDetailData.id,
          currentSteps: challengeDetailData.currentSteps || 0,
          totalSteps: challengeDetailData.totalSteps || challengeDetailData.stepsEst || 0,
          endTime: challengeDetailData.endTime || 0,
          startTime: challengeDetailData.startTime || 0,
          // Additional fields
          stepsEst: challengeDetailData.stepsEst || 0,
          distanceKm: challengeDetailData.distanceKm || 0,
          title: challengeDetailData.title || "Challenge",
          shortTitle: challengeDetailData.shortTitle || "Challenge",
          description: challengeDetailData.description || "Complete the challenge to earn rewards!",
          location: challengeDetailData.location || "Unknown",
          starletsReward: challengeDetailData.reward || 0,
          type: challengeDetailData.type || "WEEKLY",
          challengeEndDate: formatEndDate(challengeDetailData.endTime || 0)
        } : {}}
        onDone={handleDoneFromUpdate}
        onBack={handleBackFromUpdate}
        onViewBadges={onViewBadges}
      />
    );
  }

  return (
    <div className="challenge-join-confirmation-container-wrapper">
      {/* Back Button */}
      <button className="back-button back-button-alignment" onClick={handleBack}>
        <img src={backIcon} alt="Back" />
      </button>
      <div className="challenge-join-confirmation-container"> 
        
        
        {/* Background Pattern */}
        <div className="cjc-background-pattern"></div>
        
        {/* Main Content */}
        <div className="cjc-main-content">
          {/* Challenge Goal */}

          {/* Reward Information */}
          <div className="cjc-reward-info">
            EARN EXPLORER BADGE AND STARLETS
          </div>

          {/* Central Graphic - 3 Images */}
          <div className="cjc-central-graphic">
            <img 
              src={trophy_4} 
              alt="Left Image" 
              className="cjc-left-image"
            />
            <img 
              src={starlet}
              alt="Center Image" 
              className="cjc-center-image"
            />
            <img 
              src={challenges_robot}
              alt="Right Image" 
              className="cjc-right-image"
            />
          </div>

          <div className="cjc-challenge-goal warning-steps-text">
            {steps.toLocaleString()} STEPS IN {days} DAYS!
          </div>

          {/* Warning Section */}
          <div className="cjc-warning-section">
            <div className="cjc-warning-brackets">
              <div className="cjc-bracket cjc-bracket-tl"></div>
              <div className="cjc-bracket cjc-bracket-tr"></div>
              <div className="cjc-bracket cjc-bracket-bl"></div>
              <div className="cjc-bracket cjc-bracket-br"></div>
            </div>
            
            <div className="cjc-warning-banner">
              WARNING!
            </div>
            
            <div className="cjc-warning-text">
              YOU ARE ABOUT TO ENTER THE {type.toUpperCase()} CHALLENGE USING {starletsCost} STARLETS.
            </div>

              {/* Join Button */}
              <button 
                  className="cjc-join-button" 
                  onClick={handleJoinChallenge}
                  disabled={isJoining}
              >
                  {isJoining ? 'JOINING...' : 'JOIN CHALLENGE'}
              </button>
          </div>

          {/* Challenge End Date */}
          <div className="cjc-challenge-end">
            <span style={{color: '#00FFFF'}}>CHALLENGE END:</span> {formatEndDate(endTime)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeJoinConfirmation;

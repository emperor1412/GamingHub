import React, { useState } from 'react';
import './ChallengeJoinConfirmation.css';
import ChallengeUpdate from './ChallengeUpdate';
import shared from './Shared';
import challenges_robot from './images/challenges_robot.png';
import starlet from './images/starlet.png';
import trophy_4 from './images/trophy_4.png';

const ChallengeJoinConfirmation = ({ 
  challengeData, 
  onJoinChallenge, 
  onBack,
  onViewBadges,
  onShowError
}) => {
  const [showChallengeUpdate, setShowChallengeUpdate] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [challengeDetailData, setChallengeDetailData] = useState(null);
  const {
    steps = 56000,
    days = 7,
    starletsCost = 200,
    badgeName = "EXPLORER BADGE",
    challengeEndDate = "DD/MM/YY HH:MM",
    id: challengeId
  } = challengeData || {};

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
        // Other errors
        console.error('Failed to join challenge:', result.error);
        // You can show a generic error message here
      }
    } catch (error) {
      console.error('Error joining challenge:', error);
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
    setShowChallengeUpdate(false);
    // Don't stay in ChallengeJoinConfirmation, go back to ChallengesMenu
    if (onBack) {
      onBack();
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
          challengeEndDate: challengeDetailData.dateEnd ? `${challengeDetailData.dateEnd} 23:59` : "DD/MM/YYYY 23:59"
        } : {}}
        onDone={handleDoneFromUpdate}
        onBack={handleBackFromUpdate}
        onViewBadges={onViewBadges}
      />
    );
  }

  return (
    <div className="challenge-join-confirmation-container">
      {/* Background Pattern */}
      <div className="cjc-background-pattern"></div>
      
      {/* Main Content */}
      <div className="cjc-main-content">
        {/* Challenge Goal */}
        <div className="cjc-challenge-goal">
          {steps.toLocaleString()} STEPS IN {days} DAYS!
        </div>

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
            YOU ARE ABOUT TO ENTER THE WEEKLY CHALLENGE USING {starletsCost} STARLETS.
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
          <span style={{color: '#00FFFF'}}>CHALLENGE END:</span> {challengeEndDate}
        </div>
      </div>
    </div>
  );
};

export default ChallengeJoinConfirmation;

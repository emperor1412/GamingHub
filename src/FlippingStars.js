import React, { useState, useEffect, useRef } from 'react';
import './FlippingStars.css';
import shared from './Shared';
import ticketIcon from './images/ticket.svg';
import starlet from './images/starlet.png';
import flippingStarsLogo from './images/Flipping_stars.png';
import headsCounterLogo from './images/HeadsCounterLogo.png';
import tailsCounterLogo from './images/TailsCounterLogo.png';
import exitButton from './images/ExitButton.png';

// Navigation icons
import HomeIcon_normal from './images/Home_normal.svg';
import HomeIcon_selected from './images/Home_selected.svg';
import Task_normal from './images/Task_normal.svg';
import Task_selected from './images/Task_selected.svg';
import Friends_normal from './images/Friends_normal.svg';
import Friends_selected from './images/Friends_selected.svg';
import Market_normal from './images/Market_normal.svg';
import Market_selected from './images/Market_selected.svg';
import ID_normal from './images/ID_normal.svg';
import ID_selected from './images/ID_selected.svg';

const betOptions = [1, 10, 20, 50, 100, 500];

const FlippingStars = ({ onClose, setShowProfileView, setActiveTab }) => {
  const [selectedSide, setSelectedSide] = useState('HEADS');
  const [selectedBet, setSelectedBet] = useState(10);
  const [tickets, setTickets] = useState(0);
  const [starlets, setStarlets] = useState(0);
  const [headsCount, setHeadsCount] = useState(0);
  const [tailsCount, setTailsCount] = useState(0);
  // Thay đổi logic streak - chỉ lưu count, không lưu side
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalFlips, setTotalFlips] = useState(0);
  const [autoFlip, setAutoFlip] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showAllInConfirm, setShowAllInConfirm] = useState(false);
  const [showCustomConfirm, setShowCustomConfirm] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [showAutoFlipOverlay, setShowAutoFlipOverlay] = useState(false);
  const [selectedAutoFlipCount, setSelectedAutoFlipCount] = useState(null);
  
  // New states for flip functionality
  const [isFlipping, setIsFlipping] = useState(false);
  const [lastFlipResult, setLastFlipResult] = useState(null);
  const [showFlipResult, setShowFlipResult] = useState(false);
  
  // Auto flip states
  const [autoFlipCount, setAutoFlipCount] = useState(0);
  const [autoFlipTarget, setAutoFlipTarget] = useState(0);
  const [isAutoFlipping, setIsAutoFlipping] = useState(false);
  // Thêm ref để lưu timeout ID
  const autoFlipTimeoutRef = useRef(null);
  
  // Thay thế shouldStopAutoFlip state bằng useRef
  const shouldStopAutoFlipRef = useRef(false);

  // Function to check if a bet amount is affordable
  const isBetAffordable = (betAmount) => {
    if (betAmount === 'all-in') {
      return starlets > 0; // All-in is always affordable if user has any starlets
    } else if (betAmount === 'custom') {
      const customBet = parseInt(customAmount) || 0;
      return customBet > 0 && customBet <= starlets;
    } else if (typeof betAmount === 'number') {
      return betAmount <= starlets;
    } else {
      return false; // Invalid bet amount
    }
  };

  useEffect(() => {
    const setupProfileData = async () => {
      if (shared.userProfile) {
        const userStarlets = shared.userProfile.UserToken?.find(token => token.prop_id === 10020);
        if (userStarlets) {
          setStarlets(userStarlets.num);
        }

        const userTicket = shared.userProfile.UserToken?.find(token => token.prop_id === 10010);
        if (userTicket) {
          setTickets(userTicket.num);
        }
      }
    };

    setupProfileData();
  }, [shared.userProfile]); // Add dependency to refresh when userProfile changes

  useEffect(() => {
    // Show welcome overlay when totalFlips is 0
    setShowWelcome(totalFlips === 0);
  }, [totalFlips]);

  useEffect(() => {
    // Debug auto flip state changes
    console.log('Auto flip state changed:', {
      isAutoFlipping,
      autoFlip,
      autoFlipTarget,
      autoFlipCount
    });
  }, [isAutoFlipping, autoFlip, autoFlipTarget, autoFlipCount]);

  useEffect(() => {
    // Prevent body scroll when welcome overlay or ALL IN confirmation is shown
    if (showWelcome || showAllInConfirm || showCustomConfirm || showAutoFlipOverlay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showWelcome, showAllInConfirm, showCustomConfirm, showAutoFlipOverlay]);

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    // Set totalFlips to 1 so welcome doesn't show again
    setTotalFlips(0);
  };

  const handleAllInClick = () => {
    // Enable ALL IN functionality
    setShowAllInConfirm(true);
  };

  const handleAllInConfirm = () => {
    setShowAllInConfirm(false);
    setSelectedBet('all-in');
    // Here you can add the actual ALL IN logic
  };

  const handleAllInCancel = () => {
    setShowAllInConfirm(false);
  };

  const handleCustomClick = () => {
    // Enable Custom Amount functionality
    setShowCustomConfirm(true);
  };

  const handleCustomConfirm = () => {
    // Clamp to available starlets
    const amountNum = Math.min(parseInt(customAmount) || 0, starlets);
    const finalAmount = amountNum.toString();
    setShowCustomConfirm(false);
    setSelectedBet('custom');
    setCustomAmount(finalAmount);
    console.log('Custom amount set:', finalAmount); // Debug log
  };

  const handleKeypadInput = (value) => {
    if (value === 'delete') {
      setCustomAmount(prev => prev.slice(0, -1));
    } else if (value === 'confirm') {
      handleCustomConfirm();
    } else {
      // Limit to 6 digits and clamp to available starlets
      setCustomAmount(prev => {
        if ((prev || '').length >= 6) return prev;
        const nextRaw = prev === '0' ? value : (prev || '') + value;
        let nextNum = parseInt(nextRaw) || 0;
        if (nextNum > starlets) nextNum = starlets;
        return nextNum.toString();
      });
    }
  };

  const handleAutoFlipClick = () => {
    if (isAutoFlipping) {
      // Clear timeout và dừng ngay lập tức
      if (autoFlipTimeoutRef.current) {
        clearTimeout(autoFlipTimeoutRef.current);
        autoFlipTimeoutRef.current = null;
      }
      setIsAutoFlipping(false);
      setAutoFlip(false);
      setAutoFlipTarget(0);
      setAutoFlipCount(0);
    } else if (autoFlip) {
      // If auto flip is ON but not currently flipping, turn it OFF
      setAutoFlip(false);
      setSelectedAutoFlipCount(null);
    } else {
      // If auto flip is OFF, show overlay to select options
      setShowAutoFlipOverlay(true);
    }
  };

  const handleAutoFlipConfirm = () => {
    if (selectedAutoFlipCount !== null) {
      // Check if the selected bet is affordable before starting auto flip
      if (!isBetAffordable(selectedBet)) {
        shared.showPopup({
          type: 0,
          title: 'Insufficient Starlets',
          message: 'You don\'t have enough Starlets for the selected bet amount'
        });
        return;
      }
      
      console.log('Starting auto flip with count:', selectedAutoFlipCount);
      setAutoFlip(true);
      setAutoFlipTarget(selectedAutoFlipCount);
      setAutoFlipCount(0);
      setShowAutoFlipOverlay(false);
      
      // Start auto flipping immediately
      startAutoFlip(selectedAutoFlipCount);
    }
  };

  const handleAutoFlipCancel = () => {
    setShowAutoFlipOverlay(false);
    setSelectedAutoFlipCount(null);
  };

  // Function to start auto flipping
  const startAutoFlip = async (targetCount) => {
    console.log('startAutoFlip called with targetCount:', targetCount, 'isAutoFlipping:', isAutoFlipping);
    if (isAutoFlipping) return;
    
    console.log('Setting up auto flip...');
    shouldStopAutoFlipRef.current = false; // Reset flag
    let currentCount = 0;
    
    const performAutoFlip = async () => {
      console.log('performAutoFlip called, currentCount:', currentCount, 'targetCount:', targetCount, 'shouldStopAutoFlip:', shouldStopAutoFlipRef.current);
      
      // Check if user wants to stop auto flip
      if (shouldStopAutoFlipRef.current) {
        console.log('Stopping auto flip due to shouldStopAutoFlip flag');
        setIsAutoFlipping(false);
        setAutoFlip(false);
        setAutoFlipTarget(0);
        setAutoFlipCount(0);
        shouldStopAutoFlipRef.current = false;
        return;
      }
      
      if (currentCount >= targetCount && targetCount !== 'infinite') {
        // Auto flip completed
        console.log('Auto flip completed');
        setIsAutoFlipping(false);
        setAutoFlip(false);
        setAutoFlipTarget(0);
        setAutoFlipCount(0);
        return;
      }
      
      // Calculate bet amount for auto flip
      let betAmount = selectedBet;
      if (selectedBet === 'all-in') {
        betAmount = starlets;
      } else if (selectedBet === 'custom') {
        betAmount = parseInt(customAmount) || 0;
      }
      
      // Check if user has enough starlets
      if (starlets < betAmount) {
        await shared.showPopup({
          type: 0,
          title: 'Insufficient Starlets',
          message: 'Auto flip stopped due to insufficient Starlets'
        });
        setIsAutoFlipping(false);
        setAutoFlip(false);
        setAutoFlipTarget(0);
        setAutoFlipCount(0);
        return;
      }
      
      // Perform single flip
      const isHeads = selectedSide === 'HEADS';
      const result = await shared.flipCoin(isHeads, betAmount);
      
      if (result.success) {
        currentCount++;
        setAutoFlipCount(currentCount);
        
        // Update counters and UI (same as handleFlip)
        setTotalFlips(prev => prev + 1);
        
        if (result.isWin) {
          // Cập nhật streak - tăng lên 1 khi thắng
          setCurrentStreak(prev => prev + 1);
          
          if (selectedSide === 'HEADS') {
            setHeadsCount(prev => prev + 1);
          } else {
            setTailsCount(prev => prev + 1);
          }
        } else {
          // Reset streak về 0 khi thua
          setCurrentStreak(0);
          
          const actualResult = selectedSide === 'HEADS' ? 'TAILS' : 'HEADS';
          if (actualResult === 'HEADS') {
            setHeadsCount(prev => prev + 1);
          } else {
            setTailsCount(prev => prev + 1);
          }
        }
        
        // Update starlets
        const updatedStarlets = shared.getStarlets();
        setStarlets(updatedStarlets);
        
        // Continue auto flip after a short delay
        autoFlipTimeoutRef.current = setTimeout(() => {
          performAutoFlip();
        }, 1000);
        
      } else {
        // Stop auto flip on error
        await shared.showPopup({
          type: 0,
          title: 'Auto Flip Error',
          message: result.error || 'Auto flip stopped due to an error'
        });
        setIsAutoFlipping(false);
        setAutoFlip(false);
        setAutoFlipTarget(0);
        setAutoFlipCount(0);
      }
    };
    
    // Set auto flip state and start the process
    setIsAutoFlipping(true);
    setAutoFlip(true);
    setAutoFlipTarget(targetCount);
    setAutoFlipCount(0);
    
    // Start the auto flip process
    performAutoFlip();
  };

  // New function to handle coin flip
  const handleFlip = async () => {
    if (isFlipping) return; // Prevent multiple clicks
    
    // Validate bet amount - handle regular bet amounts, ALL IN, and Custom Amount
    let betAmount = selectedBet;
    
    if (selectedBet === 'all-in') {
      betAmount = starlets; // Use all available starlets
    } else if (selectedBet === 'custom') {
      betAmount = parseInt(customAmount) || 0;
    } else if (typeof selectedBet !== 'number') {
      await shared.showPopup({
        type: 0,
        title: 'Invalid Bet',
        message: 'Please select a valid bet amount'
      });
      return;
    }
    
    if (betAmount <= 0) {
      await shared.showPopup({
        type: 0,
        title: 'Invalid Bet',
        message: 'Please select a valid bet amount'
      });
      return;
    }
    
    if (betAmount > starlets) {
      await shared.showPopup({
        type: 0,
        title: 'Insufficient Starlets',
        message: 'You don\'t have enough Starlets for this bet'
      });
      return;
    }
    
    setIsFlipping(true);
    
    try {
      const isHeads = selectedSide === 'HEADS';
      const result = await shared.flipCoin(isHeads, betAmount);
      
      if (result.success) {
        // Update flip result
        setLastFlipResult({
          isWin: result.isWin,
          reward: result.reward,
          betAmount: betAmount,
          selectedSide: selectedSide,
          actualResult: result.isWin ? selectedSide : (selectedSide === 'HEADS' ? 'TAILS' : 'HEADS')
        });
        
        // Update counters
        setTotalFlips(prev => prev + 1);
        
        if (result.isWin) {
          // Cập nhật streak - tăng lên 1 khi thắng
          setCurrentStreak(prev => prev + 1);
          
          // Update heads/tails count
          if (selectedSide === 'HEADS') {
            setHeadsCount(prev => prev + 1);
          } else {
            setTailsCount(prev => prev + 1);
          }
        } else {
          // Reset streak về 0 khi thua
          setCurrentStreak(0);
          
          // Update heads/tails count for the actual result
          const actualResult = selectedSide === 'HEADS' ? 'TAILS' : 'HEADS';
          if (actualResult === 'HEADS') {
            setHeadsCount(prev => prev + 1);
          } else {
            setTailsCount(prev => prev + 1);
          }
        }
        
        // Update starlets from shared
        const updatedStarlets = shared.getStarlets();
        setStarlets(updatedStarlets);
        
        // Show result
        setShowFlipResult(true);
        
        // Hide result after 3 seconds
        setTimeout(() => {
          setShowFlipResult(false);
          setLastFlipResult(null);
        }, 3000);
        
      } else {
        await shared.showPopup({
          type: 0,
          title: 'Flip Failed',
          message: result.error || 'Failed to flip coin'
        });
      }
    } catch (error) {
      console.error('Flip error:', error);
      await shared.showPopup({
        type: 0,
        title: 'Error',
        message: 'An error occurred while flipping'
      });
    } finally {
      setIsFlipping(false);
    }
  };

  // Thêm useEffect để theo dõi shouldStopAutoFlip
  useEffect(() => {
    if (shouldStopAutoFlipRef.current && isAutoFlipping) {
      console.log('Stopping auto flip due to shouldStopAutoFlip flag');
      setIsAutoFlipping(false);
      setAutoFlip(false);
      setAutoFlipTarget(0);
      setAutoFlipCount(0);
      shouldStopAutoFlipRef.current = false;
    }
  }, [isAutoFlipping]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (autoFlipTimeoutRef.current) {
        clearTimeout(autoFlipTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="fc_app">
      {/* Welcome Overlay */}
      {showWelcome && (
        <div className="fc_welcome-overlay">
          <div className="fc_welcome-content">
            {/* Welcome Text */}
            <div className="fc_welcome-title">WELCOME TO</div>
            
            {/* Logo */}
            <div className="fc_welcome-logo-container">
              <img src={flippingStarsLogo} alt="Flipping Stars" className="fc_welcome-logo-image" />
            </div>
            
            
            
            {/* Bet Button Demo (non-interactive) */}
            <div className="fc_welcome-bet-demo">
              <div className="fc_bet-button fc_selected fc_welcome-bet-button">
                <div className="fc_corner fc_corner-top-left"></div>
                <div className="fc_corner fc_corner-top-right"></div>
                <div className="fc_corner fc_corner-bottom-left"></div>
                <div className="fc_corner fc_corner-bottom-right"></div>
                <div className="fc_bet-content">
                  <span className="fc_bet-amount">10</span>
                  <img src={starlet} alt="starlet" className="fc_bet-starlet-icon" />
                </div>
              </div>
            </div>

            {/* Pick Value Text */}
            <div className="fc_welcome-pick-text">PICK THE VALUE YOU<br/>WANT TO STAKE</div>
            
            {/* Select Text */}
            <div className="fc_welcome-select-text">SELECT</div>
            
            {/* Coin Selection Demo (non-interactive) */}
            <div className="fc_welcome-coin-demo">
              <div className="fc_coin-button fc_selected fc_welcome-coin-button">
                <div className="fc_corner fc_corner-top-left"></div>
                <div className="fc_corner fc_corner-top-right"></div>
                <div className="fc_corner fc_corner-bottom-left"></div>
                <div className="fc_corner fc_corner-bottom-right"></div>
                <div className="fc_coin-content">
                  <div className="fc_coin-title">HEADS</div>
                </div>
              </div>
              <div className="fc_coin-button fc_welcome-coin-button">
                <div className="fc_corner fc_corner-top-left"></div>
                <div className="fc_corner fc_corner-top-right"></div>
                <div className="fc_corner fc_corner-bottom-left"></div>
                <div className="fc_corner fc_corner-bottom-right"></div>
                <div className="fc_coin-content">
                  <div className="fc_coin-title">TAILS</div>
                </div>
              </div>
            </div>
            
            {/* Press Flip Text */}
            <div className="fc_welcome-flip-text">PRESS FLIP AND<br/><span className="fc_welcome-win-text">WIN STARLETS</span></div>
            
            {/* LFG Button */}
            <button className="fc_welcome-lfg-btn" onClick={handleWelcomeClose}>
              <div className="fc_flip-content">LFG!</div>
            </button>
          </div>
        </div>
      )}

      {/* ALL IN Confirmation Overlay */}
      {showAllInConfirm && (
        <div className="fc_allin-overlay">
          <div className="fc_allin-content">
            {/* ALL IN Text */}
            <div className="fc_allin-title">ALL IN!</div>
            
            {/* ARE YOU SURE Section */}
            <div className="fc_allin-question">ARE YOU SURE?</div>
            
            {/* Buttons */}
            <div className="fc_allin-buttons">
              <button className="fc_allin-btn fc_allin-no" onClick={handleAllInCancel}>
                <div className="fc_flip-content">NO</div>
              </button>
              <button className="fc_allin-btn fc_allin-yes" onClick={handleAllInConfirm}>
                <div className="fc_flip-content">YES</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Overlay */}
      {showCustomConfirm && (
        <div className="fc_custom-overlay">
          <div className="fc_custom-overlay-content">
            {/* Number Keyboard */}
            <div className="fc_keyboard">
              <div className="fc_keyboard-shadow">
                <div className="fc_keyboard-container">
                  <input 
                    type="text" 
                    className="fc_custom-display" 
                    value={customAmount || '0'} 
                    readOnly 
                  />
                  <div className="fc_keyboard-grid">
                    <button className="fc_keyboard-key" onClick={() => handleKeypadInput('1')}>1</button>
                    <button className="fc_keyboard-key" onClick={() => handleKeypadInput('2')}>2</button>
                    <button className="fc_keyboard-key" onClick={() => handleKeypadInput('3')}>3</button>
                    <button className="fc_keyboard-key" onClick={() => handleKeypadInput('4')}>4</button>
                    <button className="fc_keyboard-key" onClick={() => handleKeypadInput('5')}>5</button>
                    <button className="fc_keyboard-key" onClick={() => handleKeypadInput('6')}>6</button>
                    <button className="fc_keyboard-key" onClick={() => handleKeypadInput('7')}>7</button>
                    <button className="fc_keyboard-key" onClick={() => handleKeypadInput('8')}>8</button>
                    <button className="fc_keyboard-key" onClick={() => handleKeypadInput('9')}>9</button>
                    <button className="fc_keyboard-key" onClick={() => handleKeypadInput('delete')}>⌫</button>
                    <button className="fc_keyboard-key" onClick={() => handleKeypadInput('0')}>0</button>
                    <button className="fc_keyboard-key" onClick={() => handleKeypadInput('confirm')}>✔</button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* SET Button */}
            <div className="fc_custom-buttons">
              <button className="fc_custom-btn fc_custom-set" onClick={handleCustomConfirm}>
                <div className="fc_flip-content">SET</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto Flip Overlay */}
      {showAutoFlipOverlay && (
        <div className="fc_autoflip-overlay">
          <div className="fc_autoflip-content">
            {/* Close Button */}
            <div className="fc_autoflip-header">
              <button className="fc_autoflip-close" onClick={handleAutoFlipCancel}>
                <img src={exitButton} alt="Close" className="fc_autoflip-close-icon" />
              </button>
            </div>
            
            {/* Number of flips selection */}
            <div className="fc_autoflip-options">
              {[10, 20, 30, 40, 50].map((count) => (
                <button
                  key={count}
                  className={`fc_autoflip-option ${selectedAutoFlipCount === count ? 'fc_selected' : ''}`}
                  onClick={() => setSelectedAutoFlipCount(count)}
                >
                  <div className="fc_autoflip-option-content">X{count}</div>
                </button>
              ))}
              
              {/* Infinite option */}
              <button
                className={`fc_autoflip-option fc_autoflip-infinite ${selectedAutoFlipCount === 'infinite' ? 'fc_selected' : ''}`}
                onClick={() => setSelectedAutoFlipCount('infinite')}
              >
                <div className="fc_autoflip-option-content">∞</div>
              </button>
            </div>
            
            {/* Confirm Button */}
            <div className="fc_autoflip-buttons">
              <button 
                className={`fc_autoflip-btn fc_autoflip-confirm ${selectedAutoFlipCount && isBetAffordable(selectedBet) ? '' : 'fc_disabled'}`} 
                onClick={handleAutoFlipConfirm}
                disabled={!selectedAutoFlipCount || !isBetAffordable(selectedBet)}
              >
                <div className="fc_flip-content">
                  {selectedAutoFlipCount === 'infinite' ? 'FLIP ∞' : 
                   selectedAutoFlipCount ? `FLIP X${selectedAutoFlipCount}` : 'FLIP'}
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header - matching Market.js stats-header */}
      <header className="fc_stats-header">
        <button 
          className="fc_profile-pic-main"
          onClick={() => setShowProfileView && setShowProfileView(true)}
        >
          <img 
            src={shared.avatars[shared.userProfile ? shared.userProfile.pictureIndex : 0]?.src} 
            alt="Profile" 
          />
        </button>
        <div className="fc_stat-item-main-text" onClick={() => setShowProfileView && setShowProfileView(true)}>
          GM {shared.telegramUserData?.firstName || 'User'}!
        </div>
        <div className="fc_stats-main">
          <button 
            className="fc_stat-item-main"
            onClick={() => setShowProfileView && setShowProfileView(true)}
          >
            <img src={ticketIcon} alt="Tickets" />
            <span className="fc_stat-item-main-text">{tickets}</span>
          </button>
          <button 
            className="fc_stat-item-main"
            onClick={() => setShowProfileView && setShowProfileView(true)}
          >
            <img src={starlet} alt="Starlets" />
            <span className="fc_stat-item-main-text">{starlets}</span>
          </button>
        </div>
      </header>

      {/* Logo */}
      <div className="fc_logo-container">
        <img src={flippingStarsLogo} alt="Flipping Stars" className="fc_logo-image" />
      </div>

      {/* Total Flips and Auto Flip Controls */}
      <div className="fc_flip-controls">
        <div className="fc_total-flips">
          <span className="fc_total-flips-label">TOTAL FLIPS</span>
          <span className="fc_total-flips-count">{totalFlips.toLocaleString().padStart(8, '0')}</span>
        </div>
        <button 
          className={`fc_auto-flip-toggle ${autoFlip ? 'fc_auto-flip-on' : 'fc_auto-flip-off'}`}
          onClick={handleAutoFlipClick}
        >
          <span className="fc_auto-flip-text">AUTO FLIP</span>
          <span className="fc_auto-flip-separator">|</span>
          <span className="fc_auto-flip-status">
            {autoFlip ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>

      {/* Coin face selection - cập nhật hiển thị streak */}
      <div className="fc_coin-select">
        <button
          className={`fc_coin-button ${selectedSide === 'HEADS' ? 'fc_selected' : ''}`}
          onClick={() => setSelectedSide('HEADS')}
        >
          {/* Counter positioned above button */}
          <div className="fc_coin-counter-wrapper">
            <img src={headsCounterLogo} alt="Heads Logo" className="fc_coin-logo" />
            <span className="fc_coin-counter">{headsCount}</span>
          </div>
          
          <div className="fc_corner fc_corner-top-left"></div>
          <div className="fc_corner fc_corner-top-right"></div>
          <div className="fc_corner fc_corner-bottom-left"></div>
          <div className="fc_corner fc_corner-bottom-right"></div>
          <div className="fc_coin-content">
            <div className="fc_coin-title">HEADS</div>
          </div>
          
          {/* Streak hiển thị khi button được chọn và có streak > 0 */}
          {selectedSide === 'HEADS' && currentStreak > 0 && (
            <div className="fc_coin-streak-wrapper">
              <div className="fc_coin-streak">STREAK</div>
              <div className="fc_coin-streak-multiplier">X{currentStreak}</div>
            </div>
          )}
        </button>
        
        <button
          className={`fc_coin-button ${selectedSide === 'TAILS' ? 'fc_selected' : ''}`}
          onClick={() => setSelectedSide('TAILS')}
        >
          {/* Counter positioned above button */}
          <div className="fc_coin-counter-wrapper">
            <img src={tailsCounterLogo} alt="Tails Logo" className="fc_coin-logo" />
            <span className="fc_coin-counter">{tailsCount}</span>
          </div>
          
          <div className="fc_corner fc_corner-top-left"></div>
          <div className="fc_corner fc_corner-top-right"></div>
          <div className="fc_corner fc_corner-bottom-left"></div>
          <div className="fc_corner fc_corner-bottom-right"></div>
          <div className="fc_coin-content">
            <div className="fc_coin-title">TAILS</div>
          </div>
          
          {/* Streak hiển thị khi button được chọn và có streak > 0 */}
          {selectedSide === 'TAILS' && currentStreak > 0 && (
            <div className="fc_coin-streak-wrapper">
              <div className="fc_coin-streak">STREAK</div>
              <div className="fc_coin-streak-multiplier">X{currentStreak}</div>
            </div>
          )}
        </button>
      </div>

      {/* Bet buttons */}
      <div className="fc_bet-buttons">
        {betOptions.map((bet) => (
          <button
            key={bet}
            className={`fc_bet-button ${selectedBet === bet ? 'fc_selected' : ''} ${!isBetAffordable(bet) ? 'fc_insufficient-funds' : ''}`}
            onClick={() => isBetAffordable(bet) && setSelectedBet(bet)}
            disabled={!isBetAffordable(bet)}
          >
            {/* Corner borders */}
            <div className="fc_corner fc_corner-top-left"></div>
            <div className="fc_corner fc_corner-top-right"></div>
            <div className="fc_corner fc_corner-bottom-left"></div>
            <div className="fc_corner fc_corner-bottom-right"></div>
            
            <div className="fc_bet-content">
              <span className="fc_bet-amount">{bet}</span>
              <img src={starlet} alt="starlet" className="fc_bet-starlet-icon" />
            </div>
          </button>
        ))}
        <button 
          className={`fc_bet-button fc_all-in ${selectedBet === 'all-in' ? 'fc_selected' : ''} ${!isBetAffordable('all-in') ? 'fc_insufficient-funds' : ''}`}
          onClick={isBetAffordable('all-in') ? handleAllInClick : undefined}
          disabled={!isBetAffordable('all-in')}
        >
          <div className="fc_corner fc_corner-top-left"></div>
          <div className="fc_corner fc_corner-top-right"></div>
          <div className="fc_corner fc_corner-bottom-left"></div>
          <div className="fc_corner fc_corner-bottom-right"></div>
          <div className="fc_bet-content fc_all-in-content">
            <div className="fc_all-in-title">ALL IN</div>
            <div className="fc_all-in-details">
              <span className="fc_all-in-amount">{selectedBet === 'all-in' ? starlets : 'ALL'}</span>
              <img src={starlet} alt="starlet" className="fc_all-in-starlet" />
            </div>
          </div>
        </button>
        <button 
          className={`fc_bet-button fc_custom-amount ${selectedBet === 'custom' ? 'fc_selected' : ''} ${starlets === 0 ? 'fc_insufficient-funds' : ''}`}
          onClick={starlets > 0 ? handleCustomClick : undefined}
          disabled={starlets === 0}
        >
          <div className="fc_corner fc_corner-top-left"></div>
          <div className="fc_corner fc_corner-top-right"></div>
          <div className="fc_corner fc_corner-bottom-left"></div>
          <div className="fc_corner fc_corner-bottom-right"></div>
          <div className="fc_bet-content fc_custom-content">
            <div className="fc_custom-amount-display">{selectedBet === 'custom' && customAmount ? customAmount.padStart(4, '0') : '0000'}</div>
            <div className="fc_custom-text">CUSTOM AMOUNT</div>
          </div>
        </button>
        <button className="fc_bet-button fc_disabled">
          <div className="fc_corner fc_corner-top-left"></div>
          <div className="fc_corner fc_corner-top-right"></div>
          <div className="fc_corner fc_corner-bottom-left"></div>
          <div className="fc_corner fc_corner-bottom-right"></div>
          <div className="fc_bet-content">DOUBLE OR NOTHING</div>
        </button>
      </div>

      {/* Flip button */}
      {!
        isBetAffordable(selectedBet)
        ? (
          <div className="fc_flip-btn-container">
            <button className={`fc_flip-btn fc_flip-btn-insufficient`} disabled>
              <div className="fc_flip-content">NOT ENOUGH STARLETS</div>
            </button>
            <button
              className="fc_buy-more-btn"
              onClick={() => {
                if (onClose) onClose();
                if (setActiveTab) setActiveTab('market');
              }}
            >
              <div className="fc_flip-content">BUY MORE</div>
            </button>
          </div>
        ) : (
          <button 
            className={`fc_flip-btn ${isFlipping || isAutoFlipping ? 'fc_flip-btn-loading' : ''}`} 
            onClick={handleFlip}
            disabled={isFlipping || isAutoFlipping}
          >
            <div className="fc_flip-content">
              {isFlipping ? 'FLIPPING...' : 
               isAutoFlipping ? `AUTO FLIP ${autoFlipCount}/${autoFlipTarget === 'infinite' ? '∞' : autoFlipTarget}` : 
               'FLIP'}
            </div>
          </button>
        )
      }

      {/* Flip Result Overlay */}
      {showFlipResult && lastFlipResult && (
        <div className="fc_flip-result-overlay">
          <div className="fc_flip-result-content">
            <div className="fc_flip-result-header">
              <h3>FLIP RESULT</h3>
              <button className="fc_flip-result-close" onClick={() => setShowFlipResult(false)}>
                <img src={exitButton} alt="Close" />
              </button>
            </div>
            <div className="fc_flip-result-details">
              <p>You bet: <span className="fc_flip-result-bet-amount">{lastFlipResult.betAmount}</span></p>
              <p>You won: <span className="fc_flip-result-reward">{lastFlipResult.reward}</span></p>
              <p>Actual result: <span className="fc_flip-result-actual-result">{lastFlipResult.actualResult}</span></p>
                             <p>Win/Loss: <span className={`fc_flip-result-win-loss ${lastFlipResult.isWin ? 'win' : 'loss'}`}>{lastFlipResult.isWin ? 'WIN' : 'LOSS'}</span></p>
            </div>
            <button className="fc_flip-result-ok-btn" onClick={() => setShowFlipResult(false)}>OK</button>
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <nav className="fc_bottom-nav">
        <button onClick={() => {
          if (onClose) onClose();
          if (setActiveTab) setActiveTab('home');
        }}>
          <img src={HomeIcon_normal} alt="Home" />
        </button>
        <button onClick={() => {
          if (onClose) onClose();
          if (setActiveTab) setActiveTab('tasks');
        }}>
          <img src={Task_normal} alt="Tasks" />
        </button>
        <button onClick={() => {
          if (onClose) onClose();
          if (setActiveTab) setActiveTab('frens');
        }}>
          <img src={Friends_normal} alt="Friends" />
        </button>
        <button onClick={() => {
          if (onClose) onClose();
          if (setActiveTab) setActiveTab('market');
        }}>
          <img src={Market_normal} alt="Market" />
        </button>
        <button onClick={() => {
          if (onClose) onClose();
          if (setActiveTab) setActiveTab('fslid');
        }}>
          <img src={ID_normal} alt="FSLID" />
        </button>
      </nav>
    </div>
  );
};

export default FlippingStars;

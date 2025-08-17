/*
 * FlippingStars.js - Coin Flipping Game Component
 * 
 * This component uses PP Neue Machina Inktrap font variant for all text elements.
 * Font configuration is handled in FlippingStars.css with @font-face declarations
 * and CSS custom properties for consistent typography.
 */

import React, { useState, useEffect, useRef } from 'react';
import './FlippingStars.css';
import shared from './Shared';
import CoinAnimation from './CoinAnimation';
import ticketIcon from './images/ticket.svg';
import starlet from './images/starlet.png';
import flippingStarsLogo from './images/Flipping_stars.png';
import winFlippinStar from './images/WinFlippinStar.png';
import loseFlippinStar from './images/LoseFlippinStar.png';
import headsCounterLogo from './images/HeadsCounterLogo.png';
import tailsCounterLogo from './images/TailsCounterLogo.png';
import exitButton from './images/ExitButton.png';
import settingsIcon from './images/Settings.png';

// Sound imports
import winSound from './sounds/Win.mp3';
import loseSound from './sounds/Lose.mp3';
import coinSpinningSound from './sounds/coin-spinning.mp3';

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

const betOptions = [10, 20, 50, 70, 100, 500];
const WELCOME_FLAG_KEY = 'flippingStarsWelcomeShown';

const FlippingStars = ({ onClose, setShowProfileView, setActiveTab }) => {
  const [selectedSide, setSelectedSide] = useState('HEADS');
  const [selectedBet, setSelectedBet] = useState(10);
  const [tickets, setTickets] = useState(0);
  const [starlets, setStarlets] = useState(0);
  const [headsCount, setHeadsCount] = useState(0);
  const [tailsCount, setTailsCount] = useState(0);
  // Streak theo kết quả thực tế (HEADS/TAILS) và số lần liên tiếp
  const [streakSide, setStreakSide] = useState(null);
  const [streakCount, setStreakCount] = useState(0);
  const streakSideRef = useRef(null);
  const streakCountRef = useRef(0);
  const [totalFlips, setTotalFlips] = useState(0);
  const [autoFlip, setAutoFlip] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showAllInConfirm, setShowAllInConfirm] = useState(false);
  const [showCustomConfirm, setShowCustomConfirm] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [customAmountError, setCustomAmountError] = useState('');
  const [showAutoFlipOverlay, setShowAutoFlipOverlay] = useState(false);
  const [selectedAutoFlipCount, setSelectedAutoFlipCount] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  
  // New states for flip functionality
  const [isFlipping, setIsFlipping] = useState(false);
  // Logo swap and reward overlay
  const [logoImage, setLogoImage] = useState(flippingStarsLogo);
  const [winReward, setWinReward] = useState(null);
  const logoTimeoutRef = useRef(null);
  
  // Auto flip states
  const [autoFlipCount, setAutoFlipCount] = useState(0);
  const [autoFlipTarget, setAutoFlipTarget] = useState(0);
  const [isAutoFlipping, setIsAutoFlipping] = useState(false);
  // Thêm ref để lưu timeout ID
  const autoFlipTimeoutRef = useRef(null);
  
  // Thay thế shouldStopAutoFlip state bằng useRef
  const shouldStopAutoFlipRef = useRef(false);

  // 3D animation overlay state and pending result
  const [show3D, setShow3D] = useState(false);
  const pendingResultRef = useRef(null);
  const animationDoneRef = useRef(false);
  const pendingBetRef = useRef(0);
  const pendingSideRef = useRef('HEADS');
  const pendingAllInRef = useRef(false);
  const manualFlipTimerRef = useRef(null);

  // Double or Nothing states
  const [lastWinAmount, setLastWinAmount] = useState(0);
  const [canDouble, setCanDouble] = useState(false);
  const [useDoubleNext, setUseDoubleNext] = useState(false);

  // Sound system states
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState(0.7);
  
  // Audio refs for sound management
  const audioRefs = useRef({
    win: null,
    lose: null,
    coinSpinning: null
  });

  // Function to format win reward into 4 digits for display
  const formatWinReward = (amount) => {
    if (!amount) return ['0', '0', '0', '0'];
    
    // Convert to string and ensure it's a number
    const num = parseInt(amount) || 0;
    const str = num.toString();
    
    // If number is larger than 4 digits, show last 4 digits
    if (str.length > 4) {
      return str.slice(-4).split('');
    }
    
    // Pad with leading zeros to make it 4 digits
    return str.padStart(4, '0').split('');
  };

  // Sound management functions
  const initializeAudio = () => {
    // Create audio elements for each sound
    const audioElements = {
      win: new Audio(winSound),
      lose: new Audio(loseSound),
      coinSpinning: new Audio(coinSpinningSound)
    };

    // Configure audio properties
    Object.keys(audioElements).forEach(key => {
      const audio = audioElements[key];
      audio.volume = soundVolume;
      audio.preload = 'auto';
      
      // Special handling for coin spinning sound (loop during animation)
      if (key === 'coinSpinning') {
        audio.loop = true;
      }
    });

    audioRefs.current = audioElements;
  };

  const playSound = (soundType) => {
    if (!isSoundEnabled) return;
    
    const audio = audioRefs.current[soundType];
    if (audio) {
      try {
        // Reset audio to beginning
        audio.currentTime = 0;
        audio.volume = soundVolume;
        audio.play().catch(error => {
          console.log('Audio play failed:', error);
        });
      } catch (error) {
        console.log('Sound play error:', error);
      }
    }
  };

  const stopSound = (soundType) => {
    const audio = audioRefs.current[soundType];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const stopAllSounds = () => {
    Object.keys(audioRefs.current).forEach(soundType => {
      stopSound(soundType);
    });
  };

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
    if (!isSoundEnabled) {
      stopAllSounds();
    }
  };

  const adjustVolume = (newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setSoundVolume(clampedVolume);
    
    // Update all audio elements with new volume
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.volume = clampedVolume;
      }
    });
  };

  // Debug function to test sounds (can be removed in production)
  const testSounds = () => {
    if (!isSoundEnabled) {
      console.log('Sound is disabled');
      return;
    }
    
    console.log('Testing sounds...');
    console.log('Audio refs:', audioRefs.current);
    console.log('Sound volume:', soundVolume);
    
    // Test each sound
    Object.keys(audioRefs.current).forEach(soundType => {
      const audio = audioRefs.current[soundType];
      if (audio) {
        console.log(`${soundType} audio:`, audio);
        console.log(`${soundType} readyState:`, audio.readyState);
        console.log(`${soundType} paused:`, audio.paused);
      }
    });
  };

  // Function to show result on logo for 4 seconds
  const showResultOnLogo = (isWin, rewardAmount, duration = 10000) => {
    if (logoTimeoutRef.current) {
      clearTimeout(logoTimeoutRef.current);
      logoTimeoutRef.current = null;
    }
    if (isWin) {
      setLogoImage(winFlippinStar);
      setWinReward(rewardAmount || 0);
      
      // Play win sound for all wins
      playSound('win');
    } else {
      setLogoImage(loseFlippinStar);
      setWinReward(null);
      
      // Play lose sound
      playSound('lose');
    }
    
    // Only set logo timeout if auto flip is not being stopped
    if (!shouldStopAutoFlipRef.current) {
      logoTimeoutRef.current = setTimeout(() => {
        // Check again before resetting logo
        if (!shouldStopAutoFlipRef.current) {
          setLogoImage(flippingStarsLogo);
          setWinReward(null);
        }
      }, duration);
    }
  };

  // Function to check if a bet amount is affordable
  const isBetAffordable = (betAmount) => {
    if (betAmount === 'all-in') {
      return starlets > 0; // All-in is always affordable if user has any starlets
    } else if (betAmount === 'double') {
      return canDouble && lastWinAmount > 0 && lastWinAmount <= starlets;
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

  // Show welcome overlay only once per app session
  useEffect(() => {
    try {
      const shown = sessionStorage.getItem(WELCOME_FLAG_KEY);
      if (!shown) {
        setShowWelcome(true);
        sessionStorage.setItem(WELCOME_FLAG_KEY, '1');
      }
    } catch (e) {
      // Fallback if sessionStorage is unavailable
      setShowWelcome(true);
    }
  }, []);

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
    if (showWelcome || showAllInConfirm || showCustomConfirm || showAutoFlipOverlay || showSettings) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showWelcome, showAllInConfirm, showCustomConfirm, showAutoFlipOverlay, showSettings]);

  // Initialize audio system
  useEffect(() => {
    initializeAudio();
    
    // Cleanup audio when component unmounts
    return () => {
      stopAllSounds();
    };
  }, []); // Empty dependency array - only run once on mount

  const handleWelcomeClose = () => {
    setShowWelcome(false);
  };

  const handleAllInClick = () => {
    // Enable ALL IN functionality
    setShowAllInConfirm(true);
    // Clear any selected bet so no button is in selected state
    setSelectedBet(null);
  };

  const handleAllInConfirm = () => {
    setShowAllInConfirm(false);
    setUseDoubleNext(false);
    // Ensure no bet button is selected even after confirming
    setSelectedBet(null);
    // Select ALL IN for UI highlight and flip immediately with all current starlets
    handleFlip({ betAmount: starlets, allin: true });
  };

  const handleAllInCancel = () => {
    setShowAllInConfirm(false);
    // Clear any bet selection (unselect all buttons)
    setSelectedBet(null);
    setUseDoubleNext(false);
  };

  const handleCustomClick = () => {
    // Enable Custom Amount functionality
    setShowCustomConfirm(true);
  };

  const handleCustomConfirm = () => {
    const amountNum = parseInt(customAmount) || 0;
    
    // Check if amount is divisible by 10
    if (amountNum % 10 !== 0) {
      setCustomAmountError('DIVISIBLE BY 10 ONLY');
      return;
    }
    
    // Clear error if validation passes
    setCustomAmountError('');
    
    // Clamp to available starlets
    const finalAmount = Math.min(amountNum, starlets).toString();
    setShowCustomConfirm(false);
    
    // If custom amount is 0, select the first bet option (10 starlets)
    if (amountNum === 0) {
      setSelectedBet(10);
    } else {
      setSelectedBet('custom');
    }
    
    setCustomAmount(finalAmount);
    setUseDoubleNext(false);
    console.log('Custom amount set:', finalAmount); // Debug log
  };

  const handleKeypadInput = (value) => {
    if (value === 'delete') {
      setCustomAmount(prev => prev.slice(0, -1));
      setCustomAmountError(''); // Clear error when deleting
    } else if (value === 'confirm') {
      handleCustomConfirm();
    } else {
      // Clear error when typing new input
      setCustomAmountError('');
      
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
      // Dừng ngay lập tức, không cần chờ kết quả
      console.log('Stopping auto flip immediately...');
      
      // Stop all sounds immediately
      stopAllSounds();
      
      // Clear tất cả timeouts
      if (autoFlipTimeoutRef.current) {
        clearTimeout(autoFlipTimeoutRef.current);
        autoFlipTimeoutRef.current = null;
      }
      if (manualFlipTimerRef.current) {
        clearTimeout(manualFlipTimerRef.current);
        manualFlipTimerRef.current = null;
      }
      if (logoTimeoutRef.current) {
        clearTimeout(logoTimeoutRef.current);
        logoTimeoutRef.current = null;
      }
      
      // Reset states ngay lập tức
      setIsAutoFlipping(false);
      setAutoFlip(false);
      setAutoFlipTarget(0);
      setAutoFlipCount(0);
      setShow3D(false);
      setIsFlipping(false);
      
      // Reset logo về mặc định
      setLogoImage(flippingStarsLogo);
      setWinReward(null);
      
      // Auto-select bet phù hợp
      const currentStarlets = shared.getStarlets();
      selectLargestAffordableBet(currentStarlets);
      
    } else if (autoFlip) {
      // Nếu auto flip ON nhưng không đang flipping, tắt OFF
      setAutoFlip(false);
      setSelectedAutoFlipCount(null);
    } else {
      // Nếu auto flip OFF, hiển thị overlay chọn số lần
      setShowAutoFlipOverlay(true);
    }
  };

  const handleAutoFlipConfirm = () => {
    if (selectedAutoFlipCount !== null) {
      if (selectedBet === 'double') {
        shared.showPopup({
          type: 0,
          title: 'Not Supported',
          message: 'Double or Nothing cannot be used with Auto Flip'
        });
        return;
      }
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
      setUseDoubleNext(false);
      
      // Start auto flipping immediately
      startAutoFlip(selectedAutoFlipCount);
    }
  };

  const handleAutoFlipCancel = () => {
    setShowAutoFlipOverlay(false);
    setSelectedAutoFlipCount(null);
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleSettingsBack = () => {
    setShowSettings(false);
  };

  const handleStopAutoFlip = () => {
    console.log('Stopping auto flip...');
    shouldStopAutoFlipRef.current = true;
    
    // Stop all sounds when stopping auto flip
    stopAllSounds();
    
    // Clear any pending timeouts
    if (autoFlipTimeoutRef.current) {
      clearTimeout(autoFlipTimeoutRef.current);
      autoFlipTimeoutRef.current = null;
    }
    if (manualFlipTimerRef.current) {
      clearTimeout(manualFlipTimerRef.current);
      manualFlipTimerRef.current = null;
    }
    if (logoTimeoutRef.current) {
      clearTimeout(logoTimeoutRef.current);
      logoTimeoutRef.current = null;
    }
    
    // Reset states
    setIsAutoFlipping(false);
    setAutoFlip(false);
    setAutoFlipTarget(0);
    setAutoFlipCount(0);
    setShow3D(false);
    setIsFlipping(false);
    
    // Reset logo to default
    setLogoImage(flippingStarsLogo);
    setWinReward(null);
    
    // Auto-select the largest affordable numeric bet when stopping
    const currentStarlets = shared.getStarlets();
    selectLargestAffordableBet(currentStarlets);
  };

  // Function to start auto flipping
  const startAutoFlip = async (targetCount) => {
    console.log('startAutoFlip called with targetCount:', targetCount, 'isAutoFlipping:', isAutoFlipping);
    if (isAutoFlipping) return;
    
    console.log('Setting up auto flip...');
    shouldStopAutoFlipRef.current = false; // Reset flag
    
    // Reset win reward overlay immediately when starting auto flip
    setWinReward(null);
    
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
      
      // Calculate bet amount for auto flip using latest starlets from profile
      const currentStarlets = shared.getStarlets();
      let betAmount = selectedBet;
      if (selectedBet === 'all-in') {
        betAmount = currentStarlets;
      } else if (selectedBet === 'custom') {
        betAmount = parseInt(customAmount) || 0;
      }

      // Check if user has enough starlets
      if (currentStarlets < betAmount) {
        // Stop any playing sounds
        stopAllSounds();
        
        await shared.showPopup({
          type: 0,
          title: 'Insufficient Starlets',
          message: 'Auto flip stopped due to insufficient Starlets'
        });
        setIsAutoFlipping(false);
        setAutoFlip(false);
        setAutoFlipTarget(0);
        setAutoFlipCount(0);
        // Auto-select the largest affordable numeric bet (exclude 'custom' and 'all-in')
        selectLargestAffordableBet(currentStarlets);
        return;
      }
      
      // Show 3D animation for auto flip (same as manual flip)
      setShow3D(true);
      setIsFlipping(true);
      
      // Start playing coin spinning sound
      playSound('coinSpinning');
      
      // Store pending info for auto flip
      pendingBetRef.current = betAmount;
      pendingSideRef.current = selectedSide;
      
      // Schedule server call after 1.5s (same as manual flip)
      if (manualFlipTimerRef.current) {
        clearTimeout(manualFlipTimerRef.current);
      }
      manualFlipTimerRef.current = setTimeout(async () => {
        // Check if user wants to stop before proceeding
        if (shouldStopAutoFlipRef.current) {
          console.log('Stopping auto flip due to shouldStopAutoFlip flag');
          // Stop all sounds when stopping
          stopAllSounds();
          setIsAutoFlipping(false);
          setAutoFlip(false);
          setAutoFlipTarget(0);
          setAutoFlipCount(0);
          setShow3D(false);
          setIsFlipping(false);
          shouldStopAutoFlipRef.current = false;
          return;
        }
        try {
          // Perform single flip
          const isHeads = pendingSideRef.current === 'HEADS';
          const betAmount = pendingBetRef.current || 0;
          const result = await shared.flipCoin(isHeads, betAmount, false); // Auto flip is never all-in
          
          if (result.success) {
            currentCount++;
            setAutoFlipCount(currentCount);
            
            // Update counters and UI (same as handleFlip)
            setTotalFlips(prev => prev + 1);
            
            // Tính kết quả thực tế của coin
            const actualResult = result.isWin ? selectedSide : (selectedSide === 'HEADS' ? 'TAILS' : 'HEADS');

            // Cập nhật streak theo kết quả thực tế
            if (streakSideRef.current === actualResult) {
              streakCountRef.current += 1;
            } else {
              streakSideRef.current = actualResult;
              streakCountRef.current = 1;
            }
            setStreakSide(streakSideRef.current);
            setStreakCount(streakCountRef.current);

            // Cập nhật bộ đếm HEADS/TAILS theo kết quả thực tế
            if (actualResult === 'HEADS') {
              setHeadsCount(prev => prev + 1);
            } else {
              setTailsCount(prev => prev + 1);
            }
            
            // Update starlets
            const updatedStarlets = shared.getStarlets();
            setStarlets(updatedStarlets);
            
            // Update logo to reflect win/lose (show for 2 seconds in auto flip)
            showResultOnLogo(result.isWin, result.reward, 2000);
            
            // Stop coin spinning sound after showing result
            stopSound('coinSpinning');
            
            // Check if user wants to stop while showing result
            if (shouldStopAutoFlipRef.current) {
              console.log('Stopping auto flip due to shouldStopAutoFlip flag');
              // Stop all sounds when stopping
              stopAllSounds();
              setIsAutoFlipping(false);
              setAutoFlip(false);
              setAutoFlipTarget(0);
              setAutoFlipCount(0);
              setShow3D(false);
              setIsFlipping(false);
              shouldStopAutoFlipRef.current = false;
              return;
            }

            // Update Double or Nothing availability
            if (result.isWin && result.reward > 0) {
              setLastWinAmount(result.reward);
              setCanDouble(true);
            } else {
              setCanDouble(false);
              setUseDoubleNext(false);
            }
            
            // Hide 3D animation after showing result
            setTimeout(() => setShow3D(false), 50);
            setIsFlipping(false);
            
            // Wait 2 seconds before continuing auto flip (logo will show win/lose during this time)
            autoFlipTimeoutRef.current = setTimeout(() => {
              // Check again if user wants to stop before continuing
              if (shouldStopAutoFlipRef.current) {
                console.log('Stopping auto flip due to shouldStopAutoFlip flag');
                // Stop all sounds when stopping
                stopAllSounds();
                setIsAutoFlipping(false);
                setAutoFlip(false);
                setAutoFlipTarget(0);
                setAutoFlipCount(0);
                shouldStopAutoFlipRef.current = false;
                return;
              }
              performAutoFlip();
            }, 2000);
            
          } else {
            // Stop auto flip on error
            // Stop all sounds on error
            stopAllSounds();
            
            let errorMessage = result.error;
            let errorTitle = 'Auto Flip Error';
            
            if (result.error.includes('timeout')) {
              errorTitle = 'Connection Timeout';
              errorMessage = 'Server timeout during auto flip. Auto flip stopped.';
            }
            
            await shared.showPopup({
              type: 0,
              title: errorTitle,
              message: errorMessage
            });
            setIsAutoFlipping(false);
            setAutoFlip(false);
            setAutoFlipTarget(0);
            setAutoFlipCount(0);
            setShow3D(false);
            setIsFlipping(false);
            // If server error indicates insufficient starlets, choose best affordable bet
            const errMsg = (result && result.error) || '';
            const errCode = result && result.data && result.data.code;
            if (errCode === 210001 || /not have enough starlets/i.test(errMsg)) {
              const refreshedStarlets = shared.getStarlets();
              selectLargestAffordableBet(refreshedStarlets);
            }
          }
        } catch (error) {
          // Stop all sounds on error
          stopAllSounds();
          
          console.error('Auto flip error:', error);
          await shared.showPopup({
            type: 0,
            title: 'Error',
            message: 'An error occurred during auto flip'
          });
          setIsAutoFlipping(false);
          setAutoFlip(false);
          setAutoFlipTarget(0);
          setAutoFlipCount(0);
          setShow3D(false);
          setIsFlipping(false);
        }
      }, 1500);
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
  const handleFlip = async (options = {}) => {
    if (isFlipping) return; // Prevent multiple clicks

    // Reset win reward overlay immediately when starting new flip
    setWinReward(null);

    // Validate bet amount - handle regular bet amounts, ALL IN, and Custom Amount
    let betAmount;
    if (options && options.betAmount != null) {
      betAmount = options.betAmount;
    } else {
      if (selectedBet === 'double') {
        betAmount = lastWinAmount || 0;
      } else {
        betAmount = selectedBet;
      }

      if (selectedBet === 'all-in') {
        betAmount = starlets; // Use all available starlets
      } else if (selectedBet === 'custom') {
        betAmount = parseInt(customAmount) || 0;
      } else if (selectedBet === 'double') {
        // already set from lastWinAmount
      } else if (typeof selectedBet !== 'number') {
        await shared.showPopup({
          type: 0,
          title: 'Invalid Bet',
          message: 'Please select a valid bet amount'
        });
        return;
      }
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

    // Store pending info and start animation; API will be called after 1.5s while animation keeps looping
    pendingBetRef.current = betAmount;
    pendingSideRef.current = selectedSide;
    // Store allin flag if it's an all-in bet
    pendingAllInRef.current = options.allin || false;

    // Show 3D overlay for manual flip only and reset animation state
    animationDoneRef.current = false;
    setShow3D(true);
    setIsFlipping(true);

    // Start playing coin spinning sound
    playSound('coinSpinning');

    // Schedule server call after 1.5s; keep the 3D animation running until result arrives
    if (manualFlipTimerRef.current) {
      clearTimeout(manualFlipTimerRef.current);
    }
    manualFlipTimerRef.current = setTimeout(() => {
      performServerFlip();
    }, 1500);
  };

  // Call server after delay; keep 3D anim visible until result is in, then update logo and hide 3D
  const performServerFlip = async () => {
    try {
      const isHeads = pendingSideRef.current === 'HEADS';
      const betAmount = pendingBetRef.current || 0;
      const allin = pendingAllInRef.current || false;
      const result = await shared.flipCoin(isHeads, betAmount, allin);

      if (result.success) {
        setTotalFlips(prev => prev + 1);

        const chosenSide = pendingSideRef.current;
        const actualResult = result.isWin ? chosenSide : (chosenSide === 'HEADS' ? 'TAILS' : 'HEADS');

        if (streakSideRef.current === actualResult) {
          streakCountRef.current += 1;
        } else {
          streakSideRef.current = actualResult;
          streakCountRef.current = 1;
        }
        setStreakSide(streakSideRef.current);
        setStreakCount(streakCountRef.current);

        if (actualResult === 'HEADS') {
          setHeadsCount(prev => prev + 1);
        } else {
          setTailsCount(prev => prev + 1);
        }

        // Stop coin spinning sound before showing result
        stopSound('coinSpinning');

        // Show win/lose on logo and reward overlay first
        showResultOnLogo(result.isWin, result.reward);

        if (result.isWin && result.reward > 0) {
          setLastWinAmount(result.reward);
          setCanDouble(true);
        } else {
          setCanDouble(false);
          if (selectedBet === 'double') {
            setSelectedBet(betOptions[0]);
          }
        }

        const updatedStarlets = shared.getStarlets();
        setStarlets(updatedStarlets);
      } else {
        // Stop coin spinning sound on error
        stopSound('coinSpinning');
        
        let errorMessage = result.error;
        let errorTitle = 'Flip Failed';
        
        if (result.error.includes('timeout')) {
          errorTitle = 'Connection Timeout';
          errorMessage = 'Server is taking too long to respond. Please try again.';
        }
        
        await shared.showPopup({
          type: 0,
          title: errorTitle,
          message: errorMessage
        });
      }
    } catch (error) {
      // Stop coin spinning sound on error
      stopSound('coinSpinning');
      
      console.error('Flip error:', error);
      await shared.showPopup({
        type: 0,
        title: 'Error',
        message: 'An error occurred while flipping'
      });
    } finally {
      // Hide 3D slightly after updating logo to prevent any flicker of the base logo
      setTimeout(() => setShow3D(false), 50);
      animationDoneRef.current = true;
      setIsFlipping(false);
      pendingBetRef.current = 0;
      pendingAllInRef.current = false;
    }
  };

  // Thêm useEffect để theo dõi shouldStopAutoFlip
  useEffect(() => {
    if (shouldStopAutoFlipRef.current && isAutoFlipping) {
      console.log('Stopping auto flip due to shouldStopAutoFlip flag');
      // Stop all sounds when stopping
      stopAllSounds();
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
      if (logoTimeoutRef.current) {
        clearTimeout(logoTimeoutRef.current);
      }
      if (manualFlipTimerRef.current) {
        clearTimeout(manualFlipTimerRef.current);
      }
      // Stop all sounds when component unmounts
      stopAllSounds();
    };
  }, []);

  // Helper to compute numeric bet amount for current selection
  const getNumericBetAmount = () => {
    if (selectedBet === 'all-in') return starlets;
    if (selectedBet === 'custom') return parseInt(customAmount) || 0;
    if (selectedBet === 'double') return lastWinAmount || 0;
    if (typeof selectedBet === 'number') return selectedBet;
    return 0;
  };

  // Select the largest affordable numeric bet (exclude 'custom' and 'all-in')
  const selectLargestAffordableBet = (balance) => {
    const affordableBets = betOptions.filter((b) => typeof b === 'number' && b <= balance);
    if (affordableBets.length > 0) {
      const bestBet = Math.max(...affordableBets);
      setSelectedBet(bestBet);
    } else {
      setSelectedBet(null);
    }
  };

  const currentBetAmount = getNumericBetAmount();
  const isValidPositiveBet = currentBetAmount > 0;
  const hasEnoughStarlets = isValidPositiveBet && starlets >= currentBetAmount;
  const shouldShowInsufficient = isValidPositiveBet && !hasEnoughStarlets;

  return (
    <div className={`fc_app ${isAutoFlipping ? 'is-auto-flipping' : ''}`}>
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
            {/* All-in Value Container */}
            <div className="fc_allin-value-container">
              <div className="fc_allin-value-display">
                <span className="fc_allin-value-number">{starlets.toString()}</span>
                <img src={starlet} alt="starlet" className="fc_allin-value-starlet-icon" />
              </div>
            </div>
            
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
            
            {/* Error message */}
            {customAmountError && (
              <div className="fc_custom-error" style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>
                {customAmountError}
              </div>
            )}
            
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
        
        {/* Sound control button */}
        {/* <button 
          className="fc_sound-control"
          onClick={toggleSound}
          title={isSoundEnabled ? 'Disable Sound' : 'Enable Sound'}
        >
          <span className="fc_sound-icon">
            {isSoundEnabled ? '🔊' : '🔇'}
          </span>
        </button> */}
        
        {/* Test sound button (can be removed in production) */}
        {/* <button 
          className="fc_test-sound-control"
          onClick={testSounds}
          title="Test Sounds (Debug)"
        >
          <span className="fc_test-sound-icon">🎵</span>
        </button> */}
      </header>

      {/* Settings Button - positioned below and to the right of fc_stats-header */}
      <div className="fc_settings-button-container">
        <button 
          className="fc_settings-button"
          onClick={handleSettingsClick}
        >
          <img src={settingsIcon} alt="Settings" className="fc_settings-icon" />
        </button>
      </div>

      {/* Jackpot Counter - positioned below and in the center of fc_stats-header */}
      <div className="fc_jackpot-container">
        <div className="fc_jackpot">
          <span className="fc_jackpot-label">JACKPOT</span>
          <span className="fc_jackpot-count">00000000</span>
        </div>
      </div>

      {/* Settings Overlay */}
      {showSettings && (
        <div className="fc_settings-overlay">
          <div className="fc_settings-content">
            {/* Sound Control Section */}
            <div className="fc_settings-sound-section">
              {/* <div className="fc_settings-sound-title">SOUND CONTROL</div> */}
              
              {/* Sound Toggle Buttons */}
              <div className="fc_settings-sound-toggle">
                <button 
                  className={`fc_settings-sound-btn ${isSoundEnabled ? 'fc_sound-on' : 'fc_sound-off'}`}
                  onClick={toggleSound}
                >
                  <span className="fc_sound-text">SOUND //</span>
                </button>
                
                <button 
                  className={`fc_settings-sound-status ${isSoundEnabled ? 'fc_status-on' : 'fc_status-off'}`}
                  onClick={toggleSound}
                >
                  {isSoundEnabled ? 'ON' : 'OFF'}
                </button>
              </div>
              
              {/* Volume Control */}
              {/* <div className="fc_settings-volume-section">
                <div className="fc_settings-volume-label">VOLUME</div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={soundVolume}
                  onChange={(e) => adjustVolume(parseFloat(e.target.value))}
                  className="fc_settings-volume-slider"
                />
                <div className="fc_settings-volume-value">{Math.round(soundVolume * 100)}%</div>
              </div> */}
            </div>
            
            {/* Back Button at the bottom */}
            <button className="fc_settings-back-btn" onClick={handleSettingsBack}>
              BACK
            </button>
          </div>
        </div>
      )}

      {/* Preload Lottie animation early */}
      <CoinAnimation visible={false} />

      {/* Logo */}
      <div className={`fc_logo-container ${show3D ? 'fc_logo-elevated' : ''} ${logoImage !== flippingStarsLogo ? 'fc_logo-result' : ''}`}>
        {/* Always render CoinAnimation but control visibility */}
        <div className="fc_logo-3d" style={{ display: show3D ? 'block' : 'none' }}>
          <CoinAnimation loop={true} scale={1.5} visible={show3D} />
        </div>
        {/* Show image when 3D is not visible */}
        <img 
          src={logoImage} 
          alt="Flipping Stars" 
          className="fc_logo-image" 
          style={{ display: !show3D ? 'block' : 'none' }}
        />
        {/* WIN/LOSE text - displays above the logo when showing results */}
        {!show3D && (logoImage === winFlippinStar || logoImage === loseFlippinStar) && (
          <div className="fc_win-lose-text">
            {logoImage === winFlippinStar ? 'WIN' : 'LOSE'}
          </div>
        )}
        {/* Progress bar showing win reward - displays 4 digits and starlet icon */}
        {winReward !== null && (
          <div className="fc_win-reward-progress">
            <div className="fc_progress-bar">
              <div className="fc_progress-numbers">
                <span className="fc_progress-number">{winReward}</span>
              </div>
              <div className="fc_progress-starlet">
                <img src={starlet} alt="starlet" className="fc_progress-starlet-icon" />
              </div>
            </div>
          </div>
        )}
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
          disabled={isAutoFlipping}
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
          
          {/* Streak hiển thị khi HEADS ra ≥ 3 lần liên tiếp */}
          {streakSide === 'HEADS' && streakCount >= 3 && (
            <div className="fc_coin-streak-wrapper">
              <div className="fc_coin-streak">STREAK</div>
              <div className="fc_coin-streak-multiplier">X{streakCount}</div>
            </div>
          )}
        </button>
        
        <button
          className={`fc_coin-button ${selectedSide === 'TAILS' ? 'fc_selected' : ''}`}
          onClick={() => setSelectedSide('TAILS')}
          disabled={isAutoFlipping}
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
          
          {/* Streak hiển thị khi TAILS ra ≥ 3 lần liên tiếp */}
          {streakSide === 'TAILS' && streakCount >= 3 && (
            <div className="fc_coin-streak-wrapper">
              <div className="fc_coin-streak">STREAK</div>
              <div className="fc_coin-streak-multiplier">X{streakCount}</div>
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
            onClick={() => {
              if (isAutoFlipping) return;
              if (isBetAffordable(bet)) setSelectedBet(bet);
            }}
            disabled={isAutoFlipping || !isBetAffordable(bet)}
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
          onClick={isBetAffordable('all-in') && !isAutoFlipping ? handleAllInClick : undefined}
          disabled={isAutoFlipping || !isBetAffordable('all-in')}
        >
          <div className="fc_corner fc_corner-top-left"></div>
          <div className="fc_corner fc_corner-top-right"></div>
          <div className="fc_corner fc_corner-bottom-left"></div>
          <div className="fc_corner fc_corner-bottom-right"></div>
          <div className="fc_bet-content fc_all-in-content">
            <div className="fc_all-in-title">ALL IN</div>
            <div className="fc_all-in-details">
              <span className="fc_all-in-percent">.01%</span>
              <span className="fc_all-in-amount">X10</span>
              <img src={starlet} alt="starlet" className="fc_all-in-starlet" />
            </div>
          </div>
        </button>
        <button 
          className={`fc_bet-button fc_custom-amount ${selectedBet === 'custom' ? 'fc_selected' : ''} ${starlets === 0 ? 'fc_insufficient-funds' : ''}`}
          onClick={starlets > 0 && !isAutoFlipping ? handleCustomClick : undefined}
          disabled={isAutoFlipping || starlets === 0}
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
        {/* <button 
          className={`fc_bet-button fc_double-button ${selectedBet === 'double' ? 'fc_selected' : ''} ${(canDouble && lastWinAmount > 0 && lastWinAmount <= starlets) ? '' : 'fc_insufficient-funds'}`}
          onClick={() => {
            if (isAutoFlipping) return;
            if (!canDouble) return;
            if (lastWinAmount <= 0 || lastWinAmount > starlets) return;
            setSelectedBet('double');
          }}
          disabled={isAutoFlipping || !canDouble || lastWinAmount <= 0 || lastWinAmount > starlets}
        >
          <div className="fc_corner fc_corner-top-left"></div>
          <div className="fc_corner fc_corner-top-right"></div>
          <div className="fc_corner fc_corner-bottom-left"></div>
          <div className="fc_corner fc_corner-bottom-right"></div>
          <div className="fc_bet-content fc_double-content">
            <div className="fc_double-line1"><span className="fc_double-word">DOUBLE</span> <span className="fc_double-or">OR</span></div>
            <div className="fc_double-line2">NOTHING</div>
          </div>
        </button> */}
      </div>

      {/* Flip button */}
      { shouldShowInsufficient ? (
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
            onClick={isAutoFlipping ? handleStopAutoFlip : handleFlip}
            disabled={isFlipping || (!isAutoFlipping && !isValidPositiveBet)}
          >
            <div className="fc_flip-content">
              { isAutoFlipping ? `AUTO FLIP (${autoFlipCount}/${autoFlipTarget === 'infinite' ? '∞' : autoFlipTarget})` : 
               isFlipping ? 'FLIPPING...' :
               'FLIP'}
            </div>
          </button>
        )
      }

      {/* Flip result popup removed: handled by logo swap and reward overlay */}

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

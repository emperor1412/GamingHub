// Badge Image Mapper
// This file handles importing and mapping badge images to challenge IDs

// Import all badge images
// Weekly badges
import Badge_1001 from '../images/Challenge badges/Weekly/Badge_1001.png';
import Badge_1002 from '../images/Challenge badges/Weekly/Badge_1002.png';
import Badge_1003 from '../images/Challenge badges/Weekly/Badge_1003.png';
import Badge_1004 from '../images/Challenge badges/Weekly/Badge_1004.png';
import Badge_1005 from '../images/Challenge badges/Weekly/Badge_1005.png';
import Badge_1006 from '../images/Challenge badges/Weekly/Badge_1006.png';
import Badge_1007 from '../images/Challenge badges/Weekly/Badge_1007.png';
import Badge_1008 from '../images/Challenge badges/Weekly/Badge_1008.png';
import Badge_1009 from '../images/Challenge badges/Weekly/Badge_1009.png';
import Badge_1010 from '../images/Challenge badges/Weekly/Badge_1010.png';
import Badge_1011 from '../images/Challenge badges/Weekly/Badge_1011.png';
import Badge_1012 from '../images/Challenge badges/Weekly/Badge_1012.png';

// Monthly badges
import Badge_10001 from '../images/Challenge badges/Monthly/Badge_10001.png';

// Yearly badges
import Badge_100001 from '../images/Challenge badges/Yearly/Badge_100001.png';

// Fallback images
import badgeUnlocked from '../images/trophy_4.png';
import badgeLocked from '../images/TwoHundredStrong_Locked.png';
import questionIcon from '../images/question_icon.png';
import lockIcon from '../images/lock_icon.png';

// Badge image mapping
const badgeImageMap = {
  // Weekly badges (1001-1030)
  1001: Badge_1001,
  1002: Badge_1002,
  1003: Badge_1003,
  1004: Badge_1004,
  1005: Badge_1005,
  1006: Badge_1006,
  1007: Badge_1007,
  1008: Badge_1008,
  1009: Badge_1009,
  1010: Badge_1010,
  1011: Badge_1011,
  1012: Badge_1012,
  
  // Monthly badges (10001-10012)
  10001: Badge_10001,
  
  // Yearly badges (100001-100003)
  100001: Badge_100001,
};

// Function to get badge image by challenge ID
export const getBadgeImage = (challengeId, visualType = 'unlocked') => {
  // If we have a specific badge image for this challenge ID
  if (badgeImageMap[challengeId]) {
    return badgeImageMap[challengeId];
  }
  
  // Fallback to generic unlocked image for both unlocked and locked states
  // The locked state will be handled by CSS opacity
  return badgeUnlocked;
};

// Function to get lock icon
export const getLockIcon = () => {
  return lockIcon;
};

// Function to get question icon
export const getQuestionIcon = () => {
  return questionIcon;
};

// Function to check if we have a specific badge image for a challenge ID
export const hasSpecificBadgeImage = (challengeId) => {
  return badgeImageMap.hasOwnProperty(challengeId);
};

// Export all badge images for direct access if needed
export const badgeImages = badgeImageMap;

export default {
  getBadgeImage,
  getLockIcon,
  getQuestionIcon,
  hasSpecificBadgeImage,
  badgeImages
};

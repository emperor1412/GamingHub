import { logEvent } from 'firebase/analytics';
import { analytics } from './Firebase';

// Track section/page views with Firebase's built-in screen tracking
export const trackSectionView = (sectionName, userId) => {
    // Use Firebase's screen_view event
    logEvent(analytics, 'screen_view', {
        firebase_screen: sectionName,
        firebase_screen_class: 'App',
        userId: userId || 'unknown'
    });
};

// Track overlay views with Firebase's built-in screen tracking
export const trackOverlayView = (overlayName, userId, parentScreen = null) => {
    // Use Firebase's screen_view event for overlays
    logEvent(analytics, 'screen_view', {
        firebase_screen: `overlay_${overlayName}`,
        firebase_screen_class: 'App',
        parent_screen: parentScreen, // Track which screen opened the overlay
        userId: userId || 'unknown'
    });
};

// Track overlay exits
export const trackOverlayExit = (overlayName, userId, returnToScreen) => {
    // Track returning to previous screen
    logEvent(analytics, 'screen_view', {
        firebase_screen: returnToScreen,
        firebase_screen_class: 'App',
        from_overlay: overlayName, // Track which overlay we're coming from
        userId: userId || 'unknown'
    });
};

// Track navigation between sections
export const trackNavigation = (fromSection, toSection, userId) => {
    logEvent(analytics, `navigate_${fromSection}_to_${toSection}`, {
        userId: userId || 'unknown',
        timestamp: new Date().toISOString()
    });
};

// Track specific user actions
export const trackUserAction = (actionName, additionalData = {}, userId) => {
    logEvent(analytics, actionName, {
        userId: userId || 'unknown',
        timestamp: new Date().toISOString(),
        ...additionalData
    });
};

export const trackStoryShare = (shareType, shareContext, userId) => {
  logEvent(analytics, `share_story_${shareType}`, {
    share_context: shareContext, // Additional context like trophy ID, level number, etc.
    userId: userId || 'unknown',
    timestamp: new Date().toISOString()
  });
};

// Track task funnel events
export const trackTaskFunnel = (taskId, taskType, funnelStep, additionalData = {}, userId) => {
  logEvent(analytics, `task_${taskType}_${funnelStep}`, {
    task_id: taskId,
    timestamp: new Date().toISOString(),
    userId: userId || 'unknown',
    ...additionalData
  });
};

// Track task completion attempt
export const trackTaskAttempt = (taskId, taskType, isSuccessful, additionalData = {}, userId) => {
  const status = isSuccessful ? 'success' : 'fail';
  logEvent(analytics, `task_${taskType}_attempt_${status}`, {
    task_id: taskId,
    timestamp: new Date().toISOString(),
    userId: userId || 'unknown',
    ...additionalData
  });
};

// Track task content interaction
export const trackTaskContent = (taskId, contentIndex, interactionType, userId) => {
  logEvent(analytics, `task_content_${interactionType}`, {
    task_id: taskId,
    content_index: contentIndex,
    timestamp: new Date().toISOString(),
    userId: userId || 'unknown'
  });
};

// Track device and browser information
export const trackDeviceInfo = (userId) => {
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;
  const screenResolution = `${window.screen.width}x${window.screen.height}`;
  const devicePixelRatio = window.devicePixelRatio || 1;
  const language = window.navigator.language;
  
  // Parse browser info
  const browserInfo = {
    chrome: /chrome/i.test(userAgent),
    firefox: /firefox/i.test(userAgent),
    safari: /safari/i.test(userAgent),
    opera: /opera/i.test(userAgent),
    ie: /msie/i.test(userAgent) || /trident/i.test(userAgent),
    edge: /edge/i.test(userAgent),
    version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1]
  };

  // Determine browser name
  let browserName = 'unknown';
  if (browserInfo.edge) browserName = 'edge';
  else if (browserInfo.chrome) browserName = 'chrome';
  else if (browserInfo.firefox) browserName = 'firefox';
  else if (browserInfo.safari) browserName = 'safari';
  else if (browserInfo.opera) browserName = 'opera';
  else if (browserInfo.ie) browserName = 'ie';

  // Parse device type
  const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);
  const isTablet = /Tablet|iPad/i.test(userAgent);
  const deviceType = isTablet ? 'tablet' : (isMobile ? 'mobile' : 'desktop');

  // Log device session with specific device type and browser
  logEvent(analytics, `device_${deviceType}_${browserName}`, {
    userId: userId || 'unknown',
    platform: platform,
    browser_version: browserInfo.version,
    screen_resolution: screenResolution,
    pixel_ratio: devicePixelRatio,
    language: language,
    timestamp: new Date().toISOString()
  });
};

// Track session start with device info
export const trackSessionStart = (userId) => {
  logEvent(analytics, 'session_start', {
    userId: userId || 'unknown',
    timestamp: new Date().toISOString()
  });
  
  // Track device info on session start
  trackDeviceInfo(userId);
}; 
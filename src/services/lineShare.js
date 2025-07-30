import shared from '../Shared';
import { trackStoryShare, trackUserAction } from '../analytics';
import liff from '@line/liff';

export const lineShare = {
  // Tạo link share với referral code
  generateShareLink(referralCode) {
    const inviteLink = `${shared.app_link}?startParam=invite_${referralCode}`;
    console.log('Generated invite link:', inviteLink);
    return inviteLink;
  },

  // Share thông qua LINE
  async shareToLine(product, referralCode) {
    try {
      if (!window.liff) {
        throw new Error('LIFF is not initialized');
      }

      // Tạo URL với referral code
      const shareUrl = this.generateShareLink(referralCode);
      
      // Customize message based on type
      let shareText = `🎮 Join with me!\n\nGet ${product.amount} Starlets and 10 Tickets!\n\nUse my referral code to get bonus rewards!\n\n${shareUrl}`;
      
      // Add specific message based on type
      if (product.type) {
        switch (product.type) {
          case 'ticket_scratch':
            shareText = `🎉 I just scratched a ticket and won rewards!\n\nJoin me to scratch your own tickets!\n\n${shareUrl}`;
            break;
          case 'ticket_all':
            shareText = `🎉 I just scratched all my tickets and claimed amazing rewards!\n\nJoin me to get your own rewards!\n\n${shareUrl}`;
            break;
          case 'level_up':
            shareText = `🏆 I just reached a new level in FSL Gaming Hub!\n\nJoin me to level up together!\n\n${shareUrl}`;
            break;
          case 'trophy_unlock':
            shareText = `🏆 I just unlocked a trophy in FSL Gaming Hub!\n\nJoin me to unlock your own trophies!\n\n${shareUrl}`;
            break;
          case 'bank_steps':
            shareText = `🚶‍♂️ I just earned Starlets from my daily steps!\n\nJoin me to turn your steps into rewards!\n\n${shareUrl}`;
            break;
          default:
            shareText = `🎮 Join with me!\n\nGet ${product.amount} Starlets and 10 Tickets!\n\nUse my referral code to get bonus rewards!\n\n${shareUrl}`;
        }
      }

      // Log share URL và text
      console.log('Share URL:', shareUrl);
      console.log('Share text:', shareText);

      // Kiểm tra xem shareTargetPicker có khả dụng không
      if (!liff.isApiAvailable('shareTargetPicker')) {
        console.log('shareTargetPicker not available, showing popup');
        // Hiển thị popup thông báo
        await shared.showPopup({
          type: 1, // Notice type
          title: 'Share Not Available',
          message: 'Please open this app in LINE app to share with your friends.'
        });
        return false;
      }

      // Tạo share content
      const shareContent = {
        type: 'text',
        text: shareText
      };
      console.log('Share content:', shareContent);

      // Share trực tiếp trong LINE app
      await liff.shareTargetPicker([shareContent]);
      
      // Track share event
      trackStoryShare('line_share', {
        product_amount: product.amount,
        product_type: product.type,
        referral_code: referralCode
      }, shared.loginData?.userId);

      return true;
    } catch (error) {
      console.error('Share error:', error);
      throw error;
    }
  },

  // Share story với hình ảnh
  async shareStory(imageUrl, text, type = 'general', storyMethod = 'deeplink') {
    try {
      console.log('Starting story share with method:', storyMethod);
      console.log('Share details:', { imageUrl, text, type });

      // Kiểm tra môi trường
      if (window.liff) {
        console.log('Running in LINE mini app');
        // Trong LINE mini app
        if (storyMethod === 'social' && window.LineSocial) {
          console.log('Attempting to use LINE Social API');
          // Sử dụng LINE Social API
          try {
            await window.LineSocial.shareStory({
              imageUrl: imageUrl,
              text: text
            });
            console.log('Story shared via LINE Social API successfully');
          } catch (error) {
            console.error('LINE Social API error:', error);
            console.log('Falling back to deep link method');
            // Fallback to deep link if Social API fails
            this.openLineStoryDeepLink(imageUrl, text);
          }
        } else {
          console.log('Using LINE Deep Link method');
          // Sử dụng LINE Deep Link
          this.openLineStoryDeepLink(imageUrl, text);
        }
      } else {
        console.log('Running in browser environment');
        // Trong browser
        console.log('Showing story info in browser:', {
          imageUrl,
          text
        });
        await shared.showPopup({
          type: 1,
          title: 'Story Info',
          message: `Image URL: ${imageUrl}\n\nStory Text: ${text}\n\nPlease open LINE app to create story.`
        });
      }

      // Track story share
      trackStoryShare(`line_story_${type}`, {
        image_url: imageUrl,
        share_text: text,
        story_method: storyMethod,
        environment: window.liff ? 'line_mini_app' : 'browser'
      }, shared.loginData?.userId);

      return true;
    } catch (error) {
      console.error('Story share error:', error);
      // Hiển thị thông báo lỗi chi tiết hơn
      await shared.showPopup({
        type: 0,
        title: 'Share Error',
        message: `Failed to share story: ${error.message || 'Unknown error'}\n\nPlease try again or contact support.`
      });
      throw error;
    }
  },

  // Helper function để mở LINE story qua Deep Link
  openLineStoryDeepLink(imageUrl, text) {
    try {
      console.log('Preparing LINE story deep link');
      
      // Validate và encode parameters
      if (!imageUrl) {
        throw new Error('Image URL is required');
      }

      // Encode parameters an toàn hơn
      const encodedImageUrl = encodeURIComponent(imageUrl.trim());
      const encodedText = encodeURIComponent((text || '').trim());

      // Tạo deep link với format chuẩn cho LINE story
      // Thử format khác cho LINE story
      const lineStoryUrl = `line://msg/story/${encodedImageUrl}?text=${encodedText}`;
      
      // Validate URL format
      if (!lineStoryUrl.startsWith('line://')) {
        throw new Error('Invalid LINE deep link format');
      }

      // Kiểm tra độ dài URL (LINE có giới hạn độ dài URL)
      if (lineStoryUrl.length > 2000) {
        throw new Error('URL is too long');
      }

      console.log('Generated deep link:', lineStoryUrl);

      // Thử mở deep link
      window.location.href = lineStoryUrl;
      
      // Fallback nếu không mở được
      setTimeout(() => {
        // Nếu không mở được LINE app, hiển thị thông báo
        if (document.hidden === false) {
          shared.showPopup({
            type: 0,
            title: 'Cannot Open LINE',
            message: 'Please make sure LINE app is installed and try again.'
          });
        }
      }, 1000);

    } catch (error) {
      console.error('Error opening LINE deep link:', error);
      shared.showPopup({
        type: 0,
        title: 'Share Error',
        message: `Failed to open LINE: ${error.message}`
      });
      throw error;
    }
  },

  // Lấy thông tin referral của user
  async getReferralInfo() {
    try {
      const response = await fetch(`${shared.server_url}/api/app/getReferralInfo?token=${shared.loginData.token}&platform=line`);
      const data = await response.json();
      
      if (data.code === 0) {
        return {
          referralCode: data.referralCode,
          totalReferrals: data.totalReferrals,
          pendingRewards: data.pendingRewards,
          claimedRewards: data.claimedRewards
        };
      }
      throw new Error(data.msg || 'Failed to get referral info');
    } catch (error) {
      console.error('Get referral info error:', error);
      throw error;
    }
  },

  // Note: claimShareReward function has been removed as share story rewards are now handled through task type 5
  // Use shared.completeShareStoryTask() instead for completing share story tasks
}; 
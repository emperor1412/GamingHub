import shared from '../Shared';
import { trackStoryShare, trackUserAction } from '../analytics';
import liff from '@line/liff';

export const lineShare = {
  // Tạo link share với referral code
  generateShareLink(referralCode) {
    const inviteLink = `${shared.app_link}?startapp=invite_${referralCode}`;
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
      const shareText = `🎮 Join with me!\n\nGet ${product.amount} Starlets and 10 Tickets!\n\nUse my referral code to get bonus rewards!\n\n${shareUrl}`;
      
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
        referral_code: referralCode
      }, shared.loginData?.userId);

      return true;
    } catch (error) {
      console.error('Share error:', error);
      throw error;
    }
  },

  // Share story với hình ảnh
  async shareStory(imageUrl, text, type = 'general') {
    try {
      if (window.liff) {
        // Kiểm tra xem shareTargetPicker có khả dụng không
        if (!liff.isApiAvailable('shareTargetPicker')) {
          // Hiển thị popup thông báo
          await shared.showPopup({
            type: 1, // Notice type
            title: 'Share Not Available',
            message: 'Please open this app in LINE app to share with your friends.'
          });
          return false;
        }

        // Tạo share content với hình ảnh
        const shareContent = {
          type: 'image',
          originalContentUrl: imageUrl,
          previewImageUrl: imageUrl
        };

        // Share trực tiếp trong LINE app
        await liff.shareTargetPicker([shareContent]);

        // Track story share
        trackStoryShare(`line_story_${type}`, {
          image_url: imageUrl,
          share_text: text
        }, shared.loginData?.userId);

        return true;
      }
      return false;
    } catch (error) {
      console.error('Story share error:', error);
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

  // Claim reward từ việc share
  async claimShareReward(type = 'general', depth = 0) {
    if (depth > 3) {
      console.error('claimShareReward failed after 3 attempts');
      return;
    }

    try {
      const response = await fetch(`${shared.server_url}/api/app/sharingStory?token=${shared.loginData.token}&type=${type}&platform=line`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.code === 0) {
          console.log('Share reward claimed successfully');
          return true;
        } else if (data.code === 102002 || data.code === 102001) {
          console.log('Token expired, attempting to re-login');
          const result = await shared.login(shared.initData);
          if (result.success) {
            return this.claimShareReward(type, depth + 1);
          }
        }
      }
      return false;
    } catch (error) {
      console.error('Claim share reward error:', error);
      throw error;
    }
  }
}; 
import shared from '../Shared';
import { trackStoryShare, trackUserAction } from '../analytics';

export const lineShare = {
  // Tạo link share với referral code
  generateShareLink(referralCode) {
    return `${shared.app_link}?startapp=invite_${referralCode}`;
  },

  // Share thông qua LINE
  async shareToLine(product, referralCode) {
    try {
      // Tạo nội dung share
      const shareContent = {
        type: 'flex',
        altText: `Join me in ${product.amount} Starlets!`,
        contents: {
          type: 'bubble',
          header: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: '🎮 Join the Game!',
                weight: 'bold',
                size: 'xl',
                color: '#ffffff'
              }
            ],
            backgroundColor: '#27AE60',
            paddingAll: '20px'
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: `Get ${product.amount} Starlets and 10 Tickets!`,
                wrap: true,
                color: '#666666',
                size: 'md',
                margin: 'md'
              },
              {
                type: 'text',
                text: 'Use my referral code to get bonus rewards!',
                wrap: true,
                color: '#666666',
                size: 'sm',
                margin: 'md'
              }
            ]
          },
          footer: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'button',
                style: 'primary',
                color: '#27AE60',
                action: {
                  type: 'uri',
                  label: 'Join Now',
                  uri: this.generateShareLink(referralCode)
                }
              }
            ]
          }
        }
      };

      // Sử dụng LINE LIFF API để share
      if (window.liff) {
        await window.liff.shareTargetPicker([shareContent]);
        
        // Track share event
        trackStoryShare('line_share', {
          product_amount: product.amount,
          referral_code: referralCode
        }, shared.loginData?.userId);

        return true;
      } else {
        throw new Error('LIFF is not initialized');
      }
    } catch (error) {
      console.error('Share error:', error);
      throw error;
    }
  },

  // Share story với hình ảnh
  async shareStory(imageUrl, text, type = 'general') {
    try {
      if (window.liff) {
        await window.liff.shareTargetPicker([{
          type: 'image',
          originalContentUrl: imageUrl,
          previewImageUrl: imageUrl,
          text: text
        }]);

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

  // Xử lý referral khi người dùng mới vào
  async handleReferral() {
    try {
      // Lấy referral code từ URL
      const urlParams = new URLSearchParams(window.location.search);
      const referralCode = urlParams.get('ref');

      if (referralCode) {
        // Gọi API để xác thực và xử lý referral
        const response = await fetch(`${shared.server_url}/api/app/handleReferral`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            referralCode,
            userId: shared.userProfile?.userId,
            token: shared.loginData.token,
            platform: 'line'
          })
        });

        const data = await response.json();
        if (data.code === 0) {
          // Track successful referral
          trackUserAction('referral_success', {
            referral_code: referralCode,
            platform: 'line'
          }, shared.loginData?.userId);

          // Xóa referral code khỏi URL
          window.history.replaceState({}, document.title, window.location.pathname);
          return {
            success: true,
            message: 'Referral processed successfully',
            rewards: data.rewards
          };
        }
      }
      return { success: false };
    } catch (error) {
      console.error('Referral handling error:', error);
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
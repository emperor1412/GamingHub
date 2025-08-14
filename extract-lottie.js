const fs = require('fs');
const path = require('path');

// Đường dẫn đến file CoinAnim.html
const htmlFilePath = path.join(__dirname, 'public', 'flippin_coin_animation', 'CoinAnim.html');
const outputPath = path.join(__dirname, 'src', 'animations', 'coin-animation.json');

function extractLottieData() {
  try {
    // Đọc file HTML
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    
    // Tìm animation data trong HTML
    // Có thể là trong thẻ script hoặc trong biến JavaScript
    const scriptMatch = htmlContent.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
    
    if (scriptMatch) {
      console.log('Tìm thấy script tags trong HTML');
      
      // Tìm kiếm các pattern có thể chứa animation data
      const patterns = [
        /animationData\s*:\s*({[\s\S]*?})/i,
        /loadAnimation\s*\(\s*({[\s\S]*?})\s*\)/i,
        /bodymovin\.loadAnimation\s*\(\s*({[\s\S]*?})\s*\)/i
      ];
      
      for (const pattern of patterns) {
        const match = htmlContent.match(pattern);
        if (match) {
          try {
            // Parse JSON data
            const animationData = JSON.parse(match[1]);
            
            // Lưu vào file JSON
            fs.writeFileSync(outputPath, JSON.stringify(animationData, null, 2));
            
            console.log('✅ Đã extract thành công animation data!');
            console.log(`📁 File được lưu tại: ${outputPath}`);
            console.log(`📊 Animation info: ${animationData.nm || 'Unknown'} (${animationData.w}x${animationData.h})`);
            
            return;
          } catch (parseError) {
            console.log('❌ Không thể parse JSON data:', parseError.message);
          }
        }
      }
      
      console.log('❌ Không tìm thấy animation data trong HTML');
      console.log('💡 Hãy kiểm tra file HTML để tìm pattern phù hợp');
      
    } else {
      console.log('❌ Không tìm thấy script tags trong HTML');
    }
    
  } catch (error) {
    console.error('❌ Lỗi khi đọc file:', error.message);
  }
}

// Chạy script
console.log('🔍 Bắt đầu extract Lottie animation data...');
extractLottieData();

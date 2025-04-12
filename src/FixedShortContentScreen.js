import React, { useEffect, useRef } from 'react';
import './TestScreens.css';

/**
 * FixedShortContentScreen - màn hình có ít nội dung đã khắc phục lỗi overscrolling
 * Màn hình này minh họa cách khắc phục vấn đề khi trang không đủ nội dung để tạo thanh cuộn
 * nhưng vẫn cho phép cuộn và không có hiệu ứng "bounce"
 */
const FixedShortContentScreen = ({ onBack }) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  
  // Điều khiển overscrolling theo mẫu từ GoodScreen.js và GoodPopupScreen.js
  useEffect(() => {
    // Thêm class để kiểm soát overscrolling ở cấp body
    document.body.classList.add('no-overscroll');
    
    // Thêm thêm class để kiểm soát cho trường hợp nội dung ngắn
    document.body.classList.add('no-overscroll-strict');
    
    // Thêm style trực tiếp vào document.body cho hiệu quả tốt nhất
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.overscrollBehavior = 'none';
    document.body.style.touchAction = 'none';
    
    // Đảm bảo html cũng được kiểm soát
    document.documentElement.style.overscrollBehavior = 'none';
    document.documentElement.style.height = '100%';
    
    // Thêm sự kiện xử lý touch để ngăn overscrolling
    const preventDefaultForOverscroll = (e) => {
      const container = containerRef.current;
      if (!container) return;
      
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const height = container.clientHeight;
      const delta = e.touches[0].clientY - (container.lastClientY || 0);
      container.lastClientY = e.touches[0].clientY;
      
      // Ngăn chặn kéo xuống khi đã ở đầu trang
      if (scrollTop <= 0 && delta > 0) {
        e.preventDefault();
      }
      
      // Ngăn chặn kéo lên khi đã ở cuối trang
      if (scrollTop + height >= scrollHeight && delta < 0) {
        e.preventDefault();
      }
    };
    
    // Xử lý scroll trực tiếp - cách mới hiệu quả hơn
    const handleDirectScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      
      let startY = 0;
      let lastY = 0;
      let initialScrollTop = 0;
      let touchId = null;
      let rafId = null;
      let scrollVelocity = 0;
      
      // Hàm xử lý khi bắt đầu chạm
      const handleTouchStart = (e) => {
        if (touchId !== null) return;
        
        // Hủy bỏ animation trước đó nếu có
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        
        // Lưu trữ thông tin chạm ban đầu
        touchId = e.touches[0].identifier;
        startY = e.touches[0].clientY;
        lastY = startY;
        initialScrollTop = container.scrollTop;
        scrollVelocity = 0;
      };
      
      // Hàm xử lý khi di chuyển ngón tay
      const handleTouchMove = (e) => {
        if (touchId === null) return;
        
        // Tìm touch event đang theo dõi
        let touchIndex = -1;
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === touchId) {
            touchIndex = i;
            break;
          }
        }
        
        if (touchIndex === -1) return;
        
        // Tính toán vị trí mới và cập nhật scroll
        const currentY = e.changedTouches[touchIndex].clientY;
        const deltaY = lastY - currentY;
        
        // Sử dụng scrollTo với behavior: 'auto' để cuộn mượt mà hơn
        container.scrollTo({
          top: container.scrollTop + deltaY,
          behavior: 'auto'
        });
        
        // Cập nhật velocity
        scrollVelocity = deltaY * 0.8 + scrollVelocity * 0.2;
        lastY = currentY;
      };
      
      // Hàm xử lý khi kết thúc chạm
      const handleTouchEnd = (e) => {
        if (touchId === null) return;
        
        // Tìm touch event đang theo dõi
        let touchIndex = -1;
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === touchId) {
            touchIndex = i;
            break;
          }
        }
        
        if (touchIndex === -1) return;
        
        // Reset touchId
        touchId = null;
        
        // Nếu velocity đủ lớn, thêm hiệu ứng quán tính
        if (Math.abs(scrollVelocity) > 2) {
          let momentumVelocity = scrollVelocity * 8; // Tăng độ quán tính
          
          const animateMomentum = () => {
            // Giảm dần vận tốc
            momentumVelocity *= 0.92;
            
            // Cập nhật vị trí cuộn
            container.scrollTo({
              top: container.scrollTop + momentumVelocity,
              behavior: 'auto'
            });
            
            // Tiếp tục hoặc dừng animation
            if (Math.abs(momentumVelocity) > 0.5) {
              rafId = requestAnimationFrame(animateMomentum);
            } else {
              rafId = null;
            }
          };
          
          rafId = requestAnimationFrame(animateMomentum);
        }
      };
      
      // Đăng ký các sự kiện
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchmove', handleTouchMove, { passive: true });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
      container.addEventListener('touchcancel', handleTouchEnd, { passive: true });
      
      // Hàm dọn dẹp
      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
        container.removeEventListener('touchcancel', handleTouchEnd);
        if (rafId) cancelAnimationFrame(rafId);
      };
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchmove', preventDefaultForOverscroll, { passive: false });
      container.addEventListener('touchstart', (e) => {
        container.lastClientY = e.touches[0].clientY;
      });
      
      // Thêm scrollbar mượt mà cho desktop
      container.style.scrollBehavior = 'smooth';
    }
    
    // Thiết lập cuộn trực tiếp mượt mà
    const cleanupDirectScroll = handleDirectScroll();
    
    // Clean up khi component unmount
    return () => {
      document.body.classList.remove('no-overscroll');
      document.body.classList.remove('no-overscroll-strict');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.overscrollBehavior = '';
      document.body.style.touchAction = '';
      document.documentElement.style.overscrollBehavior = '';
      document.documentElement.style.height = '';
      
      if (container) {
        container.removeEventListener('touchmove', preventDefaultForOverscroll);
        container.removeEventListener('touchstart', () => {});
        container.style.scrollBehavior = '';
      }
      
      if (cleanupDirectScroll) {
        cleanupDirectScroll();
      }
    };
  }, []);

  return (
    <div className="test-screen-container fixed-short-screen-container-strict" ref={containerRef}>
      <div className="test-screen-header">
        Nội dung ngắn đã fix Overscrolling
      </div>
      <button className="back-button" onClick={onBack}>
        ← Quay lại
      </button>
      <div className="fixed-short-content-strict" ref={contentRef}>
        {/* Giữ cấu trúc giống như ShortContentScreen để so sánh hợp lý */}
        <div className="test-item" style={{ background: 'rgba(0, 255, 0, 0.1)', minHeight: '150px' }}>
          <p>
            Đây là một màn hình có nội dung ngắn.<br/><br/>
            Thử kéo/vuốt lên xuống và bạn sẽ thấy không còn hiệu ứng "bounce" ở biên cuộn.
          </p>
        </div>
        
        <div className="test-item" style={{ marginTop: '15px', background: 'rgba(0, 255, 0, 0.2)' }}>
          <div>
            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Giải pháp:</p>
            <ul style={{ textAlign: 'left', paddingLeft: '20px', margin: '0' }}>
              <li>Màn hình có ít nội dung nhưng vẫn có thể cuộn</li>
              <li>Đã khắc phục hiệu ứng "bounce" hoặc kéo nền</li>
              <li>Không thể kéo màn hình ra ngoài ranh giới</li>
              <li>Tạo cảm giác cuộn mượt mà và chuyên nghiệp</li>
            </ul>
          </div>
        </div>
        
        {/* Phần tử cuối đảm bảo không bị tràn, giống với ShortContentScreen */}
        <div className="test-item" style={{ 
          marginTop: '15px', 
          background: 'rgba(0, 255, 0, 0.15)',
          marginBottom: '20px'
        }}>
          <p style={{ margin: '0' }}>
            Thử cuộn từ đây đến cuối và kéo tiếp - không có hiệu ứng bounce.
          </p>
        </div>
        
        {/* Thêm nội dung để đảm bảo có thể cuộn tương tự như ShortContentScreen */}
        <div className="spacer" style={{ height: '100px' }}></div>
      </div>
    </div>
  );
};

export default FixedShortContentScreen; 
import React from 'react';
import { t, getCurrentLanguage, setLanguage } from './utils/localization';

const LocalizationDemo = () => {
  const currentLang = getCurrentLanguage();
  
  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'ja' : 'en';
    setLanguage(newLang);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Localization Demo</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={toggleLanguage}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          {currentLang === 'en' ? '🇯🇵 Switch to Japanese' : '🇺🇸 Switch to English'}
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Current Language: {currentLang.toUpperCase()}</h2>
      </div>

      <div style={{ display: 'grid', gap: '10px' }}>
        <div><strong>MY_TICKETS:</strong> {t('MY_TICKETS')}</div>
        <div><strong>SCRATCH_TICKETS:</strong> {t('SCRATCH_TICKETS')}</div>
        <div><strong>BANK_STEPS:</strong> {t('BANK_STEPS')}</div>
        <div><strong>CHECK_OUT:</strong> {t('CHECK_OUT')}</div>
        <div><strong>LEVEL_ABBR:</strong> {t('LEVEL_ABBR')}</div>
        <div><strong>CHECK_IN:</strong> {t('CHECK_IN')}</div>
        <div><strong>TODAY:</strong> {t('TODAY')}</div>
        <div><strong>EARN_EGGLETS:</strong> {t('EARN_EGGLETS')}</div>
        <div><strong>EGGLET_EVENT:</strong> {t('EGGLET_EVENT')}</div>
        <div><strong>LANGUAGE:</strong> {t('LANGUAGE')}</div>
        <div><strong>LOG_IN_STREAK:</strong> {t('LOG_IN_STREAK')}</div>
        <div><strong>DAY:</strong> {t('DAY')}</div>
        <div><strong>DAYS:</strong> {t('DAYS')}</div>
        <div><strong>LEVEL_UP:</strong> {t('LEVEL_UP')}</div>
        <div><strong>NEED_STARLETS:</strong> {t('NEED_STARLETS')}</div>
      </div>
    </div>
  );
};

export default LocalizationDemo; 
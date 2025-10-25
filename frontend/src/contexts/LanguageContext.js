import React, { createContext, useContext, useState, useEffect } from 'react';
import translationsData from '../i18n/translations';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Check localStorage for saved language preference
    const savedLanguage = localStorage.getItem('shelter-match-language');
    return savedLanguage || 'en';
  });

  const [translations, setTranslations] = useState(translationsData[language]);

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem('shelter-match-language', language);
    setTranslations(translationsData[language]);
  }, [language]);


  const t = (key) => {
    // Handle nested keys like 'app.title'
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return the key if translation not found
      }
    }
    
    return value || key;
  };

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const value = {
    language,
    setLanguage,
    changeLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

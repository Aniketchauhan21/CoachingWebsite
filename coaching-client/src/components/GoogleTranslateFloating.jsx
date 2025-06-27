import React, { useState, useEffect } from 'react';
import { Languages } from 'lucide-react';

const GoogleTranslateFloating = () => {
  const [isTranslateLoaded, setIsTranslateLoaded] = useState(false);
  const [isTranslateExpanded, setIsTranslateExpanded] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const languages = {
    'en': 'English',
    'hi': 'हिंदी',
    'bn': 'বাংলা',
    'ta': 'தமிழ்',
    'te': 'తెలుగు',
    'gu': 'ગુજરાતી',
    'mr': 'मराठी',
    'pa': 'ਪੰਜਾਬੀ',
    'ml': 'മലയാളം',
    'kn': 'ಕನ್ನಡ',
    'ur': 'اردو'
  };

  const googleTranslateElementInit = () => {
    try {
      if (window.google && window.google.translate && window.google.translate.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "hi,bn,ta,te,ml,kn,gu,mr,pa,ur,en",
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            multilanguagePage: true
          },
          "google_translate_element"
        );
        setIsTranslateLoaded(true);
      } else {
        setTimeout(googleTranslateElementInit, 500);
      }
    } catch (error) {
      setTimeout(googleTranslateElementInit, 1000);
    }
  };

  const clearAllCookies = () => {
    // Clear all possible cookie variations
    const hostname = window.location.hostname;
    const domain = hostname.startsWith('www.') ? hostname.substring(4) : hostname;
    
    // Clear cookies for current domain
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; domain=${hostname}`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; domain=.${hostname}`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; domain=${domain}`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; domain=.${domain}`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`;
    
    // Clear hash
    if (window.location.hash.includes('googtrans')) {
      window.location.hash = '';
    }
  };

  const translateToLanguage = (languageCode) => {
    try {
      setCurrentLanguage(languageCode);
      
      if (languageCode === 'en') {
        // Reset to English
        clearAllCookies();
        
        // Force page reload with clean URL
        const cleanUrl = window.location.origin + window.location.pathname + window.location.search;
        window.location.href = cleanUrl;
        return;
      }

      // Translate to other language
      const hostname = window.location.hostname;
      const cookieValue = `/en/${languageCode}`;
      
      // Set cookies with all possible domain variations
      document.cookie = `googtrans=${cookieValue}; path=/; domain=${hostname}`;
      document.cookie = `googtrans=${cookieValue}; path=/; domain=.${hostname}`;
      document.cookie = `googtrans=${cookieValue}; path=/`;
      
      // Set hash and reload
      window.location.hash = `#googtrans(en|${languageCode})`;
      
      // Use setTimeout to ensure cookie is set before reload
      setTimeout(() => {
        window.location.reload();
      }, 100);

    } catch (error) {
      console.error('Translation error:', error);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  // Detect current language from URL or cookies
  const detectCurrentLanguage = () => {
    // Check hash first
    const hash = window.location.hash;
    if (hash.includes('googtrans')) {
      const match = hash.match(/googtrans\(en\|(\w+)\)/);
      if (match && match[1]) {
        return match[1];
      }
    }

    // Check cookies
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith('googtrans=')) {
        const value = cookie.substring(10);
        if (value && value.includes('/')) {
          const parts = value.split('/');
          if (parts.length >= 3) {
            return parts[2];
          }
        }
      }
    }

    return 'en';
  };

  useEffect(() => {
    // Detect current language on component mount
    const detectedLang = detectCurrentLanguage();
    setCurrentLanguage(detectedLang);

    const existingElement = document.getElementById('google_translate_element');
    if (existingElement) {
      existingElement.innerHTML = '';
    }

    window.googleTranslateElementInit = googleTranslateElementInit;

    const existingScript = document.querySelector('script[src*="translate.google.com"]');
    if (!existingScript) {
      const addScript = document.createElement("script");
      addScript.setAttribute(
        "src",
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      );
      addScript.async = true;
      addScript.defer = true;
      addScript.onload = () => {
        setTimeout(googleTranslateElementInit, 100);
      };
      addScript.onerror = () => {
        setIsTranslateLoaded(false);
      };
      document.head.appendChild(addScript);
    } else {
      setTimeout(googleTranslateElementInit, 100);
    }

    const existingStyle = document.getElementById('google-translate-custom-css');
    if (!existingStyle) {
      const style = document.createElement('style');
      style.id = 'google-translate-custom-css';
      style.innerHTML = `
        .goog-te-banner-frame.skiptranslate { display: none !important; }
        .goog-te-gadget-icon { display: none !important; }
        body { top: 0 !important; }
        .goog-te-gadget {
          font-family: inherit !important;
          font-size: 0 !important;
        }
        .goog-te-gadget .goog-te-combo {
          display: none !important;
        }
        .goog-te-gadget > span > a {
          display: none !important;
        }
        .goog-te-gadget > span {
          font-size: 0 !important;
        }
        #google_translate_element {
          display: none !important;
        }
        html body {
          margin-top: 0px !important;
        }
        body > .skiptranslate {
          display: none !important;
        }
        iframe.goog-te-banner-frame {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      try {
        if (window.googleTranslateElementInit) {
          delete window.googleTranslateElementInit;
        }
      } catch (error) {}
    };
  }, []);

  const handleTranslateClick = () => {
    setIsTranslateExpanded(!isTranslateExpanded);
  };

  return (
    <div className="relative">
      <button
        onClick={handleTranslateClick}
        className={`flex items-center justify-center w-14 h-14 ${
          currentLanguage !== 'en' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 hover:bg-blue-600'
        } text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110`}
        title={`Current: ${languages[currentLanguage] || 'English'}`}
      >
        <Languages className="w-6 h-6" />
      </button>
      {isTranslateExpanded && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border p-4 min-w-[280px] z-50 transition-all duration-300">
          <div className="mb-3 text-sm font-medium text-gray-700 flex items-center">
            <Languages className="w-4 h-4 mr-2" />
            Choose Language:
          </div>
          <div className="text-xs text-gray-500 mb-3">
            Current: {languages[currentLanguage] || 'English'}
          </div>
          <div id="google_translate_element" style={{ display: 'none' }} />
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => translateToLanguage('en')}
              className={`px-3 py-2 text-sm rounded border transition-colors ${
                currentLanguage === 'en'
                  ? 'bg-green-100 border-green-300 text-green-800'
                  : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
              }`}
            >
              English
            </button>
            <button
              onClick={() => translateToLanguage('hi')}
              className={`px-3 py-2 text-sm rounded border transition-colors ${
                currentLanguage === 'hi'
                  ? 'bg-green-100 border-green-300 text-green-800'
                  : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => translateToLanguage('bn')}
              className={`px-3 py-2 text-sm rounded border transition-colors ${
                currentLanguage === 'bn'
                  ? 'bg-green-100 border-green-300 text-green-800'
                  : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => translateToLanguage('ta')}
              className={`px-3 py-2 text-sm rounded border transition-colors ${
                currentLanguage === 'ta'
                  ? 'bg-green-100 border-green-300 text-green-800'
                  : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'
              }`}
            >
              தமிழ்
            </button>
            <button
              onClick={() => translateToLanguage('te')}
              className={`px-3 py-2 text-sm rounded border transition-colors ${
                currentLanguage === 'te'
                  ? 'bg-green-100 border-green-300 text-green-800'
                  : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'
              }`}
            >
              తెలుగు
            </button>
            <button
              onClick={() => translateToLanguage('gu')}
              className={`px-3 py-2 text-sm rounded border transition-colors ${
                currentLanguage === 'gu'
                  ? 'bg-green-100 border-green-300 text-green-800'
                  : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'
              }`}
            >
              ગુજરાતી
            </button>
            <button
              onClick={() => translateToLanguage('mr')}
              className={`px-3 py-2 text-sm rounded border transition-colors ${
                currentLanguage === 'mr'
                  ? 'bg-green-100 border-green-300 text-green-800'
                  : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'
              }`}
            >
              मराठी
            </button>
            <button
              onClick={() => translateToLanguage('pa')}
              className={`px-3 py-2 text-sm rounded border transition-colors ${
                currentLanguage === 'pa'
                  ? 'bg-green-100 border-green-300 text-green-800'
                  : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'
              }`}
            >
              ਪੰਜਾਬੀ
            </button>
          </div>
          <button
            onClick={() => setIsTranslateExpanded(false)}
            className="text-xs text-gray-400 hover:text-gray-600 w-full text-center border-t pt-2"
          >
            ✕ Close
          </button>
        </div>
      )}
      {isTranslateExpanded && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsTranslateExpanded(false)}
        />
      )}
    </div>
  );
};

export default GoogleTranslateFloating;
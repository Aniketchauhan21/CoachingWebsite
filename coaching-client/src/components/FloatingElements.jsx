import React, { useState, useEffect } from 'react';
import { Languages } from 'lucide-react';

const FloatingElements = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isTranslateLoaded, setIsTranslateLoaded] = useState(false);
  const [isTranslateExpanded, setIsTranslateExpanded] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Phone number aur WhatsApp number yahan set karein
  const phoneNumber = "9876543210"; // Apna phone number yahan dalein
  const whatsappNumber = "919876543210"; // WhatsApp number with country code

  // Language mapping
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

  // Google Translate initialization
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
      console.log('Error initializing Google Translate:', error);
      setTimeout(googleTranslateElementInit, 1000);
    }
  };

  // Instant translation function
  const translateToLanguage = (languageCode) => {
    try {
      // Method 1: Using Google Translate API if available
      if (window.google && window.google.translate) {
        const selectElement = document.querySelector('.goog-te-combo');
        if (selectElement) {
          selectElement.value = languageCode;
          selectElement.dispatchEvent(new Event('change', { bubbles: true }));
          setCurrentLanguage(languageCode);

          // Set cookie and hash for Google Translate
          if (languageCode === 'en') {
            document.cookie = `googtrans=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;domain=${window.location.hostname}`;
            document.cookie = `googtrans=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;`;
            window.location.hash = '';
            // Force refresh for English
            window.location.reload();
          } else {
            document.cookie = `googtrans=/en/${languageCode};path=/;domain=${window.location.hostname}`;
            document.cookie = `googtrans=/en/${languageCode};path=/;`;
            window.location.hash = `#googtrans(en|${languageCode})`;
            // Force refresh for Hindi
            if (languageCode === 'hi') {
              window.location.reload();
            }
          }

          return;
        }
      }

      // Method 2: Direct URL manipulation for instant translation
      const currentUrl = window.location.href.split('#')[0];
      if (languageCode === 'en') {
        document.cookie = `googtrans=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;domain=${window.location.hostname}`;
        document.cookie = `googtrans=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;`;
        if (window.location.hash.includes('googtrans')) {
          window.location.href = currentUrl;
          setCurrentLanguage('en');
          // Force refresh for English
          setTimeout(() => window.location.reload(), 100);
        } else {
          setCurrentLanguage('en');
          setIsTranslateExpanded(false);
        }
      } else {
        document.cookie = `googtrans=/en/${languageCode};path=/;domain=${window.location.hostname}`;
        document.cookie = `googtrans=/en/${languageCode};path=/;`;
        window.location.href = `${currentUrl}#googtrans(en|${languageCode})`;
        setCurrentLanguage(languageCode);
        // Force refresh for Hindi
        if (languageCode === 'hi') {
          setTimeout(() => window.location.reload(), 100);
        }
      }
    } catch (error) {
      console.log('Translation error:', error);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Google Translate setup
  useEffect(() => {
    // Clear any existing translate elements
    const existingElement = document.getElementById('google_translate_element');
    if (existingElement) {
      existingElement.innerHTML = '';
    }

    // Set callback function
    window.googleTranslateElementInit = googleTranslateElementInit;
    
    // Check if script already exists
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
        console.log('Google Translate script loaded');
        setTimeout(googleTranslateElementInit, 100);
      };
      
      addScript.onerror = () => {
        console.log('Failed to load Google Translate script');
        setIsTranslateLoaded(false);
      };
      
      document.head.appendChild(addScript);
    } else {
      setTimeout(googleTranslateElementInit, 100);
    }

    // Detect current language from URL
    const hash = window.location.hash;
    if (hash.includes('googtrans')) {
      const match = hash.match(/googtrans\(en\|(\w+)\)/);
      if (match && match[1]) {
        setCurrentLanguage(match[1]);
      }
    }

    // Add custom CSS for Google Translate
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
        /* Fix for navbar overlap by Google Translate banner */
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
      } catch (error) {
        console.log('Cleanup error:', error);
      }
    };
  }, []);

  // Smooth scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle phone call
  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  // Handle WhatsApp
  const handleWhatsApp = () => {
    const message = "Hi, I want to know more about your coaching classes.";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Handle translate button click
  const handleTranslateClick = () => {
    setIsTranslateExpanded(!isTranslateExpanded);
  };

  return (
    <>
      {/* Left Side - Call Button */}
      <div 
        className="fixed left-4 bottom-4 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg cursor-pointer transition-all duration-300 hover:scale-110"
        onClick={handleCall}
      >
        <div className="w-6 h-6">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
        </div>
      </div>

      {/* Right Side Floating Buttons Container */}
      <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end space-y-3">
        {/* Google Translate Button */}
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
          
          {/* Translate Dropdown */}
          {isTranslateExpanded && (
            <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border p-4 min-w-[280px] z-50 transition-all duration-300">
              <div className="mb-3 text-sm font-medium text-gray-700 flex items-center">
                <Languages className="w-4 h-4 mr-2" />
                Choose Language:
              </div>
              
              <div className="text-xs text-gray-500 mb-3">
                Current: {languages[currentLanguage] || 'English'}
              </div>
              
              {/* Hidden Google Translate Element */}
              <div id="google_translate_element" style={{ display: 'none' }} />
              
              {/* Custom language buttons for instant translation */}
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
        </div>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <div 
            className="flex items-center justify-center w-14 h-14 bg-gray-700 hover:bg-gray-800 text-white rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:scale-110"
            onClick={scrollToTop}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
            </svg>
          </div>
        )}

        {/* WhatsApp Button - Always at bottom */}
        <div 
          className="flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:scale-110"
          onClick={handleWhatsApp}
        >
          <div className="w-6 h-6">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.89 3.215"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Click outside to close translate dropdown */}
      {isTranslateExpanded && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsTranslateExpanded(false)}
        />
      )}
    </>
  );
};

export default FloatingElements;
import React, { useEffect, useState } from 'react';
import { Languages } from 'lucide-react';

const GoogleTranslate = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const googleTranslateElementInit = () => {
    try {
      if (window.google && window.google.translate && window.google.translate.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "hi,bn,ta,te,ml,kn,gu,mr,pa,ur,en",
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
          },
          "google_translate_element"
        );
        setIsLoaded(true);
      }
    } catch (error) {
      console.log('Error initializing Google Translate:', error);
    }
  };

  useEffect(() => {
    // Set callback function first
    window.googleTranslateElementInit = googleTranslateElementInit;
    
    // Add Google Translate script with error handling
    const addScript = document.createElement("script");
    addScript.setAttribute(
      "src",
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    );
    addScript.onerror = () => {
      console.log('Google Translate script failed to load');
    };
    addScript.onload = () => {
      console.log('Google Translate script loaded successfully');
    };
    document.body.appendChild(addScript);

    // Add custom CSS
    
    return () => {
      // Cleanup
      try {
        const scripts = document.querySelectorAll('script[src*="translate.google.com"]');
        scripts.forEach(script => script.remove());
        
        const styles = document.querySelectorAll('style');
        styles.forEach(style => {
          if (style.innerHTML.includes('goog-te-gadget')) {
            style.remove();
          }
        });
        
        // Remove global callback
        if (window.googleTranslateElementInit) {
          delete window.googleTranslateElementInit;
        }
      } catch (error) {
        console.log('Cleanup error:', error);
      }
    };
  }, []);

  return (
    <div className="relative left-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
        title="Translate"
      >
        <Languages className="w-5 h-5 text-gray-600" />
      </button>
      {/* Always render the container, but hide it if not expanded */}
      <div
        id="google_translate_element"
        className={`absolute top-10 right-0 bg-white rounded-lg shadow-lg border p-3 min-w-[180px] z-50 transition-all duration-300 ${
          isExpanded ? 'block' : 'hidden'
        } ${isLoaded ? 'opacity-100' : 'opacity-50'}`}
      />
      {!isLoaded && isExpanded && (
        <div className="absolute top-10 right-0 bg-white rounded-lg shadow-lg border p-3 min-w-[180px] z-50 text-gray-500 text-sm animate-pulse">
          Loading...
        </div>
      )}
    </div>
  );
};

export default GoogleTranslate;
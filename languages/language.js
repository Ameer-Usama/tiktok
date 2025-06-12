/**
 * Language management system for region-based language switching
 * This script detects the user's region and loads the appropriate language file
 */

// Map of country codes to language codes
const countryToLanguage = {
  // Arabic speaking countries
  'SA': 'ar', // Saudi Arabia
  'AE': 'ar', // United Arab Emirates
  'QA': 'ar', // Qatar
  'KW': 'ar', // Kuwait
  'BH': 'ar', // Bahrain
  'OM': 'ar', // Oman
  'YE': 'ar', // Yemen
  'JO': 'ar', // Jordan
  'SY': 'ar', // Syria
  'LB': 'ar', // Lebanon
  'PS': 'ar', // Palestine
  'IQ': 'ar', // Iraq
  'EG': 'ar', // Egypt
  'LY': 'ar', // Libya
  'TN': 'ar', // Tunisia
  'DZ': 'ar', // Algeria
  'MA': 'ar', // Morocco
  'SD': 'ar', // Sudan
  'SO': 'ar', // Somalia
  'DJ': 'ar', // Djibouti
  'KM': 'ar', // Comoros
  'MR': 'ar', // Mauritania
  
  // English speaking countries
  'US': 'en', // United States
  'GB': 'en', // United Kingdom
  'CA': 'en', // Canada
  'AU': 'en', // Australia
  'NZ': 'en', // New Zealand
  'IE': 'en', // Ireland
  
  // Spanish speaking countries
  'ES': 'es', // Spain
  'MX': 'es', // Mexico
  'CO': 'es', // Colombia
  'AR': 'es', // Argentina
  'PE': 'es', // Peru
  'VE': 'es', // Venezuela
  'CL': 'es', // Chile
  'EC': 'es', // Ecuador
  'GT': 'es', // Guatemala
  'CU': 'es', // Cuba
  'BO': 'es', // Bolivia
  'DO': 'es', // Dominican Republic
  'HN': 'es', // Honduras
  'PY': 'es', // Paraguay
  'SV': 'es', // El Salvador
  'NI': 'es', // Nicaragua
  'CR': 'es', // Costa Rica
  'PA': 'es', // Panama
  'UY': 'es', // Uruguay
  'PR': 'es', // Puerto Rico
  'GQ': 'es', // Equatorial Guinea
  
  // German speaking countries
  'DE': 'de', // Germany
  'AT': 'de', // Austria
  'CH': 'de', // Switzerland
  'LI': 'de', // Liechtenstein
  'LU': 'de', // Luxembourg
  
  // French speaking countries
  'FR': 'fr', // France
  'BE': 'fr', // Belgium
  'MC': 'fr', // Monaco
  'LU': 'fr', // Luxembourg
  'CH': 'fr', // Switzerland
  'CA': 'fr', // Canada
  'CI': 'fr', // Ivory Coast
  'SN': 'fr', // Senegal
  'ML': 'fr', // Mali
  'NE': 'fr', // Niger
  'BF': 'fr', // Burkina Faso
  'GN': 'fr', // Guinea
  'BJ': 'fr', // Benin
  'TG': 'fr', // Togo
  'GA': 'fr', // Gabon
  'CG': 'fr', // Congo
  'CD': 'fr', // Democratic Republic of the Congo
  'MG': 'fr', // Madagascar
  'CM': 'fr', // Cameroon
  'CF': 'fr', // Central African Republic
  'TD': 'fr', // Chad
  'DJ': 'fr', // Djibouti
  'RW': 'fr', // Rwanda
  'BI': 'fr', // Burundi
  'HT': 'fr', // Haiti
  
  // Italian speaking countries
  'IT': 'it', // Italy
  'SM': 'it', // San Marino
  'VA': 'it', // Vatican City
  'CH': 'it', // Switzerland
  
  // Portuguese speaking countries
  'PT': 'pt', // Portugal
  'BR': 'pt', // Brazil
  'AO': 'pt', // Angola
  'MZ': 'pt', // Mozambique
  'GW': 'pt', // Guinea-Bissau
  'CV': 'pt', // Cape Verde
  'ST': 'pt', // São Tomé and Príncipe
  'TL': 'pt', // East Timor
  
  // Russian speaking countries
  'RU': 'ru', // Russia
  'BY': 'ru', // Belarus
  'KZ': 'ru', // Kazakhstan
  'KG': 'ru', // Kyrgyzstan
  
  // Vietnamese speaking countries
  'VN': 'vi', // Vietnam
  
  // Thai speaking countries
  'TH': 'th', // Thailand
  
  // Polish speaking countries
  'PL': 'pl', // Poland
  
  // Dutch speaking countries
  'NL': 'nl', // Netherlands
  'BE': 'nl', // Belgium
  'SR': 'nl', // Suriname
  
  // Turkish speaking countries
  'TR': 'tr', // Turkey
  'CY': 'tr', // Cyprus
  
  // Hungarian speaking countries
  'HU': 'hu', // Hungary
  
  // Czech speaking countries
  'CZ': 'cs', // Czech Republic
  
  // Greek speaking countries
  'GR': 'el', // Greece
  'CY': 'el', // Cyprus
  
  // Ukrainian speaking countries
  'UA': 'uk', // Ukraine
  
  // Indonesian speaking countries
  'ID': 'id', // Indonesia
  
  // Malaysian speaking countries
  'MY': 'ms', // Malaysia
  
  // Japanese speaking countries
  'JP': 'ja', // Japan
  
  // Korean speaking countries
  'KR': 'ko', // South Korea
  
  // Romanian speaking countries
  'RO': 'ro', // Romania
  'MD': 'ro', // Moldova
  
  // Javanese speaking regions
  'ID': 'jv', // Indonesia (Java island)
  
  // Chinese speaking regions
  'CN': 'zh', // China
  'TW': 'zh', // Taiwan
  'HK': 'zh', // Hong Kong
  'MO': 'zh', // Macau
  'SG': 'zh', // Singapore (partial)
  
  // Hindi speaking regions
  'IN': 'hi', // India
};

// Available languages
const availableLanguages = {
  'en': 'English',
  'vi': 'Tiếng Việt',
  'es': 'Español',
  'de': 'German',
  'hu': 'Magyar',
  'nl': 'Nederlands',
  'pt': 'Português',
  'tr': 'Turkish',
  'uk': 'українська мова',
  'ar': 'عربي',
  'ja': '日本語',
  'ro': 'Română',
  'id': 'Indonesia',
  'cs': 'Čeština',
  'fr': 'Français',
  'it': 'Italian',
  'ms': 'Malaysia',
  'pl': 'Polish',
  'th': 'Thailand',
  'el': 'Ελληνικά',
  'ru': 'Русский',
  'ko': '한국어',
  'hi': 'हिन्दी',
  'jv': 'Basa Jawa',
  'zh': '中文'
};

// Default language
let currentLanguage = 'en';

// Store translations
let translations = {};

/**
 * Initialize the language system
 */
function initLanguageSystem() {
  // Try to load language from localStorage first (user preference)
  const savedLanguage = localStorage.getItem('selectedLanguage');
  
  if (savedLanguage && availableLanguages[savedLanguage]) {
    currentLanguage = savedLanguage;
    loadTranslations(currentLanguage);
  } else {
    // Detect user's region and set language accordingly
    detectUserRegion();
  }
  
  // Create language switcher
  createLanguageSwitcher();
}

/**
 * Detect user's region using IP geolocation
 */
async function detectUserRegion() {
  try {
    // Use ipinfo.io service to get user's country
    // IMPORTANT: Replace 'YOUR_IPINFO_TOKEN' with your actual token from ipinfo.io
    const response = await fetch('https://ipinfo.io/json?token=72759eafb85d41');
    const data = await response.json();
    const countryCode = data.country;
    
    // Set language based on country code
    if (countryCode && countryToLanguage[countryCode]) {
      currentLanguage = countryToLanguage[countryCode];
    }
    
    // Load translations for detected language
    loadTranslations(currentLanguage);
  } catch (error) {
    console.error('Error detecting region:', error);
    // Fallback to default language
    loadTranslations(currentLanguage);
  }
}

/**
 * Load translations for the specified language
 * @param {string} lang - Language code
 */
async function loadTranslations(lang) {
  try {
    // Check if language is available, otherwise use default
    if (!availableLanguages[lang]) {
      lang = 'en';
    }
    
    // Load language file
    const response = await fetch(`languages/${lang}.json`);
    translations = await response.json();
    
    // Apply translations to the page
    applyTranslations();
    
    // Save selected language to localStorage
    localStorage.setItem('selectedLanguage', lang);
    
    // Update language switcher
    updateLanguageSwitcher();
    
    // Set text direction for RTL languages
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    console.log(`Language set to: ${availableLanguages[lang]}`);
  } catch (error) {
    console.error(`Error loading translations for ${lang}:`, error);
    // Fallback to English if translation file is missing
    if (lang !== 'en') {
      loadTranslations('en');
    }
  }
}

/**
 * Apply translations to all elements with data-i18n attribute
 */
function applyTranslations() {
  // Apply translations to elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = getNestedTranslation(key);
    
    if (translation) {
      element.textContent = translation;
    }
  });
  
  // Apply translations to elements with data-i18n-placeholder attribute
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    const translation = getNestedTranslation(key);
    
    if (translation) {
      element.setAttribute('placeholder', translation);
    }
  });
  
  // Apply translations to elements with data-i18n-title attribute
  document.querySelectorAll('[data-i18n-title]').forEach(element => {
    const key = element.getAttribute('data-i18n-title');
    const translation = getNestedTranslation(key);
    
    if (translation) {
      element.setAttribute('title', translation);
    }
  });
}

/**
 * Get nested translation value from a dot-notation key
 * @param {string} key - Dot-notation key (e.g., "header.videoDownloader")
 * @returns {string|null} - Translation value or null if not found
 */
function getNestedTranslation(key) {
  const keys = key.split('.');
  let value = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return null;
    }
  }
  
  return typeof value === 'string' ? value : null;
}

/**
 * Create language switcher UI
 */
function createLanguageSwitcher() {
  // Get language dropdown element
  const languageDropdown = document.getElementById('language-dropdown');
  
  if (!languageDropdown) {
    console.error('Language dropdown element not found');
    return;
  }
  
  // Clear existing options
  languageDropdown.innerHTML = '';
  
  // Add languages to dropdown
  for (const [code, name] of Object.entries(availableLanguages)) {
    const languageOption = document.createElement('div');
    languageOption.className = 'language-option';
    languageOption.setAttribute('data-lang', code);
    languageOption.textContent = name;
    
    // Add click event to language option
    languageOption.addEventListener('click', () => {
      currentLanguage = code;
      loadTranslations(code);
      toggleLanguageDropdown(false);
    });
    
    languageDropdown.appendChild(languageOption);
  }
  
  // Add click event to language button
  const languageButton = document.getElementById('language-button');
  if (languageButton) {
    languageButton.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleLanguageDropdown();
    });
  }
  
  // Add click event to document to close dropdown when clicking outside
  document.addEventListener('click', (event) => {
    const languageSwitcher = document.getElementById('language-switcher');
    if (languageSwitcher && !languageSwitcher.contains(event.target)) {
      toggleLanguageDropdown(false);
    }
  });
  
  // Update language switcher
  updateLanguageSwitcher();
}

/**
 * Toggle language dropdown visibility
 * @param {boolean|undefined} force - Force state (true = open, false = close)
 */
function toggleLanguageDropdown(force) {
  const dropdown = document.getElementById('language-dropdown');
  
  if (dropdown) {
    if (force === undefined) {
      dropdown.classList.toggle('show');
    } else if (force) {
      dropdown.classList.add('show');
    } else {
      dropdown.classList.remove('show');
    }
  }
}

/**
 * Update language switcher to reflect current language
 */
function updateLanguageSwitcher() {
  const currentLanguageElement = document.getElementById('current-language');
  
  if (currentLanguageElement) {
    currentLanguageElement.textContent = availableLanguages[currentLanguage] || 'English';
  }
  
  // Highlight current language in dropdown
  document.querySelectorAll('.language-option').forEach(option => {
    if (option.getAttribute('data-lang') === currentLanguage) {
      option.classList.add('active');
    } else {
      option.classList.remove('active');
    }
  });
}

/**
 * Change language manually
 * @param {string} lang - Language code
 */
function changeLanguage(lang) {
  if (availableLanguages[lang]) {
    currentLanguage = lang;
    loadTranslations(lang);
  }
}

// Initialize language system when DOM is loaded
document.addEventListener('DOMContentLoaded', initLanguageSystem);

// Export functions for external use
window.changeLanguage = changeLanguage;
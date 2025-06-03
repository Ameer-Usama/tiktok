# Language System for Region-Based Language Switching

## Overview

This directory contains the language system files for implementing region-based language switching on the website. The system automatically detects the user's region based on their IP address and switches the language accordingly.

## Files

- `language.js`: The main JavaScript file that handles language detection, loading, and switching
- `language.css`: CSS styles for the language switcher UI
- `*.json`: Language translation files (one for each supported language)

## How It Works

1. The system detects the user's region using IP geolocation
2. Based on the detected country, it loads the appropriate language file
3. The translations are applied to all elements with `data-i18n` attributes
4. Users can manually switch languages using the language switcher

## Adding a New Language

To add a new language:

1. Create a new JSON file in this directory with the language code as the filename (e.g., `fr.json` for French)
2. Copy the structure from an existing language file (e.g., `en.json`)
3. Translate all the text values to the new language
4. Add the language code and name to the `availableLanguages` object in `language.js`
5. Add the country codes that should use this language to the `countryToLanguage` mapping in `language.js`

## Language File Structure

Each language file follows the same JSON structure with nested objects for different sections of the website:

```json
{
  "header": { ... },
  "hero": { ... },
  "howToUse": { ... },
  "faq": { ... },
  "downloadOptions": { ... },
  "notifications": { ... },
  "ads": { ... },
  "videoInfo": { ... },
  "footer": { ... }
}
```

## HTML Integration

The language system uses data attributes to identify translatable elements:

- `data-i18n`: For element content (text)
- `data-i18n-placeholder`: For input placeholders
- `data-i18n-title`: For element titles/tooltips

Example:
```html
<h1 data-i18n="hero.title">Download TikTok Videos</h1>
```

## API Usage

You can manually change the language using the global `changeLanguage` function:

```javascript
// Change to Arabic
changeLanguage('ar');

// Change to Spanish
changeLanguage('es');
```

## Notes

- The system uses the ipinfo.io service for IP geolocation. You need to replace `YOUR_IPINFO_TOKEN` in `language.js` with a valid token.
- User language preferences are saved in localStorage for persistence across visits.
- The system automatically handles right-to-left (RTL) languages like Arabic.
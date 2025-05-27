# TikTok Downloader

A beautiful, user-friendly web application for downloading TikTok content without watermarks. This application provides tools for downloading TikTok videos, stories, and photo sliders.

## Features

- **TikTok Video Downloader**: Download TikTok videos without watermark in high quality
- **TikTok Story Downloader**: Save TikTok stories before they disappear in 24 hours
- **TikTok Slider Downloader**: Download photo sliders and carousels from TikTok
- **Clean, Modern UI**: Beautiful and responsive design that works on all devices
- **No Registration Required**: Use all features without creating an account
- **Informative Sections**: Includes FAQs and step-by-step download instructions

## Screenshots

![TikTok Downloader](screenshots/preview.png)

## How to Use

1. Copy the URL of the TikTok video, story, or slider you want to download
2. Paste the URL into the appropriate tool's input field
3. Click the download button
4. Save the content to your device

## Setup Instructions

### Local Development

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/tiktok-downloader.git
   ```

2. Navigate to the project directory:
   ```
   cd tiktok-downloader
   ```

3. Open the `index.html` file in your browser or use a local development server.

### Production Deployment

This is a static website that can be deployed to any web hosting service or CDN:

1. Upload all files to your web hosting service
2. Ensure the server is configured to serve static files correctly
3. For optimal performance, consider using a CDN for asset delivery

## Backend Integration

This frontend UI is designed to work with a backend API that handles the actual TikTok content downloading. To integrate with a backend:

1. Modify the `callDownloadApi()` function in `script.js` to make requests to your backend API
2. Ensure your backend API can handle the different types of TikTok content (videos, stories, sliders)
3. Update the error handling to match your backend API's response format

## Technologies Used

- HTML5
- CSS3 (with animations and responsive design)
- JavaScript (ES6+)
- SVG for illustrations

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This tool is for personal use only. Please respect copyright and terms of service of TikTok when using this application. We are not affiliated with TikTok.
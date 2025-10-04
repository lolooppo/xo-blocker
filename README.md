# 🎮 XO Blocker - Browser Extension

A cross-browser extension that blocks adult content websites by displaying an interactive Tic-Tac-Toe game overlay with a mandatory time delay.

## 📋 Overview

XO Blocker is a self-control tool designed to help users manage their browsing habits. When a user attempts to visit an adult content website, the extension blocks access and displays a fullscreen overlay with a Tic-Tac-Toe game. The user must wait for a configurable timer (default: 5 minutes) before being redirected away from the site.

## ✨ Features

### Core Functionality
- **Smart Detection**: Blocks access using a curated list of 23+ adult domains and 13+ keywords
- **Interactive Game**: Unbeatable Tic-Tac-Toe AI using minimax algorithm
- **Mandatory Timer**: Configurable delay (1-60 minutes, default: 5 minutes)
- **Game Loop**: Continuous games until timer expires - each game auto-restarts after completion
- **Fresh Timer Per Visit**: Timer resets on every visit to a blocked site
- **Auto-Redirect**: Automatically redirects to Google.com when timer expires

### Privacy & Security
- **100% Local**: All data stays on your device
- **Zero Tracking**: No data collection, analytics, or external servers
- **No Escape Routes**: No "Continue Anyway" or whitelist buttons
- **Incognito Support**: Works in private browsing mode (user must enable)

### Accessibility
- **Keyboard Navigation**: Full keyboard support for game controls
- **ARIA Labels**: Screen reader compatible
- **High Contrast**: Readable design with good color contrast

## 🎯 How It Works

1. **Detection**: Background service worker monitors all URLs against blocklist
2. **Blocking**: When match found, content script injects fullscreen overlay
3. **Game Loop**: User plays Tic-Tac-Toe games that auto-restart after each match
4. **Timer**: Countdown runs continuously (default: 5 minutes)
5. **Redirect**: After timer expires, user is automatically redirected to home page
6. **Reset**: Each new visit starts a fresh timer

## 🌐 Browser Compatibility

### ✅ Fully Supported (Desktop Only)
- **Chrome** - Version 88+ (Manifest V3 support)
- **Edge** - Version 88+ (Chromium-based)
- **Firefox** - Version 109+ (Manifest V3 support)

### ❌ Not Supported
- **All Mobile Browsers** - Chrome Mobile, Firefox Mobile, Safari Mobile, Edge Mobile
- **Safari Desktop** - Requires different extension format
- **Internet Explorer** - Obsolete browser

### ⚠️ Untested (May Work)
- **Opera** - Chromium-based, likely compatible but not officially tested
- **Brave** - Chromium-based, likely compatible but not officially tested

**Note**: This extension requires Manifest V3 support and modern browser APIs. It will NOT work on mobile browsers as they do not support browser extensions.

## 🛠️ Technical Stack

- **Manifest Version**: 3 (latest standard)
- **Languages**: Vanilla JavaScript, HTML, CSS
- **Storage**: chrome.storage.local API
- **Permissions**: 
  - `storage` - Save settings and timer data locally
  - `scripting` - Inject overlay on blocked pages
  - `host_permissions` - Check URLs across all sites

## 📦 Installation

### For Development/Testing

#### Chrome/Edge
1. Download or clone this repository
2. Open `chrome://extensions/` (or `edge://extensions/`)
3. Enable **Developer mode** (toggle in top-right)
4. Click **Load unpacked**
5. Select the `reclaim_v2` folder

#### Firefox
1. Download or clone this repository
2. Open `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on**
4. Select `manifest.json` from the folder

### For Production
*(Available on Chrome Web Store, Firefox Add-ons, and Edge Add-ons after approval)*

## ⚙️ Configuration

### Options Page
Right-click extension icon → **Options**
- **Blocking Duration**: Set timer length (1-60 minutes)

### Popup
Click extension icon to:
- View current status (Enabled/Disabled)
- Toggle extension on/off

### Incognito Mode
To enable in Incognito/Private mode:

**Chrome/Edge:**
1. Go to `chrome://extensions/`
2. Find "XO Blocker" → Click "Details"
3. Enable "Allow in Incognito"

**Firefox:**
1. Go to `about:addons`
2. Click "XO Blocker" → Details tab
3. Set "Run in Private Windows" to "Allow"

## 🎮 Game Details

### Tic-Tac-Toe AI
- **Algorithm**: Minimax with depth scoring
- **Difficulty**: Unbeatable (perfect play)
- **Behavior**: AI will either win or draw, never loses
- **Auto-Restart**: Games automatically restart after each match ends

### Game Flow
1. User plays as X, Computer plays as O
2. Game ends when someone wins or board is full (draw)
3. Result displays for 2.5 seconds
4. Board clears and new game starts automatically
5. Loop continues until timer expires

## 📁 Project Structure

```
reclaim_v2/
├── manifest.json           # Extension configuration
├── background.js           # Service worker (detection logic)
├── content-bundle.js       # Content script (overlay + game + storage)
├── options.html            # Settings page UI
├── options.js              # Settings page logic
├── popup.html              # Popup UI
├── popup.js                # Popup logic
└── icons/                  # Extension icons (16, 32, 48, 128px)
```

## 🔧 Customization

### Modify Blocklist
Edit `background.js` lines 6-18:

```javascript
const BLOCKED_DOMAINS = [
  'example.com',  // Add your domains here
  // ...existing domains
];

const BLOCKED_KEYWORDS = [
  'keyword',  // Add your keywords here
  // ...existing keywords
];
```

### Change Default Duration
Edit `background.js` line 94:

```javascript
chrome.storage.local.set({ blockDuration: 10 });  // Change to 10 minutes
```

### Adjust AI Difficulty
The AI uses minimax algorithm (unbeatable). To make it easier, replace the `aiMove()` function in `content-bundle.js` with random move selection.

## 🚀 Publishing

### Chrome Web Store
1. Create developer account ($5 one-time fee)
2. Zip the extension folder
3. Upload to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
4. Fill in listing details and submit for review

### Firefox Add-ons
1. Create Firefox account (free)
2. Zip the extension folder
3. Upload to [Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/)
4. Fill in listing details and submit for review

### Edge Add-ons
1. Register at Microsoft Partner Center (free)
2. Upload same zip as Chrome
3. Submit to [Edge Add-ons](https://partner.microsoft.com/dashboard/microsoftedge/overview/)

## 📱 Mobile Support

**This extension does NOT work on mobile browsers.**

Mobile browsers (Chrome Mobile, Firefox Mobile, Safari Mobile, Edge Mobile) do not support browser extensions. For mobile content filtering, consider:
- DNS-based filtering (OpenDNS, CleanBrowsing, NextDNS)
- Parental control apps
- Router-level filtering

## 🔒 Privacy Policy

**XO Blocker does not collect any data.**

- ❌ No browsing history collection
- ❌ No personal information
- ❌ No external servers or API calls
- ❌ No tracking or analytics
- ✅ All data stored locally on your device
- ✅ Open source and transparent

### What We Store Locally
- Timer data (timestamps for active blocking sessions)
- Settings (blocking duration preference)
- Extension state (enabled/disabled)

All data is stored using `chrome.storage.local` and never leaves your device.

## ⚠️ Disclaimer

This extension is designed as a **self-control tool**, not a parental control or security solution. 

- Users can disable or uninstall the extension at any time
- The blocklist is not exhaustive and may have false positives/negatives
- This is not a substitute for professional help with compulsive behaviors
- Works only on desktop browsers (not mobile)

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License

Copyright (c) 2025 XO Blocker

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## 🙏 Acknowledgments

- Built with Manifest V3 for modern browser compatibility
- Designed with accessibility and privacy as top priorities
- Minimax algorithm implementation for unbeatable AI

## 📞 Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Check existing documentation
- Review the code (it's open source!)

---

**Made with ❤️ to help people build better browsing habits**

**Version**: 1.0.0  
**Last Updated**: October 2025  
**Compatible With**: 
- ✅ Chrome (Desktop, version 88+)
- ✅ Edge (Desktop, version 88+)
- ✅ Firefox (Desktop, version 109+)
- ⏱️ Mobile browsers (Feature work)
- ⚠️ Opera/Brave (untested, may work)

---
## 🎥 Demo

![XO Blocker Demo](https://raw.githubusercontent.com/lolooppo/xo-blocker/main/gif3.gif)


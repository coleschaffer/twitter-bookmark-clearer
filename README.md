# NoMoreMarks

![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![Chrome](https://img.shields.io/badge/Chrome-Extension-4285F4)
![Manifest](https://img.shields.io/badge/Manifest-V3-green)

A Chrome extension that automatically removes all your Twitter/X bookmarks with one click.

## Overview

NoMoreMarks provides a fast, automated way to bulk-delete your Twitter/X bookmarks. Instead of manually unbookmarking tweets one by one, this extension clicks through them automatically, handling deleted tweets and auto-scrolling to load more.

## Features

- **Fast Clearing** - 300ms between unbookmarks for quick deletion
- **Deleted Tweet Detection** - Automatically skips unavailable posts
- **Auto-Scroll** - Loads more bookmarks as it clears them
- **Live Progress** - Console shows removed/skipped counts
- **Stoppable** - Click Stop anytime to halt the process
- **Rate Limit Handling** - Works around Twitter's limits with appropriate delays

## Tech Stack

| Category | Technology |
|----------|------------|
| Language | JavaScript (ES6) |
| Platform | Chrome Extension Manifest V3 |
| UI | HTML5, CSS3 |

## Installation

1. Download or clone this repository
2. Open `chrome://extensions/` in Chrome
3. Enable **Developer mode** (toggle in top right)
4. Click **Load unpacked**
5. Select the folder containing the extension

## Usage

1. Navigate to [twitter.com/i/bookmarks](https://twitter.com/i/bookmarks) or [x.com/i/bookmarks](https://x.com/i/bookmarks)
2. Click the extension icon in your toolbar
3. Click **Start Clearing Bookmarks**
4. Watch progress in the console (F12 → Console)
5. Click **Stop** at any time to halt

## Project Structure

```
NoMoreMarks/
├── manifest.json      # Chrome extension config (v3)
├── popup.html         # Extension popup UI
├── popup.js           # Main extension logic
└── README.md          # Documentation
```

## How It Works

The extension:
1. Finds the unbookmark button (`data-testid="removeBookmark"`) on each tweet
2. Clicks buttons sequentially with 300ms delays
3. Detects and skips deleted/unavailable tweets
4. Scrolls down to load more bookmarks
5. Repeats until all bookmarks are removed

## Configuration

Adjustable timing in `popup.js`:
- Line 82: `setTimeout(clickNext, 300)` - Interval between unbookmarks
- Line 73: `setTimeout(clickNext, 100)` - Delay for skipped tweets
- Line 87: `setTimeout()` - Delay after scrolling (500ms)

## Troubleshooting

### Extension not working
- Make sure you're on the bookmarks page
- Check browser console for errors (F12)

### Rate limited
- Wait a few minutes and run again
- The extension handles most rate limits automatically

### Deleted tweets causing issues
- The extension auto-skips deleted tweets
- Check console for skip count

## License

MIT License

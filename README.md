# Twitter Bookmark Clearer

A simple Chrome extension that automatically removes all your Twitter/X bookmarks with one click.

## Installation

1. Download or clone this repository
2. Open `chrome://extensions/` in Chrome
3. Enable **Developer mode** (toggle in top right)
4. Click **Load unpacked**
5. Select the folder containing this extension

## Usage

1. Navigate to your bookmarks page: [twitter.com/i/bookmarks](https://twitter.com/i/bookmarks) or [x.com/i/bookmarks](https://x.com/i/bookmarks)
2. Click the extension icon in your toolbar
3. Click **Start Clearing Bookmarks**
4. Watch the console (F12 → Console) to see progress
5. Click **Stop** at any time to halt the process

The extension will automatically scroll down to load more bookmarks as it clears them.

## Features

- **Rate limit aware**: 5-second delay between requests to avoid Twitter's API limits
- **Auto-pause on rate limit**: Detects 429 errors and pauses for 90 seconds before retrying
- **Retry logic**: Failed unbookmarks are retried, not skipped
- **Live progress**: Console shows countdown timer and success/fail status
- Scrolls to load more bookmarks as it clears
- Handles deleted posts gracefully

## How It Works

The extension finds the unbookmark button (`data-testid="removeBookmark"`) on each tweet and clicks it sequentially. After clearing visible bookmarks, it scrolls to load more until all bookmarks are removed.

If Twitter rate limits the requests (HTTP 429), the extension automatically pauses for 90 seconds and then resumes. You'll see a countdown in the console.

## License

MIT

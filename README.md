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
4. Watch as it removes each bookmark with a 0.5 second delay
5. Click **Stop** at any time to halt the process

The extension will automatically scroll down to load more bookmarks as it clears them.

## Features

- Automatically removes bookmarks with a 0.5 second delay between each
- Scrolls to load more bookmarks as it clears
- Handles deleted posts gracefully (skips them instead of getting stuck)
- Shows count of removed bookmarks and skipped deleted posts

## How It Works

The extension finds the unbookmark button (`data-testid="removeBookmark"`) on each tweet and clicks it sequentially. After clearing visible bookmarks, it scrolls to load more until all bookmarks are removed. If a bookmarked tweet has been deleted by the original author, the extension detects this and skips to the next one.

## License

MIT

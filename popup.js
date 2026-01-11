const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const status = document.getElementById('status');

startBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab.url.includes('twitter.com/i/bookmarks') && !tab.url.includes('x.com/i/bookmarks')) {
    status.textContent = 'Please navigate to your bookmarks page first!';
    status.style.color = '#f4212e';
    return;
  }

  startBtn.style.display = 'none';
  stopBtn.style.display = 'block';
  status.textContent = 'Clearing bookmarks...';
  status.style.color = '#666';

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: clearBookmarks
  });
});

stopBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => { window.stopClearing = true; }
  });

  startBtn.style.display = 'block';
  stopBtn.style.display = 'none';
  status.textContent = 'Stopped';
});

function clearBookmarks() {
  window.stopClearing = false;
  let removed = 0;
  let attempts = 0;
  let consecutiveFails = 0;
  const baseDelay = 5000; // 5 seconds between requests
  const rateLimitPause = 90000; // 90 second pause when rate limited
  const successfullyRemoved = new WeakSet();

  function countdown(seconds, message) {
    return new Promise(resolve => {
      let remaining = seconds;
      const interval = setInterval(() => {
        if (window.stopClearing) {
          clearInterval(interval);
          resolve();
          return;
        }
        console.log(`${message} ${remaining}s...`);
        remaining--;
        if (remaining < 0) {
          clearInterval(interval);
          resolve();
        }
      }, 1000);
    });
  }

  async function clickNext() {
    if (window.stopClearing) {
      console.log(`Stopped. Removed ${removed} bookmarks.`);
      return;
    }

    // Find the first unbookmark button we haven't successfully removed yet
    const allBtns = document.querySelectorAll('[data-testid="removeBookmark"]');
    let btn = null;

    for (const b of allBtns) {
      if (!successfullyRemoved.has(b)) {
        btn = b;
        break;
      }
    }

    if (btn) {
      const article = btn.closest('article');

      btn.click();
      attempts++;
      console.log(`Attempt #${attempts} (${removed} removed so far)`);

      // Wait to check result
      await new Promise(r => setTimeout(r, 2000));

      // Check if the article was removed (success) or still there (rate limited)
      if (article && document.contains(article)) {
        const stillHasBtn = article.querySelector('[data-testid="removeBookmark"]');
        if (stillHasBtn) {
          // Failed - likely rate limited
          consecutiveFails++;
          console.log(`❌ Rate limited! (${consecutiveFails} consecutive fails)`);

          if (consecutiveFails >= 3) {
            // We're definitely rate limited, pause for a long time
            console.log(`🛑 Rate limit detected. Pausing for 90 seconds...`);
            await countdown(90, '⏳ Resuming in');
            consecutiveFails = 0; // Reset after pause
          }
        } else {
          // Button gone but article still there - success
          successfullyRemoved.add(btn);
          removed++;
          consecutiveFails = 0;
          console.log(`✅ Removed bookmark #${removed}`);
        }
      } else {
        // Article removed from DOM - success
        successfullyRemoved.add(btn);
        removed++;
        consecutiveFails = 0;
        console.log(`✅ Removed bookmark #${removed}`);
      }

      // Wait before next attempt
      const delay = baseDelay + (consecutiveFails * 3000);
      await new Promise(r => setTimeout(r, delay));
      clickNext();
    } else {
      // Scroll down to load more bookmarks
      window.scrollBy(0, 500);

      // Wait a bit for new bookmarks to load
      setTimeout(() => {
        const newBtns = document.querySelectorAll('[data-testid="removeBookmark"]');
        let hasNew = false;
        for (const b of newBtns) {
          if (!clickedButtons.has(b)) {
            hasNew = true;
            break;
          }
        }

        if (hasNew) {
          clickNext();
        } else {
          console.log(`🎉 Done! Removed ${removed} bookmarks.`);
          alert(`Finished! Removed ${removed} bookmarks.`);
        }
      }, 1000);
    }
  }

  clickNext();
}

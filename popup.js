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
  let skipped = 0;
  const processed = new WeakSet();

  async function clickNext() {
    if (window.stopClearing) {
      console.log(`Stopped. Removed ${removed}, skipped ${skipped}.`);
      return;
    }

    const allBtns = document.querySelectorAll('[data-testid="removeBookmark"]');
    let btn = null;

    for (const b of allBtns) {
      if (!processed.has(b)) {
        btn = b;
        break;
      }
    }

    if (btn) {
      processed.add(btn);
      const article = btn.closest('article');

      // Check if this tweet is deleted - skip it
      if (article) {
        const text = article.textContent || '';
        if (text.includes('This post is unavailable') ||
            text.includes('This Tweet was deleted') ||
            text.includes('This post was deleted') ||
            text.includes('This Tweet is unavailable')) {
          skipped++;
          console.log(`⏭️ Skipped deleted #${skipped}`);
          setTimeout(clickNext, 100);
          return;
        }
      }

      btn.click();
      removed++;
      console.log(`✅ Removed #${removed} (${skipped} skipped)`);

      setTimeout(clickNext, 300);
    } else {
      // Scroll down to load more bookmarks
      window.scrollBy(0, 500);

      setTimeout(() => {
        const newBtns = document.querySelectorAll('[data-testid="removeBookmark"]');
        let hasNew = false;
        for (const b of newBtns) {
          if (!processed.has(b)) {
            hasNew = true;
            break;
          }
        }

        if (hasNew) {
          clickNext();
        } else {
          console.log(`🎉 Done! Removed ${removed}, skipped ${skipped} deleted.`);
          alert(`Done! Removed ${removed} bookmarks, skipped ${skipped} deleted.`);
        }
      }, 500);
    }
  }

  clickNext();
}

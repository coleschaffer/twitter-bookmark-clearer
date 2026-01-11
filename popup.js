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
  let count = 0;
  let skipped = 0;
  const clickedButtons = new WeakSet();

  async function clickNext() {
    if (window.stopClearing) {
      console.log(`Stopped. Removed ${count} bookmarks, skipped ${skipped} deleted posts.`);
      return;
    }

    // Find all unbookmark buttons and get one we haven't clicked yet
    const allBtns = document.querySelectorAll('[data-testid="removeBookmark"]');
    let btn = null;

    for (const b of allBtns) {
      if (!clickedButtons.has(b)) {
        btn = b;
        break;
      }
    }

    if (btn) {
      // Mark this button as clicked before we click it
      clickedButtons.add(btn);

      // Get the tweet article element to check if it gets removed
      const article = btn.closest('article');

      btn.click();
      count++;
      console.log(`Clicked unbookmark #${count}`);

      // Wait and check if the article was removed
      setTimeout(() => {
        // If the article is still in the DOM and still has the button, it was probably a deleted post
        if (article && document.contains(article)) {
          const stillHasBtn = article.querySelector('[data-testid="removeBookmark"]');
          if (stillHasBtn) {
            skipped++;
            console.log(`Post #${count} appears to be deleted, skipping...`);
          }
        }
        clickNext();
      }, 500);
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
          console.log(`Done! Removed ${count - skipped} bookmarks, skipped ${skipped} deleted posts.`);
          alert(`Finished! Removed ${count - skipped} bookmarks.\n${skipped > 0 ? `Skipped ${skipped} deleted posts.` : ''}`);
        }
      }, 1000);
    }
  }

  clickNext();
}

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

  async function clickNext() {
    if (window.stopClearing) {
      console.log(`Stopped. Removed ${count} bookmarks.`);
      return;
    }

    const btn = document.querySelector('[data-testid="removeBookmark"]');

    if (btn) {
      btn.click();
      count++;
      console.log(`Removed bookmark #${count}`);

      // Wait 500ms then click next
      setTimeout(clickNext, 500);
    } else {
      // Scroll down to load more bookmarks
      window.scrollBy(0, 500);

      // Wait a bit for new bookmarks to load
      setTimeout(() => {
        const newBtn = document.querySelector('[data-testid="removeBookmark"]');
        if (newBtn) {
          clickNext();
        } else {
          console.log(`Done! Removed ${count} bookmarks total.`);
          alert(`Finished! Removed ${count} bookmarks.`);
        }
      }, 1000);
    }
  }

  clickNext();
}

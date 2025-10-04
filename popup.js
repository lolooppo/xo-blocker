// popup.js
// Shows current status and lets user toggle extension on/off
const statusDiv = document.getElementById('status');
const toggleBtn = document.getElementById('toggle');

function updateUI(enabled) {
  statusDiv.textContent = enabled ? 'Blocking is ENABLED' : 'Blocking is DISABLED';
  toggleBtn.textContent = enabled ? 'Disable XO Blocker' : 'Enable XO Blocker';
}

chrome.runtime.sendMessage({ action: 'get_enabled' }, (resp) => {
  updateUI(resp && resp.enabled !== false);
});

toggleBtn.onclick = () => {
  chrome.runtime.sendMessage({ action: 'get_enabled' }, (resp) => {
    const current = resp && resp.enabled !== false;
    chrome.runtime.sendMessage({ action: 'set_enabled', enabled: !current }, () => {
      updateUI(!current);
    });
  });
};

// options.js
// Handles options page logic
const durationInput = document.getElementById('duration');
const status = document.getElementById('status');
const form = document.getElementById('options-form');

// Load
chrome.storage.local.get(['blockDuration'], (data) => {
  durationInput.value = data.blockDuration || 5;
});

// Save
form.onsubmit = (e) => {
  e.preventDefault();
  const val = Math.max(1, Math.min(60, parseInt(durationInput.value, 10)));
  chrome.storage.local.set({ blockDuration: val }, () => {
    status.textContent = 'Saved!';
    setTimeout(() => (status.textContent = ''), 1500);
  });
};

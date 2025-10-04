// background.js
// Service worker for detection logic
// Isolates detection and communicates with content script

// Real detection logic with curated blocklist
const BLOCKED_DOMAINS = [
  // Major adult sites (sample list - add more as needed)
  'pornhub.com', 'xvideos.com', 'xnxx.com', 'redtube.com', 'youporn.com',
  'tube8.com', 'spankbang.com', 'xhamster.com', 'pornhd.com', 'txxx.com',
  'hqporner.com', 'eporner.com', 'tnaflix.com', 'drtuber.com', 'upornia.com',
  'porn.com', 'beeg.com', 'sex.com', 'xxx.com', 'hentai.xxx',
  'nhentai.net', 'hanime.tv', 'hentaihaven.xxx', 'fakku.net'
];

const BLOCKED_KEYWORDS = [
  'porn', 'xxx', 'sex', 'adult', 'hentai', 'nsfw', 'nude', 'naked',
  'erotic', 'fetish', 'camgirl', 'webcam', 'onlyfans'
];

const isPornSite = (url) => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase().replace(/^www\./, '');
    const fullUrl = url.toLowerCase();
    
    // Check against domain blocklist
    if (BLOCKED_DOMAINS.some(domain => hostname.includes(domain))) {
      return true;
    }
    
    // Check against keyword list
    if (BLOCKED_KEYWORDS.some(keyword => fullUrl.includes(keyword))) {
      return true;
    }
    
    return false;
  } catch {
    return false;
  }
};

const getDomain = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;
  chrome.storage.local.get(["whitelist", "enabled"], (data) => {
    if (data.enabled === false) return;
    const whitelist = data.whitelist || [];
    const domain = getDomain(tab.url);
    if (whitelist.includes(domain)) return;
    if (isPornSite(tab.url)) {
      chrome.tabs.sendMessage(tabId, { action: "block_with_overlay", domain });
    }
  });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "whitelist_site") {
    chrome.storage.local.get(["whitelist"], (data) => {
      const whitelist = data.whitelist || [];
      if (!whitelist.includes(msg.domain)) {
        whitelist.push(msg.domain);
        chrome.storage.local.set({ whitelist });
      }
    });
  }
  if (msg.action === "get_block_duration") {
    chrome.storage.local.get(["blockDuration"], (data) => {
      sendResponse({ blockDuration: data.blockDuration || 5 });
    });
    return true;
  }
  if (msg.action === "set_enabled") {
    chrome.storage.local.set({ enabled: msg.enabled });
  }
  if (msg.action === "get_enabled") {
    chrome.storage.local.get(["enabled"], (data) => {
      sendResponse({ enabled: data.enabled !== false });
    });
    return true;
  }
});

// Set defaults on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["blockDuration", "enabled"], (data) => {
    if (typeof data.blockDuration !== "number") {
      chrome.storage.local.set({ blockDuration: 5 });
    }
    if (typeof data.enabled !== "boolean") {
      chrome.storage.local.set({ enabled: true });
    }
  });
});

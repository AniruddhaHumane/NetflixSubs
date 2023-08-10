chrome.webNavigation.onHistoryStateUpdated.addListener(details => {
    // Check if the URL change is related to a Netflix episode
    if (details.url.includes("https://www.netflix.com/watch/")) {
        console.log('Netflix episode URL changed to:', details.url);
        chrome.tabs.sendMessage(details.tabId, {action: "refreshSubtitles"});
    }
}, {url: [{hostSuffix: 'netflix.com'}]});

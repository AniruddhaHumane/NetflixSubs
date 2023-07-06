chrome.webNavigation.onHistoryStateUpdated.addListener(details => {
    // Check if the URL change is related to a Netflix episode
    if (details.url.includes("https://www.netflix.com/watch/")) {
        console.log('Netflix episode URL changed to:', details.url);
        chrome.tabs.sendMessage(details.tabId, {action: "refreshSubtitles"});
    }
}, {url: [{hostSuffix: 'netflix.com'}]});


chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (key === 'syncTime') {
            console.log('SyncTime changed. newValue:', newValue);
            chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, {action: "refreshSubtitles"});
                }
            });
        }
    }
});
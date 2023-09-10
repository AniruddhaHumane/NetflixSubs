document.getElementById('apply').addEventListener('click', () => {
    let syncTime = document.getElementById('syncTime').value;
    if (!syncTime) {
        syncTime = 15;
    }
    chrome.storage.local.set({ syncTime: syncTime }, () => {
        console.log('Sync time is set to ', syncTime);
    });
});
document.getElementById('apply').addEventListener('click', () => {
    let syncTime = document.getElementById('syncTime').value;
    if (!syncTime) {
        syncTime = 15;
    }
    chrome.storage.local.set({ syncTime: syncTime }, () => {
        console.log('Sync time is set to ', syncTime);
    });
});

document.getElementById('syncTimeSlider').addEventListener('input', function () {
    document.getElementById('syncTime').value = this.value;
});

document.getElementById('syncTime').addEventListener('input', function () {
    document.getElementById('syncTimeSlider').value = this.value;
});
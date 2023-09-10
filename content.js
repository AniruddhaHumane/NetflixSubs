let ass = null

function fetchWithRetry(url, retries = 3) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw new Error('File not found');
                }
                return res.text();
            })
            .then(text => {
                resolve(text);
            })
            .catch(error => {
                if (retries === 1) {
                    reject('Failed after ' + retries +' retries: ' + error);
                    return;
                }
                // Retry with one less attempt left
                fetchWithRetry(url, retries - 1)
                    .then(resolve)
                    .catch(reject);
            });
    });
}

function createAss(episodeId) {
    const subtitleUrl = `http://localhost:19191/${episodeId}.ass`;
    chrome.storage.local.set({ episodeId: episodeId });
    fetchWithRetry(subtitleUrl)
        .then((text) => {
            
            const loadingTimer = setInterval(() => {
                let loading = document.getElementsByClassName("nf-loading-spinner")[0];
                if (loading === undefined){
                    clearInterval(loadingTimer);                        
                    vv = document.getElementsByTagName('video')[0];

                    subContainer = document.getElementsByClassName('ass-ani')
                    for(let i=0; i< subContainer.length; i++)
                        subContainer[i].remove();

                    let divElement = document.createElement('div');
                    divElement.className = "ass-ani"
                    let videoElement = document.querySelector('video');
                    videoElement.insertAdjacentElement('afterend', divElement);
                    
                    ass = new ASS(text, vv, { container: document.getElementsByClassName('ass-ani')[0]});
                    
                    elem = document.getElementsByClassName("ASS-container")[0];

                    document.addEventListener("fullscreenchange", function () {
                        ass.resize();
                    });
                    
                }
            }, 500);

        }).catch(error => {
            return
        });
}

function loadsubs(episodeID){
    if(!isNaN(episodeID)){
        console.log("episode id in loadsubs "+ episodeID)
        createAss(episodeID);
    }
    const checkVideoTitleInterval = setInterval(() => {
        let videoTitleElement = document.querySelector('[data-uia="video-title"]');
        if (videoTitleElement && videoTitleElement.children.length > 2 && videoTitleElement.children[2].innerText !== "") {
            attempts = 1
            while (true) {
                try {
                    let videoTitleElement = document.querySelector('[data-uia="video-title"]');
                    let episodeID = NaN;
                    for (let i = 0; i < videoTitleElement.children.length; i++) {
                        episodeID = videoTitleElement.children[i].innerText.slice(-3)
                        if (!isNaN(episodeID)) {
                            break;
                        }
                    }
                    clearInterval(checkVideoTitleInterval);
                    chrome.storage.local.set({'episodeID': episodeID}, function() {
                        console.log('episodeID is set to ' + episodeID);
                    });

                    // let ass = document.getElementsByClassName("ASS-container")[0]
                    createAss(episodeID);

                    break;
                } catch (error) {
                    console.log(`Attempt ${attempts + 1} failed:`, error);
                    attempts++;
                    if(attempts == 1000)
                        break
                }
            }

        } else {
            console.log('Video title element is not present yet. Retrying...');
        }
    }, 500);
}
chrome.storage.local.get('episodeID', (data) => {
    console.log("Value currently is " + data.episodeID);    
    loadsubs(parseInt(data.episodeID))
})


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'refreshSubtitles') {
        console.log('Refreshing subtitles...');
        chrome.storage.local.get('episodeID', (data) => {
            console.log("Value currently is " + data.episodeID);
            episodeID = parseInt(data.episodeID) + 1;
            loadsubs(episodeID)
        })
    }
});


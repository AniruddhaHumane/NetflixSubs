
let ass = null;
function createAss(episodeId) {
    const subtitleUrl = `http://localhost:19191/${episodeId}.ass`;
    chrome.storage.local.set({ episodeId: episodeId });
    fetch(subtitleUrl)
        .then(res => res.text())
        .then((text) => {
            
            const loadingTimer = setInterval(() => {
                let loading = document.getElementsByClassName("nf-loading-spinner")[0];
                if (loading === undefined){
                    clearInterval(loadingTimer);                        
                    vv = document.getElementsByTagName('video')[0];
                    if(ass && typeof ass.destroy === 'function')
                        ass.destroy();
                    ass = new ASS(text, vv);
                    elem = document.getElementsByClassName("ASS-container")[0];
                    elem.style.height = window.innerHeight;
                    elem.style.width = window.innerWidth;
                    vv.style.height = window.innerHeight;
                    vv.style.width = window.innerWidth;
                    vv.style.marginLeft = "50%";
                    vv.style.marginTop = "18.7%";

                    document.addEventListener("fullscreenchange", function () {
                        ass.resize();
                        elem.style.height = window.innerHeight;
                        elem.style.width = window.innerWidth;
                        vv.style.height = window.innerHeight;
                        vv.style.width = window.innerWidth;
                        if (document.fullscreenElement) {
                            vv.style.marginTop = "21%";
                        } else {
                            vv.style.marginTop = "18.7%";
                        }
                    });
                    
                }
            }, 500);

        });
}

//

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


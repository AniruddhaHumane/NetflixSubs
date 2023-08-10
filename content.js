function loadsubs(){
    const checkVideoTitleInterval = setInterval(() => {
        const videoTitleElement = document.querySelector('[data-uia="video-title"]');
        if (videoTitleElement && videoTitleElement.children[2]) {
            const episodeId = videoTitleElement.children[2].innerText.slice(-3)
            // console.log("Episode_id", videoTitleElement.children[2].innerText, videoTitleElement.children[2].innerText.slice(-3).slice(-3))
            clearInterval(checkVideoTitleInterval);
            // console.log('Video title element is present', videoTitleElement.children[2]);

            const subtitleUrl = `http://localhost:19191/${episodeId}.ass`;
            chrome.storage.local.set({ episodeId: episodeId });
            fetch(subtitleUrl)
            .then(res => res.text())
            .then((text) => {
                vv = document.getElementsByTagName('video')[0]
                const ass = new ASS(text, vv);
                elem = document.getElementsByClassName("ASS-container")[0]
                elem.style.height = "100%"
                elem.style.height = "100%"
                vv.style.height = "100%"
                vv.style.height = "100%"
                vv.style.marginLeft="50%"
                vv.style.marginTop="18.7%"

                document.addEventListener("fullscreenchange", function() {
                    ass.resize()
                    elem.style.height = "100%"
                    elem.style.height = "100%"
                    vv.style.height = "100%"
                    vv.style.height = "100%"
                    if(document.fullscreenElement){
                        vv.style.marginTop="21%"

                    }else{
                        vv.style.marginTop="18.7%"
                    }
                })
                
            });
            
        } else {
            console.log('Video title element is not present yet. Retrying...');
        }
    }, 500);
}
loadsubs()

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'refreshSubtitles') {
        console.log('Refreshing subtitles...');
        loadsubs()
    }
});

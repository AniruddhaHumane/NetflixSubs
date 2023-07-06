chrome.storage.local.get('syncTime', (data) => {

    const syncTime = data.syncTime || 5;

    const checkVideoTitleInterval = setInterval(() => {
        const videoTitleElement = document.querySelector('[data-uia="video-title"]');
        if (videoTitleElement && videoTitleElement.children[2]) {
            clearInterval(checkVideoTitleInterval);
            console.log('Video title element is present', videoTitleElement.children[2]);
            proceedWithSubtitles(videoTitleElement, syncTime);
        } else {
            console.log('Video title element is not present yet. Retrying...');
        }
    }, 500);

});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'refreshSubtitles') {
        console.log('Refreshing subtitles...');
        chrome.storage.local.get(["syncTime"]).then((result) => {
            console.log("Value currently is " + result.syncTime);
            
            // delete existing subs
            const AniSubsDiv = document.querySelector('div.AniSubs');
            if(AniSubsDiv){
                console.log("Existing div found, removing it...")
                AniSubsDiv.remove()
            }

            const checkVideoTitleInterval = setInterval(() => {
                const videoTitleElement = document.querySelector('[data-uia="video-title"]');
                if (videoTitleElement && videoTitleElement.children[2]) {
                    clearInterval(checkVideoTitleInterval);
                    console.log('Video title element is present', videoTitleElement.children[2]);
                    proceedWithSubtitles(videoTitleElement, result.syncTime);
                } else {
                    console.log('Video title element is not present yet. Retrying...');
                }
            }, 500);
        });
    }
});


// Function to parse SRT time format
const parseTime = (t, syncTime) => {
    const [hours, minutes, rest] = t.trim().split(':');
    const [seconds, milliseconds] = rest.split(',');
    return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds) - syncTime;
};

const parseAss = (subtitleText, syncTime) => {
     // Extract subtitle events section
     const eventsSection = subtitleText.split('[Events]')[1];
     if (!eventsSection) return [];
 
     // Extract dialogue lines
     const dialogueLines = eventsSection.split('\n').filter(line => line.startsWith('Dialogue:'));
 
     // Parse dialogue lines into subtitles array
     const subtitles = dialogueLines.map(line => {
         const parts = line.split(',');
         const start = parseTime(parts[1].trim(), syncTime);
         const end = parseTime(parts[2].trim(), syncTime);
         const text = "<span class='AniSubSpan'>"+parts.slice(9).join(",").trim().replace(/\\N|\\n/g, '<br>')+"<span>";
         return { start, end, text };
     });
 
     return subtitles;
}

const parseSrt = (subtitleText) => {
    const subtitles = subtitleText.split('/\n(?=\d+\n)/').map(block => {
        const [idx, rawTime, text] = block.split('\n');
        const [startTime, endTime] = rawTime.split(' --> ').map(parseTime);
        const formattedText = Array.isArray(text) ? text.join('\n') : text;
        return { startTime, endTime, text: formattedText };
    });
    return subtitles
}

function binarySearch(subtitles, currentTime) {
    let low = 0, high = subtitles.length - 1;
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        // console.log(subtitles[low], subtitles[mid], subtitles[high])
        if (subtitles[mid].start <= currentTime && subtitles[mid].end >= currentTime) {
            return mid;
        }
        if (subtitles[mid].start > currentTime) {
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return -1;
}


function proceedWithSubtitles(videoTitleElement, syncTime) {
    console.log("Proceeding with subtitles...", syncTime);

    const episodeId = videoTitleElement.children[2].innerText.slice(-3)
    const subtitleUrl = `http://localhost:19191/${episodeId}.ass`;
    console.log("subs loaded: ", subtitleUrl);

    chrome.storage.local.set({ episodeId: episodeId });
    
    // Fetch and parse the subtitle file
    fetch(subtitleUrl).then(response => response.text()).then(subtitleText => {
        const subtitles = parseAss(subtitleText, syncTime)
        subtitles.sort((a, b) => a.startTime - b.startTime);

        // Create subtitle container
        const subtitleContainer = document.createElement('div');
        subtitleContainer.className = "AniSubs"
        subtitleContainer.style.position = 'absolute';
        subtitleContainer.style.display = "flex";
        subtitleContainer.style.justifyContent = "center";
        subtitleContainer.style.alignItems = "center";
        subtitleContainer.style.width = "50%";
        subtitleContainer.style.marginLeft = "25%"; 
        subtitleContainer.style.marginRight = "25%"; 
        subtitleContainer.style.bottom = '15%';
        subtitleContainer.style.color = 'white';
        subtitleContainer.style.textAlign = 'center';
        subtitleContainer.style.fontSize = '4em';
        subtitleContainer.style.fontFamily = "Open Sans"
        subtitleContainer.style.webkitTextStroke = "1px black"
        subtitleContainer.style.fontWeight = "bold"
        subtitleContainer.style.textShadow = "1px 1px 2px black"

        document.body.appendChild(subtitleContainer);

        document.addEventListener("fullscreenchange", function() {
            if (document.fullscreenElement) {
                document.fullscreenElement.appendChild(subtitleContainer);
            } else {
                document.body.appendChild(subtitleContainer);
            }
        });
        

        // Display subtitles
        const video = document.querySelector('video');
        video.addEventListener('timeupdate', () => {
            const currentTime = video.currentTime;
            // const { startTime, endTime, text } = subtitles[subtitleIndex];

            const index = binarySearch(subtitles, currentTime);
    
            if (index !== -1) {
                subtitleContainer.innerHTML = subtitles[index].text;
                // const subSpan = subtitleContainer.children[0]
                // // console.log("subspan ", subSpan)
                // subSpan.style.padding = "2px";
                // subSpan.style.paddingLeft = "10px";
                // subSpan.style.paddingRight = "10px";
                // subSpan.style.background = "rgba(0,0,0,0.5)";
                // subSpan.style.borderRadius = "25px";
                // console.log("subtitles[index].text: ", subtitles[index].text)
            } else {
                subtitleContainer.innerHTML = '';
            }
        });

        console.log("Subs displaying...");
    }).catch(error => console.error('There has been a problem with AniSub: ', error));
}
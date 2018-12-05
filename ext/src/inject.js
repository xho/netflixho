chrome.extension.sendMessage({}, function(response) {
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);

            // ----------------------------------------------------------
            // This part of the script triggers when page is done loading
            console.log('--- Neflixho ready ---');
            chrome.storage.sync.get('autoplay', (result) => {
                if (result.autoplay) {
                    chrome.runtime.sendMessage({action: "disableThumbsAutoplay"}, (response) => {
                        chrome.storage.sync.set({autoplay: true}, () => {
                            console.log('inject autoplay observer', response);
                        });
                    });
                }
            });
            chrome.storage.sync.get('playbackrate', (result) => {
                if (result.playbackrate) {
                    chrome.runtime.sendMessage({setPlayBackRate: result.playbackrate}, (response) => {
                        console.log('inject playbackrate ', response);
                    });
                }
            });
        }
    }, 10);
});

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
            chrome.storage.sync.get('speed', (result) => {
                if (result.speed) {
                    chrome.runtime.sendMessage({setPlayBackSpeed: result.speed}, (response) => {
                        console.log('inject speed', response);
                    });
                }
            });
        }
    }, 10);
});

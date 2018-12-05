chrome.extension.sendMessage({}, function(response) {
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);

            // ----------------------------------------------------------
            // This part of the script triggers when page is done loading
            console.log('--- Neflixho ready ---');
            chrome.storage.sync.get('observer', (result) => {
                if (result.observer) {
                    chrome.runtime.sendMessage({action: "disableThumbsAutoplay"}, function(response) {
                        chrome.storage.sync.set({observer: true}, function() {
                            console.log('inject observer true', response);
                            console.log('set observer true');                        });
                    });
                }
            });
            chrome.storage.sync.get('speed', (result) => {
                if (result.speed) {
                    chrome.runtime.sendMessage({setPlayBackSpeed: result.speed}, (response) => {
                        console.log('inject speed', response);
                        document.getElementById('currentPlaybackRate').innerText = parseFloat(result.speed).toFixed(2);
                    });
                }
            });
        }
    }, 10);
});

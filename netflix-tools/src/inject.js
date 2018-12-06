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

            this.getAndUpdatePlaybackrate();

            // observe for changes
            let targetNode = document.getElementById('appMountPoint');
            if (targetNode) {
                let config = { childList: true, subtree: true };
                let callback = (mutationsList, observer) => {
                    if (document.querySelector('video')) {
                        this.getAndUpdatePlaybackrate();
                    }
                };
                this.NETFLIXHO.injectObserver = new MutationObserver(callback);
                this.NETFLIXHO.injectObserver.observe(targetNode, config);
            }
        }
    }, 10);
});

// to be moved in libs
this.getAndUpdatePlaybackrate = () => {
    chrome.storage.sync.get('playbackrate', (result) => {
        if (result.playbackrate && result.playbackrate != 1) {
            chrome.runtime.sendMessage({setPlayBackRate: result.playbackrate}, (response) => {
                console.log('inject playbackrate ', response);
            });
        }
    });
}

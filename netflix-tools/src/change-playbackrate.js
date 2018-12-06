document.querySelectorAll("video").forEach((v) => {
    v.playbackRate = this.NETFLIXHO.playbackrate;
});

if (this.NETFLIXHO.playbackrate != 1) {

    if (!this.NETFLIXHO.playbackrateObserver) { // don't create another observer
        let targetNode = document.querySelector('#appMountPoint');
        if (targetNode) {
            let config = { childList: true, subtree: true };
            let callback = (mutationsList, observer) => {
                for(let mutation of mutationsList) {
                    if (mutation.type == 'childList') {
                        if(mutation.addedNodes.length) {
                            let v = mutation.addedNodes[0];
                            if (v && v.tagName == 'VIDEO') {
                                v.addEventListener('play', this.onPlaySetRate);
                            }
                        }
                    }
                }
            };

            this.NETFLIXHO.playbackrateObserver = new MutationObserver(callback);
            this.NETFLIXHO.playbackrateObserver.observe(targetNode, config);
            console.log('Netflixho: playbackrate observer is enabled');
        }
    }

} else if (this.NETFLIXHO.playbackrateObserver) {

    this.NETFLIXHO.playbackrateObserver.disconnect();
    this.NETFLIXHO.playbackrateObserver = null;
    console.log('Netflixho: playbackrate observer is disabled and speed reset to 1');

}

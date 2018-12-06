if (!this.NETFLIXHO.autoplay) {

    document.querySelectorAll('video').forEach((v) => {
        this.removeVideo(v);
    });

    let targetNode = document.querySelector('.mainView .lolomo');
    if (targetNode) {
        let config = { childList: true, subtree: true };
        let callback = (mutationsList, observer) => {
            for(let mutation of mutationsList) {
                if (mutation.type == 'childList') {
                    if(mutation.addedNodes.length) {
                        let v = mutation.addedNodes[0];
                        if (v && v.tagName == 'VIDEO') {
                            v.addEventListener('play', this.onPlaySetPause);
                        }
                        if (v.getElementsByTagName("video")[0]) {
                            v.getElementsByTagName("video")[0].pause();
                        }
                    }
                }
            }
        };

        this.NETFLIXHO.autoplayObserver = new MutationObserver(callback);
        this.NETFLIXHO.autoplayObserver.observe(targetNode, config);
        console.log('Netflixho: autoplay stop is enabled');
    }

}

if (!this.NETFLIXHO) {
    this.NETFLIXHO = {};
}

if (!this.NETFLIXHO.observe) {

    document.querySelectorAll('video').forEach((v) => {
        v.pause();
    })

    let targetNode = document.querySelector('.mainView .lolomo');
    if (targetNode) {
        let config = { childList: true, subtree: true };
        let callback = function(mutationsList, observer) {
            for(let mutation of mutationsList) {
                if (mutation.type == 'childList') {
                    if(mutation.addedNodes.length) {
                        let v = mutation.addedNodes[0];
                        if (v && v.tagName == 'VIDEO') {
                            const onPlay = () => {
                                v.pause();
                            };
                            v.addEventListener('play', onPlay);
                        }
                        if (v.getElementsByTagName("video")[0]) {
                            v.getElementsByTagName("video")[0].pause();
                        }
                    }
                }
            }
        };

        this.NETFLIXHO.observer = new MutationObserver(callback),
        this.NETFLIXHO.observer.observe(targetNode, config);
        console.log('VIDEO AUTOPLAY DISABLED');
    }

}

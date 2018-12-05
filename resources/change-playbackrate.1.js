this.NETFLIXHO = {};
this.playbackrate = 3;

this.onPlaySetRate = (ev) => {
    console.log(ev, this.playbackrate);
    ev.currentTarget.playbackRate = this.playbackrate;
};

let targetNode = document.querySelector('#appMountPoint');
let config = { childList: true, subtree: true };
let callback = (mutationsList, observer) => {
    for(let mutation of mutationsList) {
        if (mutation.type == 'childList') {
            if(mutation.addedNodes.length) {
                let v = mutation.addedNodes[0];
                if (v && v.tagName == 'VIDEO') {
                    console.log(mutation.addedNodes);
                    v.addEventListener('play', this.onPlaySetRate);
                }
            }
        }
    }
};

this.NETFLIXHO.playbackrateObserver = new MutationObserver(callback),
this.NETFLIXHO.playbackrateObserver.observe(targetNode, config);
console.log('Netflixho: playbackrate observer is enabled');



    this.NETFLIXHO.playbackrateObserver.disconnect();
    this.NETFLIXHO.playbackrateObserver = null;
    console.log('Netflixho: playbackrate observer is disabled and speed reset to 1');


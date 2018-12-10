// inject at start with common methods
const setAllVideosPlaybackRate = (rate) => {
    document.querySelectorAll('video').forEach((v) => {
        v.playbackRate = rate;
    });
};

const stopPlayingVideos = () => {
    document.querySelectorAll('video').forEach((v) => {
        v.pause();
        const onPlay = () => { v.pause(); };
        v.addEventListener('play', onPlay);
    });
};


const typeOfVideo = (video) => {
    video = video || document.querySelector('video');
    if (!video) { return; }

    let type;
    if (!!video.closest('.bob-video-merch-player-wrapper')) {
        type = 'autoplayThumbnails';
    }
    if (!!video.closest('.billboard-row')) {
        type = 'autoplayFeatured';
    }
    if (!!video.closest('.jawBoneContent')) {
        type = 'autoplayTrailers';
    }
    return type;
}


// GLOBAL observer settings and callback
let globalObserver;
const config = { childList: true, subtree: true };
const observerCallback = (mutationsList, observer) => {
    for (let mutation of mutationsList) {
        if (mutation.type == 'childList' && mutation.addedNodes && mutation.addedNodes.length) {
            let wrapper = [...mutation.addedNodes]
                .find((element) => {
                    if (element.matches('video')) { return element; }
                    return element.querySelector('video');
                });

            if (!wrapper) { return; }
            let v = wrapper.matches('video') ? wrapper : wrapper.querySelector('video');
            if (!v) { return; }

            if (typeOfVideo(v) == 'autoplayThumbnails') {
                chrome.storage.sync.get('autoplayThumbnails', (result) => {
                    if (result.autoplayThumbnails) {
                        const onPlay = () => { v.pause(); };
                        v.addEventListener('play', onPlay);
                        const container = document.querySelector('.bob-card div .bob-video-merch-player-wrapper');
                        container && (container.style.opacity = 0);
                    }
                });
            }

            if (typeOfVideo(v) == 'autoplayFeatured') {
                chrome.storage.sync.get('autoplayFeatured', (result) => {
                    if (result.autoplayFeatured) {
                        const onPlay = () => { v.pause(); };
                        v.addEventListener('play', onPlay);
                        document.querySelectorAll('.billboard-motion').forEach((i) => {
                            i && i.classList.remove('dismiss-static');
                        });
                    }
                });
            }

            if (typeOfVideo(v) == 'autoplayTrailers') {
                chrome.storage.sync.get('autoplayTrailers', (result) => {
                    if (result.autoplayTrailers) {
                        const onPlay = () => { v.pause(); };
                        v.addEventListener('play', onPlay);
                    }
                });
            }

            chrome.storage.sync.get('playbackrate', (result) => {
                if (result.playbackrate) {
                    v.playbackRate = result.playbackrate;
                }
            });
        }
    }
};

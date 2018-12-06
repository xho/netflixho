// initial setup amd event methods
if (!this.NETFLIXHO) {
    this.NETFLIXHO = {};

    this.removeVideo = (v) => {
        v.pause();
        document.querySelector('.bob-card div .bob-video-merch-player-wrapper').style.opacity = 0;
    }


    this.onPlayRemoveVideo = (ev) => {
        this.removeVideo(ev.currentTarget);
    };

    this.onPlaySetRate = (ev) => {
        if (ev.currentTarget.playbackRate != this.NETFLIXHO.playbackrate) {
            ev.currentTarget.playbackRate = this.NETFLIXHO.playbackrate;
        }
    };
}

// initial setup amd event methods
if (!this.NETFLIXHO) {
    this.NETFLIXHO = {};

    this.removeVideo = (v) => {
        v.pause();
        document.querySelectorAll('.billboard-motion').forEach((i) => {
            i.classList.remove('dismiss-static');
        });
    }

    this.onPlaySetPause = (ev) => {
        this.removeVideo(ev.currentTarget);
    };

    this.onPlaySetRate = (ev) => {
        ev.currentTarget.playbackRate = this.playbackrate;
    };
}

document.querySelectorAll('video').forEach((v) => {
    v.play();
})

if (this.NETFLIXHO && this.NETFLIXHO.autoplay) {
    this.NETFLIXHO.autoplay.disconnect();
    this.NETFLIXHO.autoplay = null;
    console.log('VIDEO AUTOPLAY ENABLED');
}

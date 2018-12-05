document.querySelectorAll('video').forEach((v) => {
    v.play();
})

if (this.NETFLIXHO && this.NETFLIXHO.autoplayObserver) {
    this.NETFLIXHO.autoplayObserver.disconnect();
    this.NETFLIXHO.autoplayObserver = null;
    console.log('Netflixho: autoplay stop is disabled');
}

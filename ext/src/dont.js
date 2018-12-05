document.querySelectorAll('video').forEach((v) => {
    v.play();
})

if (this.NETFLIXHO && this.NETFLIXHO.observer) {
    this.NETFLIXHO.observer.disconnect();
    this.NETFLIXHO.observer = null;
}

console.log('STOP');

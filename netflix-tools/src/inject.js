chrome.extension.sendMessage({}, (response) => {
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);

            // ----------------------------------------------------------
            // This part of the script triggers when page is done loading
            let targetNode = document.querySelector('[data-reactroot]');
            if (targetNode) {
                globalObserver = new MutationObserver(observerCallback);
                globalObserver.observe(targetNode, config);
                console.log('--- Netflixho started ---');
                chrome.runtime.sendMessage({ updateIcon: true }, () => {} );
            }
        }
    }, 10);
});

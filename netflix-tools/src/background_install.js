// on install
chrome.runtime.onInstalled.addListener(function() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        tabs.length && tabs[0].id && updateIcon(tabs[0].id);
        console.log('› background installed ');
    });
});

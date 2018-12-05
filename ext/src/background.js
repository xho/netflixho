// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


chrome.extension.onMessage.addListener(
    (request, sender, sendResponse) => {

        let tabId = sender.tab && sender.tab.id || null;

        switch (request.type) {
            case 'popupInit':
                sendResponse(tabStorage[request.tabId]);
                break;
            default:

                if (request.action == 'disableThumbsAutoplay') {
                    chrome.tabs.executeScript(tabId, {file: 'src/do.js'});
                    sendResponse('ok pauso i video');
                    chrome.storage.sync.set({observer: true}, () => {
                        console.log('set observer true');
                    });
                }

                if (request.action == 'enableThumbsAutoplay') {
                    chrome.tabs.executeScript(tabId, {file: 'src/dont.js'});
                    sendResponse('ok riabilito i video');
                    chrome.storage.sync.set({observer: false}, () => {
                        console.log('set observer false');
                    });
                }

                if (request.setPlayBackSpeed) {
                    chrome.tabs.executeScript({
                        code: 'document.querySelectorAll("video").forEach((v) => {	v.playbackRate = ' + request.setPlayBackSpeed + '; })'
                    });
                    chrome.storage.sync.set({speed: request.setPlayBackSpeed}, () => {
                        console.log('set speed ' + request.setPlayBackSpeed);
                    });
                    sendResponse('imposto la velocità a' + request.setPlayBackSpeed);
                }

                if (request.question && request.question == 'isThumbsAutoplayEnabled') {
                    chrome.storage.sync.get('observer', (result) => {
                        console.log('bg get observer ', result.observer);
                        sendResponse(result.observer || false);
                    });
                }

                if (request.question && request.question == 'currentPlaybackRate') {
                    chrome.storage.sync.get('speed', (result) => {
                        let speed = result.speed;
                        console.log('bg get speed ', speed);
                        sendResponse(speed);
                    });
                }

                break;
        }

        chrome.tabs.query({url: "https://netflix.com/*"}, (results) => {
            if (results.length == 0) {
                if (sender.tab && sender.tab.id) {
                    chrome.pageAction.show(sender.tab.id);
                }
            }
        });
    }
);

chrome.extension.onMessage.addListener(
    (request, sender, sendResponse) => {

        let tabId = sender.tab && sender.tab.id || null;;
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs.length != 0) {
                tabId = tabs[0].id;
                chrome.pageAction.show(tabs[0].id);
            }
        });


        switch (request.type) {
            case 'popupInit':
                sendResponse(tabStorage[request.tabId]);
                break;
            default:
                if (request.action == 'disableThumbsAutoplay') {
                    chrome.tabs.executeScript(tabId, {file: 'src/disable-autoplay.js'});
                    sendResponse('ok pauso i video');
                    chrome.storage.sync.set({observer: true}, () => {
                        console.log('set observer true');
                    });
                }

                if (request.action == 'enableThumbsAutoplay') {
                    chrome.tabs.executeScript(tabId, {file: 'src/enable-autoplay.js'});
                    sendResponse('ok riabilito i video');
                    chrome.storage.sync.set({observer: false}, () => {
                        console.log('set observer false');
                    });
                }

                if (request.setPlayBackSpeed) {
                    chrome.tabs.executeScript({
                        code: 'document.querySelectorAll("video").forEach((v) => {	v.playbackRate = ' + request.setPlayBackSpeed + '; })'
                    });
                    chrome.storage.sync.set({speed: request.setPlayBackSpeed}, () => { });
                    sendResponse('imposto la velocità a ' + request.setPlayBackSpeed);
                }

                if (request.question && request.question == 'isThumbsAutoplayEnabled') {
                    chrome.storage.sync.get('observer', (result) => {
                        chrome.runtime.sendMessage({observer:result.observer}, () => {});
                        sendResponse(result.observer || false);
                    });
                }

                if (request.question && request.question == 'currentPlaybackRate') {
                    chrome.storage.sync.get('speed', (result) => {
                        chrome.runtime.sendMessage({speed:result.speed}, () => {});
                        sendResponse(result.speed);
                    });
                }

                break;
        }
    }
);

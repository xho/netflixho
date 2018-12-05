chrome.extension.onMessage.addListener(
    (request, sender, sendResponse) => {

        let tabId = sender.tab && sender.tab.id || null;;
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs.length != 0) {
                chrome.pageAction.show(tabs[0].id);
                tabId = tabs[0].id;
            }
        });


        switch (request.type) {
            case 'popupInit':
                sendResponse(tabStorage[request.tabId]);
                break;
            default:
                if (request.action == 'disableThumbsAutoplay') {
                    chrome.tabs.executeScript(tabId, { file: 'src/disable-autoplay.js' });
                    sendResponse('ok pauso i video');
                    chrome.storage.sync.set({ autoplay: true }, () => {
                        console.log('set autoplay observer true');
                    });
                }

                if (request.action == 'enableThumbsAutoplay') {
                    chrome.tabs.executeScript(tabId, {file: 'src/enable-autoplay.js'});
                    sendResponse('ok riabilito i video');
                    chrome.storage.sync.set({ autoplay: false }, () => {
                        console.log('set autoplay observer false');
                    });
                }

                if (request.setPlayBackRate) {
                    chrome.tabs.executeScript({
                        code: 'document.querySelectorAll("video").forEach((v) => {	v.playbackRate = ' + request.setPlayBackRate + '; })'
                    });
                    chrome.storage.sync.set({ playbackrate: request.setPlayBackRate }, () => { });
                    sendResponse('imposto la velocità a ' + request.setPlayBackRate);
                }

                if (request.question && request.question == 'isThumbsAutoplayEnabled') {
                    chrome.storage.sync.get('autoplay', (result) => {
                        chrome.runtime.sendMessage({ autoplay: result.autoplay }, () => {});
                    });
                }

                if (request.question && request.question == 'currentPlaybackRate') {
                    chrome.storage.sync.get('playbackrate', (result) => {
                        chrome.runtime.sendMessage({ playbackrate: result.playbackrate }, () => {});
                    });
                }

                break;
        }
    }
);

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

                if (request.setPlayBackSpeed) {
                    chrome.tabs.executeScript({
                        code: 'document.querySelectorAll("video").forEach((v) => {	v.playbackRate = ' + request.setPlayBackSpeed + '; })'
                    });
                    chrome.storage.sync.set({speed: request.setPlayBackSpeed}, () => { });
                    sendResponse('imposto la velocità a ' + request.setPlayBackSpeed);
                }

                if (request.question && request.question == 'isThumbsAutoplayEnabled') {
                    chrome.storage.sync.get('autoplay', (result) => {
                        chrome.runtime.sendMessage({ autoplay: result.autoplay }, () => {});
                    });
                }

                if (request.question && request.question == 'currentPlaybackRate') {
                    chrome.storage.sync.get('speed', (result) => {
                        chrome.runtime.sendMessage({speed:result.speed}, () => {});
                    });
                }

                break;
        }
    }
);

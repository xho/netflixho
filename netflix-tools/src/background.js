const options = [
    'playbackrate',
    'autoplayThumbnails',
    'autoplayFeatured',
    'autoplayTrailers',
];

const icons = {
    default: {
        "16": "icons/icon16.png",
        "19": "icons/icon19.png",
        "48": "icons/icon48.png",
        "128": "icons/icon128.png"
    },
    gray: {
        "16": "icons/icon16-grayed.png",
        "19": "icons/icon19-grayed.png",
        "48": "icons/icon48-grayed.png",
        "128": "icons/icon128-grayed.png"
    }
}

const applyToExistingElements = (setting, value) => {
    switch (setting) {
        case 'autoplayThumbnails':
        case 'autoplayTrailers':
        case 'autoplayFeatured':
            value && chrome.tabs.executeScript( {code: 'stopPlayingVideos();' } );
            break;

        case 'playbackrate':
            chrome.tabs.executeScript( {code: `setAllVideosPlaybackRate(${value});` } );
            break;

        default:
            break;
    }
};

const updateIcon = (tabId) => {
    let selectedIcons = 'gray';
    getStatus().then((status) => {
        if (status) { selectedIcons = 'default'; }
        chrome.pageAction.setIcon({
            tabId: tabId,
            path: icons[selectedIcons],
        });
    });
}

const getStatus = () => new Promise((resolve) => {
    const promises = [];
    options.forEach((setting) => {
        const promise =  new Promise((resolve) => {
            chrome.storage.sync.get(setting, (result) => {
                if (setting == 'playbackrate') {
                    resolve((result[setting] && parseFloat(result[setting]) != '1') || false);
                } else {
                    resolve(result[setting] || false);
                }
            });
        });
        promises.push(promise);
    });
    Promise.all(promises).then((r) => {
        resolve(r.includes(true));
    });
});

chrome.extension.onMessage.addListener(
    (request, sender, sendResponse) => {
        let tabId = sender.tab && sender.tab.id || null;;
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (!tabId && tabs.length != 0) { tabId = tabs[0].id; }
            tabId && chrome.pageAction.show(tabs[0].id);
        });

        if (request.updateIcon) {
            console.log('update');
            tabId && updateIcon(tabId);
        }

        if (request.setConfigOption) {
            const setting = request.setConfigOption;
            chrome.storage.sync.set({
                [Object.keys(setting)[0]]: setting[Object.keys(setting)[0]]
            }, () => {
                tabId && updateIcon(tabId);
                applyToExistingElements(Object.keys(setting)[0], setting[Object.keys(setting)[0]]);
            });
        }

        if (request.getConfigOption) {
            chrome.storage.sync.get(request.getConfigOption, (result) => {
                chrome.runtime.sendMessage({ [request.getConfigOption]: result[request.getConfigOption] }, () => {});
            });
        }
    }
);

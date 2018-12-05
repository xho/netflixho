const autoplayInput = document.getElementById('toggleThumbsAutoplay');
const rateInput = document.getElementById('playbackRate');
const rateLabel = document.getElementById('currentPlaybackRate');

const addDOMEventListeners = () => {
    autoplayInput.addEventListener('change', () => {
        if (autoplayInput.checked) {
            // start autoplay observer
            chrome.runtime.sendMessage({action: 'disableThumbsAutoplay'}, (response) => { });
        } else {
            // stop autoplay observer
            chrome.runtime.sendMessage({action: 'enableThumbsAutoplay'}, (response) => { });
        }
    });


    rateInput.addEventListener('input', () => {
        let val = rateInput.value || 1;
        chrome.runtime.sendMessage({setPlayBackRate: val}, (response) => {
            setPlaybackRateLabel(val);
        });
    });
}

const setPlaybackRateLabel = (val) => {
    rateInput.value = val;
    rateLabel.innerText = parseFloat(val).toFixed(2);
    if (parseFloat(val) != "1") {
        rateLabel.classList.add('on');
    } else {
        rateLabel.classList.remove('on');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({question: 'isThumbsAutoplayEnabled'}, (response) => { });
    chrome.runtime.sendMessage({question: 'currentPlaybackRate'}, (response) => { });
    chrome.runtime.onMessage.addListener((message,sender,sendResponse) => {
        'playbackrate' in message && setPlaybackRateLabel(message.playbackrate);
        'autoplay' in message && (autoplayInput.checked = message.autoplay);
    });

    addDOMEventListeners();
});
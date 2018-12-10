const checkboxes = document.querySelectorAll('[type=checkbox]');
const range = document.getElementById('playbackRate');

const addDOMEventListeners = () => {
    checkboxes.forEach((input) => {
        input.addEventListener('change', (ev) => {
            chrome.runtime.sendMessage({
                setConfigOption: {
                    [ev.currentTarget.id]: ev.currentTarget.checked,
                }
            });
        });
    });

    range.addEventListener('input', (ev) => {
        chrome.runtime.sendMessage({
            setConfigOption: {
                playbackrate: ev.currentTarget.value,
            }
        });
        setPlaybackRateLabel(ev.currentTarget.value);
    });

    // plus & minus buttons
    let interval;
    document.getElementById('minus-button').addEventListener('mousedown', () => {
        interval = setInterval(() => {
            range.value -= 0.1;
            setPlaybackRateLabel(range.value);
        }, 100);
    });
    document.getElementById('plus-button').addEventListener('mousedown',  () => {
        interval = setInterval(() => {
            range.value = (parseFloat(range.value) + 0.1).toFixed(1);
            setPlaybackRateLabel(range.value);
        }, 100);
    });
    document.getElementById('minus-button').addEventListener('mouseup', () => { clearInterval(interval); });
    document.getElementById('minus-button').addEventListener('mouseleave', () => { clearInterval(interval); });
    document.getElementById('plus-button').addEventListener('mouseup', () => { clearInterval(interval); });
    document.getElementById('plus-button').addEventListener('mouseleave', () => { clearInterval(interval); });
}

const setPlaybackRateLabel = (val) => {
    const rateLabel = document.getElementById('currentPlaybackRate');
    rateLabel.innerText = parseFloat(val).toFixed(1);
    rateLabel.classList.toggle('on', val != "1");
}


// onload
document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({ getConfigOption: 'playbackrate', });
    checkboxes.forEach((input) =>
        chrome.runtime.sendMessage({ getConfigOption: input.id, })
    );

    // set initial value
    chrome.runtime.onMessage.addListener((message,sender,sendResponse) => {
        if ('playbackrate' in message) {
            range.value = message.playbackrate;
            setPlaybackRateLabel(message.playbackrate);
        }

        checkboxes.forEach((input) => {
            (input.id in message) && (input.checked = message[input.id]);
        });
    });

    addDOMEventListeners();
});

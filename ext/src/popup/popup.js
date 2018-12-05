let toggleInput = document.getElementById('toggleThumbsAutoplay');
let playbackRateInput = document.getElementById('setPlaybackRate');

addChangeListeners = function() {
    toggleInput.addEventListener('change', () => {
        if (toggleInput.checked) {
            // start observer
            chrome.runtime.sendMessage({action: 'disableThumbsAutoplay'}, function(response) {
                console.log(response);
            });
        } else {
            // stop observer
            chrome.runtime.sendMessage({action: 'enableThumbsAutoplay'}, function(response) {
                console.log(response);
            });
        }
    });


    playbackRateInput.addEventListener('input', () => {
        let val = playbackRateInput.value || 1;
        chrome.runtime.sendMessage({setPlayBackSpeed: val}, (response) => {
            document.getElementById('currentPlaybackRate').innerText = parseFloat(val).toFixed(2);
            console.log(response);
        });
    });
}


document.addEventListener('DOMContentLoaded', function () {
    chrome.runtime.sendMessage({question: 'isThumbsAutoplayEnabled'}, (response) => {
        console.log('---- response observer: ', response);
        toggleInput.checked = response || false;
    });

    setTimeout(() => {
        console.log('send mesage');
        chrome.runtime.sendMessage({question: 'currentPlaybackRate'}, (response) => {
            console.log('---- response speed: ', response);
            // playbackRateInput.value = response.toString() || '1';
            // document.getElementById('currentPlaybackRate').innerText = parseFloat(result.speed).toFixed(2);
        });
    }, 10000);

    addChangeListeners();
});

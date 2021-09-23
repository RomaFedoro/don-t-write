function addLimitation(id) {
    let css = '*[data-list-id="' + id + '"], *[data-id="' + id + '"]{ display: none; }',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));

    head.appendChild(style);
}

function clearData() {
    chrome.storage.local.clear(function () {
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
    });
}

function loadData(list) {
    clearData();
    chrome.storage.local.set({ 'dntwrt': list }, function (result) {
        console.log('Load', list);
    });
}

function launchExtension() {
    chrome.storage.local.get(['dntwrt'], function (result) {
        let conversations = result['dntwrt'];
        let newConversations = {};
        let output = {};
        let deleteList = [];

        for (let id in conversations) {
            let bodyConversation = document.querySelectorAll('li[data-list-id="' + id + '"]');
            if (bodyConversation.length == 1) {
                let imgLink = '';
                if (bodyConversation[0].querySelectorAll('a').length == 1) {
                    imgLink = bodyConversation[0].querySelectorAll('div[class="im_grid"] > img')[0].currentSrc;
                }
                let nameConversation = bodyConversation[0].querySelectorAll('span[class="_im_dialog_link"]')[0].innerText;
                let active = conversations[id];
                output[id] = [imgLink, nameConversation, active];
                if (active == 1) {
                    addLimitation(id);
                }
            }
        }
        chrome.runtime.onMessage.addListener(
            function (message, sender, sendResponse) {
                switch (message.type) {
                    case "getData":
                        sendResponse(output);
                        break;
                    default:
                        console.error("Unrecognised message: ", message);
                }
            }
        );
    });
}

let startLink = window.location.href;
if ((startLink.includes('https://vk.com/im?p')) || (startLink === 'https://vk.com/im')){
    launchExtension();
} else{
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.message == "activeExtension") {
                launchExtension();
            }
        }
    );
}












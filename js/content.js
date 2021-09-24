function addLimitation(id) {
    let css = '*[data-list-id="' + id + '"], *[data-id="' + id + '"]{ display: none; }',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    style.type = 'text/css';
    style.id = id;
    style.innerText = css;

    head.appendChild(style);
}

function deleteLimitation(id) {
    let el = 'style[id="' + id + '"]';
    document.querySelector(el).remove();
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

function addStyle(id) {
    chrome.storage.local.get(['dntwrt'], function (result) {
        let conversations = result['dntwrt'];
        conversations[id] = 1;
        addLimitation(id);
        loadData(conversations);
    });
}

function deleteStyle(id) {
    chrome.storage.local.get(['dntwrt'], function (result) {
        let conversations = result['dntwrt'];
        conversations[id] = 0;
        deleteLimitation(id);
        loadData(conversations);
    });
}

function launchExtension() {
    chrome.storage.local.get(['dntwrt'], function (result) {
        let oldConversations = result['dntwrt'];
        console.log(oldConversations);
        let newConversations = {};
        let output = [];
        let listConversations = document.querySelectorAll('ul[id="im_dialogs"] > li');
        for (let id = 0; id < listConversations.length; id += 1) {
            let conversation = listConversations[id];
            let idConversation = conversation.getAttribute('data-list-id');
            if (conversation.getAttribute('class').includes("nim-dialog_muted")) {
                let imgLink = '';
                if (Object.keys(oldConversations).indexOf(idConversation) != -1) {
                    newConversations[idConversation] = oldConversations[idConversation];
                } else {
                    newConversations[idConversation] = 0;
                }
                delete oldConversations[idConversation];

                if (conversation.querySelectorAll('a').length == 1) {
                    imgLink = conversation.querySelectorAll('div[class="im_grid"] > img')[0].currentSrc;
                }
                let nameConversation = conversation.querySelectorAll('span[class="_im_dialog_link"]')[0].innerText;
                let active = newConversations[idConversation];
                output.push([idConversation, imgLink, nameConversation, active]);
                if (active == 1) {
                    addLimitation(idConversation);
                }
            } else {
                if (Object.keys(oldConversations).indexOf(idConversation) != -1) {
                    delete oldConversations[idConversation];
                }
            }
        }
        for (let id in oldConversations) {
            if (oldConversations[id]) {
                newConversations[id] = 1;
                addLimitation(id);
            }
        }
        loadData(newConversations);

        chrome.runtime.onMessage.addListener(
            function (message, sender, sendResponse) {
                if (message.type === "getData") {
                    sendResponse(output);
                } else if (message.type === "addStyle") {
                    addStyle(message.id);
                } else if (message.type === "deleteStyle") {
                    deleteStyle(message.id);
                } else {
                    console.error("Unrecognised message: ", message);
                }                      
            }
        );
    });
}

let startLink = window.location.href;
if ((startLink.includes('https://vk.com/im')) && (document.querySelectorAll('ul[id="im_dialogs"]'))) {
    launchExtension();
} else {
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.message == "activeExtension") {
                launchExtension();
            }
        }
    );
}

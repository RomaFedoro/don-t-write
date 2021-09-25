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
        conversations[id].active = 1;
        addLimitation(id);
        loadData(conversations);
    });
}

function deleteStyle(id) {
    chrome.storage.local.get(['dntwrt'], function (result) {
        let conversations = result['dntwrt'];
        conversations[id].active = 0;
        deleteLimitation(id);
        loadData(conversations);
    });
}

function launchExtension() {
    chrome.storage.local.get(['dntwrt'], function (result) {
        let oldConversations = result['dntwrt'];
        if (typeof oldConversations == "undefined") {
            oldConversations = {};
        }
        console.log(oldConversations);
        let newConversations = {};
        let listConversations = document.querySelectorAll('ul[id="im_dialogs"] li');
        for (let id = 0; id < listConversations.length; id += 1) {
            let conversation = listConversations[id];
            let idConversation = conversation.getAttribute('data-list-id');
            if (conversation.getAttribute('class').includes("nim-dialog_muted")) {
                if (Object.keys(oldConversations).indexOf(idConversation) != -1) {
                    newConversations[idConversation] = oldConversations[idConversation];
                } else {
                    newConversations[idConversation] = {'active': 0, 'imgLink': '', 'name': ''};
                }
                delete oldConversations[idConversation];
                let imgLink = conversation.querySelectorAll('div[class="nim-peer--photo _im_dialog_photo"] img');
                if (imgLink.length == 1) {
                    newConversations[idConversation].imgLink = imgLink[0].currentSrc;
                }
                newConversations[idConversation].name = conversation.querySelectorAll('span[class="_im_dialog_link"]')[0].innerText;
                if (newConversations[idConversation].active == 1) {
                    addLimitation(idConversation);
                }
            } else {
                if (Object.keys(oldConversations).indexOf(idConversation) != -1) {
                    delete oldConversations[idConversation];
                }
            }
        }
        for (let id in oldConversations) {
            if (oldConversations[id].active) {
                newConversations[id].active = 1;
                addLimitation(id);
            }
        }
        loadData(newConversations);

        chrome.runtime.onMessage.addListener(
            function (message, sender, sendResponse) {
                if (message.type === "addStyle") {
                    addStyle(message.id);
                } else if (message.type === "deleteStyle") {
                    deleteStyle(message.id);
                } else if (message.type === "activeExtensionPopUp") {
                    sendResponse('OK!');
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

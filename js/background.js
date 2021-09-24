chrome.tabs.onUpdated.addListener(
    function (tabId, changeInfo, tab) {
        let link = changeInfo.url;
        if ((link.includes('https://vk.com/im')) && (document.querySelectorAll('ul[id="im_dialogs"]'))) {
            chrome.tabs.sendMessage(tabId, { message: "activeExtension" });
        }
    }
);

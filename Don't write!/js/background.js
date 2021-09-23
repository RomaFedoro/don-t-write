chrome.tabs.onUpdated.addListener(
    function (tabId, changeInfo, tab) {
        let link = changeInfo.url;
        if ((link.includes('https://vk.com/im?p')) || (link === 'https://vk.com/im')) {
            chrome.tabs.sendMessage(tabId, { message: "activeExtension" });
        }
    }
);
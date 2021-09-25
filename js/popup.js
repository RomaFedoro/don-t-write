function checkCheckbox(id) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (document.getElementById(id).checked) {
            console.log('checked ' + id);
            chrome.tabs.sendMessage(tabs[0].id, { type: "addStyle", id: id });
        } else {
            console.log('unchecked ' + id);
            chrome.tabs.sendMessage(tabs[0].id, { type: "deleteStyle", id: id });
        };
    });
}

function start() {
    chrome.storage.local.get(['dntwrt'], function (result) {
        let data = result['dntwrt'];
        if (typeof data == "undefined") {
            data = {};
        }
        console.log(data);
        if (data) {
            let warning = document.querySelector(".warning");
            warning.parentNode.removeChild(warning);
            for (let id in data) {
                console.log(id);
                let imgLink = data[id].imgLink;
                let nameConversation = data[id].name;
                let active = data[id].active;

                if (imgLink === '') {
                    imgLink = '../icons/plug-image.svg';
                }

                let inform = document.createElement('div');
                inform.setAttribute('class', 'inform_conversation');
                inform.innerHTML = '<div class="img_conversation" style = "background-image: url('
                    + imgLink + ');"></div><div class="name_conversation">'
                    + nameConversation + '</div>';

                let checkbox = document.createElement('input');
                checkbox.setAttribute('class', 'custom-checkbox');
                checkbox.setAttribute('type', 'checkbox');
                checkbox.setAttribute('id', id);
                if (active == 1) {
                    checkbox.checked = true;
                }
                checkbox.addEventListener('change', function () {
                    checkCheckbox(id);
                });

                let label = document.createElement('label');
                label.setAttribute('for', id);

                let checkboxCont = document.createElement('div');
                checkboxCont.setAttribute('class', 'checkbox');
                checkboxCont.appendChild(checkbox);
                checkboxCont.appendChild(label);

                let conversation = document.createElement('div');
                conversation.setAttribute('class', 'conversation');
                conversation.setAttribute('id', 'conv-' + id);
                conversation.appendChild(inform);
                conversation.appendChild(checkboxCont);

                let container = document.querySelector('.list_conversations');
                container.appendChild(conversation);
            }
        }
    });
}


chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: "activeExtensionPopUp" }, function (ans) {
        if (ans == 'OK!'){
            start();
        }
    });
});
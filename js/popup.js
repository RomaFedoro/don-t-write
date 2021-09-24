function checkCheckbox(id) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
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
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "getData" }, function (data) {
            console.log(data);
            if ((data) && (Object.keys(data).length)) {
                let warning = document.querySelector(".warning");
                warning.parentNode.removeChild(warning);
            }

            for (let i = 0; i < data.length; i += 1) {
                let id = data[i][0];
                let imgLink = data[i][1];
                let nameConversation = data[i][2];
                let active = data[i][3];

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

        });
    });
}

start();
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: "getData" }, function (data) {
        console.log(data);
        if((data) && (Object.keys(data).length)){
            let warning = document.querySelector(".warning");
            warning.parentNode.removeChild(warning);
        }

        for (let id in data) {
            let imgLink = data[id][0];
            let nameConversation = data[id][1];
            let active = data[id][2];

            if (active == 1) {
                active = ' checked';
            } else {
                active = '';
            }

            if (imgLink === '') {
                imgLink = '../icons/plug-image.svg';
            }

            let container = document.querySelector('.list_conversations');
            let conversation = document.createElement('div');
            conversation.setAttribute('class', 'conversation');
            conversation.setAttribute('id', 'conv-' + id);

            let inform = document.createElement('div');
            inform.setAttribute('class', 'inform_conversation');
            inform.innerHTML = '<div class="img_conversation" style = "background-image: url('
                + imgLink + ');"></div><div class="name_conversation">'
                + nameConversation + '</div>';

            let checkbox = document.createElement('div');
            checkbox.setAttribute('class', 'checkbox');
            checkbox.innerHTML = '<input class="custom-checkbox" type="checkbox" id="'
                + id + '"' + active + '><label for="' + id + '"></label>';

            conversation.appendChild(inform);
            conversation.appendChild(checkbox);
            container.appendChild(conversation);
        }
    });
});
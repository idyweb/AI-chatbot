class Chatbot {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.chatbox__send--footer'),
        }
        this.state = false;
        this.messages = [{ name: "Vivian", message: "Hi. My name is Viola. Welcome to Bingham University chat support system! How can I assist you today?" }];
    }
    display() {
        const { openButton, chatBox, sendButton } = this.args;

        window.addEventListener('scroll', this.onScroll.bind(this));

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        const node = chatBox.querySelector('input');
        node.addEventListener('keyup', ({ key }) => {
            if (key === 'Enter') {
                this.onSendButton(chatBox);
            }
        })
    }
    onScroll() {
        if (window.scrollY > 100) {
            this.showPopup();
        } else {
            this.hidePopup();
        }
    }
    showPopup() {
        if (!this.popup) {
            this.popup = document.createElement('div');
            this.popup.textContent = 'For More enquires about Bingham University, Chat with us here!!';
            this.popup.style.position = 'fixed';
            this.popup.style.bottom = '100px';
            this.popup.style.right = '100px';
            this.popup.style.padding = '10px';
            this.popup.style.backgroundColor = 'lightblue';
            document.body.appendChild(this.popup);
        }
        this.popup.style.display = 'block';
    }

    hidePopup() {
        if (this.popup) {
            this.popup.style.display = 'none';
        }
    }

    toggleState(chatBox) {
        this.state = !this.state;
        if (this.state) {
            chatBox.classList.add('chatbox--active')
            // Hide the pop-up when the chatbot is opened
            this.hidePopup();
            this.updateChatText(chatBox);
        } else {
            chatBox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value;
        if (text1 === "") {
            return;
        }
        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);

        fetch($SCRIPT_ROOT + '/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(r => r.json())
            .then(r => {
                let msg2 = { name: "Vivian", message: r.answer };
                this.messages.push(msg2);
                this.updateChatText(chatbox)
                textField.value = ''
            }).catch((error) => {
                console.error('Error:', error);
                this.updateChatText(chatbox)
                textField.value = ''
            });
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function (item) {
            if (item.name === "Vivian") {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>';
            } else {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>';
            }
        });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}

const chatbot = new Chatbot();
chatbot.display();

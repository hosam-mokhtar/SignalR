document.addEventListener('DOMContentLoaded', function () {
    var userName = prompt("Please Enter Your Name");
    var messageInput = document.getElementById("messageInp");
    var groupNameInput = document.getElementById("groupNameInp");
    var messageToGroupInput = document.getElementById("messageToGroupInp");

    messageInput.focus();

    var proxyConnection = new signalR.HubConnectionBuilder()
        .withUrl("/chathub")
        .build();

    proxyConnection.start()
        .then(() => {
            console.log("Connection started");
            setupEventListeners();
        })
        .catch(err => console.error("Connection error: ", err));

    function setupEventListeners() {

        document.getElementById("sendMessageBtn").addEventListener('click', function (e) {
            e.preventDefault();
            var message = messageInput.value;
            if (message) {
                proxyConnection.invoke("Send", userName, message)
                    .catch(err => console.error("Send error: ", err));
                messageInput.value = '';
            }
        });
    }

    proxyConnection.on("ReciveMessage", function (userName, message) {
        var listElement = document.createElement('li');
        listElement.innerHTML = `<strong>${userName} :</strong> ${message}`;
        document.getElementById("conversation").appendChild(listElement);
    });

    document.getElementById("joinGroupBtn").addEventListener('click', function (e) {
        e.preventDefault();
        var groupName = groupNameInput.value;
        if (groupName) {
            proxyConnection.invoke("JoinGroup", groupName, userName)
                .catch(err => console.error("Send error: ", err));

        }
    });

    document.getElementById("sendMessageToGroupBtn").addEventListener('click', function (e) {
        e.preventDefault();
        var groupName = groupNameInput.value;
        var groupMessage = messageToGroupInput.value;
        if (groupMessage && groupName) {
            proxyConnection.invoke("SendToGroup", groupName, userName, groupMessage)
                .catch(err => console.error("Send error: ", err));
            messageToGroupInput.value = '';

        }
    });

    proxyConnection.on("NewMemberJoin", function (userName, groupName) {
        var listElement = document.createElement('li');
        listElement.innerHTML = `<strong>${userName} has joined ${groupName}</strong> `;
        document.getElementById("groupConversationUL").appendChild(listElement);
    });

    proxyConnection.on("ReciveMessageFromGroup", function (sender, message) {
        var listElement = document.createElement('li');
        listElement.innerHTML = `<strong>${sender} :</strong> ${message}`;
        document.getElementById("groupConversationUL").appendChild(listElement);
    });

});
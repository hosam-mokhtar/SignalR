document.addEventListener('DOMContentLoaded', function () {
    var userName = prompt("Please Enter Your Name");
    var messageInput = document.getElementById("messageInp");

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

});
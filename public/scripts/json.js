function sendLoginJSON() {
    let result = document.querySelector('.result');
    let email = document.querySelector('#email');
    let password = document.querySelector('#password');

    let xhr = new XMLHttpRequest();
    let url = "/user/login";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function() {

        if (xhr.readyState === 4 && xhr.status === 200) {
            result.innerHTML = this.responseText;
        }
        
    };

    var data = JSON.stringify({"email": email.value, "password": password.value})
    xhr.send(data);
}
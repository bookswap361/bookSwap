const addBookBtn      = document.getElementById("addBookBtn"),
      chooseCondition = document.getElementById("chooseCondition"),
      confirmDiv      = document.getElementById("confirm");

function showAddForm(){
    chooseCondition.classList.remove("hidden");
}

function addBook(){
    new Promise(function(resolve, reject) {

        var payload = {user_id: null, book_id: null, condition_id: null, condition_description: null, list_date: null};
        // payload.user_id = document.getElementById("newUser_id").value;
        payload.user_id = 1;
        payload.book_id = parseInt(document.getElementById("newBook_id").value);
        payload.condition_id = parseInt(document.getElementById("newCondition").value);
        payload.condition_description = convertCondition(payload.condition_id).description;
        payload.list_date = getDate();
        
        payload.title = document.getElementById("newTitle").value;
        payload.condition_points = convertCondition(payload.condition_id).points;
    
        resolve(payload);
    }).then(function(result){
        makeReq(result);
    }).then(function(){
    }).catch(function(){
        console.log('error!')
    })

}

function makeReq(data) {
    var req = new XMLHttpRequest();
    req.open("POST", "/book/add-owned-book", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(data))

    console.log(data);
    var confirmStr = `You have successfully added ${data.title} in ${data.condition_description} condition (asking for ${data.condition_points} points) to your collection!`;

    req.onload = function(){
        if(req.status >= 200 && req.status < 400) {
            confirmDiv.innerText = confirmStr;
        }
    }
    
    req.onprogress = function(event) {
        confirmDiv.innerText = "Adding book...";
    }

    req.onerror = function() {
        console.log('error');
        confirmDiv.innerText = "Error! Refresh and try again";
    }
}

function getDate(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = `${yyyy}-${mm}-${dd}`;
    return today;
}

function convertCondition(condition){
    var points;
    var description;
    switch(condition) {
        case 3:
            points = 15;
            description = "excellent";
            break;
        case 2:
            points = 10;
            description = "good";
            break;
        case 1:
            points = 5;
            description = "acceptable";
            break;
    }
    return {points: points, description: description}
}

document.addEventListener("DOMContentLoaded", createOlKey);

function createOlKey(){
    return `${Math.floor(Math.random(500)*+1)}`;
}

function createBook(){
    let req = new XMLHttpRequest();
    req.setRequestHeader('Content-Type', 'application/json');

    req.onload = function(){
        if(req.status >= 200 && req.status < 400) {

            new Promise(function(resolve, reject){
                resolve(JSON.parse(req.responseText))

            }).then(function(results){
                console.log(results);
                var i = 0;
                results.forEach(function(item){
                    if (item.key != null) {
                        showResult(item);
                        i++;
                    }
                })
                loadingText.innerText = `${i} results found for "${query}"`;
                noFind.classList.remove("hidden");
            })
            .catch(function(){
                resultsDiv.innerHTML = "Error! Try search again";
            });
        } else resultsDiv.innerHTML = "404 Error! Try search again";
    }
    req.onerror = function() {
        console.log('Error')
    }

    req.open('POST', baseURL, true);
    req.send(JSON.stringify());
    event.preventDefault();
}
const addBookBtn      = document.getElementById("addBookBtn"),
      chooseCondition = document.getElementById("chooseCondition"),
      confirmDiv      = document.getElementById("confirm"),
      confirmCreate   = document.getElementById("confirmCreate"),
      submitCreBtn    = document.getElementById("submitCreBtn");

// Add existing book to owned books

function showAddForm(){
    chooseCondition.classList.remove("hidden");
}

function addBook(){
    new Promise(function(resolve, reject) {
        resolve(getDataOwn());
    }).then(function(result){
        makeReq(result);
    }).then(function(){
    }).catch(function(){
        console.log('error!')
    })

}

function getDataOwn(){
    var payload = {user_id: null, book_id: null, condition_id: null, condition_description: null, list_date: null};
    // payload.user_id = document.getElementById("newUser_id").value;
    payload.user_id = 1;
    payload.book_id = parseInt(document.getElementById("newBook_id").value);
    payload.condition_id = parseInt(document.getElementById("newCondition").value);
    payload.condition_description = convertCondition(payload.condition_id).description;
    payload.list_date = getDate();
    
    payload.title = document.getElementById("newTitle").value;
    payload.condition_points = convertCondition(payload.condition_id).points;

    return payload
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

// Create Book

submitCreBtn.addEventListener("click", function(event){
    createBook();
    event.preventDefault();
})

function createBook(){
    new Promise(function(resolve, reject){
        resolve(getDataCreate());
    }).then(function(result){
        console.log(result);
    }).catch(function(){
        console.log("Error!")
    })
}

function makeCBReq(data){
    let req = new XMLHttpRequest();
    req.setRequestHeader('Content-Type', 'application/json');

    req.onload = function(){
        if(req.status >= 200 && req.status < 400) {
            confirmCreate.innerText = "Successfully added book to system"
            // Link
        }
    }

    req.onerror = function() {
        console.log('Error')
    }

    req.open('POST', "/book/create-book", true);
    req.send(JSON.stringify(data));
    event.preventDefault();
}

function createOlKey(){
    return "OL" + Math.floor(Math.random()*500+1);
}

function getDataCreate(){
    var payload = {title: null, description: null, ol_key: null, thumbnail_url: null};
    payload.title = document.getElementById("newTitle").value;
    payload.description = document.getElementById("newDescription").value;
    payload.ol_key = createOlKey();
    return payload
}
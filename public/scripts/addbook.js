const addBookBtn      = document.getElementById("addBookBtn"),
      chooseCondition = document.getElementById("chooseCondition"),
      confirmDiv      = document.getElementById("confirm"),
      confirmCreate   = document.getElementById("confirmCreate"),
      newLink         = document.getElementById("newLink"),
      submitCreBtn    = document.getElementById("submitCreBtn"),
      allOlKeys       = document.getElementById("allOlKeys").innerHTML.split(",");


// Add existing book to owned books
function showAddForm(){
    chooseCondition.classList.remove("hidden");
}

function addBook(){
    new Promise(function(resolve, reject) {
        resolve(getDataOwn());
    }).then(function(result){
        makeReq(result);
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
    req.open("POST", "/book/add-to-account", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(data))

    console.log(data);
    var confirmStr = `You have successfully added ${data.title} in ${data.condition_description} condition (asking for ${data.condition_points} points) to your collection!`;

    req.onload = function(){
        if(req.status >= 200 && req.status < 400) {
            confirmDiv.innerText = confirmStr;
        } else {
            confirmDiv.innerText = "Something went wrong! Please refresh and try again.";
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

// Create new Book to Library
submitCreBtn.addEventListener("click", function(event){
    createBook();
    event.preventDefault();
})

function createBook(){
    new Promise(function(resolve, reject){
        resolve(getDataCreate());
    }).then(function(result){
        console.log(result);
        makeCBReq(result);
    }).catch(function(){
        console.log("Error!")
    })
}

function makeCBReq(data){
    var bol_key = data.bol_key;
    var req = new XMLHttpRequest();
    req.open('POST', "/book/create-book", true);    
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(data));

    req.onload = function(){
        if(req.status >= 200 && req.status < 400) {
            confirmCreate.innerText = "Successfully added book to system!"
            newLink.classList.remove("hidden");
            newLink.setAttribute("href", `/book/${bol_key}`);
            submitCreBtn.setAttribute("disabled", "true");
        } else {
            confirmCreate.innerText = "Hmm something went wrong. Please refesh and try again."
        }
    }

    req.onerror = function() {
        console.log('Error')
    }

}

function createOlKey(id){
    var newKey = "OL" + Math.floor(Math.random()*50000+1) + id;
    while (allOlKeys.includes(newKey)) {
        newKey = "OL" + Math.floor(Math.random()*50000+1) + id;
    }
    return newKey;
}

function getDataCreate(){
    var payload =
        {bol_key: null, description: null, thumbnail_url: null, title: null,
        aol_key: null, name: null};
    payload.title = document.getElementById("newTitle").value;
    payload.description = document.getElementById("newDescription").value;
    payload.bol_key = createOlKey("NB");

    payload.aol_key = createOlKey("NA");
    payload.name = document.getElementById("newAuthor").value;
    return payload
}
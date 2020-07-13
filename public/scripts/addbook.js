const addBookBtn      = document.getElementById("addBookBtn"),
      chooseCondition = document.getElementById("chooseCondition"),
      confirmDiv      = document.getElementById("confirm");

function showAddForm(){
    chooseCondition.classList.remove("hidden");
}

function addBook(){
    new Promise(function(resolve, reject) {

        var payload = {};
            payload.title = document.getElementById("newTitle").value;
            payload.user_id = document.getElementById("newUser_id").value;
            payload.book_id = document.getElementById("newBook_id").value;
            payload.list_date = document.getElementById("newTitle").value;
            
            payload.condition = document.getElementById("newCondition").value;
            payload.points = convertCondition(payload.condition).points;
            payload.description = convertCondition(payload.condition).description;
    
        resolve(payload);
    }).then(function(result){
        // makeReq(result);
        console.log(result);
        return result;
    }).then(function(result){
        confirmDiv.innerText = `You have successfully added ${result.title} in ${result.description} condition (asking for ${result.points} points) to your collection!`;
    }).catch(function(){
        console.log('error')
    })

}

function makeReq(data) {
    var req = new XMLHttpRequest();

    return new Promise(function(resolve, reject){        
  
        req.onload = function(){
            if(req.status >= 200 && req.status < 400) {
                confirmDiv.innerText = "Adding book...";
        }
        req.onerror = function() {
            console.log('error');
            confirmDiv.innerText = "Error! Refresh and try again";
        }
        
        req.open("POST", "/add-own-book", true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(data))

        return data;

        }
    })
}

function convertCondition(condition){
    var points;
    var description;
    switch(condition) {
        case "3":
            points = 15;
            description = "excellent";
            break;
        case "2":
            points = 10;
            description = "good";
            break;
        case "1":
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
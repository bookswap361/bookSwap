const addBookBtn      = document.getElementById("addBookBtn"),
      confirmDiv      = document.getElementById("confirm"),
      description     = document.getElementById("description");

// Add existing book to owned books
function getDataOwn(){
    var payload = {user_id: null, book_id: null, condition_id: null, condition_description: null, list_date: null};
    payload.user_id = 1;
    payload.book_id = parseInt(document.getElementById("newBook_id").value);
    payload.condition_id = parseInt(document.getElementById("newCondition").value);
    payload.condition_description = convertCondition(payload.condition_id).description;
    payload.list_date = new Date();
    
    payload.title = document.getElementById("newTitle").value;
    payload.condition_points = convertCondition(payload.condition_id).points;

    return payload
}

function makeReq(type) {
    var data = getDataOwn();
    switch (type) {
        case "booklist":
            var confirmStr = `You have successfully added ${data.title} in ${data.condition_description} condition (asking for ${data.condition_points} points) to your collection! View your account to see it.`;
            
            fetchHelper("/account/add_books", "POST", data)
            .then(function() {                
                confirmDiv.innerText = confirmStr;
                disableBtn(addBookBtn);
            })
            .catch(function(err) {
                console.log(err);
                confirmDiv.innerText = "Error! Refresh and try again.";
            });
        break;
    case "wishlist":
        var confirmStr = `You have successfully added ${data.title} to your wishlist. View your account to see it.`;
        
        fetchHelper("/account/add_wish", "POST", data)
        .then(function() {
            confirmDiv.innerText = confirmStr;
            disableBtn(addWishBtn);
        })
        .catch(function(err) {
            console.log(err);
            confirmDiv.innerText = "Error! Refresh and try again";
        });
        break;
    }
}

function convertCondition(condition){
    var points;
    var description;
    switch(condition) {
        case 3:
            points = 15;
            description = "Excellent";
            break;
        case 2:
            points = 10;
            description = "Good";
            break;
        case 1:
            points = 5;
            description = "Acceptable";
            break;
    }
    return {points: points, description: description}
}

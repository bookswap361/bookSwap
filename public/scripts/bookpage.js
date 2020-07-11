const addBookBtn   = document.getElementById("addBookBtn"),
      chooseCondition = document.getElementById("chooseCondition"),
      confirmDiv   = document.getElementById("confirm");

function showAddForm(){
    chooseCondition.classList.remove("hidden");
}

function addBook(){
    new Promise(function(resolve, reject) {

        var payload = {};
            payload.title = document.getElementById("newTitle").value;
            payload.condition = document.getElementById("newCondition").value;
            payload.points = convert(payload.condition);
    
        resolve(payload);
    }).then(function(result){
        confirmDiv.innerText = `You have successfully added ${result.title} in ${result.condition} condition (asking for ${result.points} points) to your collection!`;
    }).catch(function(){
        console.log('error')
    })

}

function convert(condition){
    var points;
    switch(condition) {
        case "excellent":
            points = 15;
            break;
        case "good":
            points = 10;
            break;
        case "acceptable":
            points = 5;
            break;
    }
    return points
}

const addBookBtn   = document.getElementById("addBookBtn"),
      chooseCondition = document.getElementById("chooseCondition"),
      confirmDiv   = document.getElementById("confirm");

function showAddForm(){
    chooseCondition.classList.remove("hidden");
}

// function addBook(){
//     new Promise(function(resolve, reject){
//         // resolve(getValues())
//         resolve(function(){
//             alert('hello');
//         }).then(function(result){

//         }).catch(function(){
//             console.log("error");
//         })
//     })
    
//     confirmDiv.innerText = `Trade ${book}`
//     // Update for request
//     var payload = {}
//     payload.condition = conditionVal.value;  
//     })

// function getValues(){

// }


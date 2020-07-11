const addBookBtn   = document.getElementById("addBookBtn"),
      conditionVal = document.getElementById("condition"),
      confirmDiv   = document.getElementById("confirm");

function addBook(){
    new Promise(function(resolve, reject){
        // resolve(getValues())
        resolve(function(){
            alert('hello');
        }).then(function(result){

        }).catch(function(){
            console.log("error");
        })
    })
    
    confirmDiv.innerText = `Trade ${book}`
    // Update for request
    var payload = {}
    payload.condition = conditionVal.value;  
    })

function getValues(){

}
// Create new Book to Library
const allOlKeys = document.getElementById("allOlKeys").innerHTML.split(",");


document.addEventListener("DOMContentLoaded", dataCreate);

function createOlKey(id){
    var newKey = "OL" + Math.floor(Math.random()*50000+1) + id;
    while (allOlKeys.includes(newKey)) {
        newKey = "OL" + Math.floor(Math.random()*50000+1) + id;
    }
    return newKey;
}

function dataCreate(){
    document.getElementById("bol_key").setAttribute("value", createOlKey("NB"));
    document.getElementById("aol_key").setAttribute("value", createOlKey("NA"));
}
// Create new Book to Library
const allOlKeys   = document.getElementById("allOlKeys").innerHTML.split(","),
      findAuthBtn = document.getElementById("findAuthBtn"),
      loadingText = document.getElementById("loadingText"),
      resultsDiv  = document.getElementById("resultsDiv"),
      authorRes   = document.getElementById("authorRes"),
      other       = document.getElementById("other");
var uniqueResults;

document.addEventListener("DOMContentLoaded", dataCreate);
findAuthor();

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

function findAuthor(){
    findAuthBtn.addEventListener("click", function(event){        
        event.preventDefault();
        new Promise(function(resolve, reject){
            loadingText.innerText = "Finding author... please wait... ";
            resolve(getData())
        }).then(function(result){
            makeReq(result)
        }).catch(function(){
            loadingText.innerText = "Hmm something went wrong, please try again.";
        })
    });
}

function getData(){
    return document.getElementById("qAuthor").value;
}

function makeReq(data) {
    return new Promise(function(resolve, reject){        
        var req = new XMLHttpRequest();
        var baseURL = `http://openlibrary.org/search.json?author=${data}`;
        req.open("GET", baseURL, true);
        req.send(null);

        req.onload = function(){
            if(req.status >= 200 && req.status < 400) {

                new Promise(function(resolve, reject){
                    resolve(JSON.parse(req.responseText))
                }).then(function(results){
                    var allResults = [];
                    var max = 5;
                    if (results.docs.length < 5) max = results.docs.length;
                    for(var i=0; i<max; i++) {
                        var data = {name: null, author_id: null};
                        if (results.docs[i].hasOwnProperty("author_name")) data.name = results.docs[i].author_name[0];
                        if (results.docs[i].hasOwnProperty("author_key")) data.author_id = results.docs[i]["author_key"][0];
                        allResults.push(data);
                    }
                    return allResults;
                }).then(function(results){
                    uniqueResults = getUnique(results);
                    var i = 0;
                    uniqueResults.forEach(function(item){
                        if (item.author_id != null) {
                            showResult(item);
                            i++;
                        }
                    })
                    loadingText.innerText = `${i} results found for "${data}"`;
                    if (i > 0){
                        resultsDiv.classList.remove("hidden");
                    } else {
                        loadingText.innerText = "No results found- enter details below:"
                        document.getElementById("iAuthor").value = data;
                    }
                    document.getElementById("addBook").classList.remove("hidden");
                })
                .catch(function(){
                    resultsDiv.innerHTML = "Error! Try search again";
                });
            } else resultsDiv.innerHTML = "404 Error! Try search again";
        }
        req.onerror = function() {
            console.log("error")
        }        
    })
}

function showResult(data){
    var newOpt = document.createElement("option");
    newOpt.value = data.name;
    newOpt.innerText = data.name;
    newOpt.setAttribute("id", data.author_id);
    authorRes.insertBefore(newOpt, other);
}

function getUnique(data){
    var result = [];
    const map = new Map();
    for (const item of data) {
        if(!map.has(item.author_id)){
            map.set(item.author_id, true);
            result.push({
                name: item.name,
                author_id: item.author_id
            });
        }
    }
    return result;
}

function fillInAuthor(){
  var selection = authorRes.value;
  var id = uniqueResults.find((isSelected)).author_id;
  document.getElementById("iAuthor").value = selection;
  document.getElementById("aol_key").value = id;

  function isSelected(item){
    return item.name == selection;
}

}


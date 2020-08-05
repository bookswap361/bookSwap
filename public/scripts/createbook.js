// Create new Book to Library
const allOlKeys   = document.getElementById("allOlKeys").innerHTML.split(","),
      findAuthBtn = document.getElementById("findAuthBtn"),
      loadingText = document.getElementById("loadingText"),
      resultsDiv  = document.getElementById("resultsDiv"),
      authorRes   = document.getElementById("authorRes"),
      other       = document.getElementById("other");
var uniqueResults;

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
    attachAuthorListener();
}

function attachAuthorListener(){
    findAuthBtn.addEventListener("click", function(event){        
        event.preventDefault();
        makeReq();
    });
}

function getData(){
    return document.getElementById("qAuthor").value;
}

function makeReq() {
    var data = getData();
    loadingText.innerHTML = "Finding author... please wait... ";
    fetchHelper(`https://openlibrary.org/search.json?author=${data}`, "GET")
    .then(function(data) {
        return data.json();
    })
    .then(function(results) {
        var authorValue = getData();
        var allResults = [];
        var max = 5;
        loadingText.innerHTML = "";
        if (results.docs.length < 5) max = results.docs.length;
        for(var i=0; i<max; i++) {
            var data = {name: null, author_id: null};
            if (results.docs[i].hasOwnProperty("author_name")) data.name = results.docs[i].author_name[0];
            if (results.docs[i].hasOwnProperty("author_key")) data.author_id = results.docs[i]["author_key"][0];
            allResults.push(data);

        }
        uniqueResults = getUnique(allResults);
        var i = 0;
        uniqueResults.forEach(function(item){
            if (item.author_id != null) {
                showResult(item);
                i++;
            }
        })
        loadingText.innerText = `${i} results found for "${authorValue}"`;
        if (i > 0){
            resultsDiv.classList.remove("hidden");
        } else {
            loadingText.innerText = "No results found- enter details below:"
            document.getElementById("iAuthor").value = data;
        }
        document.getElementById("addBook").classList.remove("hidden");
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
  if (uniqueResults.find(isSelected)) {
    var id = uniqueResults.find(isSelected).author_id;
    document.getElementById("iAuthor").value = selection;
    document.getElementById("aol_key").value = id;
  }

  function isSelected(item){
    return item.name == selection;
    }
}

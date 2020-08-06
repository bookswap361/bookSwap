// Create new Book to Library
const allOlKeys   = document.getElementById("allOlKeys").innerHTML.split(","),
      findAuthBtn = document.getElementById("findAuthBtn"),
      loadingText = document.getElementById("loadingText"),
      resultsDiv  = document.getElementById("resultsDiv"),
      authorRes   = document.getElementById("authorRes"),
      authorInput = document.getElementById("qAuthor"),
      other       = document.getElementById("other"),
      MAX_RESULT  = 5;
var uniqueResults;

document.addEventListener("DOMContentLoaded", pageInit);

function createOlKey(id){
    var newKey = "OL" + Math.floor(Math.random()*50000+1) + id;
    while (allOlKeys.includes(newKey)) {
        newKey = "OL" + Math.floor(Math.random()*50000+1) + id;
    }
    return newKey;
}

function pageInit() {
    document.getElementById("bol_key").setAttribute("value", createOlKey("NB"));
    document.getElementById("aol_key").setAttribute("value", createOlKey("NA"));
    attachAuthorListener();
}

function attachAuthorListener(){
    findAuthBtn.addEventListener("click", function(event){        
        event.preventDefault();
        authorGetRequest();
    });
}

function getAuthorValue(){
    return authorInput.value;
}

function authorGetRequest() {
    var authorValue = getAuthorValue();
    loadingText.innerHTML = "Finding author... please wait... ";
    fetchHelper(`https://openlibrary.org/search.json?author=${authorValue}`, "GET")
    .then(function(data) {
        return data.json();
    })
    .then(function(results) {
        var authorValue = getAuthorValue();
        var allResults = [];
        uniqueResults = [];
        var numResults = results.docs.length < MAX_RESULT ? results.docs.length : MAX_RESULT;
        resetAuthorDropdown();
        loadingText.innerHTML = "";
        for(var i = 0; i < numResults; i++) {
            var data = {name: null, author_id: null};
            if (results.docs[i].hasOwnProperty("author_name")) data.name = results.docs[i].author_name[0];
            if (results.docs[i].hasOwnProperty("author_key")) data.author_id = results.docs[i]["author_key"][0];
            allResults.push(data);

        }
        uniqueResults = getUnique(allResults);
        var resultCounter = 0;
        uniqueResults.forEach(function(item, index){
            if (item.author_id != null) {
                showResult(item, index == 0);
                resultCounter++;
            }
        })
        loadingText.innerText = `${resultCounter} results found for "${authorValue}"`;
        if (resultCounter > 0){
            resultsDiv.classList.remove("hidden");
        } else {
            loadingText.innerText = "No results found- enter details below:"
            document.getElementById("iAuthor").value = data;
        }
        document.getElementById("addBook").classList.remove("hidden");
    })
}

function showResult(data, isFirst) {
    var newOpt = document.createElement("option");
    newOpt.value = data.name;
    newOpt.innerText = data.name;
    newOpt.setAttribute("id", data.author_id);
    newOpt.setAttribute("selected", isFirst ? "" : true);
    authorRes.prepend(newOpt);
}

function getUnique(data) {
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

function fillInAuthor() {
    var selection = authorRes.value;
    var findAuthor = uniqueResults.find(isSelected);
    if (findAuthor) {
        var id = findAuthor.author_id;
        document.getElementById("iAuthor").value = selection;
        document.getElementById("aol_key").value = id;
    } else {
        document.getElementById("iAuthor").value = "";
    }

    function isSelected(item){
        return item.name == selection;
    }
}

function resetAuthorDropdown() {
    var otherOption = document.createElement("option");
    authorRes.innerHTML = "";
    otherOption.value = "";
    otherOption.innerText = "Other - Type in author name below";
    authorRes.appendChild(otherOption);
}

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

function createOlKey(id) {
    var newKey = "OL" + Math.floor(Math.random()*50000+1) + id;
    while (allOlKeys.includes(newKey)) {
        newKey = "OL" + Math.floor(Math.random()*50000+1) + id;
    }
    return newKey;
}

function pageInit(){
    document.getElementById("bol_key").setAttribute("value", createOlKey("NB"));
    findAuthBtn.addEventListener("click", function(event){        
        event.preventDefault();
        authorGetRequest();
    });
}

function getAuthorValue(){
    return authorInput.value;
}

function toggleLoadingText(options) {
    if (!options) {
        loadingText.innerHTML = "Finding author... please wait... ";
    } else if (options.resultCounter) {
        loadingText.innerHTML = `${options.resultsLength} results found for "${options.authorValue}"`;
    } else {
        loadingText.innerHTML = "No results found - enter details below:";
    }
}

function authorGetRequest() {
    var authorValue = getAuthorValue();
    toggleLoadingText();
    fetchHelper(`https://openlibrary.org/search.json?author=${authorValue}`, "GET")
    .then(function(data) {
        return data.json();
    })
    .then(function(results) {
        var authorValue = getAuthorValue();
        var allResults = [];
        var numResults = results.docs.length < MAX_RESULT ? results.docs.length : MAX_RESULT;
        uniqueResults = [];
        resetAuthorDropdown();
        for(var i = 0; i < numResults; i++) {
            var data = {name: null, author_id: null};
            if (results.docs[i].hasOwnProperty("author_name")) data.name = results.docs[i].author_name[0];
            if (results.docs[i].hasOwnProperty("author_key")) data.author_id = results.docs[i]["author_key"][0];
            allResults.push(data);

        }
        uniqueResults = getUnique(allResults);
        showResult(uniqueResults);
        var resultsLength = uniqueResults.length;
        toggleLoadingText({resultsLength, authorValue});
        if (resultsLength){
            resultsDiv.classList.remove("hidden");
            fillInAuthor();
        } else {
            setAuthorValues();
        }
        document.getElementById("addBook").classList.remove("hidden");
    });
}

function showResult(data) {
    data.forEach(function(item, index) {
        var option = createOption(item, index == 0);
        authorRes.prepend(option);
    });
}

function createOption(data, isFirst) {
    var newOpt = document.createElement("option");
    newOpt.value = data.name;
    newOpt.innerText = data.name;
    newOpt.setAttribute("id", data.author_id);
    newOpt.setAttribute("selected", isFirst ? "" : true);
    return newOpt;
}

function getUnique(data) {
    var result = [];
    const map = new Map();
    for (const item of data) {
        if(!map.has(item.author_id) && item.author_id){
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
        setAuthorValues(selection, id);
    } else {
        setAuthorValues();
    }

    function isSelected(item){
        return item.name == selection;
    }
}

function setAuthorValues(authorName, authorId) {
    document.getElementById("iAuthor").value = authorName || "";
    document.getElementById("aol_key").value = authorId || createOlKey("NA");
}

function resetAuthorDropdown() {
    var otherOption = document.createElement("option");
    authorRes.innerHTML = "";
    otherOption.value = "";
    otherOption.innerText = "Other - Type in author name below";
    authorRes.appendChild(otherOption);
}

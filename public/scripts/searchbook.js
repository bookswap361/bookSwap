const loadingText = document.getElementById("loadingText"),
      topTitle    = document.getElementById("topTitle"),
      topAuthor   = document.getElementById("topAuthor"),
      topGenre    = document.getElementById("topGenre"),
      topImg      = document.getElementById("topImg");

bindSearch();

function bindSearch(){
    document.getElementById("searchSubmit").addEventListener("click", function(event){        
        loadingText.innerText = "Loading results...";
        makeReq()
    });
}

function makeReq() {
    var req = new XMLHttpRequest();

    return new Promise(function(resolve, reject){        
        var baseURL = "http://openlibrary.org/search.json?q=" + document.getElementById("searchText").value;
                
        req.onload = function(){
            if(req.status >= 200 && req.status < 400) {
                document.getElementById("resultsDiv").classList.remove("hidden");
                var parsedData = JSON.parse(req.responseText);
                if (parsedData.docs[0].cover_i) makeImg(parsedData.docs[0].cover_i);
                loadingText.innerText = `Number of results: ${parsedData.numFound} | Top Result:`;
                topTitle.innerText   = parsedData.docs[0].title_suggest;
                topAuthor.innerText  = parsedData.docs[0].author_name[0];
                topGenre.innerText  = parsedData.docs[0].subject[0];
            } else resultsDiv.innerHTML = "Error!";
        }
        
        req.onerror = function() {
            console.log('error')
        }
        
        req.open("GET", baseURL, true);
        req.send(null);
        event.preventDefault();
    })
}

function makeImg(id) {
    var url = `https://covers.openlibrary.org/b/id/${id}-M.jpg`;
    topImg.innerHTML = `<img src="${url}">`;
}
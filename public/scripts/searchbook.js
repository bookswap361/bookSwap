const loadingText = document.getElementById("loadingText"),
      resultsDiv  = document.getElementById("resultsDiv");

bindSearch();

function bindSearch(){
    document.getElementById("searchSubmit").addEventListener("click", function(event){        
        loadingText.innerText = "Loading results...";
        makeReq()
    });
}

function makeReq() {
    var req = new XMLHttpRequest();
    var query = document.getElementById("searchText").value;

    return new Promise(function(resolve, reject){        
        var baseURL = `http://openlibrary.org/search.json?q=${query}`;
                
        req.onload = function(){
            if(req.status >= 200 && req.status < 400) {
                resultsDiv.classList.remove("hidden");

                new Promise(function(resolve, reject){

                    resolve(JSON.parse(req.responseText))
                
                }).then(function(results){
                
                    loadingText.innerText = `${results.numFound} results found for "${query}"`;

                    var allResults = [];
                     for(var i=0; i<10; i++) {
                        var data = {title: null, author: null, genre: null, art_id: null};
                        
                        if (results.docs[i].hasOwnProperty("cover_i")) data.title  = results.docs[i].title_suggest;
                        if (results.docs[i].hasOwnProperty("cover_i")) data.author = results.docs[i].author_name[0];
                        if (results.docs[i].hasOwnProperty("cover_i")) data.art_id = results.docs[i].cover_i;
                        if (results.docs[i].hasOwnProperty("subject")) data.genre  = results.docs[i].subject[0];

                        allResults.push(data);
                     }
                     
                     return allResults;
                
                }).then(function(results){
                    // makeresults
                    console.log(results);
                    results.forEach(function(item){
                        showResult(item);
                    })
                })
                .catch(function(){
                    resultsDiv.innerHTML = "Error! Try search again";
                });
            } else resultsDiv.innerHTML = "Error! Try search again";
        }
        
        req.onerror = function() {
            console.log('error')
        }
        
        req.open("GET", baseURL, true);
        req.send(null);
        event.preventDefault();
    })
}

function showResult(data) {
    var newRow = makeRow()
    newRow.appendChild(makeThumbnail(data.art_id));
    
    resultsDiv.appendChild(newRow)
}

function makeRow(){
    var newDiv = document.createElement("div");
    newDiv.classList.add("row");
    return newDiv;
}

function makeThumbnail(id){
    var newArt = document.createElement("div");
    if (id) {
        var url = `https://covers.openlibrary.org/b/id/${id}-M.jpg`;
        newArt.innerHTML = `<img src="${url}">`;
    } else {
        newArt.innerText = "No image found";
    }
    return newArt;
}


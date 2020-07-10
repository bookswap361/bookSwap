const loadingText = document.getElementById("loadingText"),
      resultsDiv  = document.getElementById("resultsDiv");

bindSearch();

function bindSearch(){
    document.getElementById("searchSubmit").addEventListener("click", function(event){        
        new Promise(function(resolve, reject){
            resolve(resetResults())
        }).then(function(result){
            loadingText.innerText = "Loading results...";
        }).then(function(result){
            makeReq()
        })
    });
}

function makeReq() {
    var req = new XMLHttpRequest();
    var query = document.getElementById("searchText").value;

    return new Promise(function(resolve, reject){        
        var baseURL = `http://openlibrary.org/search.json?q=${query}`;
        resultsDiv.classList.remove("hidden");        

        req.onload = function(){
            if(req.status >= 200 && req.status < 400) {

                new Promise(function(resolve, reject){

                    resolve(JSON.parse(req.responseText))
                
                }).then(function(results){
                
                    loadingText.innerText = `${results.numFound} results found for "${query}"`;

                    var allResults = [];
                     for(var i=0; i<10; i++) {
                        var data = {title: null, author: null, genre: [], art: null};
                        
                        if (results.docs[i].hasOwnProperty("title_suggest")) data.title  = results.docs[i].title_suggest;
                        if (results.docs[i].hasOwnProperty("author_name")) data.author = results.docs[i].author_name[0];
                        if (results.docs[i].hasOwnProperty("cover_i")) data.art = results.docs[i].cover_i;
                        if (results.docs[i].hasOwnProperty("subject")) {
                            results.docs[i].subject.forEach(function(item){
                            data.genre.push(item);
                            });
                        }

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
    newRow.appendChild(makeThumbnail(data.art));
    newRow.appendChild(showBookInfo(data));
    newRow.classList.add("searchResult")
    document.getElementById("searchResults").appendChild(newRow);
    document.getElementById("searchResults").appendChild(makeHr());
}

function makeHr(){
    return document.createElement("hr");
}

function makeRow(){
    var newDiv = document.createElement("div");
    newDiv.classList.add("row");
    return newDiv;
}

function showBookInfo(data){
    var divDetail = document.createElement("div");
    divDetail.classList.add("col-9");
    if (data.genre.length > 10){
        divDetail.innerHTML = `${data.title} by ${data.author} <hr> Genres: ${cutGenre(data.genre)}, and more`;
    } else if (data.genre.length > 0) {
        divDetail.innerHTML = `${data.title} by ${data.author} <hr> Genres: ${data.genre}`;
    } else {
        divDetail.innerHTML = `${data.title} by ${data.author}`;
    }
    return divDetail;
}

function cutGenre(data){
    return data.slice(0, 10);
}

function makeThumbnail(id){
    var newArt = document.createElement("div");
    newArt.classList.add("col-3")
    if (id) {
        var url = `https://covers.openlibrary.org/b/id/${id}-M.jpg`;
        newArt.innerHTML = `<img src="${url}">`;
    } else {
        newArt.innerText = "No image found";
        newArt.style.width = "180px";
    }
    return newArt;
}

function resetResults(){
    document.getElementById("searchResults").innerHTML = "";
    resultsDiv.classList.add("hidden");
}
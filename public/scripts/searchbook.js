const loadingText = document.getElementById("loadingText"),
      resultsDiv  = document.getElementById("resultsDiv");

bindSearch();

function bindSearch(){
    document.getElementById("searchSubmit").addEventListener("click", function(event){        
        new Promise(function(resolve, reject){
            resolve(resetResults())
        }).then(function(result){
            resultsDiv.classList.add("hidden");
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
        // var baseURL = `http://openlibrary.org/search.json?q=${query}`;
        var baseURL = `https://www.googleapis.com/books/v1/volumes?q=${query}`;
                
        req.onload = function(){
            if(req.status >= 200 && req.status < 400) {
                resultsDiv.classList.remove("hidden");

                new Promise(function(resolve, reject){

                    resolve(JSON.parse(req.responseText))
                
                }).then(function(results){
                
                    loadingText.innerText = `${results.totalItems} results found for "${query}"`;

                    var allResults = [];
                     for(var i=0; i<10; i++) {
                        var data = {title: null, author: [], genre: [], description: null, art: null};
                        
                        if (results.items[i].hasOwnProperty("volumeInfo")) data.title  = results.items[i].volumeInfo.title;
                        if (results.items[i].volumeInfo.hasOwnProperty("authors")){
                            results.items[i].volumeInfo.authors.forEach(function(item){
                                data.author.push(item);
                            });
                        }
                        if (results.items[i].volumeInfo.hasOwnProperty("description")) data.description = results.items[i].volumeInfo.description;
                        if (results.items[i].volumeInfo.hasOwnProperty("imageLinks")) data.art = results.items[i].volumeInfo.imageLinks.thumbnail;
                        if (results.items[i].volumeInfo.hasOwnProperty("categories")){
                            results.items[i].volumeInfo.categories.forEach(function(item){
                                data.genre.push(item);
                            });
                        }

                        allResults.push(data);
                     }
                     
                     return allResults;
                
                }).then(function(results){
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
    document.getElementById("searchResults").appendChild(newRow)
}

function makeRow(){
    var newDiv = document.createElement("div");
    newDiv.classList.add("row");
    return newDiv;
}

function showBookInfo(data){
    var divDetail = document.createElement("div");
    divDetail.classList.add("col-6");
    if (data.description.length >= 60){
        divDetail.innerHTML = `${data.title} by ${data.author} | <strong>Recommended</strong> <hr> ${data.description} <P> Genres: ${data.genre}`;
    } else {
        divDetail.innerHTML = `${data.title} by ${data.author} <hr> ${data.description} <P> Genres: ${data.genre}`;
    }
    return divDetail;
}

function makeThumbnail(id){
    var newArt = document.createElement("div");
    newArt.classList.add("col-3");
    
    if (id) newArt.innerHTML = `<img src="${id}">`;
    else newArt.innerText = "No image found";

    return newArt;

}

function resetResults(){
    document.getElementById("searchResults").innerHTML = "";
}
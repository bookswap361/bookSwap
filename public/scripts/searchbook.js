const loadingText = document.getElementById("loadingText"),
      resultsDiv  = document.getElementById("resultsDiv"),
      noFind  = document.getElementById("noFind");
var resultData = [];

bindSearch();

function bindSearch(){
    document.getElementById("searchSubmit").addEventListener("click", function(event){        
        event.preventDefault();
        makeReq();
    });
}

function makeReq() {
    resetResults();
    var query = document.getElementById("searchText").value;
    loadingText.innerText = "Loading and filtering results... please wait... ";
    fetchHelper(`https://openlibrary.org/search.json?q=${query}`, "GET")
    .then(function(data) {
        return data.json();
    })
    .then(function(results) {
        resultsDiv.classList.remove("hidden");
        loadingText.innerText = "";
        var allResults = [];
        var max = 20;
        if (results.docs.length < 20) max = results.docs.length;
        for(var i=0; i<max; i++) {
            var data = {title: null, name: null, genre: [], thumbnail_url: null, book_id: null, author_id: null, description: null};
                        
            if (results.docs[i].hasOwnProperty("title_suggest")) data.title  = results.docs[i].title_suggest;
            if (results.docs[i].hasOwnProperty("author_name")) data.name = results.docs[i].author_name[0];
            if (results.docs[i].hasOwnProperty("key")) {
                var key = results.docs[i].key;
                data.book_id = key.split("/")[2];
            }
            if (results.docs[i].hasOwnProperty("author_key")) data.author_id = results.docs[i]["author_key"][0];
            if (results.docs[i].hasOwnProperty("cover_i")){
                data.thumbnail_url = `https://covers.openlibrary.org/b/id/${results.docs[i].cover_i}-M.jpg`
            }
            if (results.docs[i].hasOwnProperty("first_sentence")) data.description = results.docs[i]["first_sentence"][0];
            if (results.docs[i].hasOwnProperty("subject")) {
                results.docs[i].subject.forEach(function(item){
                    data.genre.push(item);
                });
            }
            allResults.push(data);
        } 
        var i = 0;
        allResults.forEach(function(item){
            if (item.book_id != null) {
                showResult(item, i);
                resultData.push(item)
                i++;
            }
        })
        loadingText.innerText = `${i} results found for "${query}"`;
        noFind.classList.remove("hidden");
    })
}


function showResult(data, num) {
    var newRow = makeRow()
    newRow.appendChild(makeThumbnail(data.thumbnail_url));
    newRow.appendChild(showBookInfo(data, num));
    newRow.classList.add("searchResult");
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

function showBookInfo(data, num){
    var divDetail = document.createElement("div");
    divDetail.classList.add("col-6");
    divDetail.classList.add("col-md-9");
    divDetail.setAttribute("id", num);

    var length = data.genre.length;
    var genreStr;
    if (length > 0) genreStr = `<hr> Genres: ${data.genre}`;
    if (length > 10) genreStr = `<hr> Genres: ${cutGenre(data.genre)}, and more`;
    else genreStr = "";
    divDetail.innerHTML = `${data.title} by ${data.name} ${genreStr} <P>`;
    divDetail.appendChild(makeLink(data));

    return divDetail;
}

function cutGenre(data){
    return data.slice(0, 10);
}

function makeThumbnail(id){
    var newthumbnail_url = document.createElement("div");
    newthumbnail_url.classList.add("col-6")
    newthumbnail_url.classList.add("col-md-3")
    if (id) {
        newthumbnail_url.innerHTML = `<img src="${id}" class="img-fluid">`;
    } else {
        newthumbnail_url.innerText = "No image found";
    }
    return newthumbnail_url;
}

function makeLink(data) {
    var newForm = document.createElement("form");
    newForm.setAttribute("action", "/book/" + data.book_id);
    newForm.setAttribute("method", "POST");
    
    for (var [key, value] of Object.entries(data)){
        newForm.appendChild(makeInput(key, value));
    }    
    
    newForm.appendChild(makeSubmit())
    return newForm
}

function makeSubmit(){
    var submit = document.createElement("input");
    submit.type = "submit";
    submit.value = "Select Book";
    return submit;
}

function makeInput(name, data){
    var newInput = document.createElement("input");
    newInput.setAttribute("value", data);
    newInput.name = name;
    newInput.setAttribute("hidden", "true");
    return newInput;
}

function resetResults(){
    document.getElementById("searchResults").innerHTML = "";
    resultsDiv.classList.add("hidden");
    noFind.classList.add("hidden");
}


// Create post req when user clicks 'select book'
resultsDiv.onclick = function(event) {
    var a = event.target.closest('a');
    if (!a) return;
    if (!resultsDiv.contains(a)) return;
    
    var i = a.closest("div").id;
    var sendData = resultData[i];
    renderBook(sendData);
  };

function renderBook(data){
    var id = data.book_id;
    if (id) {
        fetchHelper(`/book/${id}`, "POST", data)
        .catch(function(err) {
            console.log(err);
            resultsDiv.innerHTML = "Hmm something went wrong. Please refresh and try again.";
        });
    }
    
}

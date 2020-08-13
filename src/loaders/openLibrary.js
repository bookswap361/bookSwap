var axios = require('axios');
var makeRequest = {};

makeRequest.main = axios.create({
    baseURL: 'https://openlibrary.org/',
    method: 'get',
    responseType: 'json'
});

makeRequest.search = function(query){
    return new Promise(function(resolve, reject){
        resolve(makeRequest.main(determineUrl(query)))
        })
        .then(function(results) {
            var allResults = [];
    
            results.data.docs.forEach(function(item) {
                allResults.push(getBookPayload(item));
            })
            
            return {
                "numResults": maxResults(results.data.numFound),
                "books": allResults,
                "pages": getPages(results),
            }
        })
}

module.exports = { makeRequest };

function determineUrl(query) {
    var postfix = `search.json?q=${query.title}`;
    if (query.title && query.author) postfix += `+${query.author}`;
    else if (query.author) postfix += `&author=${query.author}`;
    if (query.page) postfix += `&page=${query.page}`;
    return postfix
}

function getBookPayload(item) {
    var data = {title: null, author: null, thumbnail_url: null, book_id: null, author_id: null, description: null};
                    
    if (item.title_suggest) data.title  = item.title_suggest;
    if (item.author_name) data.author = item.author_name[0];
    if (item.key) {
        var key = item.key;
        data.book_id = key.split("/")[2];
    }
    if (item.author_key) data.author_id = item.author_key[0];
    if (item.cover_i) data.thumbnail_url = `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`;
    if (item.first_sentence) data.description = item.first_sentence[0];
    
    return data
}

function getPages(results) {
    var total = maxResults(results.data.numFound);
    return Math.ceil(total/100)
}

function maxResults(total) {
    if (total >= 1000) return 999;
    else return total;
}
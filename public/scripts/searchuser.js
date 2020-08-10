function makeReq() {
    var query = document.getElementById("filter").value;
    var type = document.getElementById("search_by").value;
    switch(type)
    {
        case 1:
            fetchHelper(`user/search_by_name?name=${query}`, "GET")
                .catch(function(err) {
                    console.log(err);
                });
            break;
        case 2:
            fetchHelper(`user/search_by_email?email=${query}`, "GET")
                .catch(function(err) {
                    console.log(err);
                });

    }
    
}

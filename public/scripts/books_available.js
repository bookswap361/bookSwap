// Gets the conditions of selected book.
function getCondition(event) {

	// Get book_id for row.
	var book_id = event.target.parentNode.parentNode.id;
    var isAllChecked = document.getElementById("view-all").checked;

    var url = "../books_available/condition/?id=" + book_id + "&filter=" + (isAllChecked ? "all" : "afford");
    
    fetchHelper(url, "GET")
    .then(function(data) {
        return data.json();
    })
    .then(function(response) {
        buildTable(response)
    });
}

// Builds a table displaying conditions and costs of available books.
 function buildTable(response) {
    var books = response[0];
    var userPoints = response[1].points;

    var newtable = document.getElementById("conditionTable");
    newtable.innerHTML = "";

    var headers = ['Title', 'Author', 'Traded By', 'Condition', 'Cost',''];
    var tableHead = document.createElement('tr');
    if (books.length > 0) {
        for (var i = 0; i < headers.length; i++){
            var th = document.createElement('th');
            th.innerText = headers[i];
            tableHead.appendChild(th);
        }
        newtable.appendChild(tableHead);

        for (var i = 0; i < books.length; i++) {
            var row = document.createElement('tr');

            // List_id
            row.id = books[i].list_id;

            // Title
            var title = document.createElement('td');
            title.innerText = books[i].title;
            row.appendChild(title);

            // Author
            var author = document.createElement('td');
            author.innerText = books[i].author;
            row.appendChild(author);

            // Traded By
            var owner = document.createElement("td");
            owner.innerText = books[i].name;
            row.appendChild(owner);

            // condition_description
            var condition = document.createElement('td');
            condition.innerText = books[i].condition_description;
            row.appendChild(condition);

            // cost
            var cost = document.createElement('td');
            cost.innerText = books[i].cost;
            cost.className = "center";
            cost.classList.add(userPoints < books[i].cost ? "highlight-red" : "highlight");
            row.appendChild(cost);

            // Create swap button
            var swap = document.createElement('td');
            var swapButton = document.createElement('button');
            swapButton.className = "swap";
            swapButton.classList.add("btn");
            swapButton.classList.add("btn-primary");
            swapButton.innerText = "Swap";
            swapButton.onclick = createSwap.bind(this, books[i].user_id);
            swapButton.type = "button";
            swap.appendChild(swapButton);
            row.appendChild(swap);

            if (userPoints < books[i].cost) {
                row.classList.add("inactive");
                disableBtn(swapButton);
            }

            newtable.appendChild(row);
        }
    }
}

// Creates a new swap and adds it to the database.
function createSwap(userId, event) {
    var cost = event.target.parentNode.parentNode.cells[4].innerText;
    var info = {
        "list_id": event.target.parentNode.parentNode.id,
        "owner_id": userId,
        "cost": cost
    };

    fetchHelper("/swap/create", "POST", info)
    .then(function(result) {
        return result.json();
    })
    .then(function(text) {
        document.getElementById('exitButton').click();
        console.log(text);
        swapAdded(text);
        console.log('Swap added.');
    })
}

function swapAdded(result) {
    var thisDiv = document.getElementById('successContent');
    thisDiv.innerHTML = "";

    var content = document.createElement("p");
    content.innerText = "Title:  " + result.title + "\nBy:  " + result.author + "\nSee 'my account -> Swaps' for more details.";
    thisDiv.appendChild(content);

    $('#successModal').modal('show');

    //document.getElementById('successModal').modal('show');
}

// add event listeners to all 'details' buttons
 var num_buttons = document.getElementsByClassName('details').length;
 var buttons = document.getElementsByClassName('details');
 for (var i = 0; i < num_buttons; i++) {
     buttons[i].addEventListener("click", getCondition);
 }

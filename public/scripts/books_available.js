// Gets the conditions of selected book.
function getCondition(event) {

	// Get book_id for row.
	var book_id = event.target.parentNode.parentNode.id;
	var url = "../books_available/condition/" + book_id;

	fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(function (data) {
		return data.json();
	}).then(function(response) {
		buildTable(response);
	}).catch(function (err){
		console.log(err);
	}).catch(function(err){
		console.log(err);
	});
}

// Builds a table displaying conditions and costs of available books.
 function buildTable(response) {
 	var books = response[0];
 	var userPoints = response[1].points;

 	var newtable = document.getElementById("conditionTable");
 	newtable.innerHTML = "";

 	var headers = ['Title', 'Author', 'Condition', 'Cost',''];
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

 			// condition_description
 			var condition = document.createElement('td');
 			condition.innerText = books[i].condition_description;
 			row.appendChild(condition);

 			// cost
 			var cost = document.createElement('td');
 			cost.innerText = books[i].cost;
 			cost.className = "center";
 			row.appendChild(cost);

 			// Create swap button
 			var swap = document.createElement('td');
 			var swapButton = document.createElement('button');
 			swapButton.className = "swap";
 			swapButton.innerText = "Swap";
 			swapButton.onclick = createSwap;
 			swapButton.type = "button";
 			swap.appendChild(swapButton);
 			row.appendChild(swap);

 			if (userPoints < books[i].cost) {
 				row.classList.add("inactive");
 				swapButton.disabled = true;
 			}

 			newtable.appendChild(row);
 		}
 	}
 }

 // Creates a new swap and adds it to the database.
function createSwap(event) {
	// Reference: m. castillo
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = `${yyyy}-${mm}-${dd}`;

    var list_id = event.target.parentNode.parentNode.id;

    console.log("list_id: " + list_id + "\ndate: " + today);

    var info = {
    	"list_id": list_id,
    	"date": today
    };

	fetch("../books_available/add-swap", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(info)
	}).then(function(result) {
		document.getElementById('exitButton').click();
		console.log('Swap added.');
	}).catch(function(err){
		console.log(err);
	});
}

// add event listeners to all 'details' buttons
 var num_buttons = document.getElementsByClassName('details').length;
 var buttons = document.getElementsByClassName('details');
 for (var i = 0; i < num_buttons; i++) {
     buttons[i].addEventListener("click", getCondition);
 }

// Gets the conditions of selected book.
function getCondition(event) {

	// Get book_id for row.
	var book_id = event.target.parentNode.parentNode.id;

	fetch("../books_available/condition/", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({"book_id": book_id})
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
 	var newtable = document.getElementById("conditionTable");
 	var rowCount = newtable.rows.length - 1;
 	for (var i = rowCount; i >= 0; i--) {
 		newtable.rows[i].remove();
 	}

 	var headers = ['Title', 'Author', 'Condition', 'Cost',''];
 	var tableHead = document.createElement('tr');
 	if (response.length > 0) {
 		for (var i = 0; i < headers.length; i++){
 	        var th = document.createElement('th');
 	        th.innerText = headers[i];
 	        tableHead.appendChild(th);
 	    }
 	    newtable.appendChild(tableHead);

 		for (var i = 0; i < response.length; i++) {
 			var row = document.createElement('tr');

 			// List_id
 			row.id = response[i].list_id;

 			// Title
 			var title = document.createElement('td');
 			title.innerText = response[i].title;
 			row.appendChild(title);

 			// Author
 			var author = document.createElement('td');
 			author.innerText = response[i].author;
 			row.appendChild(author);

 			// condition_description
 			var condition = document.createElement('td');
 			condition.innerText = response[i].condition_description;
 			row.appendChild(condition);

 			// cost
 			var cost = document.createElement('td');
 			cost.innerText = response[i].cost;
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

 			newtable.appendChild(row);

 			getPoints();
 		}
 	}
 }

 // Gets the amount of points that the current user has.
 function getPoints() {
 	return fetch("../books_available/get-points", {
 		method: 'GET',
 		headers: {
 			'Content-Type': 'application/json'
 		}
 	}).then(function(data) {
 		return data.json();
 	}).then(function(response) {
 		var userPoints = response.points;
 		checkPoints(userPoints);
 	})
 }


 // Checks whether the user has enough points to make a swap 
 // and updates the table accordingly.
 function checkPoints(userPoints) {
 	var table = document.getElementById("conditionTable");
 	var rowCount = table.rows.length

 	for (var i = 1; i < rowCount; i++) {
 		var row = table.rows.item(i);
 		var cost = row.cells[3].innerHTML;
 		var button = row.cells[4].childNodes[0];

 		if (userPoints < cost) {
 			for (var j = 0; j < row.cells.length; j++){
 				var cell = row.cells[j];
 				cell.classList.add('inactive');
 			}
 			button.disabled = true;
 		}
 		else {
 			for (var j = 0; j < row.cells.length; j++){
 				var cell = row.cells[j];
 				cell.classList.remove('inactive');
 			}
 			button.disabled = false;
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

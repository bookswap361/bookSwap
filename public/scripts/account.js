
/*Reference: https://www.w3schools.com/howto/howto_js_tabs.asp*/

// Books tab functionality
function showInventory(event) {
	var tabcontent = document.getElementsByClassName("tabcontent");
	for (var i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}

	tablinks = document.getElementsByClassName("tablinks");
	for (var i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	event.currentTarget.className += " active";

	var id = 1;
	var url = "../books_owned/" + id;
	fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(function (response) {
		console.log(response);
		if (response.ok) {

			document.getElementById("booksInventory").style.display = "block";
			return response;
		}
	}).catch(function (err){
		console.log("Inventory table empty.");
		console.log(err);
	});
}

function updateInventory() {

	var id = 1;
	var url = "../books_owned/update/" + id;
	fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(function (data) {
		return data.json();
	}).then(function(response) {
		console.log(response);

		document.getElementById("booksInventory").style.display = "block";

		var newtable = document.getElementById("inventoryTable");
		var rowCount = newtable.rows.length - 1;
		for (var i = rowCount; i >= 0; i--) {
			newtable.rows[i].remove();
		}
		console.log("length: " + response.length);
		var headers = ['Title', 'Author', 'Condition', 'List Date',''];
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
//				var id = document.createElement('td');
//				id.innerText = response[i].list_id;
//				console.log("id: " + response[i].list_id);
//				id.className = "hidden";
//				row.appendChild(id);

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

				// list_date
				var date = document.createElement('td');
				date.innerText = response[i].list_date;
				row.appendChild(date);

				var td = document.createElement('td');
				var delButton = document.createElement('button');
				delButton.className = "delete";
				delButton.innerText = "Delete";
				delButton.onclick = deleteInventory;
				td.appendChild(delButton);
				row.appendChild(td);

				newtable.appendChild(row);
			}
		}
	}).catch(function (err){
		console.log(err);
	}).catch(function(err){
		console.log(err);
	});
}

// Delete Book from Inventory.
function deleteInventory(event) {
	var list_id = event.target.parentNode.parentNode.id;
	console.log('Delete book with list id: ', list_id);

	var id = 1;		// To be replaced.
	var url = "../books_owned/" + id;
	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({"list_id": list_id})
	}).then(function() {
		console.log('Inventory deleted.');
		updateInventory();
	})
}

// Swap tab functionality.
function showSwaps(event){
	
	var tabcontent = document.getElementsByClassName("tabcontent");
	for (var i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}

	tablinks = document.getElementsByClassName("tablinks");
	for (var i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

	document.getElementById("swaps").style.display = "block";
	event.currentTarget.className += " active";

	var id = 1;
	var url = "../swap/" + id;
	fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(function (response) {
		console.log(response);
		if (response.length > 0) {
			return response;
		}
		else {
			console.log("Swaps table empty.")
		}
	})
}

// Wish List functionality.
function showWishList(event) {
	
	var tabcontent = document.getElementsByClassName("tabcontent");
	for (var i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}

	tablinks = document.getElementsByClassName("tablinks");
	for (var i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

	document.getElementById("wishlist").style.display = "block";
	event.currentTarget.className += " active";
}

// add event listeners to all 'delete' buttons
var num_buttons = document.getElementsByClassName('delete').length;
var buttons = document.getElementsByClassName('delete');
for (var i = 0; i < num_buttons; i++) {
    buttons[i].addEventListener("click", deleteInventory);
}

document.getElementById("booksTab").addEventListener("click", showInventory);
document.getElementById("swapsTab").addEventListener("click", showSwaps);
document.getElementById("wishlistTab").addEventListener("click", showWishList);


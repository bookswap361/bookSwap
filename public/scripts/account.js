
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

	fetch("../books_owned/", {
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
				var formattedDate = response[i].list_date.slice(0, 10);
				date.innerText = formattedDate;
				row.appendChild(date);

				// Create update button
				var update = document.createElement('td');
				var updateButton = document.createElement('button');
				updateButton.className = "update";
				updateButton.innerText = "Update";
				updateButton.onclick = makeEditable;
				updateButton.classList.add("btn");
				updateButton.classList.add("btn-outline-primary");
				update.appendChild(updateButton);

				// Create submit button
				var subButton = document.createElement('button');
				subButton.className = "submit";
				subButton.style.display = 'none';
				subButton.innerText = "Submit";
				subButton.onclick = updateInventory;
				subButton.classList.add("btn");
				subButton.classList.add("btn-outline-primary");
				update.appendChild(subButton);
				row.appendChild(update);

				// Create delete button
				var del = document.createElement('td');
				var delButton = document.createElement('button');
				delButton.className = "delete";
				delButton.innerText = "Delete";
				delButton.onclick = deleteInventory;
				delButton.classList.add("btn")
				delButton.classList.add("btn-outline-danger")
				del.appendChild(delButton);

				// Create cancel button
				var cancelButton = document.createElement('button');
				cancelButton.className = "cancel";
				cancelButton.style.display = 'none';
				cancelButton.innerText = "Cancel";
				cancelButton.onclick = cancelUpdate;
				cancelButton.classList.add("btn")
				cancelButton.classList.add("btn-outline-danger");
				del.appendChild(cancelButton);

				row.appendChild(del);

				newtable.appendChild(row);
			}
		}
	}).catch(function (err){
		console.log(err);
	}).catch(function(err){
		console.log(err);
	});
}

// Update inventory condition.
function updateInventory(event) {
	var td = event.target.parentNode;
	var tr = td.parentNode
	var list_id = tr.id;
	var condition = tr.cells.item(2).childNodes[0].value;
	var condition_id = 0;

	switch(condition) {
		case "Acceptable":
			condition_id = 1;
			break;
		case "Good":
			condition_id = 2;
			break;
		case "Excellent":
			condition_id = 3;
			break;
	}

	console.log('Update book with list id: ' + list_id + 'condition: ' + condition);

	info = {
		"list_id": list_id,
		"condition_description": condition,
		"condition_id": condition_id
	};
	
	fetch("../books_owned/update", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(info)
	}).then(function() {
		console.log('Inventory updated.');
		var event = document.getElementById("booksTab").click();
	})
}

// Makes a book's condition editable.
function makeEditable(event) {
	var choices = ['Acceptable', 'Good', 'Excellent'];
	var td = event.target.parentNode;
	var tr = td.parentNode;

	// Source: https://www.golangprograms.com/highlight-and-get-the-details-of-table-row-on-click-using-javascript.html
	var currentRow = tr.cells;
	var condition = currentRow.item(2);

	// Hide Update Button and Show Submit button.
	var updateButton = currentRow.item(4).childNodes[0];
	updateButton.style.display = 'none';
	var submitButton = currentRow.item(4).childNodes[1];
	submitButton.style.display = 'block';

	// Hide Delete Button and Show Cancel Button.
	var deleteButton = currentRow.item(5).childNodes[0];
	deleteButton.style.display = 'none';
	var cancelButton = currentRow.item(5).childNodes[1];
	cancelButton.style.display = 'block';

	// Create dropdown menu.
	var newDrop = document.createElement('select');
	var option1 = document.createElement('option');
	var text = condition.innerText;
	condition.removeChild(condition.childNodes[0]);
	option1.innerText = text;
	newDrop.appendChild(option1);

	for (var i = 0; i < choices.length; i++) {
		if (choices[i] != text) {
			var option = document.createElement('option');
			option.innerText = choices[i];
			newDrop.appendChild(option);
		}
	}
	condition.appendChild(newDrop);
}


// Delete Book from Inventory.
function deleteInventory(event) {
	var list_id = event.target.parentNode.parentNode.id;
	console.log('Delete book with list id: ', list_id);

	fetch("../books_owned/delete", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({"list_id": list_id})
	}).then(function() {
		console.log('Inventory deleted.');
		var event = document.getElementById("booksTab").click();
	})
}

// Cancels the update.
function cancelUpdate(event){
	var td = event.target.parentNode;
	var tr = td.parentNode;
	var currentRow = tr.cells;

	// Show Update Button and Hide Submit button.
	var updateButton = currentRow.item(4).childNodes[0];
	updateButton.style.display = 'block';
	var submitButton = currentRow.item(4).childNodes[1];
	submitButton.style.display = 'none';

	// Show Delete Button and Hide Cancel Button.
	var deleteButton = currentRow.item(5).childNodes[0];
	deleteButton.style.display = 'block';
	var cancelButton = currentRow.item(5).childNodes[1];
	cancelButton.style.display = 'none';

	window.location.reload();
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

document.getElementById("booksTab").addEventListener("click", showInventory);
document.getElementById("swapsTab").addEventListener("click", showSwaps);
document.getElementById("wishlistTab").addEventListener("click", showWishList);
document.getElementById('addInventory').addEventListener("click", function(event) {
    location.href = "/book/search"});


window.onload = document.getElementById("booksTab").click();

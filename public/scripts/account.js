
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

	document.getElementById("booksInventory").style.display = "block";
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

	info = {
		"list_id": list_id,
		"condition_description": condition,
		"condition_id": condition_id
	};

    fetchHelper("/account/update_books", "POST", info)
    .then(function() {
        location.href = "/account/?tab=books";
    });
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
	var updateButton = currentRow.item(4).childNodes[1];
	updateButton.style.display = 'none';
	var submitButton = currentRow.item(4).childNodes[3];
	submitButton.style.display = 'block';

	// Hide Delete Button and Show Cancel Button.
	var deleteButton = currentRow.item(5).childNodes[1];
	deleteButton.style.display = 'none';
	var cancelButton = currentRow.item(5).childNodes[3];
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
    var dataObj = {
        "list_id": list_id
    };
    fetchHelper("/account/delete_books", "POST", dataObj)
    .then(function() {
        location.href = "/account/?tab=books";
    });
}

// Cancels the update.
function cancelUpdate(event){
	var td = event.target.parentNode;
	var tr = td.parentNode;
	var currentRow = tr.cells;

	// Show Update Button and Hide Submit button.
	var updateButton = currentRow.item(4).childNodes[1];
	updateButton.style.display = 'block';
	var submitButton = currentRow.item(4).childNodes[3];
	submitButton.style.display = 'none';

	// Show Delete Button and Hide Cancel Button.
	var deleteButton = currentRow.item(5).childNodes[1];
	deleteButton.style.display = 'block';
	var cancelButton = currentRow.item(5).childNodes[3];
	cancelButton.style.display = 'none';

	windowReload();
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

// Profile functionality.
function showProfile(event) {
	
	var tabcontent = document.getElementsByClassName("tabcontent");
	for (var i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}

	tablinks = document.getElementsByClassName("tablinks");
	for (var i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

	document.getElementById("profile").style.display = "block";
	event.currentTarget.className += " active";
}

/*Carousel slideshow*/
/*Source: https://www.w3schools.com/howto/howto_js_slideshow.asp*/
var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  if (slides.length > 0){
  	slides[slideIndex-1].style.display = "block";
  }
}

function setEventListeners() {
    document.getElementById("profileTab").addEventListener("click", showProfile);
    document.getElementById("booksTab").addEventListener("click", showInventory);
    document.getElementById("swapsTab").addEventListener("click", showSwaps);
    document.getElementById("wishlistTab").addEventListener("click", showWishList);
    document.getElementById('addInventory').addEventListener("click", function(event) { location.href = "/book/search" });
    setUpdateListener();
    setSubmitListener();
    setDeleteListener();
    setCancelListener();
}

function setUpdateListener() {
    var updateElements = document.getElementsByClassName("update");
    for (var i = 0; i < updateElements.length; i++) {
	    updateElements[i].addEventListener("click", makeEditable);
    }
}

function setSubmitListener() {
    var submitElements = document.getElementsByClassName("submit");
    for (var i = 0; i < submitElements.length; i++) {
	    submitElements[i].addEventListener("click", updateInventory);
    }
}

function setDeleteListener() {
    var deleteElements = document.getElementsByClassName("delete");
    for (var i = 0; i < deleteElements.length; i++) {
	    deleteElements[i].addEventListener("click", deleteInventory);
    }
}

function setCancelListener() {
    var cancelElements = document.getElementsByClassName("cancel");
    for (var i = 0; i < cancelElements.length; i++) {
	    cancelElements[i].addEventListener("click", cancelUpdate);
    }
}

function pageInit() {
    setEventListeners();
}

window.onload = document.getElementById("profileTab").click();

var pb = document.getElementById("pendingBtn");
var cb = document.getElementById("completeBtn");

pb.onclick = function(event) { collapseExpand(pb); }
cb.onclick = function(event) { collapseExpand(cb); }

function collapseExpand(button) {
	var text = button.innerText;
	toggleBtn(button, text);
}

function toggleBtn(button, text) {
	if (text == "Expand") button.innerText = "Hide";
	else button.innerText = "Expand";
}

window.onload = pageInit(); 

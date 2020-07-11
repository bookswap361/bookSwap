
/*Reference: https://www.w3schools.com/howto/howto_js_tabs.asp*/


// Books tab functionality.
document.getElementById("booksTab").addEventListener("click", function(event){
	
	var tabcontent = document.getElementsByClassName("tabcontent");
	for (var i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}

	tablinks = document.getElementsByClassName("tablinks");
	for (var i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

	document.getElementById("booksInventory").style.display = "block";
	event.currentTarget.className += " active";
});

// Swap tab functionality.
document.getElementById("swapsTab").addEventListener("click", function(event){
	
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

	// Make get request to return table of swaps
	/*var request = new XMLHttpRequest();
	return new Promise(function(resolve, reject){
		var id = 1;		// to be updated
		var url = "/" + id;
	})*/

	var id = 1;
	var url = "../swap/" + id;
	fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(function (response) {
		console.log(response);
		return response;
	})
});

// Wish List functionality.
document.getElementById("wishlistTab").addEventListener("click", function(event){
	
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
});
function fetchHelper(url, method, data = {}) {
	return fetch(url, {
		method: method,
		headers: {
            ...(!(url.match(/\b(openlibrary)\b/g)) && {"Content-Type": "application/json"})
		},
        ...(method !== "GET" && {body: JSON.stringify(data)})
	})
    .catch(function(err) {
        console.log(err)
    })
};

function windowReload() {
    window.location.reload();
};

function filterSubmit(radio) {
    radio.form.submit();
};

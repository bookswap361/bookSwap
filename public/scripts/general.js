function fetchHelper(url, method, data = {}) {
	return fetch(url, {
		method: method,
		headers: {
			"Content-Type": "application/json"
		},
		//body: JSON.stringify(data)
        ...(method !== "GET" && {body: JSON.stringify(data)})
	})
};

function windowReload() {
    window.location.reload();
};

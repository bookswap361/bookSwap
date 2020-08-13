var searchCriteriaInput = document.getElementById("search-criteria");
var searchContentInput = document.getElementById("search-content");
var filterInput = document.getElementById("filter");
var dropdown = document.getElementById("search_by");

window.addEventListener('DOMContentLoaded', pageInit);

function pageInit() {
    dropdown.addEventListener("change", populateCriteria, false);
    filterInput.addEventListener("change", populateContent, false);
};


function populateCriteria() {
    var selectedInput = dropdown.options[dropdown.selectedIndex].value;
    searchCriteriaInput.value = selectedInput;
}

function populateContent() {
    searchContentInput.value = filterInput.value;
}

/*
Citation for the following code: 
Code adapted from Node.JS starter guide
Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

// Get the objects we need to modify
let updateAuthorForm = document.getElementById('update-author-form-ajax');

// Modify the objects we need
updateAuthorForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOldName = document.getElementById("mySelect");
    let inputNewName = document.getElementById("input-name-update");

    // Get the values from the form fields
    let oldNameValue = inputOldName.value;
    let newNameValue = inputNewName.value;
    
    // currently the database table for Authors does not allow updating values to NULL
    // so we must abort if being bassed NULL for new name




    // Put our data we want to send in a javascript object
    let data = {
        author: oldNameValue,
        name: newNameValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-author-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, oldNameValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
    location.reload();
})


function updateRow(data, authorID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("author-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == authorID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[1];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].name; 
       }
    }
}
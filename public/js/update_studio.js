/*
Citation for the following code: 
Code adapted from Node.JS starter guide
Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

// Get the objects we need to modify
let updateStudioForm = document.getElementById('update-studio-form-ajax');

// Modify the objects we need
updateStudioForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("mySelect");
    let inputCount = document.getElementById("input-count-update");

    // Get the values from the form fields
    let nameValue = inputName.value;
    let countValue = inputCount.value;
    

    if (isNaN(nameValue)) 
    {
        return;
    }

    if (isNaN(countValue))
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        name: nameValue,
        count: countValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-studio-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, countValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
    location.reload();
})


function updateRow(data, studioID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("studio-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == studioID) {

            // Get the location of the row where we found the matching author ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of name value
            let td = updateRowIndex.getElementsByTagName("td")[4];

            // Reassign name to our value we updated to
            td.innerHTML = parsedData[0].anime_count; 
       }
    }
}
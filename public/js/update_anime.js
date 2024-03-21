/*
Citation for the following code: 
Code adapted from Node.JS starter guide
Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

// Get the objects we need to modify
let updateAnimeForm = document.getElementById('update-anime-form-ajax');

// Modify the objects we need
updateAnimeForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputTitle = document.getElementById("mySelect");
    let inputScore = document.getElementById("input-score-update");
    let inputViewer = document.getElementById("input-viewer-update");

    // Get the values from the form fields
    let titleValue = inputTitle.value;
    let scoreValue = inputScore.value;
    let viewerValue = inputViewer.value;

    if (isNaN(scoreValue)) 
    {
        return;
    }

    if (isNaN(viewerValue)) 
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        title: titleValue,
        score: scoreValue,
        viewer: viewerValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-anime-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, scoreValue);
            updateRow(xhttp.response, viewerValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
    location.reload();
})


function updateRow(data, animeID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("anime-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == animeID) {

            // Get the location of the row where we found the matching anime ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of score value
            let scoretd = updateRowIndex.getElementsByTagName("td")[4];
            // Reassign score to our value we updated to
            scoretd.innerHTML = parsedData[0].average_score; 

            let viewertd = updateRowIndex.getElementsByTagName("td")[5];

            viewertd.innerHTML = parsedData[0].viewership; 
       }
    }
}
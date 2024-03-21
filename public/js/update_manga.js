/*
Citation for the following code: 
Code adapted from Node.JS starter guide
Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

// Get the objects we need to modify
let updateMangaForm = document.getElementById('update-manga-form-ajax');

// Modify the objects we need
updateMangaForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputTitle = document.getElementById("mySelect");
    let inputAverageScore = document.getElementById("input-average_score-update");
    let inputMonthlyReaders = document.getElementById("input-monthly_readers-update");

    // Get the values from the form fields
    let titleValue = inputTitle.value;
    let averagescoreValue = inputAverageScore.value;
    let monthlyreadersValue = inputMonthlyReaders.value;

    // Put our data we want to send in a javascript object
    let data = {
        title: titleValue,
        average_score: averagescoreValue,
        monthly_readers: monthlyreadersValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-manga-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, averagescoreValue);
            updateRow(xhttp.response, monthlyreadersValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
    location.reload();
})


function updateRow(data, mangaID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("manga-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == mangaID) {

            // Get the location of the row where we found the matching anime ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of average_score value
            let average_scoretd = updateRowIndex.getElementsByTagName("td")[5];
            // Reassign title to our value we updated to
            average_scoretd.innerHTML = parsedData[0].average_score; 

            // Get td of monthly_readers value
            let monthly_readerstd = updateRowIndex.getElementsByTagName("td")[6];
            // Reassign title to our value we updated to
            monthly_readerstd.innerHTML = parsedData[0].monthly_readers; 
       }
    }
}

/*
Citation for the following code: 
Code adapted from Node.JS starter guide
Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

// Get the objects we need to modify
let updateMangaReaderForm = document.getElementById('update-mangareader-form-ajax');

// Modify the objects we need
updateMangaReaderForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputManga = document.getElementById("mySelect");
    let inputReader = document.getElementById("input-reader-update");

    // Get the values from the form fields
    let mangaValue = inputManga.value;
    let readerValue = inputReader.value;

    // Put our data we want to send in a javascript object
    let data = {
        manga: mangaValue,
        reader: readerValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-mangareader-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, mangaValue);
            updateRow(xhttp.response, readerValue);

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
    
    let table = document.getElementById("mangareaders-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == mangaID) {

            // Get the location of the row where we found the matching manga ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of reader value
            let agetd = updateRowIndex.getElementsByTagName("td")[1];
            // Reassign reader to updated value
            agetd.innerHTML = parsedData[0].reader;
       }
    } 
}

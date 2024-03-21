/*
Citation for the following code: 
Code adapted from Node.JS starter guide
Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

// Get the objects we need to modify
let updateReaderForm = document.getElementById('update-reader-form-ajax');

// Modify the objects we need
updateReaderForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("mySelect");
    let inputAge = document.getElementById("input-age-update");
    let inputGender = document.getElementById("input-gender-update");
    let inputCountry = document.getElementById("input-country-update");

    // Get the values from the form fields
    let nameValue = inputName.value;
    let ageValue = inputAge.value;
    let genderValue = inputGender.value;
    let countryValue = inputCountry.value;
    

    // Put our data we want to send in a javascript object
    let data = {
        name: nameValue,
        age: ageValue,
        gender: genderValue,
        country: countryValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-reader-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, ageValue);
            updateRow(xhttp.response, genderValue);
            updateRow(xhttp.response, countryValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
    location.reload();
})


function updateRow(data, readerID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("reader-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == readerID) {

            // Get the location of the row where we found the matching reader ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of age value
            let agetd = updateRowIndex.getElementsByTagName("td")[2];
            // Reassign age to updated value
            agetd.innerHTML = parsedData[0].age;

            // Get td of gender value
            let gendertd = updateRowIndex.getElementsByTagName("td")[3];
            // Reassign gender to updated value
            gendertd.innerHTML = parsedData[0].gender;

            // Get td of country value
            let countrytd = updateRowIndex.getElementsByTagName("td")[4];
            // Reassign country to updated value
            countrytd.innerHTML = parsedData[0].country;
       }
    } 
}

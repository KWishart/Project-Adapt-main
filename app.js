/*
Citation for the following code: 
Code adapted from Node.JS starter guide
Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

/*
    SETUP
*/


// Express
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

PORT        = 9562;                 // Set a port number at the top so it's easy to change in the future

// Database
var db = require('./database/db-connector')

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/

app.get('/', function(req, res)
    {
        res.render('index');                    // Note the call to render() and not send(). Using render() ensures the templating engine
    });                                         // will process this file, before sending the finished HTML to the client.

// manga_readers CRUD operations

app.get('/manga_readers', function(req, res)
    {
        let query1 = "SELECT * FROM Manga_Readers;";  
        
        let query2 = "SELECT * FROM Manga;";

        let query3 = "SELECT * FROM Readers;";

        db.pool.query(query1, function(error, rows, fields){    
            let manga_readers = rows;

            db.pool.query(query2, (error, rows, fields) =>{
                let manga = rows;

                db.pool.query(query3, (error, rows, fields) =>{
                    let readers = rows;
                    return res.render('manga_readers', {data: manga_readers, manga: manga, readers: readers});
                })
            })
        })                 
    });

app.post('/add-mangareader-form', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Manga_Readers (manga_id, reader_id) VALUES ((SELECT manga_id FROM Manga WHERE manga_id='${data['input-manga']}'), (SELECT reader_id FROM Readers WHERE reader_id='${data['input-reader']}'))`;
    db.pool.query(query1, function(error, rows, fields){
        //Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.redirect('/manga_readers');
        }
    })
});

app.put('/put-mangareader-ajax', function(req,res,next){
    let data = req.body;
  
    let manga = parseInt(data.manga);
    let reader = parseInt(data.reader);
  
    let query1 = `UPDATE Manga_Readers SET reader_id = ? WHERE Manga_Readers.manga_id = ?`;
  
        // Run the 1st query
        db.pool.query(query1, [reader, manga], function(error, rows, fields){
            if (error) {
  
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            }
  
            // If there was no error, we return that data so we can use it to update the people's
            // table on the front-end
            else
            {
                res.send(rows);
            }
        })
});

app.delete('/delete-mangareader-ajax', function(req,res,next){
    let data = req.body;
    let mangaID = parseInt(data.id);
    let deleteManga_Readers= `DELETE FROM Manga_Readers WHERE manga_id = ?`;
  
        // Run the 1st query
        db.pool.query(deleteManga_Readers, [mangaID], function(error, rows, fields) {
  
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else 
            {
                res.sendStatus(204);
                res.redirect('/manga_readers');
            }
        })
    }
);

// Authors CRUD operations

app.get('/authors', function(req, res)
    {
        let query1 = "SELECT * FROM Authors;";               // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            
            res.render('authors', {data: rows});  
        })                 
    });  

app.post('/add-author-form', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Authors (name) VALUES ('${data['input-name']}')`;
    db.pool.query(query1, function(error, rows, fields){
        //Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.redirect('/authors');
        }
    })
});

app.delete('/delete-author-ajax', function(req,res,next){
    let data = req.body;
    let authorID = parseInt(data.id);
    let deleteManga = `DELETE FROM Manga WHERE author_id = ?`;  
    let deleteAuthors= `DELETE FROM Authors WHERE author_id = ?`;
  
        // Run the 1st query
        db.pool.query(deleteManga, [authorID], function(error, rows, fields){
            if (error) {
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            }
  
            else
            {
                // Run the second query
                db.pool.query(deleteAuthors, [authorID], function(error, rows, fields) {
  
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else 
                    {
                        res.sendStatus(204);
                        res.redirect('/authors');
                    }
                })
            }
        })
});

app.put('/put-author-ajax', function(req,res,next){
    let data = req.body;
  
    let name = data.name;
    let author = parseInt(data.author);
  
    let query1 = `UPDATE Authors SET name = ? WHERE Authors.author_id = ?`;
  
        // Run the 1st query
        db.pool.query(query1, [name, author], function(error, rows, fields){
            if (error) {
  
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            }
  
            // If there was no error, we return that data so we can use it to update the people's
            // table on the front-end
            else
            {
                res.send(rows);
            }
        })
});

// Anime CRUD operations

app.get('/anime', function(req, res)
    {
        let query1 = "SELECT * FROM Anime;";  
        
        let query2 = "SELECT * FROM Manga;";

        let query3 = "SELECT * FROM Studios;";

        db.pool.query(query1, function(error, rows, fields){    
            let anime = rows;

            db.pool.query(query2, (error, rows, fields) =>{
                let manga = rows;

                db.pool.query(query3, (error, rows, fields) =>{
                    let studios = rows;
                    return res.render('anime', {data: anime, manga: manga, studios: studios});
                })
            })
        })                 
    });

app.post('/add-anime-form', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Anime (manga_id, title, studio_id, average_score, viewership) 
        VALUES ((SELECT manga_id FROM Manga WHERE manga_id='${data['input-manga']}'), '${data['input-title']}', (SELECT studio_id FROM Studios WHERE studio_id='${data['input-studio']}'), '${data['input-score']}', '${data['input-viewer']}')`;
    
    db.pool.query(query1, function(error, rows, fields){
        //Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.redirect('/anime');
        }
    })
});

app.delete('/delete-anime-ajax', function(req,res,next){
    let data = req.body;
    let animeID = parseInt(data.id);
    let deleteAnime= `DELETE FROM Anime WHERE anime_id = ?`;
  
        // Run the 1st query
        db.pool.query(deleteAnime, [animeID], function(error, rows, fields) {
  
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else 
            {
                res.sendStatus(204);
                res.redirect('/anime');
            }
        })
    }
);

app.put('/put-anime-ajax', function(req,res,next){
    let data = req.body;
  
    let score = parseFloat(data.score);
    let viewership = parseInt(data.viewer);
    let anime = parseInt(data.title);
  
    let query1 = `UPDATE Anime SET average_score = ?, viewership = ? WHERE Anime.anime_id = ?`;
    let query2 = `SELECT * FROM Anime WHERE anime_id = ?`;
  
        // Run the 1st query
        db.pool.query(query1, [score, viewership, anime], function(error, rows, fields){
            if (error) {
  
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            }
  
            // If there was no error, we return that data so we can use it to update the people's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(query2, [anime], function(error, rows, fields) {
  
                    if (error) {
                        console.log(error);
                       res.sendStatus(400);
                    } else 
                    {
                        res.send(rows);
                    }
                })
            }
        })
});

// Studios CRUD Operations

app.get('/studios', function(req, res)
{
    let query1 = "SELECT * FROM Studios;";               // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query
        
        res.render('studios', {data: rows});  
    })                 
});    

app.post('/add-studio-form', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Studios (name, establish_date, website, anime_count) VALUES ('${data['input-name']}', '${data['input-date']}', '${data['input-website']}', '${data['input-count']}')`;
    db.pool.query(query1, function(error, rows, fields){
        //Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.redirect('/studios');
        }
    })
});

app.delete('/delete-studio-ajax', function(req,res,next){
    let data = req.body;
    let studioID = parseInt(data.id);
    let deleteAnime = `DELETE FROM Anime WHERE studio_id = ?`;  
    let deleteStudios= `DELETE FROM Studios WHERE studio_id = ?`;
  
        // Run the 1st query
        db.pool.query(deleteAnime, [studioID], function(error, rows, fields){
            if (error) {
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            }
  
            else
            {
                // Run the second query
                db.pool.query(deleteStudios, [studioID], function(error, rows, fields) {
  
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else 
                    {
                        res.sendStatus(204);
                    }
                })
            }
        })
});

app.put('/put-studio-ajax', function(req,res,next){
    let data = req.body;
  
    let count = parseInt(data.count);
    let studio = parseInt(data.name);
  
    let query1 = `UPDATE Studios SET anime_count = ? WHERE Studios.studio_id = ?`;
    let query2 = `SELECT * FROM Studios WHERE studio_id = ?`;
  
        // Run the 1st query
        db.pool.query(query1, [count, studio], function(error, rows, fields){
            if (error) {
  
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            }
  
            // If there was no error, we run our second query and return that data so we can use it to update the people's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(query2, [studio], function(error, rows, fields) {
  
                    if (error) {
                        console.log(error);
                       res.sendStatus(400);
                    } else 
                    {
                        res.send(rows);
                    }
                })
            }
        })
});


// Readers CRUD Operations

app.get('/readers', function(req, res)
{
    let query1 = "SELECT * FROM Readers;";               // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query
        
        res.render('readers', {data: rows});  
    })                 
});    

app.post('/add-reader-form', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Readers (name, age, gender, country) VALUES ('${data['input-name']}', '${data['input-age']}', '${data['input-gender']}', '${data['input-country']}')`;
    db.pool.query(query1, function(error, rows, fields){
        //Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.redirect('/readers');
        }
    })
});

app.delete('/delete-reader-ajax', function(req,res,next){
    let data = req.body;
    let readerID = parseInt(data.id);
    let deleteReader = `DELETE FROM Readers WHERE reader_id = ?`;  
  
        // Run the 1st query
        db.pool.query(deleteReader, [readerID], function(error, rows, fields){
            if (error) {
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            }
        })
});

app.put('/put-reader-ajax', function(req,res,next){
    let data = req.body;
  
    let country = data.country;
    let gender = data.gender;
    let age = parseInt(data.age);
    let reader = data.name;
  
    let query1 = `UPDATE Readers SET country = ?, gender = ?, age = ? WHERE Readers.reader_id = ?`;
    let query2 = `SELECT * FROM Readers WHERE reader_id = ?`;
  
        // Run the 1st query
        db.pool.query(query1, [country, gender, age, reader], function(error, rows, fields){
            if (error) {
  
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            }
  
            // If there was no error, we run our second query and return that data so we can use it to update the people's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(query2, [reader], function(error, rows, fields) {
  
                    if (error) {
                        console.log(error);
                       res.sendStatus(400);
                    } else 
                    {
                        res.send(rows);
                    }
                })
            }
        })
});

// Manga CRUD operations

app.get('/manga', function(req, res)
    {
        let query1 = "SELECT * FROM Manga;";  
        
        let query2 = "SELECT * FROM Anime;";

        let query3 = "SELECT * FROM Authors;";

        db.pool.query(query1, function(error, rows, fields){    
            let manga = rows;

            db.pool.query(query2, (error, rows, fields) =>{
                let anime = rows;

                db.pool.query(query3, (error, rows, fields) =>{
                    let authors = rows;
                    return res.render('manga', {data: manga, anime: anime, authors: authors});
                })
            })
        })                 
    });

app.post('/add-manga-form', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Manga (title, publisher, genre, demographic, average_score, monthly_readers, author_id, anime_id) VALUES ('${data['input-title']}', '${data['input-publisher']}', '${data['input-genre']}', '${data['input-demographic']}', '${data['input-average_score']}', '${data['input-monthly_readers']}', (SELECT author_id FROM Authors WHERE author_id='${data['input-author']}'), (SELECT anime_id FROM Anime WHERE anime_id='${data['input-anime']}'))`;

    db.pool.query(query1, function(error, rows, fields){
        //Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.redirect('/manga');
        }
    })
});

app.delete('/delete-manga-ajax', function(req,res,next){
    let data = req.body;
    let mangaID = parseInt(data.id);
    let deleteManga= `DELETE FROM Manga WHERE manga_id = ?`;
  
        // Run the 1st query
        db.pool.query(deleteManga, [mangaID], function(error, rows, fields){
            if (error) {
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            }
        })
});

app.put('/put-manga-ajax', function(req,res,next){
    let data = req.body;
  
    let average_score = parseFloat(data.average_score);
    let monthly_readers = data.monthly_readers;
    let manga = data.title;
  
    let query1 = `UPDATE Manga SET average_score = ?, monthly_readers = ? WHERE Manga.manga_id = ?`;
    let query2 = `SELECT * FROM Manga WHERE manga_id = ?`;
  
        // Run the 1st query
        db.pool.query(query1, [average_score, monthly_readers, manga], function(error, rows, fields){
            if (error) {
  
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            }
  
            // If there was no error, we return that data so we can use it to update the people's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(query2, [manga], function(error, rows, fields) {
  
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else 
                    {
                        res.send(rows);
                    }
                })
            }
        })
});


/*
    LISTENER
*/

app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});

// SET UP THE VAR FOR STARTING THE EXPRESS SERVER =====================================
var express = require("express");
var path = require("path");
const fs = require("fs");
let allnotes = [];
// Tells node that we are creating an "express" server
var app = express();
// Sets an initial port. We"ll use this later in our listener
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
//==================================================================================

//SET UP THE PATHS TO LOAD THE FILES===================================================

//ROUTES FOR THE FILE PATHS

app.get("/notes/", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/assets/html/notes.html"));
});

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/assets/html/index.html"));
});

app.get("/api/notes", function(req, res) {
    console.log("Retrieving File")
    fs.readFile("./db/db.json", "utf8", (err, response)=>{
        if(err) 
        throw err;
        console.log("Success!");
        allnotes = JSON.parse(response);
        res.json(allnotes)
    })
  });

  app.post("/api/notes", function(req, res) {
    console.log("Retrieving File")
    fs.readFile("./db/db.json", "utf8", (err, response)=>{
        if(err) 
        throw err;
        console.log("Success!");
        allnotes = JSON.parse(response);

        let newNote = req.body
        allnotes = [...allnotes, newNote]
        fs.writeFile("./db/db.json",JSON.stringify(allnotes), err => {
            if(err) throw err
            console.log("Note Updated!")
            res.json(allnotes);
        })
    })
});

app.delete("/api/notes/:id", function(req, res){
  console.log("DELETING FILES")
  let jsonFilePath = path.join(__dirname, "/db/db.json");
  //=======DELETING NOTE BY ITS ID===============================
  for(let i =0; i < allnotes.length; i++){
    if(allnotes[i].id == req.params.id){
      //==============SPLICE COMMAND TAKES THE ARRAY POSITION AND REMOVES ONLY THE ONE NOTE====================
      allnotes.splice(i,1);
      break;
    }
  }
//====================WRITE THE UPDATED NOTE FILE==================================
fs.writeFileSync(jsonFilePath, JSON.stringify(allnotes), function (err){

  if(err){
    return console.log("CANNOT UPDATE FILE AFTER DELETE");
  }else{
    console.log("YOUR NOTE WAS DELETED, AND THE NOTEBOOK HAS BEEN UPDATED!")
  }
});
res.json(allnotes)
})


//SETS UP THE FILES TO BE READ VIA THE `FS` MODULE ===========================================
// var http = require('http');
// //FOR INDEX.HTML====================
// http.createServer(function (req, res){
// fs.readFile('*', function(err,data){
//   res.writeHead(200, {'Content-Type': 'text/html'});
//   res.write(data);
//   return res.end();
//   });
// });
// //FOR NOTES.HTML========================
// http.createServer(function (req, res){
// fs.readFile('/notes', function(err,data){
//   res.writeHead(200, {'Content-Type': 'text/html'});
//   res.write(data);
//   return res.end();
//   });
// });

//==========================================================================================

// The below code effectively "starts" our server
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
  });
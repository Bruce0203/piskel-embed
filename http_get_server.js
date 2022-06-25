const fs = require('fs')
  // We can add the modules we imported from NPM using require
const express = require('express')
const app = express()
const router = express.Router();

let LiveReloadExpress = require("livereload-express")(app);
app.use(LiveReloadExpress.static("/workspaces/piskel-embed"));
app.use(express.json())

// Calling express as a function we create a basic web server

// This is the port where we will run our web server
const port = 8080
console.log(__dirname)

// This is how we define the routes for the API's in our web server
// where the .get makes references to the http GET method
// and the '/' is the route
// the attached callback function will be called each time we get 
// a GET request to the '/' route
// In the callback the parameteres we get:
// req includes all the request information, eg headers
// res is an object we use to respond the http call!
// app.get('/', (req, res) => res.send('Hello World!'))
app.use("/", router);
router.post("/upload", (req, res) => {
    console.log("---------------------------------------------------")
    let jsonResult = res.json({requestBody: req.body}).req.body  // <==== req.body will be a parsed JSON object
    let data = JSON.stringify(jsonResult)
    fs.writeFileSync('kdash/' + jsonResult.piskel.name + ".piskel", data);
    console.log("---------------------------------------------------")
  });

  LiveReloadExpress.listen(port, () =>
  console.log(
    `Example app listening on port ${port}!`
  )
);

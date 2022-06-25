const your_assets_dir = "kdash"


const fs = require('fs')
  // We can add the modules we imported from NPM using require
const express = require('express');
const { Console } = require('console');
const app = express()
const router = express.Router();

let LiveReloadExpress = require("livereload-express")(app);

app.get("/", (req, res) => {
  var addingHtml = ""
  fs.readdirSync(your_assets_dir).forEach((filename) => {
      addingHtml = addingHtml + '<li id="button" class="sidebar-menuitem" data-sprite="' + filename + '">' + filename + '</li>'
  });
  let html = fs.readFileSync("index.html", 'utf8');
  html = html.replace("<!-- buttons -->", addingHtml)
  res.send(html)
})
app.use(LiveReloadExpress.static(__dirname));
app.use(express.json())


// Calling express as a function we create a basic web server

// This is the port where we will run our web server
const port = 8080
console.log(__dirname)



app.use("/upload", router);
router.post("/", (req, res) => {
    console.log("---------------------------------------------------")
    let jsonResult = res.json({requestBody: req.body}).req.body
    let data = JSON.stringify(jsonResult)
    fs.writeFileSync(your_assets_dir + '/' + jsonResult.piskel.name + ".piskel", data);
    console.log("---------------------------------------------------")
});

  
  LiveReloadExpress.listen(port, () =>
  console.log(
    `Example app listening on port ${port}!`
  )
);

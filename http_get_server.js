const your_assets_dir = "piskel"
const exported_assets_dir = "src/assets"


const fs = require('fs')
  // We can add the modules we imported from NPM using require
const express = require('express');
const { Console } = require('console');
const { execSync } = require('child_process');
const exp = require('constants');
const app = express()
const router = express.Router();

let LiveReloadExpress = require("livereload-express")(app);

app.get("/", (req, res) => {
  console.log("asdf")
  var addingHtml = ""
  fs.readdirSync(__dirname.replace("piskel-embed", "") + "/" + your_assets_dir).forEach((filename) => {
      addingHtml = addingHtml + '<li id="button" class="sidebar-menuitem" data-sprite="' + filename.replace(".piskel", "") + '">' + filename.replace(".piskel", "") + '</li>'
  });
  let html = fs.readFileSync(__dirname + "/index.html", 'utf8');
  html = html.replace("<!-- buttons -->", addingHtml)
  res.send(html)
  piskelExportImage()
})
app.use(LiveReloadExpress.static(__dirname));
app.use(LiveReloadExpress.static(__dirname.replace("piskel-embed", "") + "/" + your_assets_dir));
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

var exec = require('child_process').exec;
async function piskelExportImage() {
  console.log("start piskel export")
  execSync(`rm -r -f ${__dirname.replace("piskel-embed", "")}${exported_assets_dir}/`);
  fs.readdirSync(your_assets_dir).forEach((filename) => {
    if (filename.indexOf(".piskel") == -1) return
    let srcFile = `/${__dirname.replace("piskel-embed", "")}/${your_assets_dir}/${filename.replace("piskel-embed", "")}`
    let outFile = `/${__dirname.replace("piskel-embed", "")}/${exported_assets_dir}/${filename.replace(".piskel", "")}`
    let srcJson = JSON.parse(fs.readFileSync(srcFile, 'utf8'))
    console.log(srcJson)
    let width = srcJson.piskel.width
    let height = srcJson.piskel.height
    let hasDescribedExportSize = !isNaN(srcJson.piskel.description)

    console.log("hasDescribedExportSize: " + hasDescribedExportSize)
    console.log("<" + srcJson.piskel.description + ">")
    if (hasDescribedExportSize) {
      let exportSize = parseInt(srcJson.piskel.description)
      width = exportSize
      height = exportSize
    }
    let cmd = `cd piskel-embed/piskel-cli ; node index.js '${srcFile}' --pixiMovie --output '${outFile}' --scaledWidth ${width} --scaledHeight ${height}`
    console.log(`cmd:${cmd}`)
    execSync(cmd,
    function (error, stdout, stderr) {});
    let jsonOut = JSON.parse(fs.readFileSync(outFile + '.json', 'utf8'))
    let frameCount = Object.keys(jsonOut.frames).length
    let sqrted = Math.floor(Math.sqrt(frameCount))
    if (frameCount <= 1) sqrted = 1
    let x = 0, y = 0
    console.log(jsonOut)

    for (let f in jsonOut.frames) {
      f = jsonOut.frames[f]
      console.log(f)
      let rectFunc = (a) => {
        a.x = x * width
        a.y = y * height
        a.w = width 
        a.h = height 
      }
      rectFunc(f.frame)
      rectFunc(f.spriteSourceSize)
      f.sourceSize.w = width
      f.sourceSize.h = height
      y++
      if (y >= sqrted) {
        y = 0
        x++
      }
    }
    jsonOut.meta.size = {"w": width*sqrted, "h": height*sqrted}
    // jsonOut.width = srcJson.piskel.width
    fs.writeFileSync(outFile + '.json', JSON.stringify(jsonOut))
    
  });
}

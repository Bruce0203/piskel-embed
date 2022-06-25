
console.log("uploaded sucessfully")
console.log("----------------------------------------")
// let piskelFileName = toPiskelDir(button.getAttribute("data-sprite"))
let piskelFile = JSON.parse(localStorage.getItem("piskel.keys"));
if (piskelFile != null && piskelFile != undefined) piskelFile.forEach((psklFile => {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(JSON.parse(localStorage.getItem(psklFile.name + ".piskel"))));
    localStorage.removeItem(psklFile.name + ".piskel")
}))
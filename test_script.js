
console.log("uploaded sucessfully")
console.log("----------------------------------------")
let piskelKeys = JSON.parse(localStorage.getItem("piskel.keys"));
if (piskelKeys != null && piskelKeys != undefined) piskelKeys.forEach((psklFile => {
    console.log("uploading " + psklFile.name + " now...")
    if (localStorage.getItem(psklFile.name + ".piskel") == undefined) return
    console.log("" + psklFile.name + "uploaded")
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    let data = localStorage.getItem(psklFile.name + ".piskel")
    console.log(data)
    xhr.send(data)
    let i = 0
    for (f in {...piskelKeys}) {
        if (psklFile.name == f.name) {
            piskelKeys[u] = undefined
        }
        i++
    }
    localStorage.setItem("piskel.keys", JSON.stringify(piskelKeys))
    localStorage.removeItem(psklFile.name + ".piskel")
}))
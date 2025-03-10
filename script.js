(function () {  



  function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
  }

  var init = function () {
    var sidebarEl = document.querySelector(".sidebar");

    sidebarEl.addEventListener("click", function (evt) {
      var spriteName = evt.target.dataset.sprite;
      // loadSprite(sprites[spriteName])

      console.log(toPiskelDir(spriteName))
      readTextFile(toPiskelDir(spriteName), function(text){
        text = JSON.parse(text)
        loadSprite(text);
      });        
      
    });
  };


  const toPiskelDir = (name) => {
    return name + ".piskel"
  }

  var loadSprite = function (sprite) {
    var editorFrameEl = document.querySelector(".editor-frame");
    var pskl = editorFrameEl.contentWindow.pskl;
    if (pskl) {
      var fps = sprite.piskel.fps;
      var piskel = sprite.piskel;
      var descriptor = new pskl.model.piskel.Descriptor(piskel.name, piskel.description, true);
      pskl.utils.serialization.Deserializer.deserialize(sprite, function (piskel) {
        piskel.setDescriptor(descriptor);
        pskl.app.piskelController.setPiskel(piskel);
        pskl.app.previewController.setFPS(fps);
      });
    }

  };

  init();
})();


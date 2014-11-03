var watermark = new Image();
watermark.src = 'watermark.png';

var toDownload;

var holder = document.getElementById('holder'),
    tests = {
      filereader: typeof FileReader != 'undefined',
      dnd: 'draggable' in document.createElement('span'),
      formdata: !!window.FormData,
      progress: "upload" in new XMLHttpRequest
    },
    acceptedTypes = {
      'image/png': true,
      'image/jpeg': true,
      'image/gif': true
    },
    progress = document.getElementById('uploadprogress'),
    fileupload = document.getElementById('upload');

function previewfile(file) {
  if (tests.filereader === true && acceptedTypes[file.type] === true) {
    var reader = new FileReader();
    reader.onload = function (event) {
      var image = new Image();
      image.src = event.target.result;
      image.width = 250; // a fake resize
      holder.appendChild(image);
    };

    reader.readAsDataURL(file);
  }
}

function previewimage(image) {
    image.width = 250;
    holder.appendChild(image);
}

function watermarkfile(file, cb) {
    if (tests.filereader === true && acceptedTypes[file.type] === true) {
      var reader = new FileReader();
      reader.onload = function (event) {
          var image = new Image();
          image.src = event.target.result;
          var canvas = document.createElement("canvas");
          canvas.height = image.height;
          canvas.width  = image.width;
          var ctx = canvas.getContext('2d');
          ctx.drawImage(image, 0, 0);
          ctx.drawImage(watermark, 0, 0, image.width, image.height);
          var done = new Image();
          done.src = canvas.toDataURL("image/png");
          cb(done);
      };
      reader.readAsDataURL(file);
    }
}

function readfiles(files) {
    var formData = tests.formdata ? new FormData() : null;

    if(files.length > 0) {
        watermarkfile(files[0], function(image) {
            var dl = document.getElementById('download');
            dl.disabled = false;
            dl.onclick = function() {
                downloadURI(image.src, 'glorious.jpg');
            }
            previewimage(image);
        });

    }
}

if (tests.dnd) {
  holder.ondragover = function () { this.className = 'hover'; return false; };
  holder.ondragend = function () { this.className = ''; return false; };
  holder.ondrop = function (e) {
    this.className = '';
    e.preventDefault();
    readfiles(e.dataTransfer.files);
  }
} else {
  fileupload.className = 'hidden';
  fileupload.querySelector('input').onchange = function () {
    readfiles(this.files);
  };
}

function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  link.click();
}

/* Controllers */

function IndexCtrl($scope, $http) {

};

var UploadCtrl = ['$scope', '$http',
  function($scope, $http) {
    $scope.onFileSelect = function($files) {
      //$files: an array of files selected, each file has name, size, and type.
      for (var i = 0; i < $files.length; i++) {
        var $file = $files[i];
        $http.uploadFile({
          url: 'api/upload', //upload.php script, node.js route, or servlet uplaod url)
          data: {
            myObj: $scope.myModelObj
          },
          file: $file
        }).then(function(data, status, headers, config) {
          // file is uploaded successfully
          console.log(data);
        });
      }
    }
  }
];


document.body.addEventListener("paste", function(e) {
  for (var i = 0; i < e.clipboardData.items.length; i++) {
    if (e.clipboardData.items[i].kind == "file" && e.clipboardData.items[i].type == "image/png") {
      // get the blob
      var imageFile = e.clipboardData.items[i].getAsFile();
      // read the blob as a data URL
      var fileReader = new FileReader();
      fileReader.onloadend = function(e) {
        // create an image
        //var image = document.createElement("IMG");
        //image.src = this.result;
        var html = '<img class="content-img" src="' + this.result + '">';
        console.log(html);
        var box = document.querySelector('#img-box');
        console.log(box)
        if (box) {
          var value = box.innerHTML;
          console.log(value);
          box.innerHTML = value + html;
        }
        /* // insert the image
        var range = window.getSelection().getRangeAt(0);
        range.insertNode(image);
        range.collapse(false);

        // set the selection to after the image
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);*/
      };
      // TODO: Error Handling!
      // fileReader.onerror = ...

      fileReader.readAsDataURL(imageFile);

      // prevent the default paste action
      e.preventDefault();

      // only paste 1 image at a time
      break;
    }
  }
});
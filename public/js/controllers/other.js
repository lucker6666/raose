/* Controllers */

function IndexCtrl($scope, $http) {

};

var ViewMemberCtrl = function($scope,$http){
    $http.get('/api/users').success(function(data){
        $scope.members = data.data;
    })
};

var UploadCtrl =  [ '$scope', '$upload', function($scope, $upload) {
  $scope.onFileSelect = function($files) {
    //$files: an array of files selected, each file has name, size, and type.
    for (var i = 0; i < $files.length; i++) {
      var file = $files[i];
      $scope.upload = $upload.upload({
        url: 'api/upload', //upload.php script, node.js route, or servlet url
        // method: POST or PUT,
        // headers: {'headerKey': 'headerValue'}, withCredential: true,
        data: {myObj: $scope.myModelObj},
        file: file,
        // file: $files, //upload multiple files, this feature only works in HTML5 FromData browsers
        /* set file formData name for 'Content-Desposition' header. Default: 'file' */
        //fileFormDataName: myFile,
        /* customize how data is added to formData. See #40#issuecomment-28612000 for example */
        //formDataAppender: function(formData, key, val){} 
      }).progress(function(evt) {
        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config) {
        // file is uploaded successfully
        console.log(data);
      });
      //.error(...)
      //.then(success, error, progress); 
    }
  };
}];


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
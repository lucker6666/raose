module.exports = function(req, res, next) {
        var fs = require("fs");
        var target_path = null;
        // get the temporary location of the file
        console.log(req.files)
        var tmp_path = req.files.file.path;
        console.log(tmp_path);
        var name = req.files.file.name;
        var ext = name.slice(name.lastIndexOf("."));
        // set where the file should actually exists - in this case it is in the "images" directory
        target_path = req.files.file.path + ext;
        // move the file from the temporary location to the intended location
        fs.rename(tmp_path, target_path, function(err) {
            if (err) return next(err);
            res.send({
                error: 0,
                data: {
                    ext: ext.slice(1),
                    path: req.files.file.path.split("/")[2],
                    name: req.files.file.name,
                    date: new Date(),
                    author: req.user.username
                }
            });
        });
    };
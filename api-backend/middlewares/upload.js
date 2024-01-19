const multer = require("multer");

const tsvFilter = (req, file, cb) => {
    console.log(file);
  if (file.originalname.endsWith('.tsv')) {
    cb(null, true);
  } else {
    cb("Please upload only TSV file.", false);
  }
};

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/../uploads')
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`)
  }
})

var uploadFile = multer({ storage: storage, fileFilter: tsvFilter });
module.exports = uploadFile;
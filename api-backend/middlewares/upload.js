const multer = require("multer");

const csvFilter = (req, file, cb) => {
  if (file.mimetype.includes("application/octet-stream")) {
    cb(null, true);
  } else {
    cb("Please upload only csv file.", false);
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

var uploadFile = multer({ storage: storage, fileFilter: csvFilter });
module.exports = uploadFile;
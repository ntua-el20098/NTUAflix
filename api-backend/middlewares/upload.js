const multer = require("multer");
const { modifyTSV } = require('./tsv_transformer'); 


const tsvFilter = (req, file, cb) => {
  if (file.originalname.endsWith('.tsv')) {
    cb(null, true);
  } else {
    cb("Please upload only TSV file.", false);
  }
};

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Reached upload middleware from route:", req.route.path);
    cb(null, __dirname + '/../uploads');
  },

  filename: function (req, file, cb) {
    console.log("Uploaded file name:", file.originalname);
    const routePath = req.route.path.replace(/\//g, '_');
    cb(null, `${routePath}_${file.originalname}`);

    // Call modifyTSV after a file has been uploaded
    const inputFilePath = '';
    const outputFilePath = '';
    modifyTSV(inputFilePath, outputFilePath);
  }
});



var uploadFile = multer({ storage: storage, fileFilter: tsvFilter });
module.exports = uploadFile;
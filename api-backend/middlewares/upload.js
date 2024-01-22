const multer = require("multer");
const { modifyTSV } = require('./tsv_transformer'); 
const { modifyTSV_Names } = require('./tsv-transformer'); 

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
    const baseDirectory = __dirname + '/../uploads';
    const routePath = req.route.path.replace(/\//g, '_');
    cb(null, `${routePath}_${file.originalname}`);

    //Change the path to the file you want to modify and the path to the output file
    if (req.route.path === '/admin/upload/titlebasics') {
      const inputFilePath = `${baseDirectory}/${routePath}_${file.originalname}`;
      const outputFilePath = '';

      modifyTSV(inputFilePath, outputFilePath);
    } 
    else if (req.route.path === '/admin/upload/namebasics') {
      const inputFilePath = `${baseDirectory}/${routePath}_${file.originalname}`;
      const outputProfessionFilePath = `${baseDirectory}/Profession.tsv`;
      const outputTitlesFilePath = `${baseDirectory}/Titles.tsv`;

      modifyTSV_Names(inputFilePath, outputProfessionFilePath, outputTitlesFilePath);
    }
  }
});


var uploadFile = multer({ storage: storage, fileFilter: tsvFilter });
module.exports = uploadFile;
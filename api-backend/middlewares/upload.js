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
    //console.log("Reached upload middleware from route:", req.route.path);
    cb(null, __dirname + '/../uploads');
  },

  filename: function (req, file, cb) {
    //console.log("Uploaded file name:", file.originalname);

    // Define the output file name based on the route
    let outputFileName;
    if (req.route.path === '/admin/upload/titlebasics') {
      outputFileName = 'titlebasics.tsv';
    } else if (req.route.path === '/admin/upload/namebasics') {
      outputFileName = 'namebasics.tsv';
    } else if (req.route.path === '/admin/upload/titleratings') {
      outputFileName = 'titleratings.tsv';
    }
    else {
      outputFileName = file.originalname;
    }
    cb(null, outputFileName);
  }
});

const upload = multer({ storage: storage, fileFilter: tsvFilter });

module.exports = upload;
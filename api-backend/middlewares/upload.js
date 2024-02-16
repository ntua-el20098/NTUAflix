const multer = require("multer");

const tsvFilter = (req, file, cb) => {
  if (file.originalname.endsWith('.tsv')) {
    cb(null, true);
  } else {
    //cb("Please upload only TSV file.", false);
    cb(null, false);
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
    else if (req.route.path === '/admin/upload/titleakas') {
      outputFileName = 'titleakas.tsv';
    }
    else if (req.route.path === '/admin/upload/titlecrew') {
      outputFileName = 'titlecrew.tsv';
    }
    else if (req.route.path === '/admin/upload/titleepisode') {
      outputFileName = 'titleepisode.tsv';
    }
    else if (req.route.path === '/admin/upload/titleprincipals') {
      outputFileName = 'titleprincipals.tsv';
    }
    else {
      outputFileName = file.originalname;
    }
    cb(null, outputFileName);
  }
});

const upload = multer({ 
  storage: storage, 
  fileFilter: tsvFilter,
  // Accepts only one file with the field name 'file'
  limits: { files: 1 }
})

module.exports = upload;
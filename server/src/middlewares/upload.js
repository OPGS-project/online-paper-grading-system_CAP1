import multer from 'multer';
import path from 'path';

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'csvFile-' + uniqueSuffix + '.csv');
    },
});

// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Set a file size limit (e.g., 5 MB)
  },
  fileFilter: function (req, file, cb) {
    // Check file types, you can customize this based on your needs
    const allowedFileTypes = /csv/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Only CSV files are allowed!');
    }
  },
});

export default upload;

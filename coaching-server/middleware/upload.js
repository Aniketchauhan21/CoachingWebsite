const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ✅ Define path for uploads
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');

// ✅ Ensure directory exists at runtime
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueName + ext);
  }
});

const upload = multer({ storage });
module.exports = upload;

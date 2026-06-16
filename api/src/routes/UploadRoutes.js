const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { UploadController } = require('../controllers');

router.post(
    "/",
    upload.single("image"),
    UploadController.uploadImage
);

module.exports = router;
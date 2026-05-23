const express = require("express");
const router = express.Router();
const { generateCertificate, getMyCertificates, verifyCertificate } = require("../controllers/certificateController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/generate", authMiddleware, generateCertificate);
router.get("/my", authMiddleware, getMyCertificates);
router.get("/verify/:hash", verifyCertificate); // Public route for scanning verification QR codes

module.exports = router;

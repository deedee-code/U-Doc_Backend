const express = require("express");
const router = express.Router();

const { registerMedicalProfessional, uploadFile } = require("../controllers/authController")


router.post('/registerMedicalProfessional', uploadFile, registerMedicalProfessional)


module.exports = router;
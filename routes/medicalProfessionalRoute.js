const express = require("express");
const router = express.Router();

const { registerMedicalProfessional } = require("../controllers/authController")


router.post('/registerMedicalProfessional', registerMedicalProfessional)


module.exports = router;
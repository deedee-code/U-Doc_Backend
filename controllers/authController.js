const Medics = require("../models/medicalProfessionalModel");
const bcrypt = require('bcrypt');


const registerMedicalProfessional = async (req, res) => {

  const { firstName, lastName, gender, dateOfBirth, nationality, medicalPersonnel, employmentStatus, organization, qualification, uploadFile, street1, street2, city, state, postalCode, country, phoneNumber, email, password } = req.body;

  if (!firstName || !lastName || !gender || !dateOfBirth || !nationality || !medicalPersonnel || !employmentStatus || !organization || !qualification || !uploadFile || !street1 || !street2 || !city || !state || !postalCode || !country || !phoneNumber || !email || !password) {
    return res.status(400).json({ message: "All fields are required" })
  }

  const user = await Medics.findOne({ email })
  if (user) {
      return res.status(404).json({ message: "User already exist, proceed to Login"})
  }


  const hashedPassword = bcrypt.hashSync(password, 10)


  const newUser = new Medics({
    firstName,
    lastName,
    gender,  
    dateOfBirth,
    nationality, 
    medicalPersonnel,
    employmentStatus,
    organization, 
    qualification, 
    uploadFile, 
    street1, 
    street2, 
    city, 
    state, 
    postalCode, 
    country, 
    phoneNumber, 
    email, 
    password: hashedPassword
  })
  try {
    await newUser.save()
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal Server Error"})
  }

  return res.status(201).json({ message: "User successfully signed up", newUser})
}




exports.registerMedicalProfessional = registerMedicalProfessional;
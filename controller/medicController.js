const MedicalPersonnel = require("../config/medicsModels");
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path')


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
})

const uploadFile = multer({ storage: storage }).single('uploadFile')




const registerMedicalProfessional = async (req, res) => {

  const { firstName, lastName, gender, dateOfBirth, nationality, medicalPersonnel, employmentStatus, organization, qualification, street1, street2, city, state, postalCode, country, phoneNumber, email, password } = req.body;
  const uploadFile = req.file ? req.file.path : undefined;


  // if (!firstName || !lastName || !gender || !dateOfBirth || !nationality || !medicalPersonnel || !employmentStatus || !organization || !qualification || !street1 || !street2 || !city || !state || !postalCode || !country || !phoneNumber || !email || !password) {
  //   return res.status(400).json({ message: "All fields are required" })
  // }

  const user = await MedicalPersonnel.findOne({ email })
  if (user) {
      return res.status(404).json({ message: "User already exist, proceed to Login"})
  }

  // if (user) {
  //   return res.status(409).json({ message: "User with the same email already exists, please use a different  email"})
  // }



  const hashedPassword = bcrypt.hashSync(password, 10)


  const newUser = new MedicalPersonnel({
    firstName,
    lastName,
    gender,  
    dateOfBirth,
    nationality, 
    medicalPersonnel,
    employmentStatus,
    organization, 
    qualification, 
    street1, 
    street2, 
    city, 
    state, 
    postalCode, 
    country, 
    phoneNumber, 
    email, 
    password: hashedPassword,
    uploadFile
  })
  try {
    await newUser.save()
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal Server Error"})
  }

  return res.status(201).json({ message: "User successfully signed up", data: newUser})
}




exports.registerMedicalProfessional = registerMedicalProfessional;
exports.uploadFile = uploadFile;
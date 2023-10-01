const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const secretKey = process.env.SECRET_KEY || 'defaultSecretKey';
const Patient = require("../config/patientModels");
const Medics = require("../config/medicalProfessionalModel");
require('dotenv').config();
const nodemailer = require('nodemailer');
const reset = express.Router();


const registerUser = async (req, res) => {

  const { firstName, lastName, username, dateOfBirth, phoneNumber, email, password } = req.body;

  if (!firstName || !lastName || !username || !dateOfBirth || !phoneNumber || !email || !password) {
    return res.status(400).json({ message: "All fields are required" })
  }

  const user = await Patient.findOne({ email })
  if (user) {
    return res.status(400).json({ message: "User already exist, proceed to Login" })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = new Patient({
    firstName,
    lastName,
    username,
    dateOfBirth,
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


const login = async (req, res) => {
  try {
    const { email, password, role } = req.body

    // Find the user in the database
    const user = await Patient.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
    console.log("Generated Token: ", token)

    // Return the token to the client
    return res.status(200).json({ message: "User Successfully Logged In", token });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};


// const createUser = async (req, res) => {
//   const { email, password, role } = req.body;

//   try {
//     // Check if user already exists
//     const findUser = await User.findOne({ email });
//     if (findUser) {
//       return res.json({
//         msg: "User already exists",
//         success: false,
//       });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     let newUser;
//     if (role === 'patient') {
//       // Create a new patient with hashed password
//       newUser = await Patient.create({
//         email,
//         password: hashedPassword,
//         // Include additional required fields specific to the patient
//         name: req.body.name,
//         age: req.body.age,
//         // ...
//       });
//     } else if (role === 'medicalProfessional') {
//       // Create a new medical professional with hashed password
//       newUser = await MedicalProfessional.create({
//         email,
//         password: hashedPassword,
//         // Include additional required fields specific to the medical professional
//         name: req.body.name,
//         specialty: req.body.specialty,
//         // ...
//       });
//     } else {
//       return res.json({
//         msg: "Invalid role",
//         success: false,
//       });
//     }

//     res.json({ newUser });
//   } catch (error) {
//     throw new Error(error);
//   }
// };

// const getAllUsers = async (req, res) => {
//   try {
//     const all = await User.find();
//     res.json(all);
//   } catch (error) {
//     throw new Error(error);
//   }
// };

// const getaUser = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const findUser = await User.findById(id);
//     res.json({ findUser });
//   } catch (error) {
//     throw new Error(error);
//   }
// };

// const update = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const updateUser = await User.findByIdAndUpdate(
//       id,
//       {
//         name: req?.body.name,
//         email: req?.body.email,
//         mobile: req?.body.mobile,
//       },
//       { new: true }
//     );
//     res.json(updateUser);
//   } catch (error) {
//     throw new Error(error);
//   }
// };

// const deleteUser = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const find = await User.findByIdAndDelete(id);
//     res.json(find);
//   } catch (error) {
//     throw new Error(error);
//   }
// };


// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  });
}
// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

//Password Reset

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: 'mahletanbessie@gmail.com',
    pass: '598600Mm@@',
  },
});

// Define the route for generating and sending the verification code to the user
reset.post('/send-verification-code', async (req, res) => {
  try {
    const { email } = req.body;
    // Find the user with the provided email in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate a unique verification code
    const verificationCode = crypto.randomBytes(4).toString('hex');

    // Save the verification code and its expiration time in the user's document in the database
    user.verificationCode = verificationCode;
    user.verificationCodeExpiration = Date.now() + 600000; // Expiration time set to 10 minutes
    await user.save();

    // Send the verification code to the user via email
    const mailOptions = {
      from: 'mahletanbessie@gmail.com',
      to: email,
      subject: 'Email Verification',
      text: `Your verification code is: ${verificationCode}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to send verification code email' });
      }
      console.log('Email sent:', info.response);
      // Return a success message
      return res.status(200).json({ message: 'Verification code sent' });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Define the route for verifying the reset code and updating the user's password
reset.post('/reset-password', async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;
    // Find the user with the provided email and reset code in the database
    const user = await User.findOne({ email, resetCode });

    if (!user) {
      return res.status(404).json({ error: 'Invalid reset code' });
    }

    // Check if the reset code has expired
    if (Date.now() > user.resetCodeExpiration) {
      return res.status(400).json({ error: 'Reset code has expired' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    user.password = hashedPassword;
    // Reset the reset code and its expiration time
    user.resetCode = undefined;
    user.resetCodeExpiration = undefined;
    await user.save();

    // Return a success message
    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



// module.exports = { registerUser, createUser, getAllUsers, getaUser, update, deleteUser, login };
module.exports = { registerUser, login, reset }

const express = require('express')
const app = express()
const Patient = require("../config/patientModels");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY || 'defaultSecretKey';
require('dotenv').config();
const multer = require('multer')
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

const profilePicture = multer({ storage: storage }).single('profilePicture')




const registerUser = async (req, res) => {

  const { firstName, lastName, username, dateOfBirth, phoneNumber, email, password } = req.body;

  if (!firstName || !lastName || !username || !dateOfBirth || !phoneNumber || !email || !password) {
    return res.status(400).json({ message: "All fields are required" })
  }

  const user = await Patient.findOne({ email })
  if (user) {
    return res.sttus(400).json({ message: "User already exist, proceed to Login" })
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



// User Account Settings

const accountProfile = async (req, res) => {
  const userId = req.params.id

  if (!userId) {
    return res.status(401).json({ message: 'User does not exist' });
  }

  const { firstName, lastName, country, address, state, username } = req.body;

  try {
    const updateUser = await Patient.findOneAndUpdate(
      { _id: userId },
      {
        firstName,
        lastName,
        country,
        address,
        state,
        username
      },
      { new: true },
    )

    if (!updateUser) {
      return res.status(400).json({ message: "User not found" })
    }


    return res.status(200).json({ message: "Profile Detailed successfully updated!", updateUser})
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error"})
  }
}


const accountLogin = async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(401).json({ message: 'User does not exist' });
  }

  const { newEmail, password, previousPassword, newPassword, confirmPassword } = req.body;

  try {
    const userEmail = await Patient.findOne({ _id: userId });

    if (!userEmail) {
      return res.status(401).json({ message: "User does not exist" })
    }

    userEmail.email = newEmail;
    await userEmail.save();

    const userPassword = await Patient.findOne({ _id: userId });

    if (!userPassword) {
      return res.status(401).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(previousPassword, userPassword.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Previous Password is incorrect" });
    }

        // if (previousPassword === newPassword) {
        //     throw { statusCode: 400, message: "New password must be different from the previous password" };
        // }

    if (newPassword !== confirmPassword) {
      return res.status(401).json({ message: "New password do not match" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    userPassword.password = hashedPassword;
    await userPassword.save();

    return res.status(201).json({ message: "Login Details updated Successfully" });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update Email and password' });
  }
};


const accountNotification = async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(401).json({ message: 'User does not exist' });
  }

  try {
    const { notificationChannel, notificationOption } = req.body

    const user = await Patient.findById(userId);

    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    const updateNotificationSettings = await Patient.findOneAndUpdate(
      { _id: req.params.id },
      {
        notificationChannel: {
          email: notificationChannel?.email || false,
          phoneNumber: notificationChannel?.phoneNumber || false,
        },
        notificationOption: {
          consultationBooking: notificationOption?.consultationBooking || false,
          consultationReminders: notificationOption?.consultationReminders || false,
          medicationReminders: notificationOption?.medicationReminders || false,
          medicationRefillReminders: notificationOption?.medicationRefillReminders || false,
          newsletter: notificationOption?.newsletter || false,
        },
      },
      { new: true }
    );


    if (!updateNotificationSettings) {
      return res.status(400).json({ message: "User does not exist"})
    }

    await user.save();

    return res.status(201).json({ message: "Notification settings updated successfully", updateNotificationSettings})
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update notification settings' });
  }
}


const accountPrivacy = async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(401).json({ message: 'User does not exist' });;
  }
    
  try {
    const { privacyPreferredDetails, medicalPersonnel } = req.body

    const user = await Patient.findById(userId);

    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

      const updatePrivacySettings = await Patient.findOneAndUpdate(
      { _id: req.params.id },
      {
        privacyPreferredDetails: {
          allDetails: privacyPreferredDetails?.allDetails || false,
          personalDetails: privacyPreferredDetails?.personalDetails || false,
          contentDetails: privacyPreferredDetails?.contentDetails || false,
          medicalRecords: privacyPreferredDetails?.medicalRecords || false,
        },
        medicalPersonnel: {
          medicalDoctor: medicalPersonnel?.medicalDoctor || false,
          pharmacists: medicalPersonnel?.pharmacists || false,
          nurses: medicalPersonnel?.nurses || false,
          nutritionist: medicalPersonnel?.nutritionist || false,
          labScientist: medicalPersonnel?.labScientist || false,
        },
      },
      { new: true }
    );


    if (!updatePrivacySettings) {
      return res.status(400).json({ message: "User does not exist"})
    }

    await user.save();

    return res.status(201).json({ message: "Notification settings updated successfully", updatePrivacySettings})

  } catch (error) {
    return res.status(500).json({ message: 'Failed to update privacy settings' });
  }
}


const deleteAccount = async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(401).json({ message: 'User does not exist' });;
  }

  try {
    const deletedUser = await Patient.findOneAndDelete({ _id: userId })
    
    if (!deletedUser) {
      return res.status(400).json({ message: "User does not exist"})
    }

    return res.status(201).json({ message: "User Account Deleted Successfully"})
  } catch (error) {
    return res.staus(500).json({error:"Intenal Error"})
  }
    
}


const viewProfilePicture = async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(401).json({ message: 'User does not exist' });;
  }

  try {
        // Fetch the user by their ID from the session
    const user = await Patient.findById(userId);

    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

        // Assuming userDP.profilePicture is a URL or path to the profile picture
    return res.status(200).json({ profilePicture: user.profilePicture });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to retrieve profile picture' });
  }
}


const editProfilePicture = async(req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(401).json({ message: 'User does not exist' });;
  }

  try {
    const user = await Patient.findById(userId);

    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    const profilePicture = req.file ? req.file.path : undefined;

    if (!profilePicture) {
      return res.status(400).json({ message: 'No file was uploaded' });
    }

    user.profilePicture = profilePicture;

    await user.save();

    return res.status(200).json({ message: 'Profile Picture uploaded successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to upload profile picture' });
  }
}


const deleteProfilePicture = async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(401).json({ message: 'User does not exist' });;
  }

  try {
    const existingUser = await Patient.findOne({ _id: userId });

    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    existingUser.profilePicture = null;

    await existingUser.save();

    return res.status(200).json({ message: "Profile Picture has been deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
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



// module.exports = { registerUser, createUser, getAllUsers, getaUser, update, deleteUser, login };
module.exports = { registerUser, login, accountProfile, accountLogin, accountNotification, profilePicture, viewProfilePicture, editProfilePicture, deleteProfilePicture, accountPrivacy, deleteAccount }
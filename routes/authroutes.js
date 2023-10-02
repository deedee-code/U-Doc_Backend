const express = require("express");

// const {
//   registerUser,
//   createUser,
//   getAllUsers,
//   getaUser,
//   update,
//   deleteUser,
//   login,
// } = require("../controller/ctrl");

const { registerUser, login, accountProfile, accountLogin, accountNotification, profilePicture, viewProfilePicture, editProfilePicture, deleteProfilePicture, accountPrivacy, deleteAccount } = require("../controller/userController")

const router = express.Router();


router.post('/user/signup', registerUser)
// router.post("/user", createUser);
// router.get("/users", getAllUsers);
// router.get("/aUser", getaUser);
// router.put("/:id", update);
// router.delete("/:id", deleteUser);
router.post("/user/login", login);
// router.post("/medics/signup", registerMedical)
router.put('/profile-details/:id', accountProfile)
router.put('/login-details/:id', accountLogin)
router.put('/notification/:id', accountNotification)
router.get('/profile-picture/view/:id', profilePicture, viewProfilePicture)
router.post('/profile-picture/edit/:id', profilePicture, editProfilePicture)
router.delete('/profile-picture/delete/:id', profilePicture, deleteProfilePicture)
router.put('/privacy-setting/:id', accountPrivacy)
router.delete('/delete-account/:id', deleteAccount)

module.exports = router;
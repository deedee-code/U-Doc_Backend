const express = require("express");
const router = express.Router();

// const {
//   registerUser,
//   createUser,
//   getAllUsers,
//   getaUser,
//   update,
//   deleteUser,
//   login,
// } = require("../controller/ctrl");

const { registerUser, login } = require("../controller/ctrl")


router.post('/user/signup', registerUser)
// router.post("/user", createUser);
// router.get("/users", getAllUsers);
// router.get("/aUser", getaUser);
// router.put("/:id", update);
// router.delete("/:id", deleteUser);
router.post("/user/login", login);
// router.post("/medics/signup", registerMedical)

module.exports = router;
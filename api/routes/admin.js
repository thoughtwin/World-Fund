const express = require("express");
const router = express.Router();
const Auth = require('../validations/auth');
const { userAuthenticator } = require('../middleware/check-auth');

//Admin User
router.get("/getAllUsers", [userAuthenticator],Auth.getAllUsers);
router.put("/updateVerified/:userId", [userAuthenticator],Auth.userVerified);

module.exports = router;
const express = require("express");
const router = express.Router();
const Auth = require('../validations/auth');
const Deposit = require('../validations/deposit');
const { userAuthenticator } = require('../middleware/check-auth');

//User Routes
router.post("/Signup", Auth.signUp);
router.post("/Login", Auth.Login);
router.put('/transactionProcess/:userId', [userAuthenticator],Auth.updateTransactionId);
router.get("/ViewUserDetails", Auth.getUserDetails);
// router.get("/VerifyEmail", Auth.verifyEmail);
router.post("/ResendEmail", Auth.emailResend);
router.post("/ForgotPassword", Auth.forgotPassword);
router.put("/UpdateUserDetails", [userAuthenticator], Auth.updateUserDetail);
router.put('/changePassword', [userAuthenticator], Auth.changePassword);

//Deposit Routes
router.post("/AddDeposit", [userAuthenticator], Deposit.createDeposit);
router.get("/getAllDeposits", [userAuthenticator], Deposit.getDeposit);
router.get("/getUserDeposits", [userAuthenticator], Deposit.getUserDeposit);
router.post("/Signup", [userAuthenticator], Auth.signUp);

module.exports = router;
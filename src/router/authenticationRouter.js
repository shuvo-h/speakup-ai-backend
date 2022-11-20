// external imports
const {checkEmailExist, makeHashPassword, generateUserToken} = require("../middleware/auth/authMiddleware")
const {addNewUserCtl, getUserCtl} = require("../controller/user.js");

const express = require("express");


const authRouter = express.Router();

// registration route path 
authRouter.post("/registration",checkEmailExist ,makeHashPassword,addNewUserCtl)

// login route path 
authRouter.post("/login",generateUserToken,getUserCtl);

module.exports = {
    authRouter
}
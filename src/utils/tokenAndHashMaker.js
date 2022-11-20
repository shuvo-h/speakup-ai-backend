const jwt = require("jsonwebtoken");
const {envInfo} = require("./envInitializer");

function generateToken(user) {
    const payloadObj = {
        _id: user._id, 
        name: user.name,
        email: user.email,
    }
    const jwt_option = {
        expiresIn: "1d"
    }
    const token = jwt.sign(payloadObj,envInfo.JWT_SECRET,jwt_option);
    return token;
}

module.exports = {
    generateToken
}
// external imports
const express = require("express");
const { convertAudioCtl, convertFreeAudioCtl } = require("../controller/audioConvert");
const { checkLogin } = require("../middleware/auth/authMiddleware");
const { checkCardLimit, checkRequestIpLimit } = require("../middleware/convert/convertMiddleWare");


const audioConvertRouter = express.Router();

// convert audio bay checking login and convert card
/*
    POST: /api/v1/audio/convert?convertCard_id=${convertCard._id}
    body: {text:"lorem",lang:"en-US"}
    headers: {authorization: "Bearer jwtToken"}
*/
audioConvertRouter.post("/convert",checkLogin,checkCardLimit,convertAudioCtl)



// convert free within a fixed limit
// audioConvertRouter.post("/free_convert",checkRequestIpLimit,convertFreeAudioCtl)
audioConvertRouter.route('/free_convert')
    /*
        POST: /api/v1/audio/free_convert
        body: {text:"lorem",lang:"en-US"}
    */
    .post(checkRequestIpLimit,convertFreeAudioCtl)






module.exports = {
    audioConvertRouter
}
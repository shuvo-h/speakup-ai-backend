// external imports
const express = require("express");
const { getSingleConvertCardCtl } = require("../controller/convertCardController");

const convert_cardRouter = express.Router();



convert_cardRouter.route('/:user_id')
    /*
        GET: /api/v1/convert_card?user_id=`{user._id}`
    */
    .get(getSingleConvertCardCtl)






module.exports = {
    convert_cardRouter
}
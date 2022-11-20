// external imports
const express = require("express");
const { getTestIpCtl } = require("../controller/freeController");

const freeRoute = express.Router();



freeRoute.route('/')
    /*
        GET: /api/v1/free
    */
    .get(getTestIpCtl)






module.exports = {
    freeRoute
}
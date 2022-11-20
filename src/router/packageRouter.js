// external imports
const express = require("express");
const {getPackageByIdCtl, allPackagesCtl, packageAddCtl} = require("../controller/packageController");

const packageRoutes = express.Router();



packageRoutes.route('/:package_id')
    /*
        GET: /api/v1/package/{packageID}?duration={duration}
    */
    .get(getPackageByIdCtl)




packageRoutes.route('/')
    /*
        GET: /api/v1/package
        details: get list of all package in array
    */
   .get(allPackagesCtl)

   /*
       POST: /api/v1/package
       body: {
            "name":"Silver",
            "character_limit":12000,
            "character_limit_per_req":5000,
            "price": 12,
            "discount_monthly": 0,
            "discount_yearly":5,
            "discount_special":0,
            "status":"active",
            "languages":["en-uk"],
            "fileTypes":[{"extension":"mp3","mime":"audio/mpeg"}],
            "category":"student",
            "commercial":"to reviewed",
            "req_per_day": 5
        }
       details: get list of all package in array
   */
    .post(packageAddCtl)






module.exports = {
    packageRoutes
}
// external imports
const express = require("express");
const {getPackageByIdCtl, allPackagesCtl, packageAddCtl} = require("../controller/packageController");
const { getStripeIntentCtl, getStripeInfoCtl } = require("../controller/paymentCtl/stripeCtl");
const { checkLogin } = require("../middleware/auth/authMiddleware");

const paymentRoutes = express.Router();



paymentRoutes.route('/methods/stripe/:stripe_intent_id')
    /*
        POST: /api/v1/payment/methods/stripe/:payment_intent_id
        details: confirm pay info by payment intent
    */
    .post(checkLogin,getStripeInfoCtl)




paymentRoutes.route('/methods/stripe')
    /*
        POST: /api/v1/payment/methods/stripe
        details: get a payment intent
    */
   .post(getStripeIntentCtl)





module.exports = {
    paymentRoutes
}
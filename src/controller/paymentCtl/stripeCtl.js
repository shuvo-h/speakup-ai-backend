
const { PackageModel } = require("../../schemaModels/package");
const { checkIsConverCardExistByUserId, updateConverCardByUserIdService, createConverCardService } = require("../../services/convertCardService");
const { createPaymentSlipService, getSlipByAgetPayIDAndUserIdService } = require("../../services/paymentSlipServices");
const { getUserByIdService } = require("../../services/user");
const { envInfo } = require("../../utils/envInitializer");
const { calculatePackageAmount } = require("../../utils/packageUtils");

// const StripeInit = require('stripe');
// const stripe = StripeInit(envInfo.STRIPE_SECRET_KEY);
const stripe = require("stripe")(envInfo.STRIPE_SECRET_KEY);


const calculateOrderAmount = (amountIn_USD) => {
    return parseInt(parseFloat(amountIn_USD) * 100); // stripe cut payment with cent, so multiply 100 to make usd to cent
};

const organizePuschaseInfo = async(pruchaseData) =>{
  try {
    // find the package info
    const reqPackage = await PackageModel.findOne({_id:pruchaseData.package_id,status:'active'}).lean();
    
    // console.log(reqPackage,"req=Package");
    if (reqPackage._id) {
      // calculate the package with duration
      const calculatedPkg = calculatePackageAmount(reqPackage,pruchaseData.duration);
      const userEmail = await getUserByIdService(pruchaseData.user_id,{email:1,_id:0});
      // find the user info and combine a confirm order slip
      
     if ((parseFloat(pruchaseData.amount) === calculatedPkg.pay_amount) && (calculatedPkg.status === 'active') && userEmail.email) {
      const {_id,__v,createdAt,pay_amount,updatedAt,commercial,status, ...restCalculatedPkg } = calculatedPkg;
       const newOrder = {
        ...restCalculatedPkg,
        package_id: _id,
        amount: pay_amount,
        method: pruchaseData.method,
        userInfo:{
          id: pruchaseData.user_id,
          email: userEmail.email
        },
       }
        return newOrder;
     }else{
      return {error:true,message:"Wrong purchase data!"}
     }
    }else{
      return {error:true,message:"Package didn't find"}
    }
    
  } catch (error) {
    console.log(error);
    return {error:true,message:error.message}
  }
}
  
async function getStripeIntentCtl(req, res) {
  try {
    const newOrder = await organizePuschaseInfo(req.body);
    if (!newOrder.error) {
      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(newOrder.amount), // make the USD to-> cent
        currency: "usd",
        payment_method_types: ['card'], // this will allow only card payment
        statement_descriptor: `Purchasing package`,
      });
      
      
      // store the information here in Database before sending response
      const paymentSlip = await createPaymentSlipService({...newOrder,pay_status:false,pay_to:"stripe",agent_pay_id:"",agent_pay_id:paymentIntent.id})
      
      if (paymentSlip._id) {
        res.send({clientSecret: paymentIntent.client_secret});
      }else{
        const errMessage = paymentSlip.message??"Unknown error occured during creating payment slip.";
        console.log(errMessage);
       res.send({error:errMessage,message:errMessage})
     }
      
    }else{
      res.json({error:true,message: newOrder.message})
    }
    
  } catch (error) {
    console.log(error);
    res.json({error:true,message: error.message})
  }
};




async function getStripeInfoCtl(req, res,next) {
    const {stripe_intent_id} = req.params;
    const decodedUser = req.decodedUser; 
    
    try {
      console.log("St Trying 2222");
      if(decodedUser._id){
        if(stripe_intent_id){
          // get the payment information from stripe and check with user data
          // const paymentIntentInfo = await stripe.paymentIntents.retrieve('pi_3LssYXDZzhqf7ann2dlI6iqn',);
          const paymentIntentInfo = await stripe.paymentIntents.retrieve(stripe_intent_id);
          console.log("St !!");
          const userPaymentSlip = await getSlipByAgetPayIDAndUserIdService (stripe_intent_id,decodedUser._id);
          console.log(userPaymentSlip,"userPaymentSlip afeter");
          
          if ((parseFloat(userPaymentSlip.amount)*100).toFixed(2) === (paymentIntentInfo.amount).toFixed(2) && (parseFloat(userPaymentSlip.amount)*100).toFixed(2) === (paymentIntentInfo.amount_received).toFixed(2)) {
            // check if the user already has an exist convertCard, so make upsert->True
            const isExistCard = await checkIsConverCardExistByUserId(decodedUser._id);
            console.log(isExistCard,"userPaymentSlip in CHECKKKKKKKKK");
            
            const newConvertCardInfo = {
              user_id: decodedUser._id,
              package_id: req.body?.package_id,
              package_start: userPaymentSlip.package_start,
              package_expire: userPaymentSlip.package_expire,
              card_status: 'active',
              character_limit: userPaymentSlip.character_limit,
              character_limit_per_req: userPaymentSlip.character_limit_per_req,
              req_per_day: userPaymentSlip.req_per_day,
              size: 0,
              file_count: 0
            }
            if (isExistCard?._id) {
              // update the card
              delete newConvertCardInfo.user_id; // delete the user_id, we don't want to update it
              delete newConvertCardInfo.size; // delete the size, we don't want to update it
              delete newConvertCardInfo.file_count; // delete the file_count, we don't want to update it
              newConvertCardInfo.card_status = new Date(userPaymentSlip.package_expire) > new Date() ? 'active':'inactive'
              const updatedCard = await updateConverCardByUserIdService(decodedUser._id,newConvertCardInfo);
              console.log(updatedCard,"CArd is Exist and Updatinggggggg");
              if (!updatedCard.error) {
                console.log("SEnding jes reson OKKAAYY");
                res.status(200).json({card:"ok",...updatedCard})
              }else{
                res.status(403).json({error:true,message:updatedCard.message??"Failed to update convert card!"})
              }
            }else{
              // create the card as it is new user
              const newCard = await createConverCardService(newConvertCardInfo);
    
              if (newCard._id) {
                res.status(200).json({card:"ok",...newCard})
              }else{
                res.status(403).json({error:true,message:newCard.message??"Failed to create convert card!"})
              }
            }
          }else{
            console.log("Payment Didn't match");
            throw new Error("Invalid payment amount!");
          }
        }else{
          throw new Error("Payment Confirmation id is required.");
        }
      }else{
        throw new Error("Invalid Authotication");
      }
    } catch (error) {
      console.log(error);
      res.status(403).json({error:true,message: error.message})
    }
    
  };
  
  

module.exports = {
    getStripeIntentCtl,
    getStripeInfoCtl
}
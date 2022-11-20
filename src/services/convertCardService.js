const { ConvertCardModel } = require("../schemaModels/convertCardModel");
const { PackageModel } = require("../schemaModels/package");

async function createConverCardService (newConverCard={}) {
    try {
        const result = await ConvertCardModel.create(newConverCard);
        return result.toJSON();
    } catch (error) {
        console.log(error);
        return error;
    }
}


async function checkIsConverCardExistByUserId (user_id) {
    try {
        const result =  await ConvertCardModel.exists({user_id}).lean();
        return result
    } catch (error) {
        console.log(error);
        return error;
    }
}

// update a convert card by user_id
async function updateConverCardByUserIdService (user_id,updateConvertCardInfo={}) {
    try {
        const result =  await ConvertCardModel.findOneAndUpdate({user_id},updateConvertCardInfo,{new:true}).lean();
        return result
    } catch (error) {
        console.log(error);
        return error;
    }
}
// update a convert card by card id
async function updateConverCardByIdService (card_id,updateConvertCardInfo={}) {
    try {
        const result =  await ConvertCardModel.findOneAndUpdate({_id:card_id},updateConvertCardInfo,{new:true}).lean();
        return result
    } catch (error) {
        console.log(error);
        return error;
    }
}


// get a convert card by user_id
async function getConvertCardByUserIdService (user_id) {
    
    try {
        const result =  await ConvertCardModel.findOne({user_id}).populate({path:'package_id',select:'name languages fileTypes'}).lean();
        return result
    } catch (error) {
        console.log(error);
        return error;
    }
}

// get a convert card by user_id
async function getConvertCardbyIdService (card_id) {
    
    try {
        const result =  await ConvertCardModel.findOne({_id:card_id}).populate({path:'package_id',select:'name languages fileTypes'}).lean();
        return result
    } catch (error) {
        console.log(error);
        return error;
    }
}
// get a convert card by user_id
async function updateCardAfterConvertService (card_id,{size=0,textLength=0}) {
    
    try {
        // const result =  await ConvertCardModel.findOne({_id:card_id}).populate({path:'package_id',select:'name languages fileTypes'}).lean();
        const result =  await ConvertCardModel.updateOne(
            {_id:card_id},
            {
                $inc:{
                    "req_per_day_reamining.req_reamining": -1,
                    size,
                    file_count: 1,
                    "character_limit_reamining": -textLength
                },
            },
            {runValidators: true}
        )
        
        return result
    } catch (error) {
        console.log(error);
        return error;
    }
}



module.exports = {
    createConverCardService,
    checkIsConverCardExistByUserId,
    updateConverCardByUserIdService,
    updateConverCardByIdService,
    getConvertCardByUserIdService,
    getConvertCardbyIdService,
    updateCardAfterConvertService,
}
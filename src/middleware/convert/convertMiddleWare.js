const { getConvertCardbyIdService, updateConverCardByIdService } = require("../../services/convertCardService");
const { getTestIpUserByIpAddressService, updateTestIpUserByIdService, createNewIpUserService } = require("../../services/testIpUserServices");
const { freeCharacterLimit } = require("../../staticData/controlledData");
const { gttActiveLanguages } = require("../../utils/activeLanguageGttUnOfficial");
const { getRemoteRequesterIpAddress } = require("../../utils/getRemoteuserIpAddress");


async function checkCardLimit (req,res,next){
    try {
        // check if the limit and card active all are satisfied
        if (req.decodedUser?._id) {
            const {convertCard_id} = req.query;
            const {text,lang} = req.body;
            if (convertCard_id) {
                const convertCard = await getConvertCardbyIdService(convertCard_id);
                // check: language is in card
                if (convertCard?.package_id?.languages?.includes(lang)) {
                    // check if package is expirted
                    const isNotExpire = new Date(convertCard.package_expire) >= new Date();
                    if ((convertCard?.card_status === 'active') && isNotExpire) {
                        // card is not expired, check req limit
                        let isToday = new Date(convertCard.req_per_day_reamining.today).toISOString().split("T")[0] === new Date().toISOString().split("T")[0];
                        
                        // if it is not today, update the card with today date and set the remaining req per day as default, and change isToday as true
                        if (!isToday) {
                            const toDay = new Date().toISOString().split("T")[0]
                            const todayUpdateDoc = {"req_per_day_reamining.today":toDay, "req_per_day_reamining.req_reamining": convertCard.req_per_day}
                            const perReqRemaining = await updateConverCardByIdService(convertCard_id,todayUpdateDoc)
                            if (perReqRemaining._id) {
                                isToday = true;
                            }
                        }
                        if ( isToday && convertCard.req_per_day_reamining.req_reamining > 0) {
                            // accept the request and check the character limit per request
                            const textLength = text.length;
                            if (convertCard.character_limit_per_req >= textLength) {
                                // text length is in limit, check total character for this package
                                if (convertCard.character_limit_reamining >= textLength) {
                                    // console.log("Going next");
                                    next();
                                }else{
                                    res.status(403).json({error:true,message:`You reached your maximum character for this month. Please renew your package! or if you are using a yearly package, wait for the next month to be auto renual`})
                                }
                            }else{
                                // character per req exceed. please send small text than the limit
                                res.status(403).json({error:true,message:`Maximum ${convertCard.character_limit_per_req} characters allowed for each convert!`})
                            }
                        }else{
                            // return that the today's req limit has exceed
                            res.status(403).json({error:true,message:"You have reached to maximum number of request for today!"})
                        }
                    }else{
                        // card is expired; update card status to "inactive"
                        if(convertCard?.card_status === 'active'){
                            const updatedCard = await updateConverCardByIdService(convertCard_id,{card_status:'inactive'})
                        }
                        res.status(403).json({error:true,message:"Card is not ACTIVE"})
                    }
                    
                }else{
                    res.status(403).json({error:true,message:"Invalid Language!"})
                }
            }else{
                res.status(403).json({error:true,message:"Card id is required"})
            }
            // find the card by convertCard_id and user_id
        }else{
            res.status(403).json({error:true,message:"Authentication is required"})
        }
    } catch (error) {
        console.log(error);
        res.status(403).json({error:true,message:error.message})
    }
}



// check limit for each requester ip address

async function checkRequestIpLimit (req,res,next) {
    try {
        const {text,lang} = req.body;
        // first check the language is in list
        const isRightLang = gttActiveLanguages.find(el=>el.code === lang);
        if (!isRightLang?.code) {
            throw new Error("Unsupported language")
        }


        const ip = getRemoteRequesterIpAddress(req)

        // check number of characters this ip has converted today
        if (ip) {
            // find ip from DB if exist
            const existIpUser = await getTestIpUserByIpAddressService(ip);
            if (existIpUser) {
                // check if the limit is crossed for today
                const isToday = new Date(existIpUser.today).toISOString().split("T")[0] === new Date().toISOString().split("T")[0];
                const totalLimit = existIpUser.characters_used + text.length;
                if (isToday) {
                    //  go next to check text lenth with limit
                    if (totalLimit <= freeCharacterLimit) {
                        req.ipDoc_id = existIpUser._id;
                        next();
                    }else{
                        throw new Error("You reached your daily free limit!");
                    }
                }else{
                    // update the today date and go next to check text lenth with limit
                    if (text.length <= freeCharacterLimit) {
                        const updatedTodayIp = await updateTestIpUserByIdService(existIpUser._id,{today: new Date().toISOString().split("T")[0]})
                        req.ipDoc_id = existIpUser._id;
                        next();
                    }else{
                        throw new Error(`You are allowed only ${freeCharacterLimit} characters to convert daily`);
                    }
                }
            }else{
                // insert as a new ip address
                const newIpUser = await createNewIpUserService(ip);
                if (newIpUser._id) {
                    // check the text length
                    if (text.length <= freeCharacterLimit) {
                        req.ipDoc_id = newIpUser._id;
                        next();
                    }else{
                        throw new Error("Characters limit exceeded!");
                    }
                }else{
                    throw new Error(newIpUser.message ?? "Failed to create record for the new user");
                }
            }
        }else{
            throw new Error("Could't recognize the user!")
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error:true,message:error.message})
    }
}


module.exports = {
    checkCardLimit,
    checkRequestIpLimit
}


const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { UsersModel } = require("../../schemaModels/user");
const { getUserByIdService } = require("../../services/user");
const { envInfo } = require("../../utils/envInitializer");
const { generateToken } = require("../../utils/tokenAndHashMaker");

async function checkEmailExist (req,res,next){
    console.log(req.body);
    try {
        const esixtUser = await UsersModel.findOne({email:req.body?.email});
        if (esixtUser?._id) {
            res.status(401).json({error:true,message:"Email already exist!"})
        }else{
            next();
        }
    } catch (error) {
        console.log(error);
        res.json({error: true, message:error.message})
    }
}

async function makeHashPassword  (req,res,next) {
    try {
        // make hash the password
        const saltRound = 10;
        const hashedPassword =  req.body.password ? await bcrypt.hash(req.body.password,saltRound) : null;
        req.body = {...req.body,password:hashedPassword}
        next();
    } catch (error) {
        console.log(error);
        res.json({error: true, message:error.message})
    }
}

async function generateUserToken (req,res,next){
    const {email,password} = req.body;
    try {
        const user = await UsersModel.findOne({email});
        if (user && bcrypt.compareSync(password,user.password)) {
            const userTokenInfo = {
                _id: user.id, 
                name: user.name,
                email: user.email,
            }
            
            const token = generateToken(userTokenInfo);
            const resData = {token,...userTokenInfo};
            req.user = resData;
            next();
        }else{
            res.status(401).json({error:true,message:"Invalid user email or password", data:{}});
        }
    } catch (error) {
        console.log(error);
        res.json({error: true, message:error.message})
    }
}


async function checkLogin (req,res,next){
    
    const token = req.headers?.authorization?.startsWith("Bearer " ) ? req.headers?.authorization?.split(" ")[1] : null;
   
    try {
        
        if (token) {
            // decode the token and check if the user is real user
            const decodedUser = jwt.verify(token,envInfo.JWT_SECRET);
            
            if (decodedUser.email) {
                const dbUser = await getUserByIdService(decodedUser._id,{email:1}) 
                if (dbUser._id.toString() === decodedUser._id && dbUser.email === decodedUser.email) {
                    // console.log(dbUser,"dbUser");
                    req.decodedUser = decodedUser;
                    next();
                }else{
                    throw new Error("Invalid Token. Please provide a valid token!")
                }
            }else{
                throw new Error("Invalid Token. Please provide a valid token!")
            }
        }else{
            throw new Error("Authentication required!");
        }
    } catch (error) {
        res.status(401).json({error:true,message: error.message});
    }
}



module.exports = {
    generateUserToken,
    makeHashPassword,
    checkEmailExist,
    checkLogin
}
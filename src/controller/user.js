const { addUserService } = require("../services/user");

async function getUserCtl(req,res,next){
    res.status(200).json(req.user)
}


async function addNewUserCtl(req,res,next){
    const user = await addUserService(req.body);
   
    if (!user.error && user._id) {
        const resUser = JSON.parse(JSON.stringify(user));
        delete resUser.password;
        res.status(200).json(resUser)
    }else{
        res.status(500).json(user)
    }
}

module.exports = {
    getUserCtl,
    addNewUserCtl
}
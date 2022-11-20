const { UsersModel } = require("../schemaModels/user");


async function addUserService (newUserData) {
    try {
        const userResult = await UsersModel.create(newUserData);
        return userResult;
    } catch (error) {
        console.log(error.message);
        return {error: true,message: error.message}
    }
}

async function getUserService (email) {
    try {
        const userResult = await UsersModel.findOne({email});
        return userResult;
    } catch (error) {
        console.log(error.message);
        return {error: true,message: error.message}
    }
}

async function getUserByIdService (userId,fields={}) {
    try {
        const userResult = await UsersModel.findOne({_id:userId}).select(fields).lean();
        return userResult;
    } catch (error) {
        console.log(error.message);
        return {error: true,message: error.message}
    }
}

module.exports = {
    getUserByIdService, 
    getUserService,
    addUserService
}
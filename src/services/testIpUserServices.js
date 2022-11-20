const { TestIpModel } = require("../schemaModels/testIpModel");


async function getTestIpUserByIpAddressService (ipAddress) {
    try {
        const ipResult = await TestIpModel.findOne({ip:ipAddress}).lean();
        return ipResult;
    } catch (error) {
        console.log(error.message);
        return {error: true,message: error.message}
    }
}

async function createNewIpUserService (ipAddress) {
    try {
        const ipResult = await TestIpModel.create({ip:ipAddress,today: new Date().toISOString().split("T")[0]});
        return ipResult;
    } catch (error) {
        console.log(error.message);
        return {error: true,message: error.message}
    }
}

async function updateTestIpUserByIdService (docId,updateDoc={}) {
    try {
        const ipResult = await TestIpModel.findOneAndUpdate({_id:docId},updateDoc,{runValidators:true});
        return ipResult;
    } catch (error) {
        console.log(error.message);
        return {error: true,message: error.message}
    }
}

async function updateTestIpUserAfterConvByIdService (docId,updateDoc={characters_used:0}) {
    try {
        const ipResult = await TestIpModel.findOneAndUpdate(
            {_id:docId},
            {
                $inc:{characters_used: updateDoc.characters_used}
            },
            {runValidators:true}
        );
        
        return ipResult;
    } catch (error) {
        console.log(error.message);
        return {error: true,message: error.message}
    }
}


module.exports = {
    getTestIpUserByIpAddressService,
    createNewIpUserService,
    updateTestIpUserByIdService,
    updateTestIpUserAfterConvByIdService,
}
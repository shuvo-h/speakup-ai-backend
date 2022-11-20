const { PackageModel } = require("../schemaModels/package");



async function addPackageService (newPackageData){
    try {
        const packageResult = await PackageModel.create(newPackageData);
        return packageResult;
    } catch (error) {
        console.log(error.message);
        return {error: true,message: error.message}
    }
}

async function getAllPackagesService (mainQuery){
    const filters = {...mainQuery}
    const excludeFields = ['sort','fields'];
    try {
        // format the query
        excludeFields.forEach(field=> delete filters[field]);
        const queries = {};
        // how the data will be sorted 
        if (mainQuery.sort) {
            const sortBy = mainQuery.sort.split(",").join(" ");
            queries.sortBy = sortBy;
        }
        // which fields will be returned
        if (mainQuery.fields) {
            const fields = mainQuery.fields.split(",").join(" ");
            queries.fields = fields;
        }

        
        const packages = await PackageModel.find(filters).sort(queries.sortBy).select(queries.fields);
        return packages;
    } catch (error) {
        console.log(error.message);
        return {error: true,message: error.message}
    }
}



async function getPackageByIdService (packageID,filters={}){
    try {
        const packageResult = await PackageModel.findOne({_id:packageID,...filters}).lean();
        return packageResult;
    } catch (error) {
        console.log(error);
        return {error: true,message: error.message}
    }
}


module.exports = {
    addPackageService,
    getAllPackagesService,
    getPackageByIdService,

}
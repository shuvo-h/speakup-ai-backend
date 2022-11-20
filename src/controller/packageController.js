
const { addPackageService, getAllPackagesService, getPackageByIdService } = require("../services/packageService")
const { calculatePackageAmount } = require("../utils/packageUtils")


async function packageAddCtl(req,res,next){
    const newPackage = await addPackageService(req.body)
    if (!newPackage.error) {
        res.status(200).json(newPackage)
    }else{
        res.status(500).json(newPackage)
    }
}

async function allPackagesCtl(req,res,next){
    const packages = await getAllPackagesService(req.query)
    if (!packages.error) {
        res.status(200).json({error:false,packages})
    }else{
        res.status(500).json({error:true,packages})
    }
}

async function getPackageByIdCtl(req,res,next){
    console.log(req.params);
    try {
        const {package_id} = req.params;
        const {duration,...restFilters} = req.query;
        if (!package_id) {return res.status(500).json({error:true,message:"Package id is required"})}
        // use filters here
        let packageData = await getPackageByIdService(package_id,restFilters);
       
        if (packageData === null) {
            return res.status(200).json({error:false,data:{}})
        }
        if (packageData?._id) {
            // calculate the price amount if duration is available in query
            if (duration && packageData) {
                packageData = calculatePackageAmount(packageData,duration)
            }
            res.status(200).json({error:false,data:packageData})
        }else{
            res.status(500).json({error:true,message:packageData?.message})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error:true,message:error.message})
    }
}


module.exports = {
    getPackageByIdCtl,
    allPackagesCtl,
    packageAddCtl,
}
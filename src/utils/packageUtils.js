function calculatePackageAmount (packageObj,duration=""){
    if (!duration) {return packageObj;}

    let totalDiscount, pay_amount ,package_expire;
    totalDiscount = pay_amount = 0;
    const date = new Date();

    if (duration === "yearly") {
        package_expire = new Date(date.setMonth(date.getMonth()+12)).toISOString();
        totalDiscount = parseFloat(packageObj.discount_yearly) + parseFloat(packageObj.discount_special);
        pay_amount = parseFloat(packageObj.price * 12) - (parseFloat(packageObj.price * 12)*(totalDiscount/100)) // convert to year
    }else if (duration === "monthly") {
        package_expire = new Date(date.setMonth(date.getMonth()+1)).toISOString()
        totalDiscount = parseFloat(packageObj.discount_monthly) + parseFloat(packageObj.discount_special);
        pay_amount = parseFloat(packageObj.price) - (parseFloat(packageObj.price)*(totalDiscount/100))
    }
    return {...packageObj,pay_amount,package_start: new Date().toISOString(),package_expire,package_expire_status:"active",duration}
}


module.exports = {
    calculatePackageAmount
}
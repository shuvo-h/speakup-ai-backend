const {mongoose } = require("mongoose");
const { gttActiveLanguages } = require("../utils/activeLanguageGttUnOfficial");
const ObjectId = mongoose.Schema.Types.ObjectId;

const PaymentSlipsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide your name"], 
            trim: true, 
            lowercase:true,
            minLength: [3, "Name must be at least 3 characteres."],
            maxLength: [100, "Name is too large."],
        },
        character_limit:{
            type: Number,
            required: [true,"Need  a limit for the total character"],
            default:0,
            min:[0,"Character limit can not be negative"]
        },
        character_limit_per_req: {
            type: Number,
            required: [true,"Need  a character limit for each request"],
            default:0,
            min:[0,"Request Character limit can not be negative"]
        },
        req_per_day: {
            type: Number,
            required: [true,"Need request limit for each day"],
            default:0,
            min:[0,"Request limit can not be negative"]
        },
        price: {
            type: Number,
            required: [true,"Price is required for this package"],
            default:0,
            min:[0,"Price can not be negative"]
        },
        discount_monthly: {
            type: Number,
            default:0,
            min:[0,"Monthly discount can not be negative"]
        },
        discount_yearly: {
            type: Number,
            default:0,
            min:[0,"Yearly discount can not be negative"]
        },
        discount_special: {
            type: Number,
            default:0,
            min:[0,"Special discount can not be negative"]
        },
        languages: [{
            type: String,
            required: true,
            validate: {
                validator: (value) =>{
                    return gttActiveLanguages.some(language => language.code === value);
                },
                message:"Invalid Language Code"
            }
        }],
        category: {
            type: String,
            lowercase:true,
            trim: true,
            required: [true,"Category for this package is required"],
        },
        download: {
            type: Boolean,
            required: true,
            default: true
        },
        fileTypes: [{
            extension:{
                type: String,
                required: [true,"Audio extension is required"],
                trim: true
            },
            mime:{
                type: String,
                required: [true,"Audio mime is required"],
                trim: true
            },
        }],
        package_start: {
            type: Date,
            required: [true,"Purchase date is required"],
        },
        package_expire: {
            type: Date,
            required: [true,"Purchase date is required"],
        },
        package_expire_status: {
            type: String,
            required: [true,"Package available duration"],
            enum:{
                values: ["active","expired","dismissed"],
                message: "Package expire status can not be {VALUE}. Must be 'active/expired/dismissed'"
            },
        },
        duration: {
            type: String,
            lowercase:true,
            trim: true,
            required: [true,"Duration for this payment slip is required"],
        },
        package_id: {
            type: ObjectId,
            ref:"Packages",
            required: [true,"Package reference is required"],
        },
        amount: {
            type: Number,
            required: [true,"Payment amount is required for this billing slip"],
            default:0,
            min:[0,"Payment amount can not be negative"]
        },
        method: {
            type: String,  // 'card'
            lowercase:true,
            trim: true,
            required: [true,"Method for this payment slip is required"],
        },
        userInfo: {
            email:{
                type: String,
                required: [true,"User email is required"],
                trim: true,
                match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,"Invalid email address"],
                lowercase:true,
            },
            id:{
                type: ObjectId,
                ref:"Users",
                required: [true,"User reference is required"],
            }
        },
        pay_status: {
            type: Boolean, 
            required: [true,"Method for this payment slip is required"],
        },
        pay_to: {
            type: String,  // 'stripe'
            lowercase:true,
            trim: true,
            required: [true,"Method for this payment slip is required"],
        },
        agent_pay_id: {
            type: String,  // stripe payment intent id number
            trim: true,
            default:""
        }
    },
    {
        timestamps: true
    }
)

const PaymentSlipsModel = mongoose.models.PaymentSlips || mongoose.model("PaymentSlips",PaymentSlipsSchema);

module.exports = {PaymentSlipsModel};


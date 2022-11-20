const {mongoose } = require("mongoose");
const { gttActiveLanguages } = require("../utils/activeLanguageGttUnOfficial");


const packageSchema = new mongoose.Schema(
    {
        serial_no:{
            type: Number,
            required: [true, "Serial number is required"],
            default: 0 
        },
        name: {
            type: String,
            required: [true, "Please provide your name"], 
            trim: true, 
            lowercase:true,
            unique:[true,"Package aleady exist"],
            minLength: [3, "Name must be at least 3 characteres."],
            maxLength: [100, "Name is too large."],
        },
        character_limit: {
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
        /*
            period:{ // missed this package. allow this property in future improvement
                type: String,
                required: [true,"Package available duration"],
                enum:{
                    values: ["monthly","yearly"],
                    message: "Duration can not be {VALUE}. Must be 'monthly/yearly'"
                },
            
            },
        */
        discount_monthly:{
            type: Number,
            default:0,
            min:[0,"Monthly discount can not be negative"]
        },
        discount_yearly:{
            type: Number,
            default:0,
            min:[0,"Yearly discount can not be negative"]
        },
        discount_special:{
            type: Number,
            default:0,
            min:[0,"Special discount can not be negative"]
        },
        status:{
            type: String,
            required: [true,"Package status is required"],
            lowercase:true,
            enum: ["active","in-active","discontinued"],
            message:"Status can not be {VALUE}. Status must be 'active/in-active/discontinued'"
           
        },
        languages:[{
            type: String,
            required: true,
            validate: {
                validator: (value) =>{
                    return gttActiveLanguages.some(language => language.code === value);
                },
                message:"Invalid Language Code"
            }
        }],
        fileTypes:[{
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
        category:{
            type: String,
            lowercase:true,
            trim: true,
            required: [true,"Category for this package is required"],
        },
        commercial:{
            type: String,
            lowercase:true,
            trim: true,
            required: [true,"Commercial case of this package is required"],
        },
        download:{
            type: Boolean,
            required: true,
            default: true
        },
    },
    {
        timestamps: true
    }
)

const PackageModel = mongoose.models.Packages || mongoose.model("Packages",packageSchema);


module.exports = {
    PackageModel
}


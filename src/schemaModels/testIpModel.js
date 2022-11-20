const {mongoose } = require("mongoose");


const testIpSchema = new mongoose.Schema(
    {
        ip: {
            type: String,
            required: [true,"IP address is unknown"],
            unique:[true,"IP address already exist"],
            trim: true,
        },
        today:{
            type: Date,
            required: [true,"Date is required"],
            trim: true,
        },
        characters_used:{
            type: Number,
            required: [true,"Date is required"],
            default: 0,
            min:[0,"Characters limit can not be negative"]
        }
    },
    {
        timestamps: true
    }
)

const TestIpModel = mongoose.models.Test_Ip || mongoose.model("Test_Ip",testIpSchema);

module.exports = {TestIpModel};


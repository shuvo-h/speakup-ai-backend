const {mongoose } = require("mongoose");


const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true,"Email is required"],
            unique:[true,"Email already exist"],
            trim: true,
            match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,"Invalid email address"],
            lowercase:true,
        },
        name: {
            type: String,
            required: [true, "Please provide your name"], 
            trim: true, 
            minLength: [3, "Name must be at least 3 characteres."],
            maxLength: [100, "Name is too large."],
        },
        password: {
            type: String,
            required: [true, "Please provide a strong password"], 
            trim: true, 
            minLength: [3, "Name must be at least 3 characteres."],
            maxLength: [300, "Name is too large."],
        }
    },
    {
        timestamps: true
    }
)

const UsersModel = mongoose.models.Users || mongoose.model("Users",userSchema);

module.exports = {UsersModel};


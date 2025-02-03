import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        age: { type: Number, required: true },
        gender: { type: String, enum: ["male", "female", "others"], required: true },
        location: { type: String, required: true },
        occupation: { type: String, required: true },
        education: {
            type: String,
            enum: ["school", "highSchool", "underGraduate", "postGraduate"], // Allowed values
            required: true
        },
        otp: { type: String },
        otpExpires: { type: Date }
    },
    { timestamps: true }
);

export default mongoose.model("User", UserSchema);

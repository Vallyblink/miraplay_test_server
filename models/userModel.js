import { Schema, model } from "mongoose";

const userSchema = new Schema({
    token: String,
    password: {
        minlength: 6,
        type: String,
        required: [true, 'Set password for user'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    verify: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        required: [true, 'Verify token is required'],
    },

  
}, { versionKey: false, timestamps: true });

const User = model("user", userSchema);

export default User;
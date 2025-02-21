import mongoose from "mongoose";
import crypto from 'crypto';

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    },
    playlist: [{
        type: String,
        required: true,
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    }
}, {
    timestamps: true,
});

// Method to generate verification token
schema.methods.generateVerificationToken = function() {
    this.verificationToken = crypto.randomBytes(20).toString('hex');
};

export const User = mongoose.model("User", schema);

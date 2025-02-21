import { User } from "../models/User.js";
import generateToken from "../utills/generateToken.js";
import TryCatch from "../utills/TryCatch.js";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "../utills/email.js";
import crypto from "crypto";

export const registerUser = TryCatch(async(req,res)=>{
    const { name, email, password } = req.body;
    // Case-insensitive email search and validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Invalid email format"
        });
    }

    let user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

    if (user) {
        return res.status(400).json({
            message: "User with this email already exists"
        });
    }


    // Validate password length
    if (password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long"
        });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // Create user with initial verification token
    user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashPassword,
        verificationToken: crypto.randomBytes(20).toString('hex')
    });

    // Generate and send verification email

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${user.verificationToken}`;
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('Email configuration is missing');
    }
    await sendVerificationEmail(user.email, verificationLink);

    generateToken(user._id, res);
    res.status(201).json({
        user,
        message: "User Created Successfully. Please check your email to verify your account.",
    });

});

export const loginUser = TryCatch(async(req,res)=>{
    const {  email, password } = req.body;
    const user = await User.findOne({email});

    if(!user)
        return res.status(400).json({
         message: " No User Exist",
    });

    const comparePassword = await bcrypt.compare(password, user.password);

    if(!comparePassword)
        return res.status(400).json({
         message: "Wrong Password",
    });

    // Send verification email if not verified
    if (!user.isVerified) {
        // Generate new token if needed
        if (!user.verificationToken) {
            user.verificationToken = crypto.randomBytes(20).toString('hex');
            await user.save();
        }

        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${user.verificationToken}`;
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error('Email configuration is missing');
        }
        await sendVerificationEmail(user.email, verificationLink);
    }

    generateToken(user._id, res);
    
    res.status(200).json({
        user,
        message: user.isVerified ? "User LoggedIN" : "Please check your email to verify your account.",
    });

});

export const myProfile = TryCatch(async(req,res)=>{
    const user = await User.findById(req.user._id);
    res.json(user);
})

export const verifyEmail = TryCatch(async(req,res)=>{
    const { token } = req.query;
    
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
        return res.status(400).json({ message: "Invalid verification token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
});

export const logoutUser = TryCatch(async(req,res)=>{

    res.cookie("token", "", { maxAge: 0 });
    res.json({
        message: "User Logout Successfully",
    });
});

export const saveToPlaylist = TryCatch(async(req,res)=>{
    const user = await User.findById(req.user._id);
    if(user.playlist.includes(req.params.id)){
        const index = user.playlist.indexOf(req.params.id)

        user.playlist.splice(index,1)
        await user.save();

       return res.json({
            message: "Song Removed from Playlist",
        })
    }

    user.playlist.push(req.params.id)
    await user.save();

    return res.json({
        message: "Song Added to Playlist",
    })
})

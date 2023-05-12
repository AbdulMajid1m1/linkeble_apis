const jwt = require('jsonwebtoken')
const Joi = require('joi')
const jwtKey = process.env.jwtKey;
const bcrypt = require("bcryptjs")
const salt = bcrypt.genSaltSync(10);
const mongoose = require('mongoose')
const User = require('../Models/User');
const sendOTPEmail = require('./Email/sendOTPEmal');
const { Chatlist, GroupChatList } = require('../Models/Chatlist');
const createError = require('../Utils/createError');
const isProduction = true;
const SignUp = async (req, res, next) => {
    const value = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(3).required(),
        username: Joi.string().required()
    }).validate(req.body)
    if (value.error) {
        next(createError(400, value.error.details[0].message))
    }
    try {
        const { email, password, username } = req.body
        const user = await User.findOne({ email })
        if (user) {
            next(createError(400, "Email already exists"))
        }
        const findUsername = await User.findOne({ username })
        if (findUsername) {
            next(createError(400, "Username already exists"))
        }
        else {
            // create a new chatlist for the user
            const newChatList = new Chatlist({});
            const chatList = await newChatList.save();
            const newGropuChatList = new GroupChatList({});
            const groupChatList = await newGropuChatList.save();

            if (!chatList) {
                next(createError(500, "Chatlist not created"))
            }
            if (!groupChatList) {
                next(createError(500, "Group chatlist not created"))
            }

            const hash = bcrypt.hashSync(password, salt);
            const newUser = new User({
                email: email.toLowerCase(),
                password: hash,
                username,
                chatlistId: chatList._id,
                groupChatListId: groupChatList._id
            });

            const userTokenData = {
                _id: newUser._id,
                email: newUser.email,
                username: newUser.username,
                profileImg: newUser.profileImg,
                location: newUser.location,
                status: newUser.status,
                chatlistId: newUser.chatlistId,
                groupChatListId: newUser.groupChatListId,
                favouriteGigs: newUser.favouriteGigs,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt
            };
            const token = jwt.sign(userTokenData, jwtKey, { expiresIn: '30d' });

            // newUser.token = token;
            // console.log(userTokenData)
            const createdUser = await newUser.save()
            delete createdUser.password
            return res.cookie("accessToken", token, {
                httpOnly: true,
                secure: isProduction, // Set 'secure' to true only in production
                sameSite: isProduction ? "none" : "lax", // Set 'sameSite' to 'none' only in production
            }).status(200).json({ success: true, userData: createdUser, token: token })

        }

    }
    catch (err) {
        next(err)
    }
}


const SignIn = async (req, res, next) => {
    const value = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(3).required()
    }).validate(req.body)
    if (value.error) {
        next(createError(400, value.error.details[0].message))
    }
    try {
        const { email, password } = req.body
        const user = await User.findOne({
            email: email.toLowerCase()
        })
        if (user) {
            const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
            if (isPasswordCorrect) {
                const userData = {
                    _id: user._id,
                    email: user.email,
                    username: user.username,
                    profileImg: user.profileImg,
                    location: user.location,
                    status: user.status,
                    chatlistId: user.chatlistId,
                    groupChatListId: user.groupChatListId,
                    favouriteGigs: user.favouriteGigs,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                };
                const token = jwt.sign(userData, jwtKey, { expiresIn: '30d' });

                res.cookie("accessToken", token, {
                    httpOnly: true,
                    secure: isProduction, // Set 'secure' to true only in production
                    sameSite: isProduction ? "none" : "lax", // Set 'sameSite' to 'none' only in production

                }).status(200).json({
                    success: true, message: "Login Successful",
                    userData: user,
                    token
                })
            }
            else {
                next(createError(400, "Wrong credentials!"))
            }

        }
        else {
            next(createError(400, "Wrong credentials!"))
        }

    }
    catch (err) {
        next(err);

    }
}

const forgetPasswordStepOne = async (req, res, next) => {
    const value = Joi.object({
        email: Joi.string().email().required()
    }).validate(req.body)
    if (value.error) {
        // return res.status(400).json({ success: false, error: value.error.details[0].message })
        next(createError(400, value.error.details[0].message))
    }

    try {
        const user = await User.findOne({ email: req.body.email })

        if (user) {
            const otp = Math.floor(1000 + Math.random() * 9000);
            const token = jwt.sign({
                id: user._id,
                otp
            }, jwtKey, { expiresIn: '30d' })

            await sendOTPEmail(req.body.email, otp)
            return res.status(200).json({ success: true, message: "OTP sent to your email", token })
        }
        else {
            next(createError(400, "Email not found!"))
        }
    }
    catch (err) {
        next(err)
    }

}

const forgetPasswordStepTwo = async (req, res, next) => {
    // save token in local storag or any other way and send it in body
    const value = Joi.object({
        token: Joi.string(),
        otp: Joi.number().required()
    }).validate(req.body)
    if (value.error) {
        next(createError(400, value.error.details[0].message))
    }

    try {
        const { otp, token } = req.body
        const decoded = jwt.verify(token, jwtKey)
        // type of decoded.otp is?

        console.log(typeof decoded.otp + " " + typeof otp)
        if (decoded.otp === otp) {
            return res.status(200).json({ success: true, message: "OTP verified" })
        }
        else {
            next(createError(400, "Wrong OTP"))
        }
    }
    catch (err) {
        next(err)
    }

}


const resetPassword = async (req, res, next) => {
    const value = Joi.object({
        token: Joi.string(),
        password: Joi.string().min(3).required(),
        confirmpassword: Joi.string().min(3).required(),
    }).validate(req.body)
    if (value.error) {
        next(createError(400, value.error.details[0].message))
    }

    try {
        const { password, token } = req.body
        const hash = bcrypt.hashSync(password, salt);
        // const decoded = jwt.verify(req.headers.authorization, jwtKey)
        // decode the token
        const decoded = jwt.verify(token, jwtKey)
        const user = await User.findOneAndUpdate({ _id: decoded.id }, { password: hash }, { new: true })
        if (user) {
            return res.status(200).json({ success: true, message: "Password reset successfully" })
        }
        else {
            next(createError(400, "User not found"))
        }
    }
    catch (err) {
        next(err)
    }


}

const logout = async (req, res, next) => {
    res
        .clearCookie("accessToken", {
            sameSite: "none",
            secure: true,
        })
        .status(200)
        .send("User has been logged out.");
};





module.exports = {
    SignUp,
    SignIn,
    forgetPasswordStepOne,
    forgetPasswordStepTwo,
    resetPassword,
    logout
}



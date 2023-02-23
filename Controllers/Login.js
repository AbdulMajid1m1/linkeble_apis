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
            })
            console.log(newUser)

            const userTokenData = newUser;
            delete userTokenData.password;
            const token = jwt.sign({ userData: userTokenData }, jwtKey, { expiresIn: '30d' })
            newUser.token = token;
            // console.log(userTokenData)
            const createdUser = await newUser.save()
            delete createdUser.password
            // const token = jwt.sign({ id: createdUser._id }, jwtKey, { expiresIn: '1d' })

            return res.status(200).json({ success: true, userData: createdUser, token: token })

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
                const userData = user.toObject();
                delete userData.password;
                const token = jwt.sign(userData, jwtKey, { expiresIn: '30d' })
                res.status(200).json({
                    success: true, message: "Login Successful",
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
            }, jwtKey, { expiresIn: '30m' })

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

module.exports = {
    SignUp,
    SignIn,
    forgetPasswordStepOne,
    forgetPasswordStepTwo,
    resetPassword
}

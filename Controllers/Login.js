const jwt = require('jsonwebtoken')
const Joi = require('joi')
const jwtKey = process.env.jwtKey;
const bcrypt = require("bcryptjs")
const salt = bcrypt.genSaltSync(10);
const mongoose = require('mongoose')
const User = require('../Models/User')

module.exports = {
    SignUp: async (req, res) => {
        const value = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(3).required(),
            username: Joi.string().required()
        }).validate(req.body)
        if (value.error) {
            return res.status(400).json({ error: value.error.details[0].message })
        }
        try {
            const { email, password, username } = req.body
            const user = await User.findOne({ email })
            if (user) {
                return res.status(400).json({ success: false, error: 'Email already exists' })
            }

            else {

                const hash = bcrypt.hashSync(password, salt);
                const newUser = new User({
                    email: email.toLowerCase(),
                    password: hash,
                    username
                })
                const userTokenData = newUser;
                delete userTokenData.password;

                const token = jwt.sign({ userData: userTokenData }, jwtKey, { expiresIn: '30d' })
                newUser.token = token;
                console.log(userTokenData)
                const createdUser = await newUser.save()
                delete createdUser.password
                // const token = jwt.sign({ id: createdUser._id }, jwtKey, { expiresIn: '1d' })

                return res.status(200).json({ success: true, userData: createdUser, token: token })

            }

        }
        catch (err) {
            return res.status(500).json({ success: false, error: err.message })
        }
    },
    SignIn: async (req, res) => {
        const value = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(3).required()
        }).validate(req.body)
        if (value.error) {
            return res.status(400).json({ error: value.error.details[0].message })

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
                    res.status(400).json({ success: false, message: "Wrong credentials!" })
                }

            }
            else {
                res.status(400).json({ success: false, message: "Wrong credentials!" })
            }

        }
        catch (err) {
            return res.status(500).json({ success: false, error: err.message })
        }
    },
}
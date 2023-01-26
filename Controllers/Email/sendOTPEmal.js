const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, REFRESH_TOKEN, OWNER_EMAIL } = require('../../Config/config');
const oAuth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI)
// No refresh token or refresh handler callback is set. how to solve it?

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })
const sendOTPEmail = async (email, otp) => {
    return new Promise(async (resolve, reject) => {
        try {
            const accessToken = await oAuth2Client.getAccessToken();
            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: OWNER_EMAIL,
                    clientId: GOOGLE_CLIENT_ID,
                    clientSecret: GOOGLE_CLIENT_SECRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken: accessToken
                }
            })
            const mailOptions = {
                from: `Linkeble <${OWNER_EMAIL}>`,
                to: email,
                subject: 'OTP for Linkeble',
                text: `Your OTP is ${otp}`,
                html: `<h1>Your OTP is ${otp}</h1>`
            }

            const result = await transport.sendMail(mailOptions)
            resolve({ success: true, message: 'OTP sent successfully' })
        } catch (error) {
            console.log(error)
            reject({ success: false, message: 'Something went wrong', error: error })
        }
    })
}

module.exports = sendOTPEmail

const nodemailer = require("nodemailer");
const dotenv = require("dotenv")
dotenv.config()
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendEmail = async (to, subject, message) => {

    await transporter.sendMail({
        from: `karashify support team ${process.env.EMAIL}`,
        to,
        subject,
        html:message
    });

};

module.exports = sendEmail;
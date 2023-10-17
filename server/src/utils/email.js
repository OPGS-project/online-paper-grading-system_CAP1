const nodemailer = require("nodemailer");
require("dotenv").config();
const sendMail = async ({ email, html, title }) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_NAME, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"New Password" <no-relply@newpassword.com>', // sender address
    to: email, // list of receivers
    subject: title, // Subject line
    html: html, // html body
  });

  return info;
};

module.exports = sendMail;

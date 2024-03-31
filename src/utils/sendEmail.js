const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const sendEmail = async (email, subject, body) => {
  try {
    const transporter = nodemailer.createTransport(
      smtpTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      })
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: subject,
      html: body,
    });

    console.log("email sent sucessfully");
  } catch (error) {
    console.log(error, "email not sent");
  }
};

module.exports = sendEmail;

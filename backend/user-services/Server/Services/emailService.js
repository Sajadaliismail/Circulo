const nodemailer = require("nodemailer");

const MAIL_SETTINGS = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_EMAIL,
    pass: process.env.MAIL_PASSWORD,
  },
};
const transporter = nodemailer.createTransport(MAIL_SETTINGS);

const sendMail = async ({ to, OTP }) => {
  try {
    let info = await transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: to,
      subject: "Círculo OTP Verification",
      html: `
      <div
  class="container"
  style="max-width: 80%; margin: auto; padding: 40px; background: linear-gradient(135deg, #87cefa, #b0e0e6); border-radius: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); color: #333; text-align: center; font-family: 'Arial', sans-serif;"
>
  <h1 style="font-size: 3em; font-weight: bold; margin-bottom: 20px;">Welcome to Círculo</h1>
  <h2 style="font-size: 2em; font-weight: normal; margin-bottom: 20px;">Connecting People Everywhere</h2>
  <p style="font-size: 1.2em; margin-bottom: 40px;">
    Circulo is your new platform to stay connected with friends and family. We're excited to have you on board!
  </p>
  <h4 style="font-size: 1.5em; font-weight: normal; margin-bottom: 30px;">Thank you for signing up <span style="color: #ffd700;">✔</span></h4>
  <p style="font-size: 1.2em; margin-bottom: 30px;">Please enter this email verification OTP</p>
  <div style="position: relative; display: inline-block; margin-bottom: 30px;">
    <h1 style="font-size: 3em; letter-spacing: 4px; text-align: center; padding: 20px; background: #fff; color: #0072ff; border-radius: 10px; display: inline-block;" id="otp">${OTP}</h1>
  </div>
  <p style="font-size: 1.2em;">If you have any questions, feel free to contact our support team at <a href="mailto:appcirculo@gmail.com" style="color: #0072ff; text-decoration: none;">appcirculo@gmail.com</a>.</p>
</div>
    `,
    });
    return info;
  } catch (error) {
    return false;
  }
};

module.exports = sendMail;

const nodemailer = require('nodemailer')
const sendEmail = async options=>{
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD
        }
      });
      const massage = {
        from:`${process.env.SMTP_FROM_NAME}<${process.env.SMTP_FROM_EMAIL}>`,
        to:options.email,
        subject:options.subject,
        text:options.massage
      }
      await transporter.sendMail(massage)
}
module.exports = sendEmail;

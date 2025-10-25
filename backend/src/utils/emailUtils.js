const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendNotification = async ({ to, subject, text, html }) => {
  if (!process.env.SMTP_USER) return;
  await transporter.sendMail({
    from: process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER,
    to,
    subject,
    text,
    html
  });
};

module.exports = { sendNotification };

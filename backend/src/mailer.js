const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_SERVER,
  port: parseInt(process.env.MAIL_PORT, 10),
  secure: process.env.MAIL_PORT === '465',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transporter;

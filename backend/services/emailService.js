const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  tls: {
    rejectUnauthorized: true,
    ciphers: 'SSLv3',
  },
  debug: true, 
});


console.log('SMTP Configuration:', {
  host: 'smtp-relay.brevo.com',
  port: 587,
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS ? '***' : 'not set',
});


transporter.verify(function (error, success) {
  if (error) {
    console.error('SMTP Verification Error:', error);
  } else {
    console.log('SMTP server is ready to take our messages');
  }
});


const sendEmail = async (to, subject, text, html) => {
  try {
    if (!to || !subject || (!text && !html)) {
      throw new Error('Missing required email parameters');
    }

  
    const info = await transporter.sendMail({
      from: {
        name: 'QuickMart Management',
        address: 'ermanfaminiano020@gmail.com',
      },
      to,
      subject,
      text,
      html,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        Importance: 'high',
      },
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Detailed error sending email:', error);
    throw new Error(error.message || 'Failed to send email');
  }
};

module.exports = sendEmail;

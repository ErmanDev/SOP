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
  // Add these settings to improve deliverability
  tls: {
    rejectUnauthorized: true,
    ciphers: 'SSLv3',
  },
  debug: true, // Enable debug logs
});

// Add this after transporter creation to debug
console.log('SMTP Configuration:', {
  host: 'smtp-relay.brevo.com',
  port: 587,
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS ? '***' : 'not set',
});

// Verify SMTP connection on startup
transporter.verify(function (error, success) {
  if (error) {
    console.error('SMTP Verification Error:', error);
  } else {
    console.log('SMTP server is ready to take our messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    if (!to || !subject || (!text && !html)) {
      throw new Error('Missing required email parameters');
    }

    // Add more email headers to improve deliverability
    const info = await transporter.sendMail({
      from: {
        name: 'QuickMart POS',
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

    console.log(`Email sent to ${to} - MessageId: ${info.messageId}`);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Detailed error sending email:', error);
    throw new Error(error.message || 'Failed to send email');
  }
};

module.exports = sendEmail;

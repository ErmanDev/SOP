const nodemailer = require('nodemailer');



const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: 'koresensi.299@gmail.com',
    pass: 'vkws fwij zimc vinu',
  },
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: 'koresensi.299@gmail.com',
      to,
      subject,
      text,
      html,
    });
    console.log(`Email sent to ${to}`);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;

const express = require('express');
const sendEmail = require('../services/emailService');
const router = express.Router();

router.post('/send-email', async (req, res) => {
  const { to, subject, text, html } = req.body;
  try {
    const info = await sendEmail(to, subject, text, html);
    res.status(200).json({
      success: true,
      message:
        'Email sent successfully! Check the preview URL to see how it looks.',
      info,
      previewUrl: info.previewUrl,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send email.',
      error: error.message,
    });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { upload, uploadToSupabase } = require('../middlewares/multer'); // Correctly import functions

router.post('/uploadSingle', upload.single('file'), async (req, res) => {
  console.log('Received file:', req.file);
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Upload the file to Supabase using the uploadToSupabase function
    const fileUrl = await uploadToSupabase(req.file);

    // Respond with the file URL from Supabase
    res.status(200).json({
      fileUrl, // Returning the public URL of the file
    });
  } catch (error) {
    console.error('Error uploading file to Supabase:', error.message);
    res.status(500).json({ error: 'Error uploading file to Supabase' });
  }
});

module.exports = router;

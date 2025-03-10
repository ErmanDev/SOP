const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// Initialize Supabase client
const supabaseUrl = 'https://bqceruupeeortjtbmnmf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxY2VydXVwZWVvcnRqdGJtbm1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMTg2NDksImV4cCI6MjA1NTg5NDY0OX0.zNjuqdxUiPB4Q9WBbZsWuBCcNQrk4R1s3gYROOyFtcM'; // Replace with your actual key
const supabase = createClient(supabaseUrl, supabaseKey);

// Configure Multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload file to Supabase
const uploadToSupabase = async (file) => {
    try {
        // Generate a unique filename using UUID to prevent overwriting
        const uniqueFilename = uuidv4() + '-' + file.originalname;

        // Upload the file to the 'uploads' bucket
        const { data, error } = await supabase.storage
            .from('uploads') // Ensure 'uploads' bucket is used here
            .upload(uniqueFilename, file.buffer, {
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            throw new Error('Failed to upload file: ' + error.message);
        }

        // Return the path or filename stored in Supabase
        return data.path;
    } catch (error) {
        console.error(error);
        throw new Error('Error uploading file to Supabase: ' + error.message);
    }
};

module.exports = { upload, uploadToSupabase };

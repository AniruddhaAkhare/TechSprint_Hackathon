import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // Loads variables from .env file

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// --- The Server Setup ---
const app = express();
const port = 3001; // Choose a port for your backend

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Allow the server to read JSON from request bodies


// --- Your Request Handler (now as part of the server) ---
const generateResumeUrlHandler = async (req, res) => {
  const { resumePath } = req.body;

  if (!resumePath) {
    return res.status(400).json({ error: "resumePath is required" });
  }

  // Credentials are read from server-side environment variables via process.env
  const client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: resumePath.trim().replace(/^\//, ''),
  });

  try {
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    res.status(200).json({ url });
  } catch (err) {
    console.error("Error generating signed URL on server:", err);
    res.status(500).json({ error: "Could not retrieve resume URL." });
  }
};


// --- Define the API Route ---
// This tells the server: "When you get a POST request to '/api/generate-resume-url', run our handler function."
app.post('/api/generate-resume-url', generateResumeUrlHandler);


// --- Start the Server ---
app.listen(port, () => {
  console.log(`Server is running and listening on http://localhost:${port}`);
});
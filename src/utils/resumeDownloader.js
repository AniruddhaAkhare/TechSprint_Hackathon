import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const generateResumeLink = async (resumePath) => {
  const client = new S3Client({
    region: import.meta.env.VITE_AWS_REGION,
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    },
  });

  const command = new GetObjectCommand({
    Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
    Key: resumePath.trim().replace(/^\//, ''),
  });

  try {
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    return url;
  } catch (err) {
    console.error("Error generating signed URL:", err);
    throw err;
  }
};

export default generateResumeLink;
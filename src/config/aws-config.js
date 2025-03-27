import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

export const debugS3Config = () => {
  console.log("S3 Config Debug:", {
    region: import.meta.env.VITE_AWS_REGION,
    accessKey: import.meta.env.VITE_AWS_ACCESS_KEY_ID ? "Set" : "Not Set",
    secretKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY ? "Set" : "Not Set",
  });
};
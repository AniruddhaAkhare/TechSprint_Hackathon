// // import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// // // const { v4: uuidv4 } = require("uuid");
// // // const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
// // import  { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// // import { v4 as uuidv4 } from "uuid"; // For unique file names
// // import functions from "firebase-functions";

// // export const s3Client = new S3Client({
// //   region: import.meta.env.VITE_AWS_REGION,
// //   credentials: {
// //     accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
// //     secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
// //   },
// // });

// // exports.generateUploadUrl = functions.https.onCall(async (data, context) => {
// //   const { enquiryId, fileType } = data;
// //   const bucketName = process.env.S3_BUCKET_NAME;
// //   const fileName = `recordings/${enquiryId}/${uuidv4()}.${fileType.split("/")[1]}`; // Unique file name in S3

// //   const putObjectParams = {
// //     Bucket: bucketName,
// //     Key: fileName,
// //     ContentType: fileType,
// //   };
// //   const command = new PutObjectCommand(putObjectParams);
// //   const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 }); // URL expires in 10 minutes
// //   const publicUrl = `https://${bucketName}.s3.amazonaws.com/${fileName}`; // URL to access the file

// //   return { signedUrl, publicUrl };
// // });


// // export const debugS3Config = () => {
// //   console.log("S3 Config Debug:", {
// //     region: import.meta.env.VITE_AWS_REGION,
// //     accessKey: import.meta.env.VITE_AWS_ACCESS_KEY_ID ? "Set" : "Not Set",
// //     secretKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY ? "Set" : "Not Set",
// //   });
// // };


// import { S3Client } from "@aws-sdk/client-s3";

// export const s3Client = new S3Client({
//   region: import.meta.env.VITE_AWS_REGION,
//   credentials: {
//     accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
//     secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
//   },
// });

// export const debugS3Config = () => {
//   console.log("S3 Config Debug:", {
//     region: import.meta.env.VITE_AWS_REGION,
//     accessKey: import.meta.env.VITE_AWS_ACCESS_KEY_ID ? "Set" : "Not Set",
//     secretKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY ? "Set" : "Not Set",
//   });
// };


import { S3Client } from "@aws-sdk/client-s3";

const region = import.meta.env.VITE_AWS_REGION;
const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;

if (!region || !accessKeyId || !secretAccessKey) {
  console.error("AWS configuration missing:", {
    region: region ? "Set" : "Not Set",
    accessKeyId: accessKeyId ? "Set" : "Not Set",
    secretAccessKey: secretAccessKey ? "Set" : "Not Set",
  });
  throw new Error("Missing AWS configuration in environment variables");
}

export const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const debugS3Config = () => {
  console.log("S3 Config Debug:", {
    region: region || "Not Set",
    accessKeyId: accessKeyId ? "Set" : "Not Set",
    secretAccessKey: secretAccessKey ? "Set" : "Not Set",
    s3Client: s3Client ? "Initialized" : "Not Initialized",
  });
};
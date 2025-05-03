// // // /**
// // //  * Import function triggers from their respective submodules:
// // //  *
// // //  * const {onCall} = require("firebase-functions/v2/https");
// // //  * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
// // //  *
// // //  * See a full list of supported triggers at https://firebase.google.com/docs/functions
// // //  */

// // // const {onRequest} = require("firebase-functions/v2/https");
// // // const logger = require("firebase-functions/logger");

// // // // Create and deploy your first functions
// // // // https://firebase.google.com/docs/functions/get-started

// // // // exports.helloWorld = onRequest((request, response) => {
// // // //   logger.info("Hello logs!", {structuredData: true});
// // // //   response.send("Hello from Firebase!");
// // // // });


// // // functions/index.js
// // const { onCall, HttpsError } = require("firebase-functions/v2/https");
// // const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
// // const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
// // const { v4: uuidv4 } = require("uuid");

// // // Initialize S3Client with environment variables
// // const s3Client = new S3Client({
// //   region: process.env.AWS_REGION,
// //   credentials: {
// //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
// //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// //   },
// // });

// // // Callable function to generate pre-signed S3 upload URL
// // exports.generateUploadUrl = onCall(async (data, context) => {
// //   try {
// //     const { enquiryId, fileType } = data;
// //     if (!enquiryId || !fileType) {
// //       throw new HttpsError("invalid-argument", "enquiryId and fileType are required");
// //     }

// //     const bucketName = process.env.S3_BUCKET_NAME;
// //     if (!bucketName) {
// //       throw new HttpsError("failed-precondition", "S3_BUCKET_NAME is not configured");
// //     }

// //     const fileName = `recordings/${enquiryId}/${uuidv4()}.${fileType.split("/")[1]}`; // e.g., recordings/12345/abc123.jpg

// //     const putObjectParams = {
// //       Bucket: bucketName,
// //       Key: fileName,
// //       ContentType: fileType,
// //     };

// //     const command = new PutObjectCommand(putObjectParams);
// //     const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 }); // URL expires in 10 minutes
// //     const publicUrl = `https://${bucketName}.s3.amazonaws.com/${fileName}`; // Public URL to access the file

// //     return { signedUrl, publicUrl };
// //   } catch (error) {
// //     throw new HttpsError("internal", `Failed to generate upload URL: ${error.message}`);
// //   }
// // });

// // // Debug function (optional, for testing configuration)
// // exports.debugS3Config = onCall(async () => {
// //   return {
// //     region: process.env.AWS_REGION || "Not Set",
// //     accessKey: process.env.AWS_ACCESS_KEY_ID ? "Set" : "Not Set",
// //     secretKey: process.env.AWS_SECRET_ACCESS_KEY ? "Set" : "Not Set",
// //     bucketName: process.env.S3_BUCKET_NAME || "Not Set",
// //   };
// // });


// // functions/index.js
// const { onCall, HttpsError } = require("firebase-functions/v2/https");
// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
// const { v4: uuidv4 } = require("uuid");

// const s3Client = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// exports.generateUploadUrl = onCall(async (data, context) => {
//   try {
//     const { enquiryId, fileType } = data;
//     if (!enquiryId || !fileType) {
//       throw new HttpsError("invalid-argument", "enquiryId and fileType are required");
//     }

//     const bucketName = process.env.S3_BUCKET_NAME;
//     if (!bucketName) {
//       throw new HttpsError("failed-precondition", "S3_BUCKET_NAME is not configured");
//     }

//     const fileName = `recordings/${enquiryId}/${uuidv4()}.${fileType.split("/")[1]}`; // e.g., recordings/12345/abc123.jpg

//     const putObjectParams = {
//       Bucket: bucketName,
//       Key: fileName,
//       ContentType: fileType,
//     };

//     const command = new PutObjectCommand(putObjectParams);
//     const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 }); // URL expires in 10 minutes
//     const publicUrl = `https://${bucketName}.s3.amazonaws.com/${fileName}`; // Public URL to access the file

//     return { signedUrl, publicUrl };
//   } catch (error) {
//     throw new HttpsError("internal", `Failed to generate upload URL: ${error.message}`);
//   }
// });

// functions/index.js
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { v4: uuidv4 } = require("uuid");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

exports.generateUploadUrl = onCall(async (data, context) => {
  try {
    console.log("generateUploadUrl invoked with:", {
      data,
      userId: context.auth?.uid || "unauthenticated",
    });

    const { enquiryId, fileType } = data;
    if (!enquiryId || !fileType) {
      throw new HttpsError("invalid-argument", "enquiryId and fileType are required");
    }

    // Validate fileType format
    const fileTypeParts = fileType.split("/");
    if (fileTypeParts.length !== 2 || !fileTypeParts[0] || !fileTypeParts[1]) {
      throw new HttpsError("invalid-argument", "fileType must be in format type/subtype (e.g., audio/webm)");
    }

    const bucketName = process.env.S3_BUCKET_NAME;
    if (!bucketName) {
      throw new HttpsError("failed-precondition", "S3_BUCKET_NAME is not configured");
    }

    console.log("S3 Configuration:", {
      region: process.env.AWS_REGION || "Not Set",
      bucketName,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ? "Set" : "Not Set",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ? "Set" : "Not Set",
    });

    const fileName = `recordings/${enquiryId}/${uuidv4()}.${fileTypeParts[1]}`; // e.g., recordings/12345/abc123.webm

    const putObjectParams = {
      Bucket: bucketName,
      Key: fileName,
      ContentType: fileType,
    };

    console.log("PutObjectCommand params:", putObjectParams);

    const command = new PutObjectCommand(putObjectParams);
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 }); // URL expires in 10 minutes
    const publicUrl = `https://${bucketName}.s3.amazonaws.com/${fileName}`;

    console.log("Generated URLs:", {
      signedUrl: signedUrl.substring(0, 50) + "...",
      publicUrl,
    });

    return { signedUrl, publicUrl };
  } catch (error) {
    console.error("Error in generateUploadUrl:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      name: error.name,
    });
    throw new HttpsError("internal", `Failed to generate upload URL: ${error.message}`);
  }
});

exports.debugS3Config = onCall(async () => {
  return {
    region: process.env.AWS_REGION || "Not Set",
    accessKey: process.env.AWS_ACCESS_KEY_ID ? "Set" : "Not Set",
    secretKey: process.env.AWS_SECRET_ACCESS_KEY ? "Set" : "Not Set",
    bucketName: process.env.S3_BUCKET_NAME || "Not Set",
  };
});
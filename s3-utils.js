// // // // import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
// // // // import { s3Client } from "./aws-config"

// // // // /**
// // // //  * Uploads a file to S3 bucket
// // // //  * @param {File} file - The file to upload
// // // //  * @param {string} directory - Directory in the bucket (e.g., 'logos/')
// // // //  * @returns {Promise<string>} - URL of the uploaded file
// // // //  */
// // // // export const uploadToS3 = async (file, directory = "") => {
// // // //   if (!file) {
// // // //     throw new Error("No file provided")
// // // //   }

// // // //   const bucketName = import.meta.env.VITE_S3_BUCKET_NAME
// // // //   const region = import.meta.env.VITE_AWS_REGION

// // // //   if (!bucketName || !region) {
// // // //     throw new Error("Missing S3 configuration")
// // // //   }

// // // //   // Create a clean directory path
// // // //   const dir = directory ? (directory.endsWith("/") ? directory : `${directory}/`) : ""

// // // //   // Create a unique file key with timestamp
// // // //   const fileKey = `${dir}${Date.now()}_${file.name.replace(/\s+/g, "_")}`

// // // //   // Convert file to array buffer
// // // //   const fileBuffer = await file.arrayBuffer()

// // // //   // Set up the S3 upload parameters
// // // //   const params = {
// // // //     Bucket: bucketName,
// // // //     Key: fileKey,
// // // //     Body: new Uint8Array(fileBuffer),
// // // //     ContentType: file.type,
// // // //     ACL: "public-read", // Make sure your bucket policy allows this
// // // //   }

// // // //   // Send the upload command
// // // //   const command = new PutObjectCommand(params)
// // // //   await s3Client.send(command)

// // // //   // Return the public URL of the uploaded file
// // // //   return `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`
// // // // }

// // // // /**
// // // //  * Gets a signed URL for a private S3 object (if needed)
// // // //  * @param {string} key - The key of the object in S3
// // // //  * @param {number} expiresIn - Expiration time in seconds
// // // //  * @returns {Promise<string>} - Signed URL
// // // //  */
// // // // export const getSignedUrl = async (key, expiresIn = 3600) => {
// // // //   const bucketName = import.meta.env.VITE_S3_BUCKET_NAME

// // // //   const command = new GetObjectCommand({
// // // //     Bucket: bucketName,
// // // //     Key: key,
// // // //   })

// // // //   const url = await getSignedUrl(s3Client, command, { expiresIn })
// // // //   return url
// // // // }

// // // import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
// // // import { s3Client } from "./aws-config"
// // // import { httpsCallable } from "firebase/functions";
// // // import { functions } from "./config/firebase";

// // // /**
// // //  * Uploads a file to S3 bucket
// // //  * @param {File} file - The file to upload
// // //  * @param {string} directory - Directory in the bucket (e.g., 'logos/')
// // //  * @returns {Promise<string>} - URL of the uploaded file
// // //  */
// // // export const uploadToS3 = async (file, directory = "") => {
// // //   if (!file) {
// // //     throw new Error("No file provided")
// // //   }

// // //   const generateUploadUrl = httpsCallable(functions, "generateUploadUrl");
// // //   // const dir = directory ? (directory.endsWith("/") ? directory : `${directory}/`) : "";
// // //   const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
// // //   // const fileKey = `${dir}${timestamp}_${file.name.replace(/\s+/g, "_")}`;


// // //   const bucketName = import.meta.env.VITE_S3_BUCKET_NAME
// // //   const region = import.meta.env.VITE_AWS_REGION

// // //   if (!bucketName || !region) {
// // //     throw new Error("Missing S3 configuration")
// // //   }

// // //   // Create a clean directory path
// // //   const dir = directory ? (directory.endsWith("/") ? directory : `${directory}/`) : ""

// // //   // Create a unique file key with timestamp
// // //   const fileKey = `${dir}${Date.now()}_${file.name.replace(/\s+/g, "_")}`

// // //   // Convert file to array buffer
// // //   const fileBuffer = await file.arrayBuffer()

// // //   // Set up the S3 upload parameters
// // //   const params = {
// // //     Bucket: bucketName,
// // //     Key: fileKey,
// // //     Body: new Uint8Array(fileBuffer),
// // //     ContentType: file.type,
// // //     ACL: "public-read", // Make sure your bucket policy allows this
// // //   }

// // //   // Send the upload command
// // //   const command = new PutObjectCommand(params)
// // //   await s3Client.send(command)

// // //   // Return the public URL of the uploaded file
// // //   return `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`
// // // }

// // // /**
// // //  * Gets a signed URL for a private S3 object (if needed)
// // //  * @param {string} key - The key of the object in S3
// // //  * @param {number} expiresIn - Expiration time in seconds
// // //  * @returns {Promise<string>} - Signed URL
// // //  */
// // // export const getSignedUrl = async (key, expiresIn = 3600) => {
// // //   const bucketName = import.meta.env.VITE_S3_BUCKET_NAME

// // //   const command = new GetObjectCommand({
// // //     Bucket: bucketName,
// // //     Key: key,
// // //   })

// // //   const url = await getSignedUrl(s3Client, command, { expiresIn })
// // //   return url
// // // }


// // import { Upload } from "@aws-sdk/lib-storage";
// // import { GetObjectCommand } from "@aws-sdk/client-s3";
// // import { s3Client } from "./aws-config";
// // import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// // /**
// //  * Uploads a file to S3 bucket with progress tracking
// //  * @param {File} file - The file to upload
// //  * @param {string} docType - Document type (e.g., 'aadharCard')
// //  * @param {string} staffId - Staff ID for organizing files
// //  * @param {Function} setUploadProgress - Function to update upload progress
// //  * @returns {Promise<string>} - URL of the uploaded file
// //  */
// // export const uploadFileToS3 = async (file, docType, staffId, setUploadProgress = () => {}) => {
// //   if (!file || !(file instanceof File)) {
// //     throw new Error(`Invalid file for ${docType}: File object is null or not a File instance`);
// //   }

// //   const bucketName = import.meta.env.VITE_AWS_S3_BUCKET_NAME;
// //   const region = import.meta.env.VITE_AWS_REGION;

// //   if (!bucketName || !region) {
// //     throw new Error("Missing S3 configuration: VITE_AWS_S3_BUCKET_NAME or VITE_AWS_REGION");
// //   }

// //   // Create a unique file key with staffId, docType, and timestamp
// //   const fileKey = `${staffId}/${docType}_${Date.now()}_${file.name.replace(/\s+/g, "_")}`;

// //   // Set up the S3 upload parameters
// //   const params = {
// //     Bucket: bucketName,
// //     Key: fileKey,
// //     Body: file,
// //     ContentType: file.type,
// //     ACL: "public-read", // Ensure bucket policy allows this
// //   };

// //   try {
// //     if (!Upload) {
// //       throw new Error("Upload class is undefined. Check @aws-sdk/lib-storage import.");
// //     }

// //     // Instantiate Upload class correctly
// //     const upload = new Upload({
// //       client: s3Client,
// //       params,
// //       queueSize: 4, // Parallel uploads
// //       partSize: 5 * 1024 * 1024, // 5MB part size for multipart upload
// //       leavePartsOnError: false, // Clean up parts on error
// //     });

// //     console.log(`Uploading ${docType}:`, {
// //       name: file.name,
// //       size: file.size,
// //       type: file.type,
// //       key: fileKey,
// //     });

// //     // Track upload progress
// //     upload.on("httpUploadProgress", (progress) => {
// //       const percent = Math.round((progress.loaded / progress.total) * 100);
// //       console.log(`Upload progress for ${docType}: ${percent}%`);
// //       setUploadProgress((prev) => ({ ...prev, [docType]: percent }));
// //     });

// //     // Await upload completion
// //     await upload.done();

// //     // Return the public URL of the uploaded file
// //     const url = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
// //     console.log(`Upload successful for ${docType}: ${url}`);
// //     return url;
// //   } catch (err) {
// //     console.error(`Error uploading ${docType}:`, err);
// //     throw new Error(`Failed to upload ${docType}: ${err.message}`);
// //   }
// // };

// // /**
// //  * Gets a signed URL for a private S3 object
// //  * @param {string} key - The key of the object in S3
// //  * @param {number} expiresIn - Expiration time in seconds (default: 3600)
// //  * @returns {Promise<string>} - Signed URL
// //  */
// // export const getSignedUrl = async (key, expiresIn = 3600) => {
// //   const bucketName = import.meta.env.VITE_AWS_S3_BUCKET_NAME;

// //   if (!bucketName) {
// //     throw new Error("Missing S3 bucket name configuration");
// //   }

// //   const command = new GetObjectCommand({
// //     Bucket: bucketName,
// //     Key: key,
// //   });

// //   try {
// //     const url = await getSignedUrl(s3Client, command, { expiresIn });
// //     return url;
// //   } catch (err) {
// //     console.error(`Error generating signed URL for ${key}:`, err);
// //     throw new Error(`Failed to generate signed URL: ${err.message}`);
// //   }
// // };

// import { Upload } from "@aws-sdk/lib-storage";
// import { GetObjectCommand } from "@aws-sdk/client-s3";
// import { s3Client } from "./aws-config"; // Verify this path
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// /**
//  * Uploads a file to S3 bucket with progress tracking
//  * @param {File} file - The file to upload
//  * @param {string} docType - Document type (e.g., 'aadharCard')
//  * @param {string} staffId - Staff ID for organizing files
//  * @param {Function} setUploadProgress - Function to update upload progress
//  * @returns {Promise<string>} - URL of the uploaded file
//  */
// export const uploadFileToS3 = async (file, docType, staffId, setUploadProgress = () => {}) => {
//   if (!file || !(file instanceof File)) {
//     throw new Error(`Invalid file for ${docType}: File object is null or not a File instance`);
//   }

//   if (!s3Client) {
//     throw new Error("s3Client is undefined. Check aws-config.js and its import.");
//   }

//   const bucketName = import.meta.env.VITE_AWS_S3_BUCKET_NAME;
//   const region = import.meta.env.VITE_AWS_REGION;

//   if (!bucketName || !region) {
//     throw new Error("Missing S3 configuration: VITE_AWS_S3_BUCKET_NAME or VITE_AWS_REGION");
//   }

//   // Create a unique file key with staffId, docType, and timestamp
//   const fileKey = `${staffId}/${docType}_${Date.now()}_${file.name.replace(/\s+/g, "_")}`;

//   // Set up the S3 upload parameters
//   const params = {
//     Bucket: bucketName,
//     Key: fileKey,
//     Body: file,
//     ContentType: file.type,
//     ACL: "public-read", // Ensure bucket policy allows this
//   };

//   try {
//     if (!Upload) {
//       throw new Error("Upload class is undefined. Check @aws-sdk/lib-storage import.");
//     }

//     // Instantiate Upload class correctly
//     const upload = new Upload({
//       client: s3Client,
//       params,
//       queueSize: 4, // Parallel uploads
//       partSize: 5 * 1024 * 1024, // 5MB part size for multipart upload
//       leavePartsOnError: false, // Clean up parts on error
//     });

//     console.log(`Uploading ${docType}:`, {
//       name: file.name,
//       size: file.size,
//       type: file.type,
//       key: fileKey,
//     });

//     // Track upload progress
//     upload.on("httpUploadProgress", (progress) => {
//       const percent = Math.round((progress.loaded / progress.total) * 100);
//       console.log(`Upload progress for ${docType}: ${percent}%`);
//       setUploadProgress((prev) => ({ ...prev, [docType]: percent }));
//     });

//     // Await upload completion
//     await upload.done();

//     // Return the public URL of the uploaded file
//     const url = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
//     console.log(`Upload successful for ${docType}: ${url}`);
//     return url;
//   } catch (err) {
//     console.error(`Error uploading ${docType}:`, err);
//     throw new Error(`Failed to upload ${docType}: ${err.message}`);
//   }
// };

// /**
//  * Gets a signed URL for a private S3 object
//  * @param {string} key - The key of the object in S3
//  * @param {number} expiresIn - Expiration time in seconds (default: 3600)
//  * @returns {Promise<string>} - Signed URL
//  */
// export const getSignedUrl = async (key, expiresIn = 3600) => {
//   const bucketName = import.meta.env.VITE_AWS_S3_BUCKET_NAME;

//   if (!bucketName) {
//     throw new Error("Missing S3 bucket name configuration");
//   }

//   if (!s3Client) {
//     throw new Error("s3Client is undefined. Check aws-config.js and its import.");
//   }

//   const command = new GetObjectCommand({
//     Bucket: bucketName,
//     Key: key,
//   });

//   try {
//     const url = await getSignedUrl(s3Client, command, { expiresIn });
//     return url;
//   } catch (err) {
//     console.error(`Error generating signed URL for ${key}:`, err);
//     throw new Error(`Failed to generate signed URL: ${err.message}`);
//   }
// };


import { Upload } from "@aws-sdk/lib-storage";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/aws-config"; // Updated path
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Uploads a file to S3 bucket with progress tracking
 * @param {File} file - The file to upload
 * @param {string} docType - Document type (e.g., 'aadharCard')
 * @param {string} staffId - Staff ID for organizing files
 * @param {Function} setUploadProgress - Function to update upload progress
 * @returns {Promise<string>} - URL of the uploaded file
 */
export const uploadFileToS3 = async (file, docType, staffId, setUploadProgress = () => {}) => {
  if (!file || !(file instanceof File)) {
    throw new Error(`Invalid file for ${docType}: File object is null or not a File instance`);
  }

  if (!s3Client) {
    throw new Error("s3Client is undefined. Check aws-config.js and its import.");
  }

  const bucketName = import.meta.env.VITE_AWS_S3_BUCKET_NAME;
  const region = import.meta.env.VITE_AWS_REGION;

  if (!bucketName || !region) {
    throw new Error("Missing S3 configuration: VITE_AWS_S3_BUCKET_NAME or VITE_AWS_REGION");
  }

  // Create a unique file key with staffId, docType, and timestamp
  const fileKey = `${staffId}/${docType}_${Date.now()}_${file.name.replace(/\s+/g, "_")}`;

  // Set up the S3 upload parameters
  const params = {
    Bucket: bucketName,
    Key: fileKey,
    Body: file,
    ContentType: file.type,
    ACL: "public-read", // Ensure bucket policy allows this
  };

  try {
    if (!Upload) {
      throw new Error("Upload class is undefined. Check @aws-sdk/lib-storage import.");
    }

    // Instantiate Upload class correctly
    const upload = new Upload({
      client: s3Client,
      params,
      queueSize: 4, // Parallel uploads
      partSize: 5 * 1024 * 1024, // 5MB part size for multipart upload
      leavePartsOnError: false, // Clean up parts on error
    });

    console.log(`Uploading ${docType}:`, {
      name: file.name,
      size: file.size,
      type: file.type,
      key: fileKey,
    });

    // Track upload progress
    upload.on("httpUploadProgress", (progress) => {
      const percent = Math.round((progress.loaded / progress.total) * 100);
      console.log(`Upload progress for ${docType}: ${percent}%`);
      setUploadProgress((prev) => ({ ...prev, [docType]: percent }));
    });

    // Await upload completion
    await upload.done();

    // Return the public URL of the uploaded file
    const url = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
    console.log(`Upload successful for ${docType}: ${url}`);
    return url;
  } catch (err) {
    console.error(`Error uploading ${docType}:`, err);
    throw new Error(`Failed to upload ${docType}: ${err.message}`);
  }
};

/**
 * Gets a signed URL for a private S3 object
 * @param {string} key - The key of the object in S3
 * @param {number} expiresIn - Expiration time in seconds (default: 3600)
 * @returns {Promise<string>} - Signed URL
 */
export const getSignedUrl = async (key, expiresIn = 3600) => {
  const bucketName = import.meta.env.VITE_AWS_S3_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("Missing S3 bucket name configuration");
  }

  if (!s3Client) {
    throw new Error("s3Client is undefined. Check aws-config.js and its import.");
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (err) {
    console.error(`Error generating signed URL for ${key}:`, err);
    throw new Error(`Failed to generate signed URL: ${err.message}`);
  }
};
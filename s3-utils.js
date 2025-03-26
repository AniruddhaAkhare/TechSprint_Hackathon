// import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
// import { s3Client } from "./aws-config"

// /**
//  * Uploads a file to S3 bucket
//  * @param {File} file - The file to upload
//  * @param {string} directory - Directory in the bucket (e.g., 'logos/')
//  * @returns {Promise<string>} - URL of the uploaded file
//  */
// export const uploadToS3 = async (file, directory = "") => {
//   if (!file) {
//     throw new Error("No file provided")
//   }

//   const bucketName = import.meta.env.VITE_S3_BUCKET_NAME
//   const region = import.meta.env.VITE_AWS_REGION

//   if (!bucketName || !region) {
//     throw new Error("Missing S3 configuration")
//   }

//   // Create a clean directory path
//   const dir = directory ? (directory.endsWith("/") ? directory : `${directory}/`) : ""

//   // Create a unique file key with timestamp
//   const fileKey = `${dir}${Date.now()}_${file.name.replace(/\s+/g, "_")}`

//   // Convert file to array buffer
//   const fileBuffer = await file.arrayBuffer()

//   // Set up the S3 upload parameters
//   const params = {
//     Bucket: bucketName,
//     Key: fileKey,
//     Body: new Uint8Array(fileBuffer),
//     ContentType: file.type,
//     ACL: "public-read", // Make sure your bucket policy allows this
//   }

//   // Send the upload command
//   const command = new PutObjectCommand(params)
//   await s3Client.send(command)

//   // Return the public URL of the uploaded file
//   return `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`
// }

// /**
//  * Gets a signed URL for a private S3 object (if needed)
//  * @param {string} key - The key of the object in S3
//  * @param {number} expiresIn - Expiration time in seconds
//  * @returns {Promise<string>} - Signed URL
//  */
// export const getSignedUrl = async (key, expiresIn = 3600) => {
//   const bucketName = import.meta.env.VITE_S3_BUCKET_NAME

//   const command = new GetObjectCommand({
//     Bucket: bucketName,
//     Key: key,
//   })

//   const url = await getSignedUrl(s3Client, command, { expiresIn })
//   return url
// }

import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { s3Client } from "./aws-config"

/**
 * Uploads a file to S3 bucket
 * @param {File} file - The file to upload
 * @param {string} directory - Directory in the bucket (e.g., 'logos/')
 * @returns {Promise<string>} - URL of the uploaded file
 */
export const uploadToS3 = async (file, directory = "") => {
  if (!file) {
    throw new Error("No file provided")
  }

  const bucketName = import.meta.env.VITE_S3_BUCKET_NAME
  const region = import.meta.env.VITE_AWS_REGION

  if (!bucketName || !region) {
    throw new Error("Missing S3 configuration")
  }

  // Create a clean directory path
  const dir = directory ? (directory.endsWith("/") ? directory : `${directory}/`) : ""

  // Create a unique file key with timestamp
  const fileKey = `${dir}${Date.now()}_${file.name.replace(/\s+/g, "_")}`

  // Convert file to array buffer
  const fileBuffer = await file.arrayBuffer()

  // Set up the S3 upload parameters
  const params = {
    Bucket: bucketName,
    Key: fileKey,
    Body: new Uint8Array(fileBuffer),
    ContentType: file.type,
    ACL: "public-read", // Make sure your bucket policy allows this
  }

  // Send the upload command
  const command = new PutObjectCommand(params)
  await s3Client.send(command)

  // Return the public URL of the uploaded file
  return `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`
}

/**
 * Gets a signed URL for a private S3 object (if needed)
 * @param {string} key - The key of the object in S3
 * @param {number} expiresIn - Expiration time in seconds
 * @returns {Promise<string>} - Signed URL
 */
export const getSignedUrl = async (key, expiresIn = 3600) => {
  const bucketName = import.meta.env.VITE_S3_BUCKET_NAME

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  })

  const url = await getSignedUrl(s3Client, command, { expiresIn })
  return url
}


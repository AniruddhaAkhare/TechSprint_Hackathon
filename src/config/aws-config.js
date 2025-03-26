// // // // // // // src/config/aws-config.js
// // // // // // // import AWS from 'aws-sdk';
// // // // // // import {Buffer} from 'buffer';
// // // // // // import { S3Client } from '@aws-sdk/client-s3';

// // // // // // // Configure the S3 client
// // // // // // const s3Client = new S3Client({
// // // // // //   region: process.env.REACT_APP_AWS_REGION,
// // // // // //   credentials: {
// // // // // //     accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
// // // // // //     secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
// // // // // //   },
// // // // // // });

// // // // // // export { s3Client };

// // // // // // window.Buffer = window.Buffer || Buffer;

// // // // // // // Add polyfill for global
// // // // // // if (typeof global === 'undefined') {
// // // // // //   window.global = window;
// // // // // // }


// // // // // // AWS.config.update({
// // // // // //   accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
// // // // // //   secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
// // // // // //   region: process.env.REACT_APP_AWS_REGION || 'us-east-1', // Replace with your region
// // // // // // });



// // // // // // // polyfills.js
// // // // // // if (typeof global === 'undefined') {
// // // // // //   window.global = window;
// // // // // // }

// // // // // // export default s3 = new AWS.S3();
// // // // // // // export default s3;


// // // // // // Import dependencies
// // // // // import { Buffer } from 'buffer';
// // // // // import { S3Client } from '@aws-sdk/client-s3';

// // // // // console.log("AWS Region:", import.meta.env.VITE_AWS_REGION);
// // // // // console.log("S3 Bucket Name:", import.meta.env.VITE_S3_BUCKET_NAME);
// // // // // console.log("Access Key ID:", import.meta.env.VITE_AWS_ACCESS_KEY_ID ? "Set" : "Not Set");
// // // // // console.log("Secret Access Key:", import.meta.env.VITE_AWS_SECRET_ACCESS_KEY ? "Set" : "Not Set");

// // // // // // Configure the S3 client
// // // // // const s3Client = new S3Client({
// // // // //   region: import.meta.env.VITE_AWS_REGION || 'ap-south-1',
// // // // //   credentials: {
// // // // //     accessKeyId: import.meta.env.REACT_APP__AWS_ACCESS_KEY_ID,
// // // // //     secretAccessKey: import.meta.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
// // // // //   },
// // // // // });

// // // // // export { s3Client };

// // // // // // Ensure Buffer is available globally
// // // // // window.Buffer = window.Buffer || Buffer;

// // // // // // Polyfill global object
// // // // // if (typeof global === 'undefined') {
// // // // //   window.global = window;
// // // // // }


// // // // // import { S3Client } from '@aws-sdk/client-s3';

// // // // // export const s3Client = new S3Client({
// // // // //   region: process.env.REACT_APP_AWS_REGION,
// // // // //   credentials: {
// // // // //     accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
// // // // //     secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
// // // // //   },
// // // // // });
// // // // // console.log('AWS Region:', process.env.REACT_APP_AWS_REGION);
// // // // // console.log('Bucket Name:', process.env.REACT_APP_S3_BUCKET_NAME);
// // // // // console.log('Access Key ID:', process.env.REACT_APP_AWS_ACCESS_KEY_ID);

// // // // // import { S3Client } from '@aws-sdk/client-s3';

// // // // // export const s3Client = new S3Client({
// // // // //   region: process.env.REACT_APP_AWS_REGION,
// // // // //   credentials: {
// // // // //     accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
// // // // //     secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
// // // // //   },
// // // // // });
// // // // // console.log('AWS Region:', process.env.REACT_APP_AWS_REGION);
// // // // // console.log('Bucket Name:', process.env.REACT_APP_S3_BUCKET_NAME);
// // // // // console.log('Access Key ID:', process.env.REACT_APP_AWS_ACCESS_KEY_ID);


// // // // // import { S3Client } from '@aws-sdk/client-s3';

// // // // // export const s3Client = new S3Client({
// // // // //   region: import.meta.env.VITE_AWS_REGION,
// // // // //   credentials: {
// // // // //     accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
// // // // //     secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
// // // // //   },
// // // // // });
// // // // // console.log('AWS Region:', import.meta.env.VITE_AWS_REGION);
// // // // // console.log('Bucket Name:', import.meta.env.VITE_S3_BUCKET_NAME);
// // // // // console.log('Access Key ID:', import.meta.env.VITE_AWS_ACCESS_KEY_ID);

// // // // // import { S3Client } from '@aws-sdk/client-s3';

// // // // // export const s3Client = new S3Client({
// // // // //   region: process.env.REACT_APP_AWS_REGION,
// // // // //   credentials: {
// // // // //     accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
// // // // //     secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
// // // // //   },
// // // // // });
// // // // // console.log('AWS Region:', process.env.REACT_APP_AWS_REGION);
// // // // // console.log('Bucket Name:', process.env.REACT_APP_S3_BUCKET_NAME);
// // // // // console.log('Access Key ID:', process.env.REACT_APP_AWS_ACCESS_KEY_ID);

// // // // // import { S3Client } from '@aws-sdk/client-s3';

// // // // // const s3Client = new S3Client({
// // // // //   region: process.env.REACT_APP_AWS_REGION,
// // // // //   credentials: {
// // // // //     accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
// // // // //     secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
// // // // //   },
// // // // // });

// // // // // export { s3Client };

// // // // // import { S3Client } from '@aws-sdk/client-s3';

// // // // // const region = import.meta.env.VITE_AWS_REGION;
// // // // // const credentials = {
// // // // //   accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
// // // // //   secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
// // // // // };

// // // // // export const s3Client = new S3Client({
// // // // //   region,
// // // // //   credentials,
// // // // // });


// // // // import { S3Client } from '@aws-sdk/client-s3';

// // // // export const s3Client = new S3Client({
// // // //   region: import.meta.env.VITE_AWS_REGION,
// // // //   credentials: {
// // // //     accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
// // // //     secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
// // // //   },
// // // // });
// // // // console.log('AWS Region:', import.meta.env.VITE_AWS_REGION);
// // // // console.log('Bucket Name:', import.meta.env.VITE_S3_BUCKET_NAME);
// // // // console.log('Access Key ID:', import.meta.env.VITE_AWS_ACCESS_KEY_ID);

// // // import { S3Client } from "@aws-sdk/client-s3"

// // // // Create and export the S3 client
// // // export const s3Client = new S3Client({
// // //   region: import.meta.env.VITE_AWS_REGION,
// // //   credentials: {
// // //     accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
// // //     secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
// // //   },
// // // })



// // import { S3Client } from "@aws-sdk/client-s3"

// // // Create and export the S3 client
// // export const s3Client = new S3Client({
// //   region: import.meta.env.VITE_AWS_REGION,
// //   credentials: {
// //     accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
// //     secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
// //   },
// //   // Add these options to help with CORS and fetch issues
// //   forcePathStyle: true, // Needed for some S3-compatible storage
// //   endpoint: undefined, // Let the SDK determine the endpoint based on region
// //   maxAttempts: 3, // Retry failed requests
// // })

// // // Add a debug function to check if environment variables are loaded
// // export const debugS3Config = () => {
// //   console.log("S3 Config Debug:")
// //   console.log("Region:", import.meta.env.VITE_AWS_REGION ? "✓ Set" : "✗ Missing")
// //   console.log("Access Key:", import.meta.env.VITE_AWS_ACCESS_KEY_ID ? "✓ Set" : "✗ Missing")
// //   console.log(
// //     "Secret Key:",
// //     import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
// //       ? "✓ Set (length: " + (import.meta.env.VITE_AWS_SECRET_ACCESS_KEY?.length || 0) + ")"
// //       : "✗ Missing",
// //   )
// //   console.log("Bucket Name:", import.meta.env.VITE_S3_BUCKET_NAME ? "✓ Set" : "✗ Missing")
// // }


// import { S3Client } from "@aws-sdk/client-s3"

// // Create and export the S3 client
// export const s3Client = new S3Client({
//   region: import.meta.env.VITE_AWS_REGION,
//   credentials: {
//     accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
//     secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
//   },
//   // Add these options to help with CORS and fetch issues
//   forcePathStyle: true, // Needed for some S3-compatible storage
//   endpoint: undefined, // Let the SDK determine the endpoint based on region
//   maxAttempts: 3, // Retry failed requests
// })

// // Add a debug function to check if environment variables are loaded
// export const debugS3Config = () => {
//   console.log("S3 Config Debug:")
//   console.log("Region:", import.meta.env.VITE_AWS_REGION ? "✓ Set" : "✗ Missing")
//   console.log("Access Key:", import.meta.env.VITE_AWS_ACCESS_KEY_ID ? "✓ Set" : "✗ Missing")
//   console.log(
//     "Secret Key:",
//     import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
//       ? "✓ Set (length: " + (import.meta.env.VITE_AWS_SECRET_ACCESS_KEY?.length || 0) + ")"
//       : "✗ Missing",
//   )
//   console.log("Bucket Name:", import.meta.env.VITE_S3_BUCKET_NAME ? "✓ Set" : "✗ Missing")
// }

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
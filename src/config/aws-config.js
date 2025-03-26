// // // src/config/aws-config.js
// // // import AWS from 'aws-sdk';
// // import {Buffer} from 'buffer';
// // import { S3Client } from '@aws-sdk/client-s3';

// // // Configure the S3 client
// // const s3Client = new S3Client({
// //   region: process.env.REACT_APP_AWS_REGION,
// //   credentials: {
// //     accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
// //     secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
// //   },
// // });

// // export { s3Client };

// // window.Buffer = window.Buffer || Buffer;

// // // Add polyfill for global
// // if (typeof global === 'undefined') {
// //   window.global = window;
// // }


// // AWS.config.update({
// //   accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
// //   secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
// //   region: process.env.REACT_APP_AWS_REGION || 'us-east-1', // Replace with your region
// // });



// // // polyfills.js
// // if (typeof global === 'undefined') {
// //   window.global = window;
// // }

// // export default s3 = new AWS.S3();
// // // export default s3;


// // Import dependencies
// import { Buffer } from 'buffer';
// import { S3Client } from '@aws-sdk/client-s3';

// console.log("AWS Region:", import.meta.env.VITE_AWS_REGION);
// console.log("S3 Bucket Name:", import.meta.env.VITE_S3_BUCKET_NAME);
// console.log("Access Key ID:", import.meta.env.VITE_AWS_ACCESS_KEY_ID ? "Set" : "Not Set");
// console.log("Secret Access Key:", import.meta.env.VITE_AWS_SECRET_ACCESS_KEY ? "Set" : "Not Set");

// // Configure the S3 client
// const s3Client = new S3Client({
//   region: import.meta.env.VITE_AWS_REGION || 'ap-south-1',
//   credentials: {
//     accessKeyId: import.meta.env.REACT_APP__AWS_ACCESS_KEY_ID,
//     secretAccessKey: import.meta.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
//   },
// });

// export { s3Client };

// // Ensure Buffer is available globally
// window.Buffer = window.Buffer || Buffer;

// // Polyfill global object
// if (typeof global === 'undefined') {
//   window.global = window;
// }


import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
  region: process.env.REACT_APP_AWS_REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  },
});
// // import { httpsCallable, connectFunctionsEmulator } from "firebase/functions";
// // import { functions } from "../config/firebase.js";

// // // Connect to Firebase Functions emulator for local testing
// // connectFunctionsEmulator(functions, "localhost", 5001);

// // /**
// //  * Sends a welcome email to a newly added student using Zoho ZeptoMail via Firebase Cloud Function.
// //  * @param {string} toEmail - The recipient's email address.
// //  * @param {string} fullName - The student's full name.
// //  * @param {string} courseName - The name of the enrolled course.
// //  * @returns {Promise<void>}
// //  */
// // const sendWelcomeEmail = async (toEmail, fullName) => {
// //   console.log("sendWelcomeEmail called with:", { toEmail, fullName}); // Debug log
// //   const sendEmailFunction = httpsCallable(functions, "sendEmail");
// //   try {
// //     console.log(`Attempting to send email to ${toEmail}`); // Debug log
// //     const result = await sendEmailFunction({
// //       toEmail,
// //       subject: `Welcome to Shiksha Saarathi, ${fullName}!`,
// //       htmlContent: `
// //         <h1>Welcome, ${fullName}!</h1>
// //         <p>Thank you for enrolling at Shiksha Saarathi.</p>
// //         <p>We are excited to have you on board. Get ready to embark on an amazing learning journey!</p>
// //         <p>Visit <a href="https://shikshasaarathi.com">shikshasaarathi.com</a> to access your course materials.</p>
// //         <p>Best regards,<br/>The Shiksha Saarathi Team</p>
// //       `,
// //     });
// //     console.log("Email sent successfully:", result.data); // Debug log
// //   } catch (error) {
// //     console.error("Error sending welcome email:", {
// //       message: error.message,
// //       code: error.code,
// //       details: error.details || error,
// //       stack: error.stack,
// //     }); // Enhanced error logging
// //     throw new Error(`Failed to send welcome email: ${error.message} (Code: ${error.code || 'unknown'})`);
// //   }
// // };

// // export default sendWelcomeEmail;

// import { httpsCallable, connectFunctionsEmulator } from "firebase/functions";
// import { functions } from "../config/firebase";

// // Connect to Firebase Functions emulator for local testing
// connectFunctionsEmulator(functions, "localhost", 5001);

// /**
//  * Sends a welcome email to a newly added student using Zoho ZeptoMail via Firebase Cloud Function.
//  * @param {string} toEmail - The recipient's email address.
//  * @param {string} fullName - The student's full name.
//  * @param {string} courseName - The name of the enrolled course.
//  * @returns {Promise<void>}
//  */
// const emailService = async (toEmail, fullName) => {
//   console.log("sendWelcomeEmail called with:", { toEmail, fullName});
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(toEmail)) {
//     throw new Error("Invalid email format");
//   }
//   const sendEmailFunction = httpsCallable(functions, "sendEmail");
//   try {
//     console.log(`Attempting to send email to ${toEmail}`);
//     const result = await sendEmailFunction({
//       toEmail,
//       subject: `Welcome to Shiksha Saarathi, ${fullName}!`,
//       htmlContent: `
//         <h1>Welcome, ${fullName}!</h1>
//         <p>Thank you for enrolling at Shiksha Saarathi.</p>
//         <p>We are excited to have you on board. Get ready to embark on an amazing learning journey!</p>
//         <p>Visit <a href="https://shikshasaarathi.com">shikshasaarathi.com</a> to access your course materials.</p>
//         <p>Best regards,<br/>The Shiksha Saarathi Team</p>
//       `,
//     });
//     console.log("Email sent successfully:", result.data);
//   } catch (error) {
//     console.error("Error sending welcome email:", {
//       message: error.message,
//       code: error.code,
//       details: error.details || error,
//       stack: error.stack,
//     });
//     throw new Error(`Failed to send welcome email: ${error.message} (Code: ${error.code || 'unknown'})`);
//   }
// };

// export default emailService;



import { httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import { functions } from "../config/firebase.js";

// Connect to Firebase Functions emulator for local testing
connectFunctionsEmulator(functions, "localhost", 5001);

/**
 * Sends a welcome email to a newly added student using Zoho ZeptoMail via Firebase Cloud Function.
 * @param {string} toEmail - The recipient's email address.
 * @param {string} fullName - The student's full name.
 * @param {string} courseName - The name of the enrolled course.
 * @returns {Promise<void>}
 */
const sendWelcomeEmail = async (toEmail, fullName) => {
  console.log("sendWelcomeEmail called with:", { toEmail, fullName});
  const sendEmailFunction = httpsCallable(functions, "sendEmail");
  try {
    console.log(`Attempting to send email to ${toEmail}`);
    const result = await sendEmailFunction({
      toEmail,
      subject: `Welcome to Shiksha Saarathi, ${fullName}!`,
      htmlContent: `
        <h1>Welcome, ${fullName}!</h1>
        <p>Thank you for enrolling at Shiksha Saarathi.</p>
        <p>We are excited to have you on board. Get ready to embark on an amazing learning journey!</p>
        <p>Visit <a href="https://shikshasaarathi.com">shikshasaarathi.com</a> to access your course materials.</p>
        <p>Best regards,<br/>The Shiksha Saarathi Team</p>
      `,
    });
    console.log("Email sent successfully:", result.data); 
  } catch (error) {
    console.error("Error sending welcome email:", {
      message: error.message,
      code: error.code,
      details: error.details || error,
      stack: error.stack,
    }); 
    throw new Error(`Failed to send welcome email: ${error.message} (Code: ${error.code || 'unknown'})`);
  }
};

export default sendWelcomeEmail;
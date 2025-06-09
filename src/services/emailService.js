import { httpsCallable } from "firebase/functions";
import { functions } from "../config/firebase";

/**
 * Sends a welcome email to a newly added student using Zoho ZeptoMail via Firebase Cloud Function.
 * @param {string} toEmail - The recipient's email address.
 * @param {string} fullName - The student's full name.
 * @param {string} courseName - The name of the enrolled course.
 * @returns {Promise<void>}
 */
export const sendWelcomeEmail = async (toEmail, fullName, courseName) => {
  const sendEmailFunction = httpsCallable(functions, "sendEmail");
  try {
    console.log(`Attempting to send email to ${toEmail}`); // Debug log
    const result = await sendEmailFunction({
      toEmail,
      subject: `Welcome to Shiksha Saarathi, ${fullName}!`,
      htmlContent: `
        <h1>Welcome, ${fullName}!</h1>
        <p>Thank you for enrolling in <strong>${courseName}</strong> at Shiksha Saarathi.</p>
        <p>We are excited to have you on board. Get ready to embark on an amazing learning journey!</p>
        <p>Visit <a href="https://shikshasaarathi.com">shikshasaarathi.com</a> to access your course materials.</p>
        <p>Best regards,<br/>The Shiksha Saarathi Team</p>
      `,
    });
    console.log("Email sent successfully:", result.data); // Debug log
  } catch (error) {
    console.error("Error sending welcome email:", {
      message: error.message,
      code: error.code,
      details: error.details || error,
    }); // Enhanced error logging
    throw new Error("Failed to send welcome email");
  }
};

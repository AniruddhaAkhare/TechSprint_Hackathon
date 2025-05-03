import { httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import { functions } from "../config/firebase.js";

// Connect to Firebase Functions emulator for local testing
connectFunctionsEmulator(functions, "localhost", 5001);

/**
 * Sends a welcome email to a newly added student with course and fee details using Zoho ZeptoMail via Firebase Cloud Function.
 * @param {string} toEmail - The recipient's email address.
 * @param {string} fullName - The student's full name.
 * @param {Object} course - The enrolled course details (e.g., { name: string }).
 * @param {Object} feeDetails - The fee details (e.g., { feeTemplate: string, totalFees: number, discountType: string, discountValue: string, feeAfterDiscount: number, discountReason: string }).
 * @returns {Promise<void>}
 */
const EnrollmentEmail = async (toEmail, fullName, course, feeDetails) => {
  console.log("EnrollmentEmail called with:", { toEmail, fullName, course, feeDetails });
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(toEmail)) {
    throw new Error("Invalid email format");
  }
  if (!course?.name) {
    throw new Error("Course name is required");
  }
  const sendEmailFunction = httpsCallable(functions, "sendEmail");
  try {
    console.log(`Attempting to send email to ${toEmail}`);
    const emailContent = `
      <h1>Welcome, ${fullName}!</h1>
      <p>Thank you for enrolling in <strong>${course.name}</strong> at Shiksha Saarathi.</p>
      <h2>Course and Fee Details</h2>
      <ul>
        <li><strong>Course:</strong> ${course.name}</li>
        <li><strong>Fee Template:</strong> ${feeDetails.feeTemplate || "N/A"}</li>
        <li><strong>Total Fees:</strong> ₹${feeDetails.totalFees || 0}</li>
        ${
          feeDetails.discountValue
            ? `<li><strong>Discount:</strong> ${
                feeDetails.discountType === "percentage"
                  ? `${feeDetails.discountValue}%`
                  : `₹${feeDetails.discountValue}`
              }${feeDetails.discountReason ? ` (${feeDetails.discountReason})` : ""}</li>`
            : ""
        }
        <li><strong>Fee After Discount:</strong> ₹${feeDetails.feeAfterDiscount || feeDetails.totalFees || 0}</li>
      </ul>
      <p>We are excited to have you on board. Get ready to embark on an amazing learning journey!</p>
      <p>Visit <a href="https://shikshasaarathi.com">shikshasaarathi.com</a> to access your course materials.</p>
      <p>Best regards,<br/>The Shiksha Saarathi Team</p>
    `;
    const result = await sendEmailFunction({
      toEmail,
      subject: `Welcome to Shiksha Saarathi, ${fullName}!`,
      htmlContent: emailContent,
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

export default EnrollmentEmail;
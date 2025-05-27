import { functions } from "../config/firebase";
import { httpsCallable } from "firebase/functions";
/**
 * Sends a batch enrollment notification email to a student.
 * @param {string} toEmail - The student's email address.
 * @param {string} fullName - The student's full name.
 * @param {Object} batchDetails - Batch details.
 * @returns {Promise<{success: boolean, messageId?: string}>}
 */
const sendBatchEnrollmentEmail = async (toEmail, fullName, batchDetails) => {
  try {
    // Basic validation
    if (!toEmail?.trim()) {
      throw new Error("Recipient email is required");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail)) {
      throw new Error("Invalid email address format");
    }

    if (!batchDetails?.batchName) {
      throw new Error("Batch name is required");
    }

    // Construct email content
    const subject = `Enrolled in Batch: ${batchDetails.batchName}`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c3e50;">Hello, ${fullName}!</h1>
        <p>You have been successfully enrolled in a new batch at Shiksha Saarathi.</p>
        
        <h2 style="color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 5px;">
          Batch Details
        </h2>
        
        <ul style="line-height: 1.6;">
          <li><strong>Batch Name:</strong> ${batchDetails.batchName}</li>
          ${batchDetails.startDate ? `<li><strong>Start Date:</strong> ${batchDetails.startDate}</li>` : ''}
          ${batchDetails.schedule ? `<li><strong>Schedule:</strong> ${batchDetails.schedule}</li>` : ''}
          ${batchDetails.instructor ? `<li><strong>Instructor:</strong> ${batchDetails.instructor}</li>` : ''}
        </ul>
        
        <p style="margin-top: 20px;">
          Please visit 
          <a href="https://shikshasaarathi.com" style="color: #3498db;">
            shikshasaarathi.com
          </a> 
          for more details about your batch and upcoming sessions.
        </p>
        
        <div style="margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
          <p style="margin: 0; font-weight: bold;">Next Steps:</p>
          <ol style="margin: 10px 0 0 20px; padding-left: 15px;">
            <li>Check your dashboard for session details</li>
            <li>Join the batch orientation (if applicable)</li>
            <li>Review any pre-course materials</li>
          </ol>
        </div>
        
        <p style="margin-top: 20px; color: #7f8c8d;">
          Best regards,<br/>
          The Shiksha Saarathi Team
        </p>
      </div>
    `;

    // Send using your working email function
    const sendEmailFunction = httpsCallable(functions, "sendEmail");

    const result = await sendEmailFunction({
      toEmail: toEmail.trim(),
      subject,
      htmlContent,
      fullName: fullName?.trim()
    });

    return {
      success: true,
      messageId: result.messageId
    };

  } catch (error) {
    // console.error("Failed to send batch enrollment email:", {
    //   toEmail,
    //   fullName,
    //   error: error.message
    // });
    
    throw new Error(
      error.message || 'Failed to send batch enrollment notification. Please try again later.'
    );
  }
};

export default sendBatchEnrollmentEmail;
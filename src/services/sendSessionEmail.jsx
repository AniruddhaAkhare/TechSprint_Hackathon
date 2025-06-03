import { functions } from "../config/firebase";
import { httpsCallable } from "firebase/functions";
/**
 * Sends a session notification email to a student.
 * @param {string} toEmail - The student's email address.
 * @param {string} fullName - The student's full name.
 * @param {Object} sessionDetails - Session details.
 * @returns {Promise<{success: boolean, messageId?: string}>}
 */
const sendSessionEmail = async (toEmail, fullName, sessionDetails) => {
  try {
    // Basic validation
    if (!toEmail?.trim()) {
      throw new Error("Recipient email is required");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail)) {
      throw new Error("Invalid email address format");
    }

    if (!sessionDetails?.name) {
      throw new Error("Session name is required");
    }

    // Construct email content
    const subject = `New Session Scheduled: ${sessionDetails.name}`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c3e50;">Hello, ${fullName}!</h1>
        <p>You have been enrolled in a new session at Shiksha Saarathi.</p>
        
        <h2 style="color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 5px;">
          Session Details
        </h2>
        
        <ul style="line-height: 1.6;">
          <li><strong>Session Name:</strong> ${sessionDetails.name}</li>
          <li><strong>Date:</strong> ${sessionDetails.date || 'To be announced'}</li>
          <li><strong>Time:</strong> ${sessionDetails.startTime || ''} ${sessionDetails.endTime ? `to ${sessionDetails.endTime}` : ''}</li>
          <li><strong>Mode:</strong> ${sessionDetails.sessionMode || 'N/A'}</li>
          ${
            sessionDetails.sessionMode === "Online" && sessionDetails.sessionLink
              ? `<li><strong>Join Session:</strong> <a href="${sessionDetails.sessionLink}" style="color: #3498db;">Click here to join</a></li>
                 ${sessionDetails.meetingPlatform ? `<li><strong>Platform:</strong> ${sessionDetails.meetingPlatform}</li>` : ''}`
              : sessionDetails.venue
                ? `<li><strong>Venue:</strong> ${sessionDetails.venue}</li>`
                : ''
          }
        </ul>
        
        <p style="margin-top: 20px;">
          Please ensure you attend the session on time. 
          <a href="https://shikshasaarathi.com" style="color: #3498db;">Visit our website</a> for more details.
        </p>
        
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
    //console.error("Failed to send session email:", {
      toEmail,
      fullName,
      error: error.message
    });
    
    throw new Error(
      error.message || 'Failed to send session notification. Please try again later.'
    );
  }
};

export default sendSessionEmail;
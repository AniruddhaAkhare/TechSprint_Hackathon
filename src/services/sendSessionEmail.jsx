/**
 * Sends a session notification email to a student.
 * @param {string} toEmail - The student's email address.
 * @param {string} fullName - The student's full name.
 * @param {Object} sessionDetails - Session details (e.g., { name, date, startTime, endTime, sessionMode, sessionLink, venue }).
 * @returns {Promise<void>}
 */
const sendSessionEmail = async (toEmail, fullName, sessionDetails) => {
    const content = {
      subject: `New Session Scheduled: ${sessionDetails.name}`,
      htmlContent: `
        <h1>Hello, ${fullName}!</h1>
        <p>You have been enrolled in a new session at Shiksha Saarathi.</p>
        <h2>Session Details</h2>
        <ul>
          <li><strong>Session Name:</strong> ${sessionDetails.name}</li>
          <li><strong>Date:</strong> ${sessionDetails.date}</li>
          <li><strong>Start Time:</strong> ${sessionDetails.startTime}</li>
          <li><strong>End Time:</strong> ${sessionDetails.endTime}</li>
          <li><strong>Mode:</strong> ${sessionDetails.sessionMode}</li>
          ${
            sessionDetails.sessionMode === "Online"
              ? `<li><strong>Session Link:</strong> <a href="${sessionDetails.sessionLink}">${sessionDetails.sessionLink}</a></li>
                 <li><strong>Meeting Platform:</strong> ${sessionDetails.meetingPlatform || "N/A"}</li>`
              : `<li><strong>Venue:</strong> ${sessionDetails.venue}</li>`
          }
        </ul>
        <p>Please ensure you attend the session on time. Visit <a href="https://shikshasaarathi.com">shikshasaarathi.com</a> for more details.</p>
        <p>Best regards,<br/>The Shiksha Saarathi Team</p>
      `,
    };
    await sendEmail(toEmail, fullName, content);
  };
  
  export default sendSessionEmail;
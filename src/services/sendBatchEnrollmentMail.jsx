/**
 * Sends a batch enrollment email to a student.
 * @param {string} toEmail - The student's email address.
 * @param {string} fullName - The student's full name.
 * @param {Object} batchDetails - Batch details (e.g., { batchName }).
 * @returns {Promise<void>}
 */
const sendBatchEnrollmentEmail = async (toEmail, fullName, batchDetails) => {
    const content = {
      subject: `Enrolled in Batch: ${batchDetails.batchName}`,
      htmlContent: `
        <h1>Hello, ${fullName}!</h1>
        <p>You have been successfully enrolled in a new batch at Shiksha Saarathi.</p>
        <h2>Batch Details</h2>
        <ul>
          <li><strong>Batch Name:</strong> ${batchDetails.batchName}</li>
        </ul>
        <p>Please visit <a href="https://shikshasaarathi.com">shikshasaarathi.com</a> for more details about your batch and upcoming sessions.</p>
        <p>Best regards,<br/>The Shiksha Saarathi Team</p>
      `,
    };
    await sendEmail(toEmail, fullName, content);
  };
  
  export default sendBatchEnrollmentEmail ;
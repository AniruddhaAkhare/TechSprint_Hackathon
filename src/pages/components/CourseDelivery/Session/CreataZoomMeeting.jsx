import axios from 'axios';

const CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
const ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID;

export const createZoomMeeting = async () => {
    try {
        const response = await axios.post(
            "https://api.zoom.us/v2/users/me/meetings",
            {
                topic: "New Session",
                type: 2, // 1=Instant, 2=Scheduled
                start_time: new Date().toISOString(),
                duration: 60, // in minutes
                timezone: "UTC",
                password: "123456",
                agenda: "Class Session",
                settings: {
                    host_video: true,
                    participant_video: true,
                    mute_upon_entry: true,
                    approval_type: 0, // 0=Auto approval
                    waiting_room: false,
                    join_before_host: true,
                },
            },
            {
                headers: {
                    "Authorization": `Bearer ${ZOOM_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Zoom Meeting Created:", response.data);
        return response.data.join_url;  // Return meeting link
    } catch (error) {
        console.error("Error creating Zoom meeting:", error.response.data);
        return null;
    }
};

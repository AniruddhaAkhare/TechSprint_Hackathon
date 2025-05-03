import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
const generateUploadUrl = httpsCallable(functions, "generateUploadUrl");

generateUploadUrl({ enquiryId: "12345", fileType: "image/jpeg" })
  .then((result) => {
    console.log(result.data); // { signedUrl, publicUrl }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
// // // ListObjects.js (example component)
// // import React, { useState, useEffect } from 'react';
// // // import s3 from './aws-config';

// // import {s3Client} from '../../config/aws-config';

// // const ListObjects = () => {
// //   const [objects, setObjects] = useState([]);

// //   useEffect(() => {
// //     const fetchObjects = async () => {
// //       const params = {
// //         Bucket: process.env.REACT_APP_S3_BUCKET_NAME, // e.g., 'my-institute-logos'
// //         Prefix: 'logos/', // List objects in the 'logos/' folder
// //       };

// //       try {
// //         const data = await s3.listObjectsV2(params).promise();
// //         setObjects(data.Contents || []);
// //       } catch (error) {
// //         //console.error('Error listing objects:', error);
// //       }
// //     };

// //     fetchObjects();
// //   }, []);

// //   return (
// //     <div>
// //       <h2>Files in S3 Bucket (logos/)</h2>
// //       <ul>
// //         {objects.map((obj) => (
// //           <li key={obj.Key}>
// //             {obj.Key} (Size: {obj.Size} bytes)
// //             <button
// //               onClick={() => {
// //                 const url = s3.getSignedUrl('getObject', {
// //                   Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
// //                   Key: obj.Key,
// //                   Expires: 60, // URL expires in 60 seconds
// //                 });
// //                 window.open(url, '_blank'); // Open the file in a new tab
// //               }}
// //             >
// //               Download
// //             </button>
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // };
// // export default ListObjects;


// import React, { useState, useEffect } from 'react';
// import { ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { s3Client } from '../../config/aws-config';

// const ListObjects = () => {
//   const [objects, setObjects] = useState([]);

//   useEffect(() => {
//     const fetchObjects = async () => {
//       const params = {
//         Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
//         Prefix: 'logos/',
//       };

//       try {
//         const command = new ListObjectsV2Command(params);
//         const data = await s3Client.send(command);
//         setObjects(data.Contents || []);
//       } catch (error) {
//         //console.error('Error listing objects:', error);
//       }
//     };

//     fetchObjects();
//   }, []);

//   const handleDownload = async (key) => {
//     try {
//       const command = new GetObjectCommand({
//         Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
//         Key: key,
//       });
      
//       const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
//       window.open(url, '_blank');
//     } catch (error) {
//       //console.error('Error generating download URL:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>Files in S3 Bucket (logos/)</h2>
//       <ul>
//         {objects.map((obj) => (
//           <li key={obj.Key}>
//             {obj.Key} (Size: {obj.Size} bytes)
//             <button onClick={() => handleDownload(obj.Key)}>
//               Download
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ListObjects;


import React, { useState, useEffect } from 'react';
import { ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '../../config/aws-config';

const ListObjects = () => {
  const [objects, setObjects] = useState([]);

  // Get bucket name from environment variables
  const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;

  useEffect(() => {
    const fetchObjects = async () => {
      if (!bucketName) {
        //console.error('S3 bucket name is not configured');
        return;
      }

      const params = {
        Bucket: bucketName,
        Prefix: 'logos/',
      };

      try {
        const command = new ListObjectsV2Command(params);
        const data = await s3Client.send(command);
        setObjects(data.Contents || []);
      } catch (error) {
        //console.error('Error listing objects:', error);
      }
    };

    fetchObjects();
  }, [bucketName]); // Add bucketName as dependency

  const handleDownload = async (key) => {
    if (!bucketName) return;

    try {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      });
      
      const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
      window.open(url, '_blank');
    } catch (error) {
      //console.error('Error generating download URL:', error);
    }
  };

  if (!bucketName) {
    return <div>Error: S3 bucket configuration missing</div>;
  }

  return (
    <div>
      <h2>Files in S3 Bucket (logos/)</h2>
      <ul>
        {objects.map((obj) => (
          <li key={obj.Key}>
            {obj.Key} (Size: {obj.Size} bytes)
            <button onClick={() => handleDownload(obj.Key)}>
              Download
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListObjects;
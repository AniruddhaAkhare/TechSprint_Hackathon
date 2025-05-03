import React from "react";
import { Typography } from "@mui/material";

const PreferredCenters = ({ centers, preferredCenters }) => {
  return (
    <div className="mb-6">
      <Typography variant="subtitle1" className="text-gray-800 font-medium mb-2">
        Preferred Learning Centers
      </Typography>
      {preferredCenters.length > 0 ? (
        <ul className="list-disc pl-5">
          {preferredCenters.map((centerId) => {
            const center = centers.find((c) => c.id === centerId);
            return (
              <li key={centerId} className="text-gray-700">
                {center ? center.name : `Unknown Center (ID: ${centerId})`}
              </li>
            );
          })}
        </ul>
      ) : (
        <Typography className="text-gray-600">
          No preferred learning centers selected.
        </Typography>
      )}
    </div>
  );
};

export default PreferredCenters;
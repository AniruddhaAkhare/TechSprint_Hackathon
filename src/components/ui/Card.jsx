import React from 'react';

export const Card = ({ children, className }) => (
  <div className={`rounded-lg border p-4 ${className}`}>{children}</div>
);

export const CardContent = ({ children }) => <div>{children}</div>;

export const CardHeader = ({ children }) => <div className="mb-4">{children}</div>;

export const CardTitle = ({ children }) => <h2 className="text-xl font-bold">{children}</h2>;

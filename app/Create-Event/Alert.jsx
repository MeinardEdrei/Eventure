import React, { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

const Alert = ({ type, message, onClose }) => {
  const alertStyles = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
  };

  const icons = {
    success: <CheckCircle className="w-6 h-6 mr-2 text-green-500" />,
    error: <XCircle className="w-6 h-6 mr-2 text-red-500" />,
    warning: <AlertTriangle className="w-6 h-6 mr-2 text-yellow-500" />,
  };

  return (
    <div
      className={`
        fixed 
        bottom-14 
        left-1/2 
        transform 
        -translate-x-1/2 
        z-50 
        px-6 
        py-4
        rounded-lg 
        border 
        flex 
        items-center 
        shadow-lg 
        transition-all 
        duration-300 
        ease-in-out 
        ${alertStyles[type]}
      `}
    >
      {icons[type]}
      <span className="font-medium mr-4">{message}</span>
      <button
        onClick={onClose}
        className="ml-auto bg-transparent hover:bg-gray-200 rounded-full p-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default Alert;

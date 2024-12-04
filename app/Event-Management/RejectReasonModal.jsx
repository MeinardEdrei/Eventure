import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const RejectReasonModal = ({ isOpen, onClose, eventData, handleReject }) => {
  const [reason, setReason] = useState("");
  const [files, setFiles] = useState([]);

  const handleSubmit = () => {
    if (reason.trim() === "") {
      alert("Please provide a reason for Rejecting the event.");
      return;
    }

    // Process rejection with reason and files
    console.log("Rejection Reason:", reason);
    handleReject(eventData.id);
    console.log("Event:", eventData);

    onClose();
  };
  // const handleFileChange = (event) => {
  //   const newFiles = Array.from(event.target.files).filter(
  //     (file) => file.type === "application/pdf"
  //   );
  //   setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  // };

  // const removeFile = (fileToRemove) => {
  //   setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  // };

  if (!isOpen) return null;

  return (
    <div className="backdrop-blur-[2px] bg-[#0000002d] fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#282828] rounded-lg shadow-xl w-full max-w-[760px] max-h-[80vh] overflow-y-auto p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-[1.7rem] text-white font-semibold">
            Reason for Rejecting the Event
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-[#ff3232]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-8">
          <label className="block text-[#c4c4c4] text-[1.1rem] font-bold mb-2">
            Event Name: {eventData?.title}
          </label>
          <textarea
            className="bg-transparent p-3 w-full outline-none border-2 border-[#8E8E8E] rounded-[6px] focus:bg-[rgba(158,158,158,0.3)] focus:border-[2px] focus:border-[#ffffffb3] placeholder:text-[#cdcdcdbb] text-white"
            rows="3"
            placeholder="Provide a detailed reason for rejecting this event..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        {/* <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Upload Supporting Documents (PDF only)
          </label>
          <input
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {files.length > 0 && (
          <div className="mb-4">
            <h3 className="font-bold mb-2">Uploaded Files:</h3>
            {files.map((file, index) => (
              <div
                key={index}
                className="flex justify-between items-center mb-1"
              >
                <span>{file.name}</span>
                <button
                  onClick={() => removeFile(file)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )} */}

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#B7B7B7] text-black rounded hover:bg-[#a2a2a2] transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectReasonModal;

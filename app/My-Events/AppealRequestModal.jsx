"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const AppealRequestModal = ({ isOpen, onClose, eventData, handleAppealRequest }) => {
  const [request, setRequest] = useState("");

  const handleSubmit = () => {
    if (request.trim() === "") {
      alert("Please provide a reason for Apealing the event.");
      return;
    }

    handleAppealRequest(eventData.id, request);

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="backdrop-blur-[2px] bg-[#0000002d] fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#282828] rounded-lg shadow-xl w-full max-w-[760px] max-h-[80vh] overflow-y-auto p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-[1.7rem] text-white font-semibold">
            Reason for Apealing the Event
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
            placeholder="Provide a detailed request for appealing this event..."
            value={request}
            onChange={(e) => setRequest(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#B7B7B7] text-black rounded hover:bg-[#a2a2a2] transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppealRequestModal

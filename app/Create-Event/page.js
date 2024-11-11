"use client";
import React, { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import "../css/Create-Event.css";

const Page = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith("image/")) {
      setSelectedFile(files[0].name);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files[0] && files[0].type.startsWith("image/")) {
      setSelectedFile(files[0].name);
    }
  };

  return (
    <div className="createEvent-mnc">
      <div className="event-content">
        <div className="text-container">
          <h1>Create a New Event</h1>
          <p>
            Create a unique and engaging event that caters to your specific
            needs.
          </p>
        </div>
        <div className="input-containers">
          <div className="event-name">
            <label>Event Name</label>
            <input type="text" />
          </div>
          <div className="description">
            <label>Description</label>
            <textarea rows="5" />
          </div>
          <div className="schedule">
            <div className="date">
              <label>Date</label>
              <div className="input-with-icon">
                <Calendar className="input-icon" />
                <input type="date" />
              </div>
            </div>
            <div className="start">
              <label>Start</label>
              <div className="input-with-icon">
                <Clock className="input-icon" />
                <input type="time" />
              </div>
            </div>
            <div className="end">
              <label>End</label>
              <div className="input-with-icon">
                <Clock className="input-icon" />
                <input type="time" />
              </div>
            </div>
          </div>
          <div className="input-image">
            <label>Choose Image</label>
            <div
              className={`dropzone ${isDragging ? "dragging" : ""}`}
              onClick={() => document.getElementById("file-input").click()}
              onDragEnter={(e) => {
                handleDrag(e);
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                handleDrag(e);
                setIsDragging(false);
              }}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-input"
                onChange={handleFileSelect}
                accept="image/*"
                hidden
              />
              <div className="dropzone-content">
                {selectedFile ? (
                  <p className="selected-file">{selectedFile}</p>
                ) : (
                  <>
                    <p>Drag and drop your image here</p>
                    <p>or</p>
                    <button type="button" className="select-button">
                      Select from computer
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="createEvent-btn">
          <button type="submit">Create Event</button>
        </div>
      </div>
    </div>
  );
};

export default Page;

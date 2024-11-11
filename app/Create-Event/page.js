"use client";
import React, { useEffect, useState } from "react";
import { Calendar, Clock } from "lucide-react";
import "../css/Create-Event.css";
import axios from "axios";
import { useSession } from "next-auth/react";

const Page = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [ title, setTitle ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ date, setDate ] = useState('');
  const [ start, setStart ] = useState('');
  const [ end, setEnd ] = useState('');
  const [ location, setLocation ] = useState('');
  const [ maxCapacity, setMaxCapacity ] = useState('');
  const [ organizerId, setOrganizerId ] = useState('');
  const { data: session } = useSession();

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
      setSelectedFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files[0] && files[0].type.startsWith("image/")) {
      setSelectedFile(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!title || !description || !date || !start || !end || !location || !maxCapacity || !selectedFile) {
      alert("Please fill in all fields and select an image");
      return;
    }

    try {
      setOrganizerId(session?.user?.id);

      const formData = new FormData(); // Using FormData to handle file uploads
      formData.append('title', title);
      formData.append('description', description);
      formData.append('date', date);
      formData.append('start', start);
      formData.append('end', end);
      formData.append('location', location);
      formData.append('max_capacity', parseInt(maxCapacity));
      formData.append('event_image', selectedFile);
      formData.append('organizer_id', parseInt(organizerId));
      formData.append('created_at', new Date().toISOString());
      formData.append('status', 'Pending');

      const res = await axios.post('http://localhost:5000/api/auth/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });

        alert(res.data.message); 
    } catch (error) {
      console.error(error);
      console.error(error.response);
      alert(error.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="createEvent-mnc">
      <form onSubmit={handleSubmit} className="event-content">
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
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="event-name">
            <label>Location</label>
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="event-name">
            <label>Maximum Capacity</label>
            <input 
              type="text" 
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(e.target.value)}
            />
          </div>
          <div className="description">
            <label>Description</label>
            <textarea 
              rows="5" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="schedule">
            <div className="date">
              <label>Date</label>
              <div className="input-with-icon">
                <Calendar className="input-icon" />
                <input 
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)} 
                />
              </div>
            </div>
            <div className="start">
              <label>Start</label>
              <div className="input-with-icon">
                <Clock className="input-icon" />
                <input 
                  type="time" 
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                />
              </div>
            </div>
            <div className="end">
              <label>End</label>
              <div className="input-with-icon">
                <Clock className="input-icon" />
                <input 
                  type="time" 
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                />
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
                  <>
                    {/* <p className="selected-file">{selectedFile}</p> */}
                    <div className="space-y-2">
                      <p className="selected-file">{selectedFile.name}</p>
                      <div className="w-full flex justify-center">
                        <div className="relative w-full max-w-xs aspect-video">
                          <img 
                            src={URL.createObjectURL(selectedFile)} 
                            alt="Selected preview" 
                            className="absolute inset-0 w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </>
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
      </form>
    </div>
  );
};

export default Page;

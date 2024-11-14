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

  useEffect(() => {
    if (session?.user?.id) {
      setOrganizerId(session.user.id);
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    // Form validation
    if (!title || !description || !date || !start || !end || !location || !maxCapacity || !selectedFile) {
      alert("Please fill in all fields and select an image");
      return;
    }

    try {
      const validOrganizerId = parseInt(organizerId);
      if (isNaN(validOrganizerId)) { // To counter NaN error
        alert("Invalid Organizer ID");
        return;
      }

      console.log('Sending form data:', {
        Title: title,
        Description: description,
        Date: date,
        Start: start,
        End: end,
        Location: location,
        Max_Capacity: maxCapacity,
        Organizer_Id: validOrganizerId,
        Status: 'Pending'
      });

      const formData = new FormData(); // Using FormData to handle file uploads

      formData.append('Title', title);
      formData.append('Description', description);
      formData.append('Date', date);
      formData.append('Start', start);
      formData.append('End', end);
      formData.append('Location', location);
      formData.append('Max_Capacity', parseInt(maxCapacity));
      formData.append('Event_Image', selectedFile);
      formData.append('Organizer_Id', validOrganizerId);
      formData.append('Status', 'Pending');

      const res = await axios.post('http://localhost:5000/api/event/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });
      console.log('Response received:', res.data);
      alert(res.data.message); 
    } catch (error) {
      console.error('Error details:', error);
      if (error.response) {
        console.error('Response error:', error.response.data);
        console.error('Status code:', error.response.status);
      }
      alert(error.response?.data?.message || "Event creation failed: " + error.message);
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

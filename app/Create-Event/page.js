"use client";
import React, { useEffect, useRef, useState } from "react";
import { Calendar, Clock } from "lucide-react";
import "../css/Create-Event.css";
import axios from "axios";
import { useSession } from "next-auth/react";
import { ChevronDown, Check } from "lucide-react";
import {
  ComboBox,
  Label,
  Input,
  Button,
  Popover,
  ListBox,
  ListBoxItem,
} from "react-aria-components";
import RequirementsModal from "./SeeRequirement";
import EventSettingsPanel from "./SpecifyEvents";
import { useRouter } from "next/navigation";

const Page = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [organizerId, setOrganizerId] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  // Import from SpecifyEvents.js
  const [venue, setVenue] = useState("");
  const [capacity, setCapacity] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [visibilityType, setVisibilityType] = useState("Public");
  const [requireApproval, setRequireApproval] = useState(false);
  const [requireTicket, setRequireTicket] = useState(false);

  const [isRequirementsModalOpen, setIsRequirementsModalOpen] = useState(false);

  const descriptionRef = useRef(null);

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
    const textarea = descriptionRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
    }
  }, [description]);

  useEffect(() => {
    if (session?.user?.id) {
      setOrganizerId(session.user.id);
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (
      !title ||
      !description ||
      !date ||
      !start ||
      !end ||
      !venue ||
      !capacity ||
      !selectedFile
    ) {
      alert("Please fill in all fields and select an image");
      return;
    }

    try {
      const validOrganizerId = parseInt(organizerId);
      if (isNaN(validOrganizerId)) {
        // To counter NaN error
        alert("Invalid Organizer ID");
        return;
      }

      // console.log("Sending form data:", {
      //   Title: title,
      //   Description: description,
      //   Date: date,
      //   Start: start,
      //   End: end,
      //   Location: venue,
      //   Max_Capacity: capacity,
      //   Visibility: visibilityType,
      //   Hosted_By: selectedDepartments,
      //   Require_Approval: requireApproval,
      //   Require_Ticket: requireTicket,
      //   Organizer_Id: validOrganizerId,
      //   Status: "Pending",
      // });

      const formData = new FormData(); // Using FormData to handle file uploads

      formData.append("Title", title);
      formData.append("Description", description);
      formData.append("Date", date);
      formData.append("Start", start);
      formData.append("End", end);
      formData.append("Location", venue);
      formData.append("Max_Capacity", parseInt(capacity));
      formData.append("Event_Image", selectedFile);
      formData.append("Organizer_Id", validOrganizerId);
      formData.append("Visibility", visibilityType);
      formData.append("Require_Approval", requireApproval.toString());
      formData.append("Require_Ticket", requireTicket.toString());
      formData.append("Hosted_By", JSON.stringify(selectedDepartments));
      formData.append("Status", "Pending");

      const res = await axios.post(
        "http://localhost:5000/api/event/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      alert(res.data.message);

      if (res.status == 200){
        router.push('/Events');
      }
    } catch (error) {
      console.error("Error details:", error);
      if (error.response) {
        console.error("Response error:", error.response.data);
        console.error("Status code:", error.response.status);
      }
      alert(
        error.response?.data?.message ||
          "Event creation failed: " + error.message
      );
    }
  };

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
          {/* Input Event Name */}
          <div className="event-name">
            <label>Event Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Input Event Description */}
          <div className="description">
            <label>Description</label>
            <textarea
              rows="5"
              className="overflow-hidden"
              ref={descriptionRef}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Input Event Schedule */}
          <div className="schedule">
            {/* Start of Event */}
            <div className="start-DT">
              <label>Start</label>
              <div className="date-time">
                <div className="date">
                  <div className="input-with-icon">
                    <Calendar className="input-icon" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="time">
                  <div className="input-with-icon">
                    <Clock className="input-icon" />
                    <input
                      type="time"
                      value={start}
                      onChange={(e) => setStart(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* End of Event */}
            <div className="start-DT">
              <label>End</label>
              <div className="date-time">
                <div className="date">
                  <div className="input-with-icon">
                    <Calendar className="input-icon" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="time">
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
            </div>
          </div>
          {/* Eventt's Detail and Option */}
          <EventSettingsPanel
            venue={venue}
            setVenue={setVenue}
            capacity={capacity}
            setCapacity={setCapacity}
            selectedDepartments={selectedDepartments}
            setSelectedDepartments={setSelectedDepartments}
            visibilityType={visibilityType}
            setVisibilityType={setVisibilityType}
            requireApproval={requireApproval}
            setRequireApproval={setRequireApproval}
            requireTicket={requireTicket}
            setRequireTicket={setRequireTicket}
          />

          {/* Input Event Image */}
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

          {/* See Requirements */}
          <div className="requirements-wrapper">
            <button
              type="button"
              className="requirements-button"
              onClick={() => setIsRequirementsModalOpen(true)}
            >
              <svg
                className="info-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              See All Requirements
            </button>
          </div>
        </div>
        <div className="createEvent-btn">
          <button type="submit">Create Event</button>
        </div>
        <RequirementsModal
          isOpen={isRequirementsModalOpen}
          onClose={() => setIsRequirementsModalOpen(false)}
        />
      </form>
    </div>
  );
};

export default Page;

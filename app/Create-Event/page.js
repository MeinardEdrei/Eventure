"use client";
import React, { useEffect, useRef, useState } from "react";
import { Calendar, Clock } from "lucide-react";
import "../css/Create-Event.css";
import axios from "axios";
import { useSession } from "next-auth/react";
import { ChevronDown, Check } from "lucide-react";
// import {
//   ComboBox,
//   Label,
//   Input,
//   // Button,
//   Popover,
//   ListBox,
//   ListBoxItem,
// } from "react-aria-components";
import Button from "@mui/material/Button";
import RequirementsModal from "./SeeRequirement";
import EventSettingsPanel from "./SpecifyEvents";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";



const Page = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [organizerId, setOrganizerId] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  // Import from SpecifyEvents.js
  const [venue, setVenue] = useState("");
  const [capacity, setCapacity] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [visibilityType, setVisibilityType] = useState("Public");
  const [requireApproval, setRequireApproval] = useState(false);
  const [selectedPartnerships, setSelectedPartnerships] = useState([]);
  const [campusType, setCampusType] = useState("On Campus");
  const [eventType, setEventType] = useState("");

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
      //   MaxCapacity: capacity,
      //   Visibility: visibilityType,
      //   HostedBy: selectedDepartments,
      //   RequireApproval: requireApproval,
      //   Partnerships: selectedPartnerships,
      //   EventImage: selectedFile,
      //   Organizer_Id: validOrganizerId,
      //   Status: "Pending",
      // });

      const formData = new FormData(); // Using FormData to handle file uploads

      formData.append("CampusType", campusType);
      formData.append("EventType", eventType);
      formData.append("Title", title);
      formData.append("Description", description);
      formData.append("DateStart", dateStart);
      formData.append("DateEnd", dateEnd);
      formData.append("TimeStart", timeStart);
      formData.append("TimeEnd", timeEnd);
      formData.append("Location", venue);
      formData.append("MaxCapacity", parseInt(capacity));
      formData.append("EventImage", selectedFile);
      formData.append("OrganizerId", validOrganizerId);
      formData.append("Visibility", visibilityType);
      formData.append("RequireApproval", requireApproval.toString());
      formData.append("Partnerships", JSON.stringify(selectedPartnerships));
      formData.append("HostedBy", JSON.stringify(selectedDepartments));
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

      if (res.status == 200) {
        router.push("/My-Events");
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

    const [startDateTime, setStartDateTime] = React.useState(dayjs(""));
    const [endDateTime, setEndDateTime] = React.useState(dayjs(""));


  return (
    <div className="createEvent-mnc">
      <form onSubmit={handleSubmit} className="event-content">
        <div className="text-container">
          <div>
            <h1>Create a New Event</h1>
            <p>
              Create a unique and engaging event that caters to your specific
              needs.
            </p>
          </div>
          <div className="line-container w-[100%] h-auto">
            <hr className="border border-white/50" />
          </div>
        </div>

        <div className="input-containers flex flex-row w-[100%] gap-8">
          {/* Left Side */}
          <div className="left-container flex flex-col w-[50%] gap-4 ">
            {/* Input Event Image */}
            <div className="input-image">
              {/* <label>Choose Image</label> */}
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
                  required
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
                      <i
                        className="fa fa-cloud-upload text-[6rem]"
                        aria-hidden="true"
                      ></i>
                      <p>Upload from files or Drag and Drop</p>
                      {/* <button type="button" className="select-button">
                        Select from computer
                      </button> */}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Input Event Name */}
            <div className="event-name ">
              <label>Event Name</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Input Event Description */}
            <div className="description">
              <label>Description</label>
              <textarea
                rows="8"
                className="overflow-y-auto max-h-[29vh]"
                ref={descriptionRef}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="right-container flex flex-col w-[50%] gap-[1.2rem] ">
            {/* Event's Detail */}
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
              selectedPartnerships={selectedPartnerships}
              setSelectedPartnerships={setSelectedPartnerships}
              campusType={campusType}
              setCampusType={setCampusType}
              eventType={eventType}
              setEventType={setEventType}
            />

            {/* New Calendar Design*/}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DateTimePicker"]}>
                <div className="bg-[#4E4E4E]/30 p-6 border border-[#FFF0F0]/30 rounded-[8px] flex flex-row justify-center gap-4">
                  {/* Start Calendar*/}
                  <div>
                    <div>
                      <h3 className="text-[#ffffff]">Start of Event</h3>
                    </div>
                    <div>
                      <DateTimePicker
                        value={startDateTime}
                        onChange={(newValue) => setStartDateTime(newValue)}
                        sx={{
                          backgroundColor: "#b8b8b8", // Set background color
                          color: "black", // Set font color
                          borderRadius: "4px", // Optional: Add border radius
                          "& .MuiInputBase-root": {
                            color: "black", // Change font color inside the input
                          },
                          "& .MuiInputBase-input": {
                            color: "darkbblue", // Ensure the input text color is also updated
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none", // Remove the border when not focused
                          },
                        }}
                      />
                    </div>
                  </div>

                  {/* End Calendar*/}
                  <div>
                    <div>
                      <h3 className="text-[#ffffff]">End of Event</h3>
                    </div>
                    <div>
                      <DateTimePicker
                        // label="End Date and Time"
                        value={endDateTime}
                        onChange={(newValue) => setEndDateTime(newValue)}
                        sx={{
                          backgroundColor: "#b8b8b8", // Set background color
                          color: "black", // Set font color
                          borderRadius: "4px", // Optional: Add border radius
                          "& .MuiInputBase-root": {
                            color: "black", // Change font color inside the input
                          },
                          "& .MuiInputBase-input": {
                            color: "darkbblue", // Ensure the input text color is also updated
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none", // Remove the border when not focused
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              </DemoContainer>
            </LocalizationProvider>

            {/* See Requirements */}
            {/* <div className="requirements-wrapper">
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
            </div> */}
            <Button
              sx={{
                width: "100%",
                // marginTop: "1.25rem",
                padding: "0.5rem",
                backgroundColor: "white",
                opacity: 0.5,
                borderRadius: "8px",
                textAlign: "center",
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "black",
                "&:hover": {
                  opacity: 1,
                },
              }}
              type="submit"
              variant="contained"
            >
              Create Event
            </Button>
          </div>
        </div>

        {/* Create Event Button */}
        {/* <div className="createEvent-btn"> */}
        {/* <button type="submit">Create Event</button> */}
        {/* </div> */}

        <RequirementsModal
          isOpen={isRequirementsModalOpen}
          onClose={() => setIsRequirementsModalOpen(false)}
        />
      </form>
    </div>
  );
};

export default Page;

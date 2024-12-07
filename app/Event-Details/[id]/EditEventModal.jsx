import React, { useState, useEffect } from "react";
import "../../css/Edit-Event-Modal.css";
import axios from "axios";
import Button from "@mui/material/Button";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { X, Upload, Send, ChevronDown } from "lucide-react";

const EditEventModal = ({
  isOpen,
  onClose,
  event,
  eventId,
  onUpdateSuccess,
  requireApproval,
  setRequireApproval,
}) => {
  const [editedEvent, setEditedEvent] = useState({
    title: "",
    description: "",
    dateStart: "",
    dateEnd: "",
    timeStart: "",
    timeEnd: "",
    location: "",
    maxCapacity: "",
    campusType: "",
    eventType: "",
    visibility: "",
    requireApproval: false,
    partnerships: [],
    hostedBy: [],
    eventImage: null,
    colleges: [],
  });

  const [campusType, setCampusType] = useState("On Campus");
  const EventOptions = ["On Campus", "Off Campus"];
  const handleSelect = (option) => {
    setCampusType(option);
    handleChange({ target: { name: "campusType", value: option } });
  };
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);

  const [previewImage, setPreviewImage] = useState(null);

  // Dropdown states
  const [isVisibilityDropdownOpen, setIsVisibilityDropdownOpen] = useState(false);
  const [isCollegesOpen, setIsCollegesOpen] = useState(false);
  const [collegesFilter, setCollegesFilter] = useState("");
  const [customCollegeInput, setCustomCollegeInput] = useState("");

  const [isPartnershipOpen, setIsPartnershipOpen] = useState(false);
  const [partnershipFilter, setPartnershipFilter] = useState("");
  const [customPartnershipInput, setCustomPartnershipInput] = useState("");

  // Predefined lists
  const colleges = [
    "CCIS - College of Computing and Information Sciences",
    "CTHM - College of Tourism and Hospitality Management",
    "ION - Institute of Nursing",
    "CITE - College of Information Technology Education",
    "CHK - College of Human Kinetics",
    "HSU - Higher School ng UMak",
  ];

  const partnerships = [
    "Google Developer Student Clubs",
    "Microsoft Learn Student Ambassador",
    "IBM Academic Initiative",
    "AWS Educate",
    "Cisco Networking Academy",
  ];
  const options = [
    { id: "Curriculum", label: "Curriculum" },
    { id: "Organizational", label: "Organizational" },
    { id: "College", label: "College" },
  ];

  useEffect(() => {
    if (event) {
      setEditedEvent({
        title: event.title || "",
        description: event.description || "",
        dateStart: event.dateStart ? event.dateStart.split("T")[0] : "",
        dateEnd: event.dateEnd ? event.dateEnd.split("T")[0] : "",
        timeStart: event.timeStart || "",
        timeEnd: event.timeEnd || "",
        location: event.location || "",
        maxCapacity: event.maxCapacity || "",
        campusType: event.campusType || "",
        eventType: event.eventType || "",
        visibility: event.visibility || "Public",
        requireApproval: event.requireApproval || false,
        partnerships: event.partnerships ? JSON.parse(event.partnerships) : [],
        hostedBy: event.hostedBy ? JSON.parse(event.hostedBy) : [],
        eventImage: null,
        colleges: event.hostedBy ? JSON.parse(event.hostedBy) : [],
      });

      // Set initial preview image
      setPreviewImage(
        `http://localhost:5000/api/event/uploads/${event.eventImage}`
      );
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "eventImage" && files && files[0]) {
      const file = files[0];
      setEditedEvent((prev) => ({
        ...prev,
        eventImage: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setEditedEvent((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // College Dropdown Handlers
  const handleCollegeToggle = (college) => {
    setEditedEvent((prev) => ({
      ...prev,
      colleges: prev.colleges.includes(college)
        ? prev.colleges.filter((c) => c !== college)
        : [...prev.colleges, college],
    }));
    setIsCollegesOpen(false);
    setCollegesFilter("");
  };

  const handleAddCustomCollege = () => {
    if (customCollegeInput.trim()) {
      setEditedEvent((prev) => ({
        ...prev,
        colleges: [...prev.colleges, customCollegeInput.trim()],
      }));
      setCustomCollegeInput("");
      setIsCollegesOpen(false);
    }
  };
  // Filtering function
  const filteredColleges = colleges.filter(
    (college) =>
      college.toLowerCase().includes(collegesFilter.toLowerCase()) &&
      !editedEvent.colleges.includes(college)
  );

  // Partnership Dropdown Handlers
  const handlePartnershipToggle = (partnership) => {
    setEditedEvent((prev) => ({
      ...prev,
      partnerships: prev.partnerships.includes(partnership)
        ? prev.partnerships.filter((p) => p !== partnership)
        : [...prev.partnerships, partnership],
    }));
    setIsPartnershipOpen(false);
    setPartnershipFilter("");
  };

  const handleAddCustomPartnership = () => {
    if (customPartnershipInput.trim()) {
      setEditedEvent((prev) => ({
        ...prev,
        partnerships: [...prev.partnerships, customPartnershipInput.trim()],
      }));
      setCustomPartnershipInput("");
      setIsPartnershipOpen(false);
    }
  };
  const filteredPartnerships = partnerships.filter(
    (partnership) =>
      partnership.toLowerCase().includes(partnershipFilter.toLowerCase()) &&
      !editedEvent.partnerships.includes(partnership)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // Append all edited event details
      Object.keys(editedEvent).forEach((key) => {
        if (
          key === "colleges" ||
          key === "partnerships" ||
          key === "hostedBy"
        ) {
          formData.append(key, JSON.stringify(editedEvent[key]));
        } else if (key === "eventImage" && editedEvent[key]) {
          formData.append(key, editedEvent[key]);
        } else if (key !== "eventImage") {
          formData.append(key, editedEvent[key]);
        }
      });

      const res = await axios.put(
        `http://localhost:5000/api/event/${eventId}/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        alert("Event updated successfully!");
        onUpdateSuccess(); // Refresh event data
        onClose(); // Close the modal
      }
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#252525] rounded-lg p-8 w-[87vw] max-h-[80vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-300 hover:text-red-500"
        >
          <X size={24} />
        </button>

        <h2 className="text-[2rem] font-bold mb-6 text-white">Edit Event</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Main Container */}
          <div className="flex flex-row w-[100%] gap-8 mb-8">
            {/* Left Side */}
            <div className="flex flex-col w-[50%] gap-4">
              {/* Image Upload Section */}
              <div
                onClick={() => document.getElementById("eventImage").click()}
                className="bg-transparent hover:bg-[rgba(255,255,255,0.05)] border-2 rounded-[8px] border-dashed p-6 flex justify-center cursor-pointer"
              >
                <div className="relative">
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Event Preview"
                      className="w-64 h-64 hover:opacity-60 object-cover rounded-lg"
                    />
                  )}
                  <label
                    htmlFor="eventImage"
                    className="absolute bottom-0 right-0 bg-transparent p-2 rounded-full cursor-pointer"
                  >
                    <input
                      type="file"
                      id="eventImage"
                      name="eventImage"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                    {/* <Upload size={24} className="text-black" /> */}
                  </label>
                </div>
              </div>

              <div className="event-name">
                <label className="block mb-2">Event Name</label>
                <input
                  type="text"
                  name="title"
                  value={editedEvent.title}
                  onChange={handleChange}
                  className="w-full bg-[#989898] text-white p-2 rounded"
                  required
                />
              </div>

              <div className="event-description">
                <label className="block mb-2">Description</label>
                <textarea
                  name="description"
                  value={editedEvent.description}
                  onChange={handleChange}
                  className="overflow-y-auto min-h-[22vh] w-full bg-[#2C2C2C] text-white p-2 rounded h-32"
                  required
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex flex-col w-[50%] gap-4">
              <div className="flex flex-row w-full">
                <div className="relative w-[100%]">
                  <label className="block mb-2">Event Details</label>

                  {/* Event Option Dropdown */}
                  <div className="relative">
                    <div
                      className={`w-full bg-[#5b55614d] text-white p-2 border border-[#fff0f04d] rounded flex justify-between items-center cursor-pointer ${
                        isEventDropdownOpen ? "rounded-b-none" : ""
                      }`}
                      onClick={() =>
                        setIsEventDropdownOpen(!isEventDropdownOpen)
                      }
                    >
                      <span>{campusType}</span>
                      <ChevronDown
                        size={20}
                        className={`transform transition-transform ${
                          isEventDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    {isEventDropdownOpen && (
                      <div className="absolute top-full left-0 w-full bg-[#6d3998] z-10 rounded-b-lg shadow-lg">
                        {EventOptions.map((option) => (
                          <div
                            key={option}
                            className={`p-2 hover:bg-purple-700 ${
                              campusType === option ? "bg-purple-800" : ""
                            }`}
                            onClick={() => {
                              setCampusType(option);
                              handleChange({
                                target: { name: "campusType", value: option },
                              });
                              setIsEventDropdownOpen(false);
                            }}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Radio Button: Curriculum, Organization, College */}
                <div className="ml-4 flex flex-col justify-end">
                  {/* <label className="block mb-2 text-white">Event Type</label> */}
                  <div className="bg-[#2C2C2C] border border-[#FFF0F0]/30 px-4 py-2 rounded-lg flex items-center">
                    <div className="flex space-x-4">
                      {options.map((option) => (
                        <label
                          key={option.id}
                          className="flex items-center space-x-2 text-white cursor-pointer"
                        >
                          <input
                            type="radio"
                            id={option.id}
                            name="eventType"
                            value={option.id}
                            checked={editedEvent.eventType === option.id}
                            onChange={(e) => {
                              handleChange({
                                target: {
                                  name: "eventType",
                                  value: e.target.value,
                                },
                              });
                            }}
                            className="form-radio h-3 w-3 accent-purple-500 text-purple-600 bg-gray-800 border-gray-600 "
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-4 w-full">
                  {/* Left Divider */}
                  <div className="bg-transparent border rounded-[8px] border-[#FFF0F0]/30 p-5 flex flex-col w-[100%] gap-[1.5rem]">
                    {/* Event Location */}
                    <div className="event-location">
                      <label className="label-container">
                        <span className="label-icon">
                          <i
                            className="fa fa-location-arrow"
                            aria-hidden="true"
                          ></i>
                        </span>
                        <span>Event Venue</span>
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={editedEvent.location}
                        onChange={handleChange}
                        className="w-full bg-[#2C2C2C] text-white p-2 rounded"
                        required
                      />
                    </div>

                    {/* College Dropdown */}
                    <div className="w-full">
                      <label className="label-container">
                        <span className="label-icon">
                          <i
                            className="fa fa-graduation-cap"
                            aria-hidden="true"
                          ></i>
                        </span>
                        <span>Colleges</span>
                      </label>
                      <div className="flex flex-col">
                        {/* College Tag Container */}
                        <div className="flex flex-wrap items-center gap-1 mb-1">
                          {editedEvent.colleges.map((college) => (
                            <span
                              key={college}
                              className="bg-purple-700 px-3 py-1 rounded text-xs flex items-center justify-center gap-2"
                            >
                              {college}
                              <button
                                className="tag-remove"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleCollegeToggle(college);
                                }}
                              >
                                <X size={11} />
                              </button>
                            </span>
                          ))}
                        </div>

                        <div className="relative w-full">
                          <div className="flex items-center justify-between w-full h-[auto] py-[0.5rem] px-4 bg-[#2C2C2C] text-white rounded">
                            <input
                              type="text"
                              placeholder="Select Colleges..."
                              className="w-full bg-transparent border-0 outline-none"
                              value={collegesFilter}
                              onChange={(e) => {
                                setCollegesFilter(e.target.value);
                                setIsCollegesOpen(true);
                              }}
                              onClick={() => setIsCollegesOpen(true)}
                            />
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setIsCollegesOpen(!isCollegesOpen);
                              }}
                            >
                              <ChevronDown
                                size={20}
                                className={`transform transition-transform ${
                                  isCollegesOpen ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                          </div>

                          {/* Dropdown Menu */}
                          {isCollegesOpen && (
                            <div className="dropdown-menu">
                              {/* Add College Input */}
                              <div className="flex items-center p-2 bg-[#6d3998]">
                                <input
                                  className="flex w-full bg-transparent border-gray-300 px-2 py-1 mr-2 text-white outline-none"
                                  type="text"
                                  placeholder="Add college"
                                  value={customCollegeInput}
                                  onChange={(e) =>
                                    setCustomCollegeInput(e.target.value)
                                  }
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      handleAddCustomCollege();
                                    }
                                  }}
                                />
                                <button
                                  onClick={handleAddCustomCollege}
                                  className="text-[#c987ff] flex items-center justify-center  hover:text-[#e0bbff] mr-2 z-10"
                                >
                                  <Send size={19} />
                                </button>
                              </div>

                              {filteredColleges.map((college) => (
                                <button
                                  key={college}
                                  className={`w-full text-left px-4 py-2 hover:bg-[#9148cd] ${
                                    editedEvent.colleges.includes(college)
                                      ? "bg-[#6d3998]"
                                      : ""
                                  }`}
                                  onClick={() => handleCollegeToggle(college)}
                                >
                                  {college}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Require Approval */}
                    <div className="">
                      <div className="toggle-div">
                        <label className="label-container">
                          <span className="label-icon">
                            <i className="fa fa-check" aria-hidden="true"></i>
                          </span>
                          <span>Require Approval</span>
                        </label>
                        <label className="toggle">
                          <input
                            type="checkbox"
                            checked={requireApproval}
                            onChange={(e) =>
                              setRequireApproval(e.target.checked)
                            }
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Right Divider */}
                  <div className="bg-transparent border rounded-[8px] border-[#FFF0F0]/30 p-5 flex flex-col w-[100%] gap-[1.5rem]">
                    {/* Capacity */}
                    <div className="event-capacity">
                      <label className="label-container">
                        <span className="label-icon">
                          <i className="fa fa-users" aria-hidden="true"></i>
                        </span>
                        <span>Capacity</span>
                      </label>
                      <input
                        type="number"
                        name="maxCapacity"
                        value={editedEvent.maxCapacity}
                        onChange={handleChange}
                        className="w-full bg-[#2C2C2C] text-white p-2 rounded"
                        required
                      />
                    </div>

                    {/* Visibility Dropdown */}
                    <div>
                      <label className="label-container">
                        <span className="label-icon">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                        </span>
                        <span>Visibilty</span>
                      </label>
                      <div className="relative w-full">
                        <div
                          className={`w-full bg-[#5b55614d] text-white p-2 border border-[#fff0f04d] rounded flex justify-between items-center cursor-pointer ${
                            isVisibilityDropdownOpen ? "rounded-b-none" : ""
                          }`}
                          onClick={() =>
                            setIsVisibilityDropdownOpen(
                              !isVisibilityDropdownOpen
                            )
                          }
                        >
                          <span>{editedEvent.visibility}</span>
                          <ChevronDown
                            size={20}
                            className={`transform transition-transform ${
                              isVisibilityDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </div>

                        {isVisibilityDropdownOpen && (
                          <div className="absolute top-full left-0 w-full bg-[#6d3998] z-10 rounded-b-lg shadow-lg">
                            {["Public", "Private", "Custom"].map((option) => (
                              <div
                                key={option}
                                className={`p-2 hover:bg-purple-700 ${
                                  editedEvent.visibility === option
                                    ? "bg-purple-800"
                                    : ""
                                }`}
                                onClick={() => {
                                  handleChange({
                                    target: {
                                      name: "visibility",
                                      value: option,
                                    },
                                  });
                                  setIsVisibilityDropdownOpen(false);
                                }}
                              >
                                {option}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Partnership Dropdown */}
                    <div className="w-full">
                      <label className="label-container">
                        <span className="label-icon">
                          <i className="fa fa-users" aria-hidden="true"></i>
                        </span>
                        <span>Partnership</span>
                      </label>
                      <div className="flex flex-col">
                        {/* Tag Container */}
                        <div className="flex flex-wrap items-center gap-1 mb-1">
                          {editedEvent.partnerships.map((partnership) => (
                            <span
                              key={partnership}
                              className="bg-purple-700 px-3 py-1 rounded text-xs flex items-center justify-center gap-2"
                            >
                              {partnership}
                              <button
                                className="tag-remove"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePartnershipToggle(partnership);
                                }}
                              >
                                <X size={11} />
                              </button>
                            </span>
                          ))}
                        </div>

                        <div className="relative w-full">
                          <div className="flex items-center justify-between w-full h-[auto] py-[0.5rem] px-4 bg-[#2C2C2C] text-white rounded">
                            <input
                              type="text"
                              placeholder="Select Partnership..."
                              className="w-full bg-transparent border-0 outline-none"
                              value={partnershipFilter}
                              onChange={(e) => {
                                setPartnershipFilter(e.target.value);
                                setIsPartnershipOpen(true);
                              }}
                              onClick={() => setIsPartnershipOpen(true)}
                            />
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setIsPartnershipOpen(!isPartnershipOpen);
                              }}
                            >
                              <ChevronDown
                                size={20}
                                className={`transform transition-transform ${
                                  isPartnershipOpen ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                          </div>
                          {/* Dropdown Menu */}
                          {isPartnershipOpen && (
                            <div className="dropdown-menu">
                              <div className="flex items-center p-2 bg-[#6d3998]">
                                <input
                                  className="flex w-full bg-transparent border-gray-300 px-2 py-1 mr-2 text-white outline-none"
                                  type="text"
                                  placeholder="Add partnership"
                                  value={customPartnershipInput}
                                  onChange={(e) =>
                                    setCustomPartnershipInput(e.target.value)
                                  }
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      handleAddCustomPartnership();
                                    }
                                  }}
                                />
                                <button
                                  onClick={handleAddCustomPartnership}
                                  className="text-[#c987ff] flex items-center justify-center  hover:text-[#e0bbff] mr-2 z-10"
                                >
                                  <Send size={19} />
                                </button>
                              </div>

                              {filteredPartnerships.map((partnership) => (
                                <button
                                  key={partnership}
                                  className={`w-full text-left px-4 py-2 hover:bg-[#9148cd] ${
                                    editedEvent.partnerships.includes(
                                      partnership
                                    )
                                      ? "bg-[#6d3998]"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handlePartnershipToggle(partnership)
                                  }
                                >
                                  {partnership}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div>
                  <div className="bg-transparent border rounded-[10px] border-[#FFF0F0]/30 p-6 flex flex-row gap-10 justify-center">
                    <div className="flex flex-col gap-8 items-center justify-center">
                      <label className="">Start</label>
                      <label className="">End</label>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <input
                            type="date"
                            name="dateStart"
                            value={editedEvent.dateStart}
                            onChange={handleChange}
                            className="w-full bg-[#4f4f4f] text-white p-2 rounded"
                            required
                          />
                        </div>
                        <div>
                          <input
                            type="date"
                            name="dateEnd"
                            value={editedEvent.dateEnd}
                            onChange={handleChange}
                            className="w-full bg-[#4f4f4f] text-white p-2 rounded"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <input
                            type="time"
                            name="timeStart"
                            value={editedEvent.timeStart}
                            onChange={handleChange}
                            className="w-full bg-[#4f4f4f] text-white p-2 rounded"
                            required
                          />
                        </div>
                        <div>
                          <input
                            type="time"
                            name="timeEnd"
                            value={editedEvent.timeEnd}
                            onChange={handleChange}
                            className="w-full bg-[#4f4f4f] text-white p-2 rounded"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="contained"
              sx={{
                width: "100%",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                fontWeight: "bold",
                padding: "0.75rem 1rem",
                marginTop: "1rem",
                backgroundColor: "#9c9c9c",
                color: "white",
                "&:hover": {
                  backgroundColor: "white",
                  color: "black",
                },
              }}
            >
              Update Event
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;

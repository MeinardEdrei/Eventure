import React, { useState, useEffect } from "react";
import "../../css/Edit-Event-Modal.css";
import axios from "axios";
import Button from "@mui/material/Button";
import { X, Upload, Send, ChevronDown } from "lucide-react";

const EditEventModal = ({
  isOpen,
  onClose,
  event,
  eventId,
  onUpdateSuccess,
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

  const [previewImage, setPreviewImage] = useState(null);

  // Dropdown states
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
        colleges: event.colleges ? JSON.parse(event.colleges) : [],
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
      <div className="bg-[#252525] rounded-lg p-8 w-[80vw] max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-white">Edit Event</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Main Container */}
          <div className="flex flex-row w-[100%] gap-8">
            {/* Left Side */}
            <div className="flex flex-col w-[50%] gap-4">
              {/* Image Upload Section */}
              <div className="bg-transparent border-2 rounded-[8px] border-dashed p-6 flex justify-center">
                <div className="relative">
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Event Preview"
                      className="w-64 h-64 object-cover rounded-lg"
                    />
                  )}
                  <label
                    htmlFor="eventImage"
                    className="absolute bottom-0 right-0 bg-white/70 p-2 rounded-full cursor-pointer"
                  >
                    <input
                      type="file"
                      id="eventImage"
                      name="eventImage"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                    <Upload size={24} className="text-black" />
                  </label>
                </div>
              </div>

              <div className="event-name">
                <label className="block mb-2">Event Title</label>
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
                  className="overflow-y-auto min-h-[26vh] w-full bg-[#2C2C2C] text-white p-2 rounded h-32"
                  required
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex flex-col w-[50%] gap-4">
              {/* Part: Off Campus Event */}
              <div className="flex flex-row w-full">
                <div>
                  <label className="block mb-2">Campus Type</label>
                  <select
                    name="campusType"
                    value={editedEvent.campusType}
                    onChange={handleChange}
                    className="w-full bg-[#2C2C2C] text-white p-2 rounded"
                    required
                  >
                    <option value="On Campus">On Campus</option>
                    <option value="Off Campus">Off Campus</option>
                  </select>
                </div>

                {/* Radio Button: Curriculum, Organization, College */}
                <div className="ml-4 flex flex-col justify-end">
                  <label className="block mb-2 text-white">Event Type</label>
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
                            className="form-radio h-4 w-4 text-purple-600 bg-gray-800 border-gray-600 focus:ring-purple-500 focus:ring-2"
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
                  <div className="bg-transparent border rounded-[8px] border-[#FFF0F0]/30 p-5 flex flex-col w-[100%] gap-[1rem]">
                    <div className="event-location">
                      <label className="block mb-2">Location</label>
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
                      <label className="block mb-2">Colleges</label>
                      <div className="flex flex-col gap-2">
                        {/* College Tag Container */}
                        <div className="flex flex-wrap items-center gap-1">
                          {editedEvent.colleges.map((college) => (
                            <span
                              key={college}
                              className="bg-purple-700 px-3 py-1 rounded text-xs flex items-center justify-center"
                            >
                              {college}
                              <button
                                className=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleCollegeToggle(college);
                                }}
                              >
                                ×
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

                          {isCollegesOpen && (
                            <div className="absolute z-10 w-full bg-[#2C2C2C] border border-gray-600 rounded mt-1 shadow-lg">
                              <div className="flex items-center p-2 bg-[#6d3998]">
                                <input
                                  className="flex-grow bg-transparent border-gray-300 rounded px-2 py-1 mr-2 text-white outline-none"
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
                                  className="text-white hover:text-[#d19fff] mr-4"
                                >
                                  <Send size={19} />
                                </button>
                              </div>

                              {filteredColleges.map((college) => (
                                <button
                                  key={college}
                                  className={`w-full text-left px-4 py-2 hover:bg-gray-700 ${
                                    editedEvent.colleges.includes(college)
                                      ? "bg-gray-600"
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

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="requireApproval"
                        checked={editedEvent.requireApproval}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label>Require Approval</label>
                    </div>
                  </div>

                  {/* Right Divider */}
                  <div className="bg-transparent border rounded-[8px] border-[#FFF0F0]/30 p-5 flex flex-col w-[100%] gap-[1rem]">
                    <div className="event-capacity">
                      <label className="block mb-2">Max Capacity</label>
                      <input
                        type="number"
                        name="maxCapacity"
                        value={editedEvent.maxCapacity}
                        onChange={handleChange}
                        className="w-full bg-[#2C2C2C] text-white p-2 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Visibility</label>
                      <select
                        name="visibility"
                        value={editedEvent.visibility}
                        onChange={handleChange}
                        className="w-full bg-[#2C2C2C] text-white p-2 rounded"
                        required
                      >
                        <option value="Public">Public</option>
                        <option value="Private">Private</option>
                      </select>
                    </div>

                    {/* Partnership Dropdown */}
                    <div className="w-full">
                      <label className="block mb-2">Partnership</label>

                      <div className="flex flex-col gap-2">
                        {/* Tag Container */}
                        <div className="flex flex-wrap items-center gap-1">
                          {editedEvent.partnerships.map((partnership) => (
                            <span
                              key={partnership}
                              className="bg-purple-700 px-3 py-1 rounded text-xs flex items-center justify-center"
                            >
                              {partnership}
                              <button
                                className=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePartnershipToggle(partnership);
                                }}
                              >
                                ×
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

                          {isPartnershipOpen && (
                            <div className="absolute z-10 w-full bg-[#2C2C2C] border border-gray-600 rounded mt-1 shadow-lg">
                              <div className="flex items-center p-2 bg-[#6d3998]">
                                <input
                                  className="flex-grow bg-transparent border-gray-300 rounded px-2 py-1 mr-2 text-white outline-none"
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
                                  className="text-white hover:text-[#d19fff] mr-4"
                                >
                                  <Send size={19} />
                                </button>
                              </div>

                              {filteredPartnerships.map((partnership) => (
                                <button
                                  key={partnership}
                                  className={`w-full text-left px-4 py-2 hover:bg-gray-700 ${
                                    editedEvent.partnerships.includes(
                                      partnership
                                    )
                                      ? "bg-gray-600"
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2">Start Date</label>
                      <input
                        type="date"
                        name="dateStart"
                        value={editedEvent.dateStart}
                        onChange={handleChange}
                        className="w-full bg-[#2C2C2C] text-white p-2 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2">End Date</label>
                      <input
                        type="date"
                        name="dateEnd"
                        value={editedEvent.dateEnd}
                        onChange={handleChange}
                        className="w-full bg-[#2C2C2C] text-white p-2 rounded"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2">Start Time</label>
                      <input
                        type="time"
                        name="timeStart"
                        value={editedEvent.timeStart}
                        onChange={handleChange}
                        className="w-full bg-[#2C2C2C] text-white p-2 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2">End Time</label>
                      <input
                        type="time"
                        name="timeEnd"
                        value={editedEvent.timeEnd}
                        onChange={handleChange}
                        className="w-full bg-[#2C2C2C] text-white p-2 rounded"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="contained"
            sx={{
              width: "100%",
              marginTop: "1rem",
              backgroundColor: "white",
              color: "black",
              "&:hover": {
                backgroundColor: "gray",
              },
            }}
          >
            Update Event
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;

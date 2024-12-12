import React, { useState, useRef, useEffect } from "react";
import "../../css/Edit-Event-Modal.css";
import axios from "axios";
import Button from "@mui/material/Button";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
  X,
  Upload,
  Send,
  ChevronDown,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
} from "lucide-react";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";

const RichTextEditor = ({ value, onChange }) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  // Handle text input and changes
  const handleChange = (newEditorState) => {
    setEditorState(newEditorState);

    // Adjust container height
    if (containerRef.current) {
      containerRef.current.style.height = "auto";
      containerRef.current.style.height = `${Math.min(
        containerRef.current.scrollHeight,
        window.innerHeight * 0.29
      )}px`;
    }

    // Convert to raw content and pass to parent component
    const contentState = newEditorState.getCurrentContent();
    onChange(JSON.stringify(convertToRaw(contentState)));
  };

  // Improved key command handling
  const handleKeyCommand = (command, editorState) => {
    // Handle delete and backspace commands more explicitly
    if (command === "delete" || command === "backspace") {
      const contentState = editorState.getCurrentContent();
      const selectionState = editorState.getSelection();

      // If entire content is selected, create a new empty editor state
      if (
        selectionState.getAnchorOffset() === 0 &&
        selectionState.getFocusOffset() ===
          contentState.getLastBlock().getLength()
      ) {
        const newState = EditorState.createEmpty();
        handleChange(newState);
        return "handled";
      }
    }

    // Default Draft.js key handling
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      handleChange(newState);
      return "handled";
    }
    return "not-handled";
  };

  // Formatting button handlers
  const toggleInlineStyle = (style) => {
    handleChange(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (blockType) => {
    handleChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  // Focus editor when clicked
  const focusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  // Customizing the Buttons for the editor
  const InlineStyleButton = ({ style, icon: Icon }) => (
    <button
      type="button"
      onClick={() => toggleInlineStyle(style)}
      className={`
      mr-2 p-2 rounded-[4px] transition-all duration-200 ease-in-out
      flex items-center justify-center
      ${
        editorState.getCurrentInlineStyle().has(style)
          ? "bg-blue-600 text-white"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }
    `}
      aria-label={style.toLowerCase()}
    >
      <Icon size={16} strokeWidth={2} />
    </button>
  );

  const BlockStyleButton = ({ blockType, icon: Icon }) => (
    <button
      type="button"
      onClick={() => toggleBlockType(blockType)}
      className={`
      mr-2 p-2 rounded-[4px] transition-all duration-200 ease-in-out
      flex items-center justify-center
      ${
        RichUtils.getCurrentBlockType(editorState) === blockType
          ? "bg-green-600 text-white"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }
    `}
      aria-label={blockType.replace("-", " ")}
    >
      <Icon size={16} strokeWidth={2} />
    </button>
  );

  return (
    <div
      ref={containerRef}
      className="border rounded-[8px] border-white/30 p-3 max-h-[auto]"
    >
      <div className="mb-2 flex items-center space-x-2">
        <div className="flex flex-row items-center gap-1">
          <InlineStyleButton style="BOLD" icon={Bold} />
          <InlineStyleButton style="ITALIC" icon={Italic} />
          <InlineStyleButton style="UNDERLINE" icon={Underline} />
          <BlockStyleButton blockType="unordered-list-item" icon={List} />
          <BlockStyleButton blockType="ordered-list-item" icon={ListOrdered} />
        </div>
      </div>

      <div
        onClick={() => editorRef.current?.focus()}
        className="min-h-[20vh] max-h-[20vh] overflow-y-auto bg-[#4e4e4e4d] p-2 rounded"
      >
        <Editor
          ref={editorRef}
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={handleChange}
          // placeholder="Enter event description..."
        />
      </div>
    </div>
  );
};

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
  const [description, setDescription] = useState("");

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
  const [isVisibilityDropdownOpen, setIsVisibilityDropdownOpen] =
    useState(false);
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
        eventImage: event.eventImage || "",
        status: event.status,
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
      hostedBy: prev.hostedBy.includes(college)
        ? prev.hostedBy.filter((c) => c !== college)
        : [...prev.hostedBy, college],
    }));
    setIsCollegesOpen(false);
    setCollegesFilter("");
  };

  const handleAddCustomCollege = () => {
    if (customCollegeInput.trim()) {
      setEditedEvent((prev) => ({
        ...prev,
        hostedBy: [...prev.hostedBy, customCollegeInput.trim()],
      }));
      setCustomCollegeInput("");
      setIsCollegesOpen(false);
    }
  };
  // Filtering function
  const filteredColleges = colleges.filter(
    (college) =>
      college.toLowerCase().includes(collegesFilter.toLowerCase()) &&
      !editedEvent.hostedBy.includes(college)
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

      // for (const [key, value] of formData.entries()) {
      //   console.log(key, value)
      // }
      // console.log(editedEvent)

      const res = await axios.put(
        `http://localhost:5000/api/event/${eventId}/update-event`,
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

  const [startDateTime, setStartDateTime] = React.useState(dayjs(""));
  const [endDateTime, setEndDateTime] = React.useState(dayjs(""));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-[2px] bg-opacity-50">
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
                className="bg-transparent hover:bg-[rgba(255,255,255,0.05)] border-2 border-[#ffffff]/40 rounded-[8px] border-dashed p-6 flex justify-center cursor-pointer"
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

              {/* Input Event Description */}
              <div className="description">
                <label>Description</label>
                <RichTextEditor value={description} onChange={setDescription} />
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
                      <div className="absolute top-full left-0 w-full bg-[#414141] z-10 rounded-b-lg shadow-lg">
                        {EventOptions.map((option) => (
                          <div
                            key={option}
                            className={`p-2 hover:bg-[#656565] ${
                              campusType === option ? "bg-[#7b7b7b]" : ""
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

                    {/* Require Approval */}
                    <div className="box">
                      <div className="flex flex-col gap-2">
                        <div className="toggle-container">
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
                        <div>
                          <p className="text-[0.7rem] leading-[14px] text-white/50">
                            By enabling this, organizers must approve each
                            attendee before they are allowed to join the event.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* <div className="">
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
                    </div> */}

                    {/* College Dropdown */}
                    <div className="w-full">
                      <label className="label-container">
                        <span className="label-icon">
                          <i
                            className="fa fa-graduation-cap"
                            aria-hidden="true"
                          ></i>
                        </span>
                        <span>College Departments</span>
                      </label>

                      <div className="flex flex-col">
                        {/* College Tag Container */}
                        <div className="flex flex-wrap items-center gap-1 mb-1">
                          {editedEvent.hostedBy.map((college) => (
                            <span
                              key={college}
                              className="bg-[#7b7b7b] px-3 py-1 rounded-[5px] text-[0.8rem] text-xs flex items-center justify-center gap-2"
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
                              <div className="flex items-center p-2 bg-[#7b7b7b]">
                                <input
                                  className="flex-grow bg-transparent focus:border focus:border-[#e4c7ffb3] placeholder:text-white  border-gray-300 rounded px-2 py-1 mr-2 text-white outline-none"
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
                                  className="text-[#414141] flex items-center justify-center  hover:text-[#ffffff] mr-2 z-10"
                                >
                                  <Send size={19} />
                                </button>
                              </div>

                              {filteredColleges.map((college) => (
                                <button
                                  key={college}
                                  className={`w-full text-left px-4 py-2 hover:bg-[#9148cd] ${
                                    editedEvent.hostedBy.includes(college)
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
                    <div className="flex flex-col gap-2">
                      <label className="label-container">
                        <span className="label-icon">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                        </span>
                        <span>Visibilty</span>
                      </label>

                      {/* Dropdown */}
                      <div className="relative w-full">
                        <div
                          className={`w-full bg-[#4E4E4E]/30 border border-[#ffffff]/30 text-white py-2 px-4 rounded-[5px] flex justify-between items-center cursor-pointer ${
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
                          <div className="absolute top-full left-0 w-full bg-[#414141] z-10 rounded-b-lg shadow-lg">
                            {["Public", "Private", "Custom"].map((option) => (
                              <div
                                key={option}
                                className={`p-2 hover:bg-[#656565] ${
                                  editedEvent.visibility === option
                                    ? "bg-[#7b7b7b]"
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
                              className="bg-[#7b7b7b] px-3 py-1 rounded-[5px] text-[0.8rem] text-xs flex items-center justify-center gap-2"
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
                              <div className="flex items-center p-2 bg-[#7b7b7b]">
                                <input
                                  className="flex-grow bg-transparent focus:border focus:border-[#e4c7ffb3] placeholder:text-white  border-gray-300 rounded px-2 py-1 mr-2 text-white outline-none"
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
                                  className="text-[#414141] flex items-center justify-center  hover:text-[#ffffff] mr-2 z-10"
                                >
                                  <Send size={19} />
                                </button>
                              </div>

                              {filteredPartnerships.map((partnership) => (
                                <button
                                  key={partnership}
                                  className={`w-full text-left px-4 py-2 hover:bg-[#656565] ${
                                    editedEvent.partnerships.includes(
                                      partnership
                                    )
                                      ? "bg-[#656565]"
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

                {/* New Calendar Design*/}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DateTimePicker"]}>
                    <div className="bg-transparent p-6 border border-[#FFF0F0]/30 rounded-[8px] flex flex-row justify-center gap-12">
                      {/* Start Calendar*/}
                      <div>
                        <div>
                          <h3 className="text-[#f7f0ff] mb-2 text-[0.9rem] font-semibold opacity-70">
                            Start of Event
                          </h3>
                        </div>
                        <div>
                          <DateTimePicker
                            value={startDateTime}
                            onChange={(newValue) => setStartDateTime(newValue)}
                            sx={{
                              backgroundColor: "rgb(78,78,78,0.9)", // Set background color
                              color: "white", // Set font color
                              borderRadius: "4px", // Optional: Add border radius
                              "& .MuiInputBase-root": {
                                color: "#c6c6c6", // Change font color inside the input
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
                          <h3 className="text-[#f7f0ff] mb-2 text-[0.9rem] font-semibold opacity-70">
                            End of Event
                          </h3>
                        </div>
                        <div>
                          <DateTimePicker
                            // label="End Date and Time"
                            value={endDateTime}
                            onChange={(newValue) => setEndDateTime(newValue)}
                            sx={{
                              backgroundColor: "rgb(78,78,78,0.9)", // Set background color
                              color: "white", // Set font color
                              borderRadius: "4px", // Optional: Add border radius
                              "& .MuiInputBase-root": {
                                color: "#c6c6c6", // Change font color inside the input
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

                {/* Date & Time */}
                {/* <div>
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
                </div> */}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;

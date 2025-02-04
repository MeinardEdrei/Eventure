import React, { useEffect, useState } from "react";
import "./SpecifyEvents.css";

import "@fortawesome/fontawesome-free/css/all.min.css";
import { useSession } from "next-auth/react";
import { ChevronDown, Send, X } from "lucide-react";
// import { Label } from "@/components/ui/label";

const EventSettingsPanel = ({
  // Pass using Props
  venue,
  setVenue,
  capacity,
  setCapacity,
  selectedDepartments,
  setSelectedDepartments,
  visibilityType,
  setVisibilityType,
  requireApproval,
  setRequireApproval,
  selectedPartnerships,
  setSelectedPartnerships,
  campusType,
  setCampusType,
  eventType,
  setEventType,
}) => {
  const [departmentsDropDown, setDepartmentsDropDown] = useState(true);
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [isVisibilityDropdownOpen, setIsVisibilityDropdownOpen] = useState(false);

  //State for Partnership
  const [partnershipFilter, setPartnershipFilter] = useState("");
  const [isPartnershipOpen, setIsPartnershipOpen] = useState(false);

  // const partnerships = [
  //   "Google Developer Student Clubs",
  //   "Microsoft Learn Student Ambassador",
  //   "IBM Academic Initiative",
  //   "AWS Educate",
  //   "Cisco Networking Academy",
  // ];

  const departments =
    [
      "CCIS - College of Computing and Information Sciences",
      "CTHM - College of Tourism and Hospitality Management",
      "ION - Institute of Nursing",
      "CITE - College of Information Technology Education",
      "CHK - College of Human Kinetics",
      "HSU - Higher School ng UMak",
    ] || [];
  const departmentMap = {
    CCIS: "College of Computing and Information Sciences",
    CTHM: "College of Tourism and Hospitality Management",
    ION: "Institute of Nursing",
    CITE: "College of Information Technology Education",
    CHK: "College of Human Kinetics",
    HSU: "Higher School ng UMak",
  };
  // For adding a department that was not in the dropdown list
  const [customDepartmentInput, setCustomDepartmentInput] = useState("");
  const handleAddCustomDepartment = () => {
    if (
      customDepartmentInput.trim() &&
      !selectedDepartments.includes(customDepartmentInput.trim())
    ) {
      setSelectedDepartments((prev) => [...prev, customDepartmentInput.trim()]);
      setCustomDepartmentInput(""); // Clear input
      setIsDepartmentOpen(false);
    }
  };

  // For adding a partner that was not in the dropdown list
  const [customPartnershipInput, setCustomPartnershipInput] = useState("");
  const handleAddCustomPartnership = () => {
    if (
      customPartnershipInput.trim() &&
      !selectedPartnerships.includes(customPartnershipInput.trim())
    ) {
      setSelectedPartnerships((prev) => [
        ...prev,
        customPartnershipInput.trim(),
      ]);
      setCustomPartnershipInput(""); // Clear input
      setIsPartnershipOpen(false);
    }
  };

  const userDept = Object.keys(departmentMap);

  const EventOptions = ["On Campus", "Off Campus"];
  const handleSelect = (option) => {
    setCampusType(option);
    setIsOpen(false);
  };

  const options = [
    { id: "Curriculum", label: "Curriculum" },
    { id: "Organizational", label: "Organizational" },
    { id: "College", label: "College" },
  ];

  const handleDepartmentToggle = (dept) => {
    setSelectedDepartments((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
    setIsDepartmentOpen(false);
    setDepartmentFilter(""); // Reset filter after selection
  };

  const handlePartnershipToggle = (partnership) => {
    setSelectedPartnerships((prev) =>
      prev.includes(partnership)
        ? prev.filter((p) => p !== partnership)
        : [...prev, partnership]
    );
    setIsPartnershipOpen(false);
    setPartnershipFilter(""); // Reset filter after selection
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (visibilityType === "Private") {
        const shortcutName = session?.user?.department;
        if (shortcutName && userDept.includes(shortcutName)) {
          const fullDepartmentName = `${shortcutName} - ${departmentMap[shortcutName]}`;
          setSelectedDepartments([fullDepartmentName]);
        }
        setDepartmentsDropDown(false);
      } else if (visibilityType === "Public") {
        setSelectedDepartments(departments);
        setDepartmentsDropDown(false);
      } else {
        setDepartmentsDropDown(true);
      }
    }
  }, [visibilityType, session?.user?.department]);

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.toLowerCase().includes(departmentFilter.toLowerCase()) &&
      !selectedDepartments.includes(dept)
  );

  const filteredPartnerships = departments.filter(
    (partnership) =>
      partnership.toLowerCase().includes(partnershipFilter.toLowerCase()) &&
      !selectedPartnerships.includes(partnership)
  );

  return (
    <div className="specify-event-mnc">
      {/* Event Details Section */}
      <div className="event-section">
        <div>
          <h2 className="text-lg font-semibold mb-1 text-white opacity-70">
            Event Details
          </h2>

          <div className="">
            <div className="flex flex-row w-[100%] gap-4">
              {/* Dropdown Event Container */}
              <div className="relative w-[100%]">
                <button
                  className="dropdown-button"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(!isOpen);
                  }}
                >
                  {campusType}
                  <i
                    className={`fas fa-chevron-down dropdown-icon ${
                      isOpen ? "rotate" : ""
                    }`}
                  ></i>
                </button>

                {isOpen && (
                  <div className="dropdown-menu">
                    {EventOptions.map((option) => (
                      <button
                        key={option}
                        className={`dropdown-item ${
                          campusType === option ? "selected" : ""
                        }`}
                        onClick={() => handleSelect(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Radio Button: Curriculum, Organization, College */}
              <div className="bg-[#5B5561]/20 border border-[#FFF0F0]/30 px-7 h-[3rem] pt-2 rounded-lg w-full flex items-center justify-center">
                <div className="flex gap-[2rem]">
                  {options.map((option) => (
                    <label
                      key={option.id}
                      htmlFor={option.id}
                      className="flex items-center gap-3 text-gray-200 cursor-pointer text-[8rem]"
                    >
                      <input
                        type="radio"
                        id={option.id}
                        value={option.id}
                        onChange={(e) => setEventType(e.target.value)}
                        name="activityType"
                        className="w-3 h-3 accent-purple-500"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-4">
          {/* Left Side */}
          <div className="bg-transparent border rounded-[8px] border-[#FFF0F0]/30 p-5 flex flex-col w-[100%] gap-[1.8rem]">
            {/* Venue Input */}
            <div className="box ">
              <label className="label-container">
                {/* <span>Event Venue</span> */}
                <div className="relative w-full">
                  <i
                    className="fa fa-location-arrow text-[1.2rem] absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"
                    aria-hidden="true"
                  ></i>
                  <input
                    type="text"
                    className="bg-transparent border rounded-lg border-[#ffffff]/50 text-white p-3 pl-10 w-full outline-none 
              focus:[background-color:rgba(85,97,87,0.3)] focus:border-2 focus:[border-color:rgba(227,198,255,0.7)] focus:rounded-lg"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="Enter venue location"
                  />
                </div>
              </label>
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
                      onChange={(e) => setRequireApproval(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div>
                  <p className="text-[0.7rem] leading-[14px] text-white/50">
                    By enabling this, organizers must approve each attendee
                    before they are allowed to join the event.
                  </p>
                </div>
              </div>
            </div>

            {/* Dropdown College Departments */}
            <div className="box">
              <label className="label-container">
                <span className="label-icon">
                  <i className="fa fa-graduation-cap" aria-hidden="true"></i>
                </span>
                <span>College Departments</span>
              </label>

              {visibilityType === "Private" && (
                <div className="text-white/70 text-sm mb-2">
                  {`${session?.user?.department} department is the only host`}
                </div>
              )}

              <div className="tags-container">
                {visibilityType === "Public" && (
                  <>
                    {selectedDepartments.map((dept) => (
                      <span key={dept} className="tag">
                        {dept}
                        <button
                          className="tag-remove"
                          onClick={() => handleDepartmentToggle(dept)}
                        >
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </>
                )}
                {visibilityType === "Custom" && (
                  <>
                    {selectedDepartments.map((dept) => (
                      <span key={dept} className="tag">
                        {dept}
                        <button
                          className="tag-remove"
                          onClick={() => handleDepartmentToggle(dept)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </>
                )}
              </div>

              {/* Only show dropdown for Custom visibility */}
              {visibilityType === "Custom" && (
                <div className="relative w-[100%]">
                  <div className="flex items-center justify-between w-full h-[auto] py-[0.5rem] px-4 bg-[#4E4E4E]/30 border border-[#ffffff]/30 rounded-[5px] shadow-sm capitalize cursor-pointer transition-all duration-200 ease-linear">
                    <input
                      type="text"
                      placeholder="Select Departments..."
                      className="w-full bg-transparent border-0 outline-none"
                      value={departmentFilter}
                      onChange={(e) => {
                        setDepartmentFilter(e.target.value);
                        setIsDepartmentOpen(true);
                      }}
                      onClick={() => setIsDepartmentOpen(true)}
                      disabled={!departmentsDropDown}
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (departmentsDropDown) {
                          setIsDepartmentOpen(!isDepartmentOpen);
                        }
                      }}
                      disabled={!departmentsDropDown}
                    >
                      <i
                        className={`fas fa-chevron-down dropdown-icon ${
                          isDepartmentOpen ? "rotate" : ""
                        }`}
                      ></i>
                    </button>
                  </div>
                  {/* Dropdown Menu */}
                  {isDepartmentOpen && departmentsDropDown && (
                    <div className="dropdown-menu">
                      <div className="flex items-center p-2 bg-[#7b7b7b]">
                        <input
                          className="add-dept flex-grow bg-transparent border-gray-300 rounded px-2 py-1 mr-2 text-white outline-none"
                          type="text"
                          placeholder="Add department"
                          value={customDepartmentInput}
                          onChange={(e) =>
                            setCustomDepartmentInput(e.target.value)
                          }
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleAddCustomDepartment();
                            }
                          }}
                        />
                        <button
                          onClick={handleAddCustomDepartment}
                          className="text-[#414141] flex items-center justify-center  hover:text-[#ffffff] mr-2 z-10"
                        >
                          <Send size={19} />
                        </button>
                      </div>

                      {filteredDepartments.map((dept) => (
                        <button
                          key={dept}
                          className={`dropdown-item ${
                            selectedDepartments.includes(dept) ? "selected" : ""
                          }`}
                          onClick={() => handleDepartmentToggle(dept)}
                          disabled={!departmentsDropDown}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Line Divider */}
            {/* <div className="line-container w-[100%] h-auto">
              <hr className="border border-solid border-[#ffffff62]" />
            </div> */}
          </div>

          {/* Right Side */}
          <div className="bg-transparent border rounded-[8px] border-[#FFF0F0]/30 p-5 flex flex-col w-[100%] gap-[1.8rem]">
            {/* Capacity */}
            <div className="box">
              <label className="label-container">
                <div className="relative w-full">
                  <i
                    className="fa fa-expand text-[1.2rem] absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"
                    aria-hidden="true"
                  ></i>
                  <input
                    type="number"
                    className="bg-transparent text-white p-3 pl-10 border border-[rgba(255,240,240,0.3)] rounded-lg w-full outline-none 
                            focus:[background-color:rgba(85,97,87,0.3)] focus:border-2 focus:[border-color:rgba(227,198,255,0.7)]"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="Enter maximum capacity"
                  />
                </div>
                {/* <span>Capacity</span> */}
              </label>
            </div>

            {/* Visibility Dropdown */}
            <div className="box">
              <div className="flex flex-col gap-2">
                <label className="label-container">
                  <span className="label-icon">
                    <i className="fa fa-globe" aria-hidden="true"></i>
                  </span>
                  <span>Visibility</span>
                </label>

                {/* Dropdown */}
                <div className="relative w-full">
                  <div
                    className={`w-full bg-[#4E4E4E]/30 border border-[#ffffff]/30 text-white py-2 px-4 rounded-[5px] flex justify-between items-center cursor-pointer ${
                      isVisibilityDropdownOpen ? "rounded-b-none" : ""
                    }`}
                    onClick={() =>
                      setIsVisibilityDropdownOpen(!isVisibilityDropdownOpen)
                    }
                  >
                    <span>{visibilityType}</span>
                    <ChevronDown
                      size={25}
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
                            visibilityType === option ? "bg-[#7b7b7b]" : ""
                          }`}
                          onClick={() => {
                            setVisibilityType(option);
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
            </div>

            {/* Line Divider */}
            {/* <div className="line-container w-[100%] h-auto">
              <hr className="border border-solid border-[#ffffff62]" />
            </div> */}

            {/* Partnership Section*/}
            <div className="box">
              <label className="label-container">
                <span className="label-icon">
                  <i className="fa fa-users" aria-hidden="true"></i>
                </span>
                <span>Partnership</span>
              </label>
              <div className="tags-container">
                {selectedPartnerships.map((partnership) => (
                  <span key={partnership} className="tag">
                    {partnership}
                    <button
                      className="tag-remove"
                      onClick={() => handlePartnershipToggle(partnership)}
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="relative w-[100%]">
                <div className="flex items-center justify-between w-full h-[auto] py-[0.5rem] px-4 bg-[#4E4E4E]/30 border border-[#ffffff]/30 rounded-[5px] shadow-sm capitalize cursor-pointer transition-all duration-200 ease-linear">
                  <input
                    type="text"
                    placeholder="Select Partnership..."
                    className="w-full bg-transparent outline-none"
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
                    <i
                      className={`fas fa-chevron-down dropdown-icon ${
                        isPartnershipOpen ? "rotate" : ""
                      }`}
                    ></i>
                  </button>
                </div>

                {isPartnershipOpen && (
                  <div className="dropdown-menu">
                    <div className="flex items-center p-2 bg-[#7b7b7b]">
                      <input
                        className="add-dept flex-grow bg-transparent border-gray-300 rounded px-2 py-1 mr-2 text-white outline-none"
                        type="text"
                        placeholder="Add partners"
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
                        className="dropdown-item"
                        onClick={() => handlePartnershipToggle(partnership)}
                      >
                        {partnership}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Ticket */}
            {/* <div className="box">
                <div className="toggle-container">
                  <label className="label-container">
                    <span className="label-icon">
                      <i className="fa fa-ticket" aria-hidden="true"></i>
                    </span>{" "}
                    <span>Ticket Required</span>
                  </label>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={requireTicket}
                      onChange={(e) => setRequireTicket(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSettingsPanel;

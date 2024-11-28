import React, { useEffect, useState } from "react";
import "./SpecifyEvents.css";

import "@fortawesome/fontawesome-free/css/all.min.css";
import { useSession } from "next-auth/react";
import { ChevronDown } from "lucide-react";
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
    if (visibilityType === "Private") {
      const shortcutName = session?.user?.department;
      if (shortcutName && userDept.includes(shortcutName)) {
        // Use the full department name from the departmentMap
        const fullDepartmentName = `${shortcutName} - ${departmentMap[shortcutName]}`;
        setSelectedDepartments([fullDepartmentName]);
      }
      setDepartmentsDropDown(false);
    } else {
      setDepartmentsDropDown(true);
    }
  }, [visibilityType]);

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
        <h2 className="section-title">Event Details</h2>

        <div className="pb-[12px]">
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
            <div className="bg-[#5B5561]/20 border border-[#FFF0F0]/30 px-7 pt-4 py-2 rounded-lg w-full flex items-center justify-center">
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

        <div className="flex flex-row gap-4">
          {/* Left Side */}
          <div className="bg-transparent border rounded-[8px] border-[#FFF0F0]/30 p-5 flex flex-col w-[100%] gap-[1rem]">
            {/* Venue Input */}
            <div className="box">
              <label className="label-container">
                <span className="label-icon">
                  <i className="fa fa-location-arrow" aria-hidden="true"></i>
                </span>
                <span>Event Venue</span>
              </label>
              <input
                type="text"
                className="bg-transparent text-white p-3 border border-[rgba(255,240,240,0.3)] rounded-lg w-full outline-none 
                            focus:[background-color:rgba(85,97,87,0.3)] focus:border-2 focus:[border-color:rgba(227,198,255,0.7)]"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Enter venue location"
              />
            </div>

            {/* Line Divider */}
            <div className="line-container w-[100%] h-auto">
              <hr className="border border-solid border-[#ffffff62]" />
            </div>

            {/* Dropdown College Departments */}
            <div className="box">
              <label className="label-container">
                <span className="label-icon">
                  <i className="fa fa-graduation-cap" aria-hidden="true"></i>
                </span>
                <span>College Departments</span>
              </label>
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
                          ×
                        </button>
                      </span>
                    ))}
                  </>
                )}
              </div>

              {/* New Dropdown UI for Departments with Filterable Input */}
              <div className="relative w-[100%]">
                <div className="flex items-center justify-between w-full h-[auto] py-[0.5rem] px-4 bg-[rgba(91,85,97,0.3)] font-bold border border-[rgba(255,240,240,0.3)] rounded-md shadow-sm capitalize cursor-pointer transition-all duration-200 ease-linear">
                  <input
                    type="text"
                    placeholder="Select Departments..."
                    className="w-full bg-transparent border-0 outline-none"
                    // className="bg-slate-600"
                    value={departmentFilter}
                    onChange={(e) => {
                      setDepartmentFilter(e.target.value);
                      setIsDepartmentOpen(true);
                    }}
                    onClick={() => setIsDepartmentOpen(true)}
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

                {isDepartmentOpen && departmentsDropDown && (
                  <div className="dropdown-menu">
                    {filteredDepartments.map((dept) => (
                      <button
                        key={dept}
                        className={`dropdown-item ${
                          selectedDepartments.includes(dept) ? "selected" : ""
                        }`}
                        onClick={() => handleDepartmentToggle(dept)}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Line Divider */}
            <div className="line-container w-[100%] h-auto">
              <hr className="border border-solid border-[#ffffff62]" />
            </div>

            {/* Require Approval */}
            <div className="box">
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
            </div>
          </div>

          {/* Right Side */}
          <div className="bg-transparent border rounded-[8px] border-[#FFF0F0]/30 p-5 flex flex-col w-[100%] gap-[1rem]">
            {/* Capacity */}
            <div className="box">
              <label className="label-container">
                <span className="label-icon">
                  <i className="fa fa-users" aria-hidden="true"></i>
                </span>
                <span>Capacity</span>
              </label>
              <input
                type="number"
                className="bg-transparent text-white p-3 border border-[rgba(255,240,240,0.3)] rounded-lg w-full outline-none 
                            focus:[background-color:rgba(85,97,87,0.3)] focus:border-2 focus:[border-color:rgba(227,198,255,0.7)]"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="Enter maximum capacity"
              />
            </div>

            {/* Line Divider */}
            <div className="line-container w-[100%] h-auto">
              <hr className="border border-solid border-[#ffffff62]" />
            </div>

            {/* Visibility Settings */}
            <div className="box">
              <label className="label-container">
                <span className="label-icon">
                  <i className="fa fa-globe" aria-hidden="true"></i>
                </span>
                <span>Visibility</span>
              </label>

              {/* Public Button */}
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="visibility"
                    className="radio-input accent-purple-500"
                    checked={visibilityType === "Public"}
                    onChange={() => setVisibilityType("Public")}
                  />
                  Public
                </label>

                {/* Private Button */}
                <label className="radio-label">
                  <input
                    type="radio"
                    name="visibility"
                    className="radio-input accent-purple-500"
                    checked={visibilityType === "Private"}
                    onChange={() => setVisibilityType("Private")}
                  />
                  Private
                </label>
              </div>
            </div>

            {/* Line Divider */}
            <div className="line-container w-[100%] h-auto">
              <hr className="border border-solid border-[#ffffff62]" />
            </div>

            {/* Partnership */}
            <div className="box">
              <label className="label-container">
                <span className="label-icon">
                  <i className="fa fa-location-arrow" aria-hidden="true"></i>
                </span>
                <span>Partnership</span>
              </label>
              <div className="tags-container">
                {selectedPartnerships.map((departmentMap) => (
                  <span key={departmentMap} className="tag">
                    {departmentMap}
                    <button
                      className="tag-remove"
                      onClick={() => handlePartnershipToggle(departmentMap)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="relative w-[100%]">
                <div className="flex items-center justify-between w-full h-[auto] py-[0.5rem] px-4 bg-[rgba(91,85,97,0.3)] font-bold border border-[rgba(255,240,240,0.3)] rounded-md shadow-sm capitalize cursor-pointer transition-all duration-200 ease-linear">
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
                    {filteredPartnerships.map((departments) => (
                      <button
                        key={departments}
                        className="dropdown-item"
                        onClick={() => handlePartnershipToggle(departments)}
                      >
                        {departments}
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

import React, { useEffect, useState } from "react";
import "./SpecifyEvents.css";

import "@fortawesome/fontawesome-free/css/all.min.css";
import { useSession } from "next-auth/react";

const EventSettingsPanel = ({ // Pass using Props
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
  requireTicket,
  setRequireTicket
}) => {
  const [departmentsDropDown, setDepartmentsDropDown] = useState(true);
  const { data: session } = useSession();
  
  const departments = [
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

  const handleDepartmentToggle = (dept) => {
    setSelectedDepartments((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
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
    }else{
      setDepartmentsDropDown(true);
    }
  }, [visibilityType]);

  return (
    <div className="specify-event-mnc">
      {/* Event Details Section */}
      <div className="event-section">
        <h2 className="section-title">Event Details</h2>

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
            className="input"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="Enter venue location"
          />
        </div>

        {/* College Departments */}
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
          <select
            className="select"
            onChange={(e) => handleDepartmentToggle(e.target.value)}
            value=""
            disabled={!departmentsDropDown}
          >
            <option value="" disabled>
              {visibilityType === "Public"
                ? "Select Departments..."
                : selectedDepartments}
            </option>
            {departments
              .filter((dept) => !selectedDepartments.includes(dept))
              .map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
          </select>
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

      {/* Options Section */}
      <div className="event-section">
        <h2 className="section-title">Event Options</h2>

        {/* Capacity */}
        <div className="box">
          <label className="label-container">
            <span className="label-icon">
              {/* <i className="fa fa-user-plus" aria-hidden="true"></i> */}
              <i className="fa fa-users" aria-hidden="true"></i>
            </span>
            <span>Capacity</span>
          </label>
          <input
            type="number"
            className="input"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="Enter maximum capacity"
          />
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
                className="radio-input"
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
                className="radio-input"
                checked={visibilityType === "Private"}
                onChange={() => setVisibilityType("Private")}
              />
              Private
            </label>
          </div>
        </div>

        {/* Ticket */}
        <div className="box">
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
        </div>
      </div>
    </div>
  );
};

export default EventSettingsPanel;

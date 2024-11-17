import React, { useState } from "react";
import "./SpecifyEvents.css";

import "@fortawesome/fontawesome-free/css/all.min.css";

const EventSettingsPanel = () => {
  const [venue, setVenue] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [visibilityType, setVisibilityType] = useState("Public");
  const [visibilityDepartments, setVisibilityDepartments] = useState([]);
  const [capacity, setCapacity] = useState("");
  const [requireApproval, setRequireApproval] = useState(false);
  const [requireTicket, setRequireTicket] = useState(false);

  const departments = [
    "CCIS - College of Computing and Information Sciences",
    "CTHM - College of Tourism and Hospitality Management",
    "ION - Institute of Nursing",
    "CITE - College of Information Technology Education",
    "CHK - College of Human Kinetics",
    "HSU - Higher School ng UMak",
  ];

  const handleDepartmentToggle = (dept) => {
    setSelectedDepartments((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  };

  const handleVisibilityDepartmentToggle = (dept) => {
    setVisibilityDepartments((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  };

  return (
    <div className="specify-event-mnc">
      {/* Event Details Section */}
      <div className="event-section">
        <h2 className="section-title">Event Details</h2>

        {/* Venue Input */}
        <div className="box">
          <label className="label-container">
            <span className="label-icon">
              <i class="fa fa-location-arrow" aria-hidden="true"></i>
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
              <i class="fa fa-graduation-cap" aria-hidden="true"></i>
            </span>
            <span>College Departments</span>
          </label>
          <div className="tags-container">
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
          </div>
          <select
            className="select"
            onChange={(e) => handleDepartmentToggle(e.target.value)}
            value=""
          >
            <option value="" disabled>
              Select Departments...
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
                <i class="fa fa-check" aria-hidden="true"></i>
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
              {/* <i class="fa fa-user-plus" aria-hidden="true"></i> */}
              <i class="fa fa-users" aria-hidden="true"></i>
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

          {visibilityType === "Public" && (
            <>
              <div className="tags-container">
                {visibilityDepartments.map((dept) => (
                  <span key={dept} className="tag green">
                    {dept}
                    <button
                      className="tag-remove"
                      onClick={() => handleVisibilityDepartmentToggle(dept)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <select
                className="select"
                onChange={(e) =>
                  handleVisibilityDepartmentToggle(e.target.value)
                }
                value=""
              >
                <option value="" disabled>
                  Select departments to include...
                </option>
                {departments
                  .filter((dept) => !visibilityDepartments.includes(dept))
                  .map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
              </select>
            </>
          )}
        </div>

        {/* Ticket */}
        <div className="box">
          <div className="toggle-container">
            <label className="label-container">
              <span className="label-icon">
                <i class="fa fa-ticket" aria-hidden="true"></i>
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

import React from "react";
import { X } from "lucide-react";

const RequirementsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const requirements = [
    "1. Intent Letter",
    "2. Budget Request",
    "3. Excuse Letter",
    "4. Disbursement",
    "5. Permit to Borrow",
    "6. Permit to Transfer",
  ];
  const options = [
    "1. Parking Letter",
    "2. Outsiders Letter",
    "3. Waiver Letter",
    "4. Letter for Guards",

  ];

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="cont">
          <div className="modal-header">
            <h2 className="modal-title">Event Requirements:</h2>
            <button onClick={onClose} className="close-button">
              <X size={24} />
            </button>
          </div>

          <div className="requirements-list">
            {requirements.map((requirement, index) => (
              <div key={index} className="requirement-item">
                <div className="checkbox">
                  <svg
                    className="checkmark"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="requirement-text">{requirement}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="cont">
          <div className="modal-header">
            <h2 className="modal-title">Optional:</h2>
          </div>

          <div className="requirements-list">
            {options.map((requirement, index) => (
              <div key={index} className="requirement-item">
                <div className="checkbox">
                  <svg
                    className="checkmark"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="requirement-text">{requirement}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="submit-button">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequirementsModal;

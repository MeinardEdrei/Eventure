import { useState, useEffect } from "react";
import { Upload, FileText, X, CircleUser, Check } from "lucide-react";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { useSession } from "next-auth/react";

const ViewEventModal = ({
  isOpen,
  onClose,
  eventData,
  handleApprove,
  handlePreApprove,
  handleReject,
  handleFileDownload,
}) => {
  // State Hooks
  const [isVisible, setIsVisible] = useState(false);
  const [selected, setSelected] = useState("Pre-approve");
  const [isDropDownOpen, setDropDownOpen] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);

  const {data: session} = useSession();

  // Effect Hook
  useEffect(() => {
    if (isOpen) {
      // Short delay to trigger CSS transition
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Early Return for Non-Visible Modal
  if (!isOpen) {
    return <div className="hidden" />;
  }

  // Helper Functions
  const options = ["Pre-approve", "Approve", "Reject"];
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-us", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // HANDLE SELECTION IN DROPDOWN
  const handleSelect = (option) => {
    setSelected(option);
    switch (option) {
      case "Pre-approve":
        handlePreApprove(eventData.id);
        break;
      case "Approve":
        handleApprove(eventData.id);
        break;
      case "Reject":
        handleReject(eventData.id);
        break;
    }
    setDropDownOpen(false);
  };
  // For modal dropdown: bg color will change
  const getButtonColor = () => {
    switch (selected) {
      case "Pre-approve":
        return "bg-[#002fff]";
      case "Approve":
        return "bg-[#00c524]";
      case "Reject":
        return "bg-[#ff3232]";
      default:
        return "bg-[#54366c]";
    }
  };
  const getHoverColor = (option) => {
    switch (option) {
      case "Pre-approve":
        return "hover:bg-blue-700";
      case "Approve":
        return "hover:bg-green-700";
      case "Reject":
        return "hover:bg-red-700";
      default:
        return "hover:bg-purple-700";
    }
  };

  const getCleanFileName = (fileName) => {
    // Check if the file name contains an underscore
    if (fileName.includes("_")) {
      return fileName.split("_").slice(1).join("_"); // Remove the first part if it has an underscore
    }
    return fileName; // Return as is if no underscore
  };

  // For modal see requirements
  const parsedFiles = (() => {
    try {
      return JSON.parse(eventData.requirementFiles || "[]");
    } catch (error) {
      console.error("Error parsing requirement files:", error);
      return [];
    }
  })();

  const requirements = () => {
    return parsedFiles.map((fileName, index) => ({
      id: index,
      text: [fileName], 
      completed: true,
    }));
  };

  const requirementsList = requirements();

  const shouldRenderButtons = () => {
    const userRole = session?.user?.role;
    const eventStatus = eventData.status;

    if (userRole === "Staff") {
      return eventStatus === "Pending";
    } else if (userRole === "Admin") {
      return eventStatus === "Pre-Approved";
    }

    return false;
  };

  const convertDraftToText = (rawContent) => {
    // Ensure rawContent is parsed if it's a string
    const content = typeof rawContent === 'string' 
      ? JSON.parse(rawContent) 
      : rawContent;
  
    if (!content || !content.blocks) return null;
  
    return content.blocks.map((block, index) => {
      // Apply inline styles to the text
      const styledText = block.inlineStyleRanges.reduce((acc, style) => {
        const start = style.offset;
        const end = start + style.length;
        const styledPart = acc.slice(start, end);
        
        switch (style.style) {
          case 'BOLD':
            return (
              acc.slice(0, start) + 
              `<strong>${styledPart}</strong>` + 
              acc.slice(end)
            );
          case 'ITALIC':
            return (
              acc.slice(0, start) + 
              `<em>${styledPart}</em>` + 
              acc.slice(end)
            );
          default:
            return acc;
        }
      }, block.text);
  
      // Handle different block types
      switch (block.type) {
        case 'unstyled':
          return styledText ? <p key={index} dangerouslySetInnerHTML={{__html: styledText}} /> : null;
        case 'unordered-list-item':
          return <li key={index} dangerouslySetInnerHTML={{__html: styledText}} />;
        case 'ordered-list-item':
          return <li key={index} dangerouslySetInnerHTML={{__html: styledText}} />;
        case 'header-one':
          return <h1 key={index} dangerouslySetInnerHTML={{__html: styledText}} />;
        case 'header-two':
          return <h2 key={index} dangerouslySetInnerHTML={{__html: styledText}} />;
        default:
          return styledText ? <p key={index} dangerouslySetInnerHTML={{__html: styledText}} /> : null;
      }
    }).filter(Boolean); // Remove any null elements
  };

  return (
    <div
      className={`backdrop-blur-[2px] fixed inset-0 bg-black bg-opacity-50 flex justify-end items-center z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`w-[800px] mr-8 h-[500px] flex flex-col justify-center transition-all duration-300 transform ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        {/* Exit Button */}
        <div className="flex justify-end items-end">
          <div>
            <button
              onClick={onClose}
              className="text-[#4e4e4e] hover:text-[#ff0000] transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div
          className={`
            bg-[#282828] 
            pb-6 
            gap-5 
            border-2 
            border-[#9b9b9b] 
            rounded-[0.8rem] 
            w-[770px] 
            flex 
            flex-col 
            transition-all 
            duration-300 
            ${isVisible ? "opacity-100" : "opacity-0"}
          `}
        >
          {/* Image Part */}
          <div className="flex items-center justify-center h-auto">
            <img
              src={`http://localhost:5000/api/event/uploads/${eventData.eventImage}`}
              alt={eventData.title}
              className="w-full h-[200px] object-cover rounded-tl-[0.8rem] rounded-tr-[0.8rem]"
            />
          </div>

          {/* Text Part */}
          <div className="px-5 flex flex-col gap-4 max-h-[50vh] overflow-y-auto">
            <div className="flex flex-row justify-between">
              {/* Details */}
              <div>
                <div>
                  <h2 className="text-2xl font-bold">{eventData.title}</h2>
                </div>
                <div>{eventData.location}</div>
                <div>{formatDate(eventData.dateStart)}</div>
              </div>

              {/* Buttons */}
              {shouldRenderButtons() && (
              <div className="flex flex-col items-center gap-3">
                {/* Modal: Dropdown button */}
                <div className="relative w-[11rem]">
                  <button
                    className={`flex items-center justify-between w-[100%] px-4 py-1 ${getButtonColor()} text-white font-bold rounded-md shadow-sm capitalize cursor-pointer transition-all duration-200 ease-in`}
                    onClick={() => setDropDownOpen(!isDropDownOpen)}
                  >
                    {selected}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ml-2 transition-transform duration-300 ${
                        isDropDownOpen ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {isDropDownOpen && (
                    <div className="absolute right-0 mt-2 w-full bg-[#e1e1e1] rounded-lg shadow-lg shadow-white/10 z-10">
                      {options.map((option) => (
                        <button
                          key={option}
                          className={`block w-full py-2 px-2 text-left capitalize bg-transparent border-0 cursor-pointer text-black opacity-70 transition-all duration-300 ease-in-out ${
                            selected === option
                              ? "bg-purple-700"
                              : `${getHoverColor(
                                  option
                                )} hover:text-white hover:font-bold hover:opacity-100`
                          }`}
                          onClick={() => handleSelect(option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-transparent hover:bg-[#595959] border rounded-md w-full flex justify-center py-1 px-3">
                  <button
                    className="text-center"
                    onClick={() => setShowRequirements(!showRequirements)}
                  >
                    {showRequirements
                      ? "Hide Requirements"
                      : "See Requirements"}
                  </button>
                </div>
              </div>
              )}
            </div>

            {/* Conditionally render based on showRequirements */}
            {!showRequirements && (
              <>
                <div className="line-container w-[100%] h-auto">
                  <hr className="border border-white/50" />
                </div>

                {/* Event Description */}
                <Accordion
                  sx={{
                    backgroundColor: "#3a3a3a",
                    color: "white",
                    borderRadius: "6px",
                    border: "1px solid #9b9b9b",
                    padding: "0rem 0.5rem",
                    // marginBottom: "1rem",
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon
                        sx={{
                          color: "white",
                        }}
                      />
                    }
                  >
                    Event Description
                  </AccordionSummary>
                  <AccordionDetails>
                    <p>{convertDraftToText(eventData.description)}</p>
                  </AccordionDetails>
                </Accordion>

                <div className="line-container w-[100%] h-auto">
                  <hr className="border border-white/50" />
                </div>

                {/* Hosted Div */}
                <div className="gap-4 flex flex-col">
                  <div>
                    <strong>Hosted by:</strong>
                  </div>
                  <div className="flex flex-row gap-4">
                    {/* Add a check to ensure hostedBy is an array before mapping */}
                    {Array.isArray(eventData.hostedBy) ? (
                      eventData.hostedBy.map((item, index) => (
                        <div key={index} className="gap-2 flex flex-row items-center">
                          <CircleUser size={16} />
                          <p>{item}</p>
                        </div>
                      ))
                    ) : (
                      <div className="gap-2 flex flex-row items-center">
                        <CircleUser size={16} />
                        <p>{JSON.parse(eventData.hostedBy)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Requirements Section */}
            {showRequirements && (
              <div className="requirements-section">
                <div className="line-container w-[100%] h-auto mb-4">
                  <hr className="border border-white/50" />
                </div>
                <div className="requirements-list space-y-2">
                  <h3 className="text-lg font-semibold mb-2">
                    Event Requirements
                  </h3>
                  {requirementsList.map((req) => {
                    const cleanFileName = getCleanFileName(req.text[0]);
                    return (
                      <div
                        key={req.id}
                        onClick={() =>
                          handleFileDownload(eventData.eventType, req.text)
                        }
                        className="flex items-center space-x-3 bg-[#3a3a3a] p-2 rounded-md cursor-pointer"
                      >
                        {req.completed ? (
                          <Check size={20} className="text-green-500" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-500 rounded"></div>
                        )}
                        <span
                          className={`${
                            req.completed ? "text-green-300" : "text-gray-300"
                          }`}
                        >
                          {cleanFileName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEventModal;

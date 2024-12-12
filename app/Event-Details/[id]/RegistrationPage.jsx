// Latest Code
"use client";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Html5Qrcode } from "html5-qrcode";
// import { Search } from "lucide-react";
import {
  Search,
  CheckCircle,
  XCircle,
  Users,
  Clock,
  CheckSquare,
  Check,
  ChevronRight,
  Camera,
  CameraOff,
  X,
  Trash2,
} from "lucide-react";

function RegistrationPage({ participants, fetchData, eventId }) {
  const [selectedSection, setSelectedSection] = useState("waiting");
  const [searchQuery, setSearchQuery] = useState("");
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [scanMessage, setScanMessage] = useState("");
  const html5QrCodeRef = useRef(null);
  const hasScannedRef = useRef(false);
  const [isScanning, setIsScanning] = useState(false);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filterParticipants = (status) => {
    const participantsOfStatus = participants.find((p) => p.status === status);
    if (!participantsOfStatus) return [];

    const query = searchQuery.toLowerCase().trim();
    return participantsOfStatus.email.filter((email, index) => {
      const name = participantsOfStatus.name[index].toLowerCase();
      return name.includes(query) || email.toLowerCase().includes(query);
    });
  };

  // const sections = [
  //   { key: "waiting", label: "Waiting" },
  //   { key: "attending", label: "Going" },
  //   { key: "attended", label: "Attended" },
  // ];

  // SCANNER TOGGLE
  const toggleScanner = (e) => {
    e.preventDefault();

    if (isScanning) return;

    setScanMessage("");
    setIsScanning(true);

    const handleScannerToggle = async () => {
      try {
        if (html5QrCodeRef.current) {
          await html5QrCodeRef.current.stop();
          html5QrCodeRef.current = null;
        }

        setIsScannerActive((prevState) => {
          const newState = !prevState;
          if (newState) {
            initializeScanner();
          }
          return newState;
        });
      } catch (error) {
        console.error("Error toggling scanner", error);
      } finally {
        setIsScanning(false);
      }
    };

    handleScannerToggle();
  };

  // SCANNER INITIALIZATION
  const initializeScanner = async () => {
    if (!html5QrCodeRef.current) {
      try {
        const html5QrCode = new Html5Qrcode("reader");
        html5QrCodeRef.current = html5QrCode;

        const qrCodeSuccessCallback = async (decodedText) => {
          if (hasScannedRef.current) return;
          hasScannedRef.current = true;

          try {
            const res = await axios.post(
              `http://localhost:5000/api/organizer/${eventId}/${decodedText}/present`
            );
            setScanMessage(
              res.status === 200
                ? `Attendance confirmed for ${decodedText}`
                : res.status === 409
                ? `Ticket has already been scanned for ${decodedText}`
                : `Error confirming attendance for ${decodedText}`
            );
            fetchData();
          } catch (error) {
            const statusCode = error?.response?.status;
            setScanMessage(
              statusCode === 409
                ? `Ticket has already been scanned for ${decodedText}`
                : statusCode === 404
                ? `Ticket is not registered for this event`
                : `Error confirming attendance for ${decodedText}`
            );
          }
          setTimeout(() => {
            hasScannedRef.current = false;
          }, 5000);
        };

        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          qrCodeSuccessCallback
        );
      } catch (err) {
        console.error("Failed to start QR Code scanning", err);
        setIsScannerActive(false);
        setIsScanning(false);
      }
    }
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current
          .stop()
          .catch((err) => console.error("Error in cleanup", err));
        hasScannedRef.current = false;
        html5QrCodeRef.current = null;
      }
    };
  }, []);

  // HANDLE APPROVE PARTICIPANT BUTTON
  const handleApproveParticipant = async (email) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/organizer/${eventId}/${email}/approve-participant`
      );
      if (res.status === 200) {
        alert(res.data.message);
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // HANDLE DISAPPROVE PARTICIPANT BUTTON
  const handleDisapproveParticipant = async (email) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/organizer/${eventId}/${email}/disapprove-participant`
      );
      if (res.status === 200) {
        alert(res.data.message);
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // HANDLE PRESENT BUTTON
  const handlePresentButton = async (email) => {
    try {
      // Trim the email and ensure consistent casing
      const processedEmail = email.trim().toLowerCase();
      const res = await axios.post(
        `http://localhost:5000/api/organizer/${eventId}/${processedEmail}/present`
      );
      if (res.status === 200) {
        alert(res.data.message);
        fetchData();
      }
    } catch (error) {
      console.log(error);
      // Optional: Add more specific error handling
      alert(error.response?.data?.message || "Error marking as present");
    }
  };

  // HANDLE UNDO PRESENT BUTTON
  const handleUndoPresent = async (email) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/organizer/${eventId}/${email}/undo-present`
      );
      if (res.status === 200) {
        alert(res.data.message);
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // HANDLE EXPORT TO EXCEL
  const handleExportToExcel = async () => {
    try {
      const registrationForm = await axios.get(
        `http://localhost:5000/api/registration/${eventId}/registration-form`
      );

      const sheetsData = registrationForm.data.map((entry) => ({
        name: entry.name || "N/A",
        email: entry.email || "N/A",
        schoolId: entry.school_Id || "N/A",
        section: entry.section || "N/A",
        eventId: (entry.event_Id || entry.event_id || "").toString(),
        eventTitle: entry.event_Title || entry.event_title || "N/A",
        registeredTime: entry.registered_time || entry.registered_Time || "N/A",
      }));

      try {
        const res = await axios.post(
          "http://localhost:5000/api/registration/excel",
          sheetsData,
          {
            headers: {
              "Content-Type": "application/json",
            },
            responseType: "blob",
          }
        );

        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${res.fileName}.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        if (error.status === 400) {
          alert("No one attended yet.");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Section configuration for better abstraction
  const sections = [
    {
      key: "waiting",
      label: "Waiting",
      icon: <Clock className="mr-2 w-4 h-4" />,
    },
    {
      key: "attending",
      label: "Attending",
      icon: <Users className="mr-2 w-4 h-4" />,
    },
    {
      key: "attended",
      label: "Attended",
      icon: <CheckSquare className="mr-2 w-4 h-4" />,
    },
  ];

  return (
    <div className="flex flex-col gap-12 bg-transparent rounded-xl shadow-md">
      <div className="">
        {/* HEADER */}
        <div className="flex flex-col space-y-6 mb-5">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Attendees List
            </h2>
            <p className="text-white/50">
              Manage and view participant details for streamlined event
              coordination.
            </p>
          </div>

          {/* Toggle and Search Function */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Toggle Buttons */}
            <div className="flex bg-transparent border border-[#ffffff]/50 w-[100%] p-1 justify-center rounded-lg overflow-hidden">
              {sections.map((section) => (
                <button
                  key={section.key}
                  className={`
                  flex items-center px-[2.05rem] py-2 rounded-md text-sm font-medium transition-all duration-300
                  ${
                    selectedSection === section.key
                      ? "bg-[#555555] text-white  "
                      : "text-[#ffffff]/50 hover:bg-gray-200 hover:text-gray-800"
                  }
                `}
                  onClick={() => setSelectedSection(section.key)}
                >
                  {section.icon}
                  {section.label}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative flex-grow w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search participants..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="
                bg-[#2f2f2f]
                w-full pl-10 pr-4 py-2 
                border  rounded-lg 
                focus:ring-2 focus:ring-[#666666] focus:border-transparent
                transition-all duration-300
                text-white placeholder-gray-400
              "
              />
            </div>
          </div>
        </div>

        {/* ATTENDEES LIST: WAITING, ATTENDING, ATTENDED */}
        <div className="flex flex-col">
          <div className="bg-transparent border border-[#ffffff]/25 rounded-[10px] py-6 px-8">
            {/* ATTENDEES LIST: WAITING SECTION */}
            <div>
              {selectedSection === "waiting" && (
                <div className="guestContainer">
                  {filterParticipants("Waiting").length > 0 ? (
                    filterParticipants("Waiting").map((email, index) => {
                      const participant = participants.find(
                        (p) => p.status === "Waiting"
                      );
                      const nameIndex = participant.email.indexOf(email);
                      return (
                        <div key={index}>
                          <div className="guestDetails">
                            <h6>{participant.name[nameIndex]}</h6>
                            <p>{email}</p>
                            <div className="flex flex-row items-center gap-6">
                              <button
                                className="bg-[#00ff00] text-[#004f00] p-[2px] rounded-[4px] hover:bg-[#004400] hover:text-[#00ff00] transition-all ease-in-out duration-200"
                                onClick={() => handleApproveParticipant(email)}
                              >
                                <Check size={15} strokeWidth={3} />
                                {/* Approve */}
                              </button>
                              <button
                                className="bg-[#ff0000] text-[#390000] p-[2px] rounded-[4px] hover:bg-[#640000] hover:text-[#ff0000] transition-all ease-in-out duration-200"
                                onClick={() =>
                                  handleDisapproveParticipant(email)
                                }
                              >
                                <X size={15} strokeWidth={3} />
                                {/* Disapprove */}
                              </button>
                            </div>
                          </div>
                          {index < filterParticipants("Waiting").length - 1 && (
                            <div className="smallhr">
                              <hr />
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div>No pending attendees right now.</div>
                  )}
                </div>
              )}
            </div>

            {/* ATTENDEES LIST: ATTENDING SECTION */}
            <div>
              {selectedSection === "attending" && (
                <div className="">
                  <div className="guestContainer">
                    {filterParticipants("Going").length > 0 ? (
                      filterParticipants("Going").map((email, index) => {
                        const participant = participants.find(
                          (p) => p.status === "Going"
                        );
                        const nameIndex = participant.email.indexOf(email);
                        return (
                          <div key={index}>
                            <div className="guestDetails">
                              <h6>{participant.name[nameIndex]}</h6>
                              <p>{email}</p>
                              <div>
                                <button
                                  className="present-btn flex flex-row gap-2 justify-center items-center"
                                  type="submit"
                                  onClick={() => handlePresentButton(email)}
                                >
                                  <Check size={16} />
                                  Present
                                </button>
                              </div>
                            </div>
                            {index < filterParticipants("Going").length - 1 && (
                              <div className="smallhr">
                                <hr />
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div>No attendees right now.</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ATTENDEES LIST: ATTENDED SECTION */}
            <div>
              {selectedSection === "attended" && (
                <div className="attendeeList">
                  <div className="guestContainer">
                    {filterParticipants("Attended").length > 0 ? (
                      filterParticipants("Attended").map((email, index) => {
                        const participant = participants.find(
                          (p) => p.status === "Attended"
                        );
                        const nameIndex = participant.email.indexOf(email);
                        return (
                          <div key={index}>
                            <div className="guestDetails">
                              <h6>{participant.name[nameIndex]}</h6>
                              <p>{email}</p>
                              <div className="flex items-center">
                                <button
                                  className=" text-[#ff0000] p-1 hover:text-[#b80000] transition-all ease-in-out duration-200"
                                  onClick={() => handleUndoPresent(email)}
                                >
                                  <Trash2 size={20} strokeWidth={2} />
                                  {/* Undo */}
                                </button>
                              </div>
                            </div>
                            {index <
                              filterParticipants("Attended").length - 1 && (
                              <div className="smallhr">
                                <hr />
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div>Attendees are still in line right now.</div>
                    )}
                  </div>

                  {/* Export button moved here and styled */}
                  <div className="flex justify-end mt-[4rem]">
                    <div className="exportToExcel">
                      <button onClick={handleExportToExcel}>
                        Export Data
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="line-container w-[100%] h-auto">
        <hr className="border border-white/50" />
      </div>

      {/* QR SCANNER */}
      <div>
        <div className="text-[1.3rem] font-semibold">Event Attendance</div>
        <div className="organizerDescription">
          Efficiently track attendee check-ins and monitor participation in
          real-time during events.
        </div>

        <div className="w-full flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center w-[80%]">
            {/* Scan Result Message */}
            {scanMessage && (
              <div
                className="scanMessage flex w-full"
                style={{
                  backgroundColor:
                    scanMessage.includes("Error") || scanMessage.includes("not")
                      ? "red"
                      : scanMessage.includes("scanned")
                      ? "#B66503"
                      : "green",
                  padding: "10px",
                  margin: "10px 0",
                  borderRadius: "5px",
                }}
              >
                {scanMessage}
              </div>
            )}

            {/* QR Code Scanner Container */}
            <div
              id="reader"
              className="mt-[.5vw] mb-[2vw]"
              style={{
                width: "100%",
                display: isScannerActive ? "block" : "none",
              }}
            ></div>
            <style>{`
            #reader video {
                transform: scaleX(-1);
            }
          `}</style>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="eventScanner">
            <button
              className="flex flex-col justify-center items-center gap-0 w-full h-[7rem]"
              type="button"
              onClick={(e) => {
                toggleScanner(e);
                setSelectedSection("attending");
              }}
            >
              {isScannerActive ? (
                <>
                  <CameraOff size={65} strokeWidth={1.5} />
                  <span>Stop Scanning</span>
                </>
              ) : (
                <>
                  <Camera size={65} strokeWidth={1.5} />
                  <span>Click to open camera for QR Scanning</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Toggle Restriction
      <div>
        <div className="text-[1.3rem] font-semibold">Toggle Registration</div>
        <div className="organizerDescription">
          Enable or disable event registration with a single click for flexible
          attendee management.
        </div>
      </div> */}
    </div>
  );
}

export default RegistrationPage;

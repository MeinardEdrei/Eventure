"use client";
import "../../css/organizerEvents.css";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Html5Qrcode } from "html5-qrcode";
import { ChevronDown, X, Pencil } from "lucide-react";
import RegistrationPage from "./RegistrationPage";
import SharePage from "./SharePage";
import MorePage from "./MorePage";
import EditEventModal from "./EditEventModal";
import { useRouter } from "next/navigation";

function OrganizerEvents() {
  const { data: session } = useSession();
  const { id } = useParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Overview");
  const [activeButton, setActiveButton] = useState("Overview");
  const options = ["Overview", "Registration", "Share", "More"];
  const textareaRef = useRef(null);
  const [selectedSection, setSelectedSection] = useState("waiting");
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [scanMessage, setScanMessage] = useState("");
  const html5QrCodeRef = useRef(null);
  const hasScannedRef = useRef(false);
  const [isScanning, setIsScanning] = useState(false);
  const [message, setMessage] = useState("");
  const [notificationImage, setNotificationImage] = useState(null);
  const [evaluationForm, setEvaluationForm] = useState([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSelect = (option) => {
    setSelected(option);
    setActiveButton(option);
    setIsOpen(false);
  };

  // SCANNER TOGGLE
  const toggleScanner = (e) => {
    e.preventDefault();

    // Prevent multiple simultaneous toggle attempts
    if (isScanning) return;

    setScanMessage("");
    setIsScanning(true);

    const handleScannerToggle = async () => {
      try {
        // FOR STOPPING THE SCANNER
        if (html5QrCodeRef.current) {
          await html5QrCodeRef.current.stop();
          html5QrCodeRef.current = null;
        }

        // Toggle the active state
        setIsScannerActive((prevState) => {
          const newState = !prevState;

          if (newState) {
            initializeScanner();
          }

          return newState; // Initialize
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
              `http://localhost:5000/api/organizer/${id}/${decodedText}/present`
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

  useEffect(() => {
    const textarea = textareaRef.current;

    const adjustHeight = () => {
      textarea.style.height = "auto"; // Reset the height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on content
    };

    if (textarea) {
      adjustHeight(); // Adjust height on component mount
      textarea.addEventListener("input", adjustHeight);
      return () => textarea.removeEventListener("input", adjustHeight); // Cleanup
    }
  }, []);

  // FETCH DATA FROM API
  const fetchData = async () => {
    const res3 = await axios.get(
      `http://localhost:5000/api/evaluation/${id}/evaluation-form`
    );
    setEvaluationForm(res3.data);

    try {
      const res1 = await axios.get(
        `http://localhost:5000/api/event/events${id}`
      );
      const res2 = await axios.get(
        `http://localhost:5000/api/organizer/${id}/participants`
      );
      setParticipants(res2.data);
      setEvent(res1.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // HANDLE DELETE EVALUATION FORM
  const handleDeleteEvaluation = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/evaluation/${id}/delete-form`
      );
      if (res.status === 204) {
        alert("Form deleted successfully.");
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // HANDLE PRESENT BUTTON
  const handlePresentButton = async (email) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/organizer/${id}/${email}/present`
      );
      if (res.status === 200) {
        alert(res.data.message);
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };
  // HANDLE UNDO PRESENT BUTTON
  const handleUndoPresent = async (email) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/organizer/${id}/${email}/undo-present`
      );
      if (res.status === 200) {
        alert(res.data.message);
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };
  // HANDLE APPROVE PARTICIPANT BUTTON
  const handleApproveParticipant = async (email) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/organizer/${id}/${email}/approve-participant`
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
        `http://localhost:5000/api/organizer/${id}/${email}/disapprove-participant`
      );
      if (res.status === 200) {
        alert(res.data.message);
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // HANDLE CANCEL EVENT
  const handleCancelEvent = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/event/${id}/cancel-event`
      );
      if (res.status === 200) {
        alert(res.data.message);
        router.push("/My-Events");
      }
    } catch (error) {
      if (error.response.status === 400) {
        alert("Event not found");
      }
    }
  };

  // HANDLE EXPORT TO EXCEL
  const handleExportToExcel = async () => {
    try {
      const registrationForm = await axios.get(
        `http://localhost:5000/api/registration/${id}/registration-form`
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

        const url = window.URL.createObjectURL(new Blob([response.data]));
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

  // SEND NOTIFICATION
  const handleSendNotification = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("UserId", session?.user?.id);
    formData.append("EventId", id);
    formData.append("Type", "All");
    formData.append("Message", message);
    formData.append("NotificationImage", notificationImage);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/organizer/notification`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status === 200) {
        alert("Notification sent successfully!");
        setMessage("");
        setNotificationImage(null);
      }
    } catch (error) {
      console.error(error);
      alert("Error sending notification");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="w-[60rem] gap-8 m-8 mx-auto flex justify-center flex-col">
        {/* Header and Dropdown */}
        <div className="flex flex-col">
          <div className="flex flex-row justify-end items-end">
            {/* <div className="eventTitle m-0 p-0">{event.title}</div> */}
            <div className="relative w-[11rem]">
              <button
                className="flex items-center justify-between w-[100%] px-4 py-2 bg-[#54366c] font-bold rounded-md shadow-sm capitalize cursor-pointer transition-all duration-200 ease-in"
                onClick={() => setIsOpen(!isOpen)}
              >
                {selected}
                <ChevronDown
                  className={`w-5 h-5 ml-2 transition-transform duration-300 ease-in-out ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="absolute right-0 mt-2 w-full bg-[#54366c] rounded-lg shadow-lg shadow-white/10 z-10">
                  {options.map((option) => (
                    <button
                      key={option}
                      className={`block w-full py-2 px-2 text-left capitalize bg-transparent border-0 cursor-pointer text-white opacity-50 transition-all duration-300 ease-in-out ${
                        selected === option
                          ? "bg-[#9148cd] text font-bold text-white opacity-90"
                          : "hover:bg-purple-700 hover:text-white hover:font-bold hover:opacity-100"
                      }`}
                      onClick={() => handleSelect(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          {/* OVERVIEW PAGE */}
          {activeButton === "Overview" && (
            // Main Container: Overview Page
            <div className="bg-transparent p-10 border rounded-[1rem] border-white/30 flex flex-col gap-5">
              <div className="overviewContainer">
                <img
                  src={`http://localhost:5000/api/event/uploads/${event.eventImage}`}
                  alt="Heron's Night"
                />
                <div className="overviewDetails">
                  <div className="flex flex-col gap-4">
                    {/* Title Container */}
                    <div>
                      <h1>{event.title}</h1>
                    </div>

                    {/* Text Container */}
                    <div>
                      <p>{event.location}</p>
                      <p>
                        {new Date(event.dateStart).toLocaleDateString("en-us", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}{" "}
                        -{" "}
                        {new Date(
                          `${event.dateStart.split("T")[0]}T${event.timeStart}`
                        ).toLocaleTimeString("en-us", {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </p>
                    </div>
                  </div>
                  {/* Edit Event */}
                  <div className="flex flex-row justify-end">
                    <button
                      className="edit-btn py-[0.5rem] px-6 flex flex-row items-center gap-2"
                      onClick={() => setIsEditModalOpen(true)}
                    >
                      <Pencil size={20} strokeWidth={1.5} />
                      Edit
                    </button>
                  </div>

                  {/* Edit Modal */}
                  <EditEventModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    event={event}
                    eventId={id}
                    onUpdateSuccess={fetchData}
                  />
                </div>
              </div>

              <div className="line-container w-[100%] h-auto">
                <hr className="border border-white/50" />
              </div>

              {/* Event Details */}
              <div className="flex flex-col gap-2">
                <div className="organizerHeader">
                  <h6 className="text-[1.3rem] font-semibold">Event Details</h6>
                </div>

                <div className="statContainer">
                  <div className="bg-gradient-to-b from-[#e29fff] to-[#452c5c] rounded-[15px]">
                    <div className="eventStatistic">
                      <p className="text-[0.8rem] font-medium text-[#460055]">
                        Waiting
                      </p>
                      <h3 className="text-[2rem] font-bold text-[#460055]">
                        {" "}
                        {participants.find((p) => p.status === "Waiting")
                          ?.count || 0}
                      </h3>
                    </div>
                  </div>

                  <div className="bg-gradient-to-b from-[#e29fff] to-[#452c5c] rounded-[15px]">
                    <div className="eventStatistic">
                      <p className="text-[0.8rem] font-medium text-[#460055]">
                        Attending
                      </p>
                      <h3 className="text-[2rem] font-bold text-[#460055]">
                        {/* PARTICIPANTS WITH STATUS COUNT: ATTENDING = GOING + ATTENDED */}{" "}
                        {["Going", "Attended"]
                          .map(
                            (status) =>
                              participants.find((p) => p.status === status)
                                ?.count || 0
                          )
                          .reduce((total, count) => total + count, 0)}
                      </h3>
                    </div>
                  </div>

                  <div className="bg-gradient-to-b from-[#FF585B] to-[#993537] rounded-[15px]">
                    <div className="eventStatistic">
                      <p className="text-[0.8rem] font-medium text-[#670002]">
                        Cancelled
                      </p>
                      <h3 className="text-[2rem] font-bold text-[#670002]">
                        {" "}
                        {participants.find((p) => p.status === "Cancelled")
                          ?.count || 0}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              <div className="line-container w-[100%] h-auto">
                <hr className="border border-white/50" />
              </div>

              {/* Event Partners */}
              <div className="flex flex-col gap-4">
                <div className="">
                  <div className="text-[1.3rem] font-semibold">
                    Event Partners
                  </div>
                  {/* <div className="organizerDescription">
                    Add hosts, special guests, and event managers.
                  </div> */}
                </div>

                <div className="guestContainer">
                  {JSON.parse(event.partnerships).map((partner, index) => (
                    <div key={index}>
                      <div className="guestRowContainer">
                        <div className="guestDetails">
                          <h6>{partner}</h6>
                        </div>
                        <div className="">
                          <button className="removeHostButton">
                            <X size={20} />
                          </button>
                        </div>
                      </div>
                      {/* {index < JSON.parse(event.partnerships).length - 1 && (
                        <div className="smallhr">
                          <hr />
                        </div>
                      )} */}
                    </div>
                  ))}
                </div>

                {/* <div className="addHostContainer">
                  <input
                    type="text"
                    className="addHostsName"
                    placeholder="Type event partners"
                  />
                  <button className="addHosts">Add Partners</button>
                </div> */}
              </div>
            </div>
          )}

          {/* REGISTRATION PAGE */}
          {activeButton === "Registration" && (
            <RegistrationPage
              participants={participants}
              fetchData={fetchData}
              eventId={id}
            />
          )}

          {/* SHARE PAGE */}
          {activeButton === "Share" && (
            <>
              <SharePage />
            </>
          )}

          {/* MORE PAGE */}
          {activeButton === "More" && (
            <MorePage
              event={event}
              evaluationForm={evaluationForm}
              fetchData={fetchData}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default OrganizerEvents;

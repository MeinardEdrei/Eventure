// My Events Page
"use client";
import { useEffect, useState } from "react";
import "../css/organizerList.css";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Pencil } from "lucide-react";

import PDFUploadModal from "./UploadModal";
import EditEventModal from "../Event-Details/[id]/EditEventModal";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  Search,
  Clock,
  CheckCircle,
  Edit,
  XCircle,
  CirclePlus,
  CalendarOff,
} from "lucide-react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";


function MyEvents() {
  const [selected, setSelected] = useState("Created");
  const progressOptions = [
    "Created",
    "Pending",
    "Pre-Approved",
    "Approved",
    "Rejected",
  ];

  // const { id } = useParams();

  const [isOpen, setIsOpen] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState({});

  // New state for Toggle and Search
  const [selectedSection, setSelectedSection] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Status icons mapping
  const statusIcons = {
    Created: <CirclePlus className="mr-2 h-4 w-4" />,
    Pending: <Clock className="mr-2 h-4 w-4" />,
    PreApproved: <CheckCircle className="mr-2 h-4 w-4" />,
    Approved: <Edit className="mr-2 h-4 w-4" />,
    Rejected: <XCircle className="mr-2 h-4 w-4" />,
  };

  // Count of events per status
  const [eventCounts, setEventCounts] = useState({
    Created: 0,
    Pending: 0,
    PreApproved: 0,
    Approved: 0,
    Rejected: 0,
  });

  // Search handler
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(3); // Number of events per page

  // Pagination handler
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;

  const fetchData = async () => {
    try {
      setLoading(true); // Set loading to true before fetching

      // Simulate a 5-second delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (session) {
        const res = await axios.get(
          `http://localhost:5000/api/organizer/events/${session?.user?.id}`
        );
        setEvents(res.data);

        // Calculate event counts for each status
        const counts = res.data.reduce((acc, event) => {
          acc[event.status] = (acc[event.status] || 0) + 1;
          return acc;
        }, {});

        setEventCounts(counts);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const fetchRejectReason = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/event/${id}/rejection-reason`);
      if (response.status === 200) {
        return response.data.reason;
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchRejectionReasons = async () => {
      const reasons = {};
      for (const event of events) {
        if (event.status === "Rejected") {
          const reason = await fetchRejectReason(event.id);
          reasons[event.id] = reason;
        }
      }
      setRejectionReason(reasons);
    };
  
    if (events.length > 0) {
      fetchRejectionReasons();
    }
  }, [events]);

  useEffect(() => {
    fetchData();
  }, [session]);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  const handleFileUpload = async (files) => {
    // console.log("Files to upload:", files);
    try {
      const formData = new FormData();

      formData.append("id", selectedEvent.id);
      files.forEach((file) => formData.append("files", file));
      const res = await axios.post(
        "http://localhost:5000/api/organizer/upload-requirements",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 200) {
        alert(res.data.message);
        fetchData();

        const newFileNames = files.map((file) => file.name);
        setSelectedEvent((prev) => ({
          ...prev,
          requirementFiles: [...prev.requirementFiles, ...newFileNames],
          requirementFilesCount:
            prev.requirementFilesCount + newFileNames.length,
        }));

        setIsUploadModalOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteFile = async (id, eventType, fileName) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/organizer/deleteFile/${id}/${eventType}/${fileName}`
      );
      if (res.status === 200) {
        // alert("Deleted Successfully");
        fetchData();
        setSelectedEvent((prevEvent) => ({
          ...prevEvent,
          requirementFiles: prevEvent.requirementFiles.filter(
            (file) => file !== fileName
          ),
          requirementFilesCount: prevEvent.requirementFilesCount - 1,
        }));
      }
    } catch (error) {
      console.error("PDF Deletion Failed", error);
    }
  };

  const handleFileDownload = async (eventType, fileName) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/organizer/download/${eventType}/${fileName}`,
        {
          responseType: "blob",
        }
      );

      // Create download mechanism
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );

      // Create temporary link
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF Download Failed", error);
    }
  };

  const handleEventSubmit = async (id) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/event/${id}/pending`);
    } catch (error) {
      if (response.status === 200) {
        alert(response.data.message);
      } else {
        console.log("Event submission failed", error);
      }
    }
  }

  // Modified filtering to include pagination
  useEffect(() => {
    const filtered = events
      .filter((event) => event.status === selected)
      .filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );

    // Slice the filtered events for pagination
    const currentEvents = filtered.slice(indexOfFirstEvent, indexOfLastEvent);

    setFilteredEvents(currentEvents);
  }, [selected, events, searchQuery, currentPage, eventsPerPage]);

  if (loading)
    return (
      <div className="org-list-mnc">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-2">
          <Skeleton
            variant="text"
            sx={{
              fontSize: "2rem",
              backgroundColor: "rgba(255,255,255,0.1)",
              width: "200px",
            }}
          />

          {/* Status Toggle and Search Skeleton */}
          <div className="flex flex-row gap-4 items-center justify-between mb-2">
            <div className="flex flex-row gap-1 w-full">
              <Skeleton
                variant="rectangular"
                width="100%"
                height={50}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
            </div>
            <div className="w-[30%]">
              <Skeleton
                variant="rectangular"
                width="100%"
                height={50}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex flex-col items-center w-[100%]">
          <div className="content-wrapper flex flex-col items-start gap-4 w-[80%]">
            <Skeleton
              variant="text"
              sx={{
                fontSize: "1.5rem",
                backgroundColor: "rgba(255,255,255,0.1)",
                width: "150px",
              }}
            />

            <div className="cards-container w-full space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="w-full">
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={250}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  // Render different event card based on status
  const renderEventCard = (event) => {
    switch (event.status) {
      case "Created":
        return renderCreatedEventCard(event);
      case "Pending":
        return renderPendingEventCard(event);
      case "Pre-Approved":
        return renderPreApprovedEventCard(event);
      case "Approved":
        return renderApprovedEventCard(event);
      case "Rejected":
        return renderRejectedEventCard(event);
      default:
        return renderDefaultEventCard(event);
    }
  };

  // Event Card for Created Status
  const renderCreatedEventCard = (event) => (
    <div key={event.id} className="organizerEventCard created-event-card">
      {/* Created Event Card Content */}
      <div className="organizerImage">
        <img
          src={`http://localhost:5000/api/event/uploads/${event.eventImage}`}
          alt={event.title}
        />
      </div>
      <div className="cardDetails w-full">
        <div className="flex flex-row justify-between items-start">
          <div className="flex flex-col mb-4">
            <div className="cardTitle">{event.title}</div>
            <div className="cardInfo">
              <p>{event.location}</p>
              <p>
                {new Date(event.dateStart).toLocaleDateString("en-us", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-4 justify-end">
          {/* Edit Event */}
          <div className="flex flex-row justify-end">
            <button
              className="edit-btn py-[0.5rem] px-6 flex flex-row items-center gap-2"
              onClick={() => {
                setSelectedEvent(event);
                setIsEditModalOpen(true);
              }}
            >
              <Pencil size={20} strokeWidth={1.5} />
              Edit
            </button>
          </div>

          {/* Edit Modal */}
          <EditEventModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            event={selectedEvent}
            eventId={selectedEvent?.id}
            onUpdateSuccess={fetchData}
            setSelectedEvent={setSelectedEvent}
          />

          {/* Button: Upload Requirements */}
          <button
            type="button"
            onClick={() => {
              setIsUploadModalOpen(true);
              setSelectedEvent(event);
            }}
            className="bg-[#b6b6b6] hover:bg-[#6a6a6a] text-[#000000] hover:text-white transition-all flex items-center gap-2 px-4 py-2 rounded"
          >
            <i
              className={`fa ${
                event.requirementFilesCount === 0 ? "fa-plus" : "fa-cog"
              } text-[0.8rem]`}
              aria-hidden="true"
            ></i>
            <p className="text-[0.8rem]">
              {event.requirementFilesCount === 0
                ? "Upload Files"
                : "Manage Requirements"}
            </p>
          </button>

          {/* Button: Submit Event */}
          {event.requirementFilesCount > 0 && (
            <button
              type="button"
              onClick={() => {
                handleEventSubmit(selectedEvent.id);
              }}
              className="bg-[#387b31] hover:bg-[#2b6026] text-white hover:text-white transition-all flex items-center gap-2 px-4 py-2 rounded"
            >
              <FontAwesomeIcon icon={faPaperPlane}/>
              <p>Submit</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Event Card for Pending Status
  const renderPendingEventCard = (event) => (
    <div key={event.id} className="organizerEventCard pending-event-card">
      {/* Pending Event Card Content */}
      <div className="organizerImage">
        <img
          src={`http://localhost:5000/api/event/uploads/${event.eventImage}`}
          alt={event.title}
        />
      </div>
      <div className="cardDetails w-full">
        <div className="flex flex-row justify-between items-start">
          <div className="flex flex-col mb-4">
            <div>
              <div className="cardTitle">{event.title}</div>
              <div className="cardInfo">
                <p>{event.location}</p>
                <p>
                  {new Date(event.dateStart).toLocaleDateString("en-us", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="inline-block bg-[#4A4A4A] mt-2 px-2 py-[2px] rounded">
                <p className="text-[0.8rem] text-white">Status: {selected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons for Pending */}
        <div className="flex flex-row gap-4 justify-end">
          {/* Edit Event */}
          <div className="flex flex-row justify-end">
            <button
              className="edit-btn py-[0.5rem] px-6 flex flex-row items-center gap-2"
              onClick={() => {
                setSelectedEvent(event);
                setIsEditModalOpen(true);
              }}
            >
              <Pencil size={20} strokeWidth={1.5} />
              Edit
            </button>
          </div>

          {/* Edit Modal */}
          <EditEventModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            event={selectedEvent}
            eventId={selectedEvent?.id}
            onUpdateSuccess={fetchData}
            setSelectedEvent={setSelectedEvent}
          />

          {/* Button: See Details */}
          {/* <Link href={`/Event-Details/${event.id}`}>
            <div className="bg-transparent hover:bg-[#ffffff]/50 transition-all border border-[#ffffff]/25 flex items-center gap-2 px-4 py-2 rounded">
              <i
                className="fa fa-info-circle text-[0.8rem]"
                aria-hidden="true"
              ></i>
              <button className="text-[0.8rem]">See Details</button>
            </div>
          </Link> */}

          {/* Button: Upload Requirements */}
          {/* {event.status === selected &&
            (selected === "Pending" || selected === "Modified") && (
              <button
                type="button"
                onClick={() => {
                  setIsUploadModalOpen(true);
                  setSelectedEvent(event);
                }}
                className="bg-[#b6b6b6] hover:bg-[#6a6a6a] text-[#000000] hover:text-white transition-all flex items-center gap-2 px-4 py-0 rounded"
              >
                <i
                  className={`fa ${
                    event.requirementFilesCount === 0 ? "fa-plus" : "fa-cog"
                  } text-[0.8rem]`}
                  aria-hidden="true"
                ></i>
                <p className="text-[0.8rem]">
                  {event.requirementFilesCount === 0
                    ? "Upload Requirements"
                    : "Manage Requirements"}
                </p>
              </button>
            )} */}
        </div>
      </div>
    </div>
  );

  // Event Card for Approved Status
  const renderApprovedEventCard = (event) => (
    <div key={event.id} className="organizerEventCard approved-event-card">
      {/* Approved Event Card Content */}
      <div className="organizerImage">
        <img
          src={`http://localhost:5000/api/event/uploads/${event.eventImage}`}
          alt={event.title}
        />
      </div>
      <div className="cardDetails w-full">
        <div className="flex flex-row justify-between items-start gap-10">
          <div className="flex flex-col mb-4">
            <div>
              <div className="cardTitle">{event.title}</div>
              <div className="cardInfo">
                <p>{event.location}</p>
                <p>
                  {new Date(event.dateStart).toLocaleDateString("en-us", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="inline-block bg-[#008C10] mt-2 px-2 py-[2px] rounded">
                <p className="text-[0.8rem] text-white">Status: {selected}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-4 justify-end">
          {/* Button: See Details */}
          <Link href={`/Event-Details/${event.id}`}>
            <div className="bg-transparent hover:bg-[#ffffff]/50 transition-all border border-[#ffffff]/25 flex items-center gap-2 px-4 py-2 rounded">
              <i
                className="fa fa-info-circle text-[0.8rem]"
                aria-hidden="true"
              ></i>
              <button className="text-[0.8rem]">See Details</button>
            </div>
          </Link>

          {/* Button: Upload Requirements */}
          {event.status === selected &&
            (selected === "Created") && (
              <button
                type="button"
                onClick={() => {
                  setIsUploadModalOpen(true);
                  setSelectedEvent(event);
                }}
                className="bg-[#b6b6b6] hover:bg-[#6a6a6a] text-[#000000] hover:text-white transition-all flex items-center gap-2 px-4 py-0 rounded"
              >
                <i
                  className={`fa ${
                    event.requirementFilesCount === 0 ? "fa-plus" : "fa-cog"
                  } text-[0.8rem]`}
                  aria-hidden="true"
                ></i>
                <p className="text-[0.8rem]">
                  {event.requirementFilesCount === 0
                    ? "Upload Requirements"
                    : "Manage Requirements"}
                </p>
              </button>
            )}
        </div>
      </div>
    </div>
  );

  // Event Card for Pre-Approvedd Status
  const renderPreApprovedEventCard = (event) => (
    <div key={event.id} className="organizerEventCard modified-event-card">
      {/* PreApproved Event Card Content */}
      <div className="organizerImage">
        <img
          src={`http://localhost:5000/api/event/uploads/${event.eventImage}`}
          alt={event.title}
        />
      </div>
      <div className="cardDetails w-full">
        <div className="flex flex-row justify-between items-start gap-10">
          <div className="flex flex-col mb-4">
            <div>
              <div className="cardTitle">{event.title}</div>
              <div className="cardInfo">
                <p>{event.location}</p>
                <p>
                  {new Date(event.dateStart).toLocaleDateString("en-us", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="inline-block bg-[#00158C] mt-2 px-2 py-[2px] rounded">
                <p className="text-[0.8rem] text-white">Status: {selected}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Event Card for Rejected Status
  const renderRejectedEventCard = (event) => (
    // Card Container for Rejected Status
    <div className="border border-[#404040] rounded-l-lg overflow-hidden gap-4 flex flex-col w-full">
      {/* Upper Part */}
      <div className="flex flex-col">
        <div key={event.id} className=" rejected-event-card flex flex-row">
          {/* Rejected Event Card Content */}
          <div className="w-[16rem] h-auto">
            <img
              className="w-full h-full object-cover"
              src={`http://localhost:5000/api/event/uploads/${event.eventImage}`}
              alt={event.title}
            />
          </div>
          <div className="cardDetails w-full">
            <div className="flex flex-row justify-between items-start">
              <div className="flex flex-col mb-4">
                <div>
                  <div className="cardTitle">{event.title}</div>
                  <div className="cardInfo">
                    <p>{event.location}</p>
                    <p>
                      {new Date(event.dateStart).toLocaleDateString("en-us", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="inline-block bg-[#8D0000] mt-2 px-2 py-[2px] rounded">
                    <p className="text-[0.8rem] text-white">
                      Status: {selected}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="line-container w-[100%] h-auto">
          <div className="w-full h-[0.25px] bg-[#404040]"></div>
        </div>
      </div>

      {/* Lower Part */}
      <div className="pb-4 px-6 flex flex-col mt-2 gap-4">
        <div className="bg-[#FF4242]/50 rounded p-3 flex flex-col gap-2">
          <h3 className="text-[1rem] font-bold">
            From Admin: Reason of Rejection
          </h3>
          <p className="text-[0.8rem]">
            {rejectionReason[event.id] || "Loading..."}
          </p>
        </div>
        <div className="flex flex-row gap-4 justify-end">
          {/* Button: See Details */}
          <Link href={`/Event-Details/${event.id}`}>
            <div className="bg-transparent hover:bg-[#ffffff]/50 transition-all border border-[#ffffff]/25 flex items-center gap-2 px-4 py-2 rounded">
              <i
                className="fa fa-info-circle text-[0.8rem]"
                aria-hidden="true"
              ></i>
              <button className="text-[0.8rem]">See Details</button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );

  // Default Event Card (fallback)
  const renderDefaultEventCard = (event) => (
    <div key={event.id} className="organizerEventCard default-event-card">
      <div className="organizerImage">
        <img
          src={`http://localhost:5000/api/event/uploads/${event.eventImage}`}
          alt={event.title}
        />
      </div>
      <div className="cardDetails w-full">
        <div className="flex flex-row justify-between items-start gap-10">
          <div className="flex flex-col mb-4">
            <div>
              <div className="cardTitle">{event.title}</div>
              <div className="cardInfo">
                <p>{event.location}</p>
                <p>
                  {new Date(event.dateStart).toLocaleDateString("en-us", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="inline-block bg-[#4A4A4A] mt-2 px-2 py-[2px] rounded">
                <p className="text-[0.8rem] text-white">Status: {selected}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-4 justify-end">
          {/* Button: See Details */}
          <Link href={`/Event-Details/${event.id}`}>
            <div className="bg-transparent hover:bg-[#ffffff]/50 transition-all border border-[#ffffff]/25 flex items-center gap-2 px-4 py-2 rounded">
              <i
                className="fa fa-info-circle text-[0.8rem]"
                aria-hidden="true"
              ></i>
              <button className="text-[0.8rem]">See Details</button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="org-list-mnc">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="eventTitle">My Events</div>

        {/* Status Toggle Buttons with Search */}
        <div className="flex flex-col w-full md:flex-row gap-4 items-center justify-between mb-2">
          {/* Status Toggle Buttons */}
          <div className="flex flex-row gap-1 bg-transparent border border-[#ffffff]/30 w-[100%] p-1 justify-between rounded-lg overflow-hidden mb-2 md:mb-0">
            {progressOptions.map((option) => (
              <button
                key={option}
                className={`
                  flex items-center px-[1.1rem] py-2 rounded-md text-sm transition-all duration-300
                  ${
                    selected === option
                      ? "bg-[#bababa] text-black"
                      : "text-[#ffffff]/50 hover:bg-gray-200 hover:text-gray-800"
                  }
                `}
                onClick={() => setSelected(option)}
              >
                {statusIcons[option]}
                {option}
                <p className="ml-2 text-[0.8rem] text-[#ffffff]/50 bg-[#484848]/70 px-2 rounded">
                  {eventCounts[option] || 0}
                </p>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative flex-grow w-[30%]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="
                bg-transparent
                w-full pl-10 pr-4 py-2 
                border border-[#ffffff]/30 rounded-lg 
                focus:ring-2 focus:ring-[#666666] focus:bg-[#343434]
                transition-all duration-300
                text-white placeholder-gray-400 outline-none
              "
            />
          </div>
        </div>

        {/* <div className="line-container w-[100%] h-auto">
          <hr className="border border-solid border-[#ffffff62]" />
        </div> */}
      </div>

      {/* Contents */}
      <div className="flex flex-col items-center justify-between w-[100%]">
        <div className="content-wrapper flex flex-col items-start gap-4 w-[80%]">
          {/* Status */}
          <div className="card-status">
            {selected === "Created" ? (
              <h3>Recently {selected}</h3>
            ) : (
              <h3>{selected}</h3>
            )}
          </div>

          <div className="cards-container w-full">
            {filteredEvents.length === 0 ? (
              <div className="flex flex-col opacity-20 items-center mt-9 justify-center text-center w-full ] text-white">
                <div>
                  <CalendarOff size={100} color="#ffffff" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[1.2rem] font-bold">
                    {" "}
                    You don't have any {selected} events yet.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {filteredEvents.map((event, index) => (
                  <div key={index}> 
                    {renderEventCard(event)}
                  </div>
                ))}

                {/* Pagination Component */}
                <div className="flex justify-center w-full mt-10">
                  <Pagination
                    count={Math.ceil(
                      events.filter((event) => event.status === selected)
                        .length / eventsPerPage
                    )}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    variant="outlined"
                    shape="rounded"
                    // hidePrevButton
                    // hideNextButton
                    className="custom-pagination"
                    sx={{
                      "& .MuiPaginationItem-root": {
                        color: "white",
                        border: "1px solid rgba(255,255,255,0.3)",
                        backgroundColor: "transparent",
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.2)",
                        },
                      },
                      "& .Mui-selected": {
                        backgroundColor: "#ffffff !important",
                        color: "#000000",
                      },
                    }}
                  />
                </div>
              </>
            )}

            <PDFUploadModal
              isOpen={isUploadModalOpen}
              onClose={() => setIsUploadModalOpen(false)}
              onUpload={handleFileUpload}
              event={selectedEvent}
              handleDeleteFile={handleDeleteFile}
              handleFileDownload={handleFileDownload}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyEvents;

"use client";
import React, { useState, useEffect } from "react";
import "../css/Event-Management.css";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ChevronDown, Check, CheckCheck, X, Info } from "lucide-react";
import axios from "axios";
import ConfirmationModal from "./ConfirmationModal";
import ViewEventModal from "./ViewEventModal";
import RejectReasonModal from "./RejectReasonModal";
import Alert from "../Create-Event/Alert";
import {
  format,
  parseISO,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from "date-fns";
import { CalendarIcon, CalendarOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function EventApproval() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noEvents, setNoEvents] = useState(true);
  const [searchEventQuery, setsearchEventQuery] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  // For alert messages
  const [alert, setAlert] = useState(null);
  const showAlert = (type, message) => {
    setAlert({ type, message });

    // Automatically dismiss the alert after 5 seconds
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  const dismissAlert = () => {
    setAlert(null);
  };

  // For Event Modal
  const [viewEventModal, setViewEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // For Confirmation Modal
  const [preApproveConfirmModal, setPreApproveConfirmModal] = useState(false);
  const [approveConfirmModal, setApproveConfirmModal] = useState(false);
  const [confirmationEventId, setConfirmationEventId] = useState(null);

  // For Reject Reason Modal
  const [rejectReasonModal, setRejectReasonModal] = useState(false);
  const [selectedRejectEvent, setSelectedRejectEvent] = useState(null);
  const [appealRequest, setAppealRequest] = useState({});

  const [selected, setSelected] = useState("Pending");
  const [options, setOptions] = useState([
    "Pending",
    "Pre-Approved",
    "Approved",
    "Rejected",
    "Appealed",
  ]);

  useEffect(() => {
    if (session?.user?.role === "Admin") {
      setOptions(["Pre-Approved", "Approved", "Rejected"]);
      setSelected("Pre-Approved");
    } else if (session?.user?.role === "Staff") {
      setOptions(["Pending", "Rejected", "Appealed"]);
      setSelected("Pending");
    }
  }, [session]);

  const fetchAppealRequest = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/event/${id}/appeal-request`
      );
      if (response.status === 200) {
        return response.data.request;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchAppealRequests = async () => {
      const requests = {};
      for (const event of events) {
        if (event.status === "Appealed") {
          const request = await fetchAppealRequest(event.id);
          requests[event.id] = request;
        }
      }
      setAppealRequest(requests);
    };

    if (events.length > 0) {
      fetchAppealRequests();
    }
  }, [events]);

  const fetchData = async () => {
    try {
      setLoading(true); // Set loading to true before fetching

      // Simulate a 5-second delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const res = await axios.get(
        "http://localhost:5000/api/event/event-approval"
      );
      if (res.status === 200) {
        setEvents(res.data);
        setNoEvents(res.data.length === 0);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [session]);

  // Enhanced filtering function
  const filteredEvents = events.filter((event) => {
    // Filter by status
    const matchesStatus = event.status === selected;

    // Filter by search query (case-insensitive)
    const matchesSearch =
      searchEventQuery === "" ||
      event.title.toLowerCase().includes(searchEventQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchEventQuery.toLowerCase()) ||
      event.dateStart.toLowerCase().includes(searchEventQuery.toLowerCase());

    // Filter by date range
    const matchesDateRange =
      !dateRange.from ||
      !dateRange.to ||
      (new Date(event.dateStart) >= dateRange.from &&
        new Date(event.dateStart) <= dateRange.to);

    // Return true only if all filters pass
    return matchesStatus && matchesSearch && matchesDateRange;
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setsearchEventQuery(e.target.value);
  };

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
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

  const handlePreApprove = async (eventId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/event/${eventId}/pre-approve`
      );

      if (res.status === 200) {
        showAlert("success", "Event pre-approved successfully");
        fetchData();
      }
    } catch (error) {
      console.error("Error approving event:", error);
    }
  };

  const handleApprove = async (eventId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/event/${eventId}/approve`
      );

      if (res.status === 200) {
        showAlert("success", "Event approved successfully");
        fetchData();
      }
    } catch (error) {
      console.error("Error approving event:", error);
    }
  };

  const handleReject = async (eventId, reason) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/event/${eventId}/reject`,
        reason,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        showAlert("success", "Event rejected successfully");
        fetchData();
      }
    } catch (error) {
      console.error("Error rejecting event:", error);
    }
  };

  const openPreApproveConfirmModal = (eventId) => {
    setConfirmationEventId(eventId);
    setPreApproveConfirmModal(true);
  };

  const openApproveConfirmModal = (eventId) => {
    setConfirmationEventId(eventId);
    setApproveConfirmModal(true);
  };

  const openRejectReasonModal = (event) => {
    setSelectedRejectEvent(event);
    setRejectReasonModal(true);
  };

  const closeRejectReasonModal = () => {
    setSelectedRejectEvent(null);
    setRejectReasonModal(false);
  };

  const openEventModal = (event) => {
    setSelectedEvent(event);
    setViewEventModal(true);
  };

  const closeEventModal = () => {
    setSelectedEvent(null);
    setViewEventModal(false);
  };

  if (loading) {
    return (
      <div className="event-maincontainer flex flex-col justify-center items-center mt-5">
        <div className="w-[82%] mb-10">
          <div className="flex flex-row justify-between items-end mb-4">
            <div>
              <Skeleton
                variant="text"
                width={300}
                height={40}
                sx={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              />
              <Skeleton
                variant="text"
                width={500}
                height={20}
                sx={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              />
            </div>
            <Skeleton
              variant="rectangular"
              width={180}
              height={50}
              sx={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            />
          </div>
        </div>

        <div className="box-maincontainer flex flex-col w-[50%] justify-center">
          <div className="flex flex-row justify-between mb-4 items-center">
            <Skeleton
              variant="text"
              width={200}
              height={30}
              sx={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            />
            <div className="flex flex-row gap-4">
              <Skeleton
                variant="rectangular"
                width={200}
                height={40}
                sx={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              />
              <Skeleton
                variant="rectangular"
                width={200}
                height={40}
                sx={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              />
            </div>
          </div>

          <div className="cards-container flex flex-col w-full gap-2">
            {[1, 2, 3].map((item) => (
              <Skeleton
                key={item}
                variant="rectangular"
                width="100%"
                height={200}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  marginBottom: "16px",
                  borderRadius: "12px",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="event-maincontainer flex flex-col justify-center items-center mt-5">
      {/* Header */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={dismissAlert}
        />
      )}
      <div className="upper-maincontainer flex flex-col w-[82%] mb-10">
        <div className="text-btn-container flex flex-row justify-between items-end mb-4">
          <div className="header-text-container flex flex-col">
            <h2 className="event-title">Event Management</h2>
            <p className="event-description">
              Create events, review them, and approve upcoming submissions by
              users.
            </p>
          </div>
          {/* Dropdown Container */}
          <div className="relative w-[11rem]">
            <button
              className="flex items-center justify-between w-[100%] px-4 py-2 bg-[#4e4e4e4d] border border-[#fff0f04d] font-bold rounded-md shadow-sm capitalize cursor-pointer transition-all duration-200 ease-in"
              onClick={() => setIsOpen(!isOpen)}
            >
              {selected}
              <i
                className={`dropdown-icon fas fa-chevron-down ${
                  isOpen ? "rotate-180" : ""
                } ml-2 transition-transform duration-300 ease-in-out`}
              ></i>
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-full bg-[#414141] rounded-lg shadow-lg shadow-white/10 z-10">
                {options.map((option) => (
                  <button
                    key={option}
                    className={`block w-full py-2 px-2 text-left capitalize bg-transparent border-0 cursor-pointer text-white opacity-50 transition-all duration-300 ease-in-out ${
                      selected === option
                        ? "bg-[#7b7b7b] text font-bold text-white opacity-90"
                        : "hover:bg-[#656565] hover:text-white hover:font-bold hover:opacity-100"
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

        <div className="line-container w-[100%] h-auto">
          <hr className="border border-white/50" />
        </div>
      </div>

      {/* Content */}
      <div className="box-maincontainer flex flex-col w-[50%] justify-center">
        <div className="flex flex-row justify-between mb-4 items-center">
          <div className="text-[1.3rem] font-bold">
            <h3 className="capitalize">{selected} Events</h3>
          </div>

          <div className="flex flex-row gap-4">
            {/* Search Container */}
            <div className="search-container">
              <div className="relative group w-full">
                <i
                  className="fa fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#F7F0FF]/80"
                  aria-hidden="true"
                ></i>
                <input
                  className="w-48 h-9 pl-11 pr-5 py-[1.1rem] text-large bg-[#463951]/50 text-[#F7F0FF] border border-[#fff0f0b3]/25 rounded-[8px] outline-none focus:border-[#F7F0FF]/30 transition-all duration-300"
                  placeholder="Search"
                  value={searchEventQuery}
                  onChange={handleSearchChange}
                />
                <div
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/30 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ zIndex: -1 }}
                />
              </div>
            </div>

            {/* Date Picker */}
            <div className="relative group">
              <DatePickerWithRange
                className=""
                onDateChange={setDateRange}
                selectedRange={dateRange}
              />
              <div
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/30 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ zIndex: -1 }}
              />
            </div>
          </div>
        </div>

        {/* {noEvents && <>No events found.</>} */}

        {/* Latest Design */}
        <div className="cards-container flex flex-col w-full gap-2">
          {filteredEvents.length === 0 ? (
            <div className="flex flex-col opacity-20 mt-14 items-center justify-center text-center w-full ] text-white">
              <div>
                <CalendarOff size={100} color="#ffffff" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[1.2rem] font-bold">
                  You don't have any {selected} events yet.
                </p>
              </div>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="organizerEventCard w-full max-w-full h-auto border border-[var(--borderColor)] rounded-l-xl overflow-hidden flex flex-row bg-[var(--color0)] transition-[var(--transition)] mb-4"
              >
                <div className="organizerImage w-[16rem] h-auto ">
                  <img
                    className="w-[100%] h-[100%] object-cover"
                    src={`http://localhost:5000/api/event/uploads/${event.eventImage}`}
                    alt={event.title}
                  />
                </div>
                <div className="cardDetails w-full pt-4 pr-6 pb-4 pl-12">
                  <div className="flex flex-row justify-between items-start gap-10">
                    <div className="flex flex-col mb-4">
                      <div className="cardTitle text-[1.5rem] font-bold mb-2 ">
                        {event.title}
                      </div>
                      <div className="cardInfo text-[0.9rem] leading-tight opacity-80">
                        <div>
                          <p>{event.location}</p>
                          <p>
                            {new Date(event.dateStart).toLocaleDateString(
                              "en-us",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <div className="">
                          <button
                            className="flex flex-row gap-1 items-center mt-2 underline text-[0.8rem]"
                            onClick={() => openEventModal(event)} // Pass the entire event object
                          >
                            <Info size={12} />
                            See Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lower Part */}
                  <div className="pb-4 flex flex-col mt-2 gap-4">
                    <div className="bg-[#FF4242]/50 rounded p-3 flex flex-col gap-2">
                      <h3 className="text-[1rem] font-bold">
                        From Organizer: Appeal Request
                      </h3>
                      <p className="text-[0.8rem]">
                        {appealRequest[event.id] || "Loading..."}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row gap-4 justify-end">
                    <div className="event-btn flex flex-row gap-4">
                      {/* Button: Pre Approve */}
                      {(selected === "Pending" || selected === "Appealed") && (
                        <div className="pre-approve-btn flex items-center gap-2 px-4 py-2 rounded">
                          <Check size={16} />
                          <button
                            className="text-[0.8rem]"
                            onClick={() => openPreApproveConfirmModal(event.id)}
                            disabled={event.status === "approved"}
                          >
                            Pre-approve
                          </button>
                        </div>
                      )}
                      {/* Button: Approve */}
                      {selected === "Pre-Approved" && (
                        <div className="approve-btn">
                          <span className="flex items-center">
                            <CheckCheck size={16} />
                          </span>
                          <button
                            className="approve"
                            onClick={() => openApproveConfirmModal(event.id)}
                            disabled={event.status === "approved"}
                          >
                            Approve
                          </button>
                        </div>
                      )}
                      {/* Button: Reject */}
                      {(selected === "Pre-Approved" ||
                        selected === "Pending") && (
                        <div
                          onClick={() => openRejectReasonModal(event)}
                          className="reject-btn"
                        >
                          <span className="flex items-center">
                            <X size={16} />
                          </span>
                          <button
                            className="reject"
                            disabled={event.status === "rejected"}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Confirmation Modals */}
        <ConfirmationModal
          isOpen={preApproveConfirmModal}
          onClose={() => setPreApproveConfirmModal(false)}
          onConfirm={() => handlePreApprove(confirmationEventId)}
          title="Confirm Pre-Approval"
          message="Are you sure you want to pre-approve this event?"
          confirmButtonText="Pre-Approve"
        />

        <ConfirmationModal
          isOpen={approveConfirmModal}
          onClose={() => setApproveConfirmModal(false)}
          onConfirm={() => handleApprove(confirmationEventId)}
          title="Confirm Approval"
          message="Are you sure you want to approve this event?"
          confirmButtonText="Approve"
        />

        {/* View Event Modal */}
        <ViewEventModal
          isOpen={viewEventModal}
          onClose={closeEventModal}
          eventData={selectedEvent} // Pass the selected event data
          handleApprove={handleApprove}
          handlePreApprove={handlePreApprove}
          handleReject={handleReject}
          handleFileDownload={handleFileDownload}
        />

        {/* Reject Reason Modal */}
        <RejectReasonModal
          isOpen={rejectReasonModal}
          onClose={closeRejectReasonModal}
          eventData={selectedRejectEvent}
          handleReject={handleReject}
        />
      </div>
    </div>
  );
}

function DatePickerWithRange({ className, onDateChange, selectedRange }) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            // variant={"outline"}
            className={cn(
              "w-[100%] justify-start text-left font-normal bg-[#463951]/50 border border-[#fff0f0b3]/25",
              !selectedRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedRange?.from ? (
              selectedRange.to ? (
                <>
                  {format(selectedRange.from, "LLL dd, y")} -{" "}
                  {format(selectedRange.to, "LLL dd, y")}
                </>
              ) : (
                format(selectedRange.from, "LLL dd, y")
              )
            ) : (
              <span>Date Range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-transparent border-none"
          align="start"
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={selectedRange?.from}
            selected={selectedRange}
            onSelect={onDateChange}
            numberOfMonths={2}
            className="bg-[#0e0811] rounded-md border border-[#fff0f0b3]/25"
            modifiersStyles={{
              selected: {
                backgroundColor: "#5F3284",
                color: "white",
              },
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

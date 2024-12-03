"use client";
import React, { useState, useEffect } from "react";
import "../css/Event-Management.css";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ChevronDown, Check, CheckCheck, X, Info } from "lucide-react";
import axios from "axios";
import { fetchData } from "next-auth/client/_utils";
import ViewEventModal from "./ViewEventModal";
import RejectReasonModal from "./RejectReasonModal";

export default function EventApproval() {
  const { data: session } = useSession();
  const [selected, setSelected] = useState("Pending");
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noEvents, setNoEvents] = useState(true);
  // For Event Modal
  const [viewEventModal, setViewEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  // For Reject Reason Modal
  const [rejectReasonModal, setRejectReasonModal] = useState(false);
  const [selectedRejectEvent, setSelectedRejectEvent] = useState(null);
  const openRejectReasonModal = (event) => {
    setSelectedRejectEvent(event);
    setRejectReasonModal(true);
  };

  const closeRejectReasonModal = () => {
    setSelectedRejectEvent(null);
    setRejectReasonModal(false);
  };

  const [eventId, setEventId] = useState(null);

  const options = [
    "Pending",
    "Pre-Approved",
    "Approved",
    "Modified",
    "Rejected",
  ];
  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/event/event-approval"
      );
      if (res.status === 200) {
        setEvents(res.data);
        setNoEvents(false);
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

  const filteredEvents = events.filter((event) => event.status === selected);

  const handleFileDownload = async (eventType, fileName) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/organizer/download/${eventType}/${fileName}`, {
          responseType: 'blob' 
        }
      );

      // Create download mechanism
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' })
      );
  
      // Create temporary link
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
  
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF Download Failed', error);
    }
  };

  const handlePreApprove = async (eventId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/event/${eventId}/pre-approve`
      );

      if (res.status === 200) {
        alert("Event pre-approved successfully");
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
        alert("Event approved successfully");
        fetchData();
      }
    } catch (error) {
      console.error("Error approving event:", error);
    }
  };

  const handleReject = async (eventId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/event/${eventId}/reject`
      );

      if (res.status === 200) {
        alert("Event rejected successfully");
        fetchData();
      }
    } catch (error) {
      console.error("Error rejecting event:", error);
    }
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
    return <div>Loading...</div>;
  }

  return (
    <div className="event-maincontainer flex flex-col justify-center items-center mt-5">
      {/* Header */}
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
              className="flex items-center justify-between w-[100%] px-4 py-2 bg-[#54366c] font-bold rounded-md shadow-sm capitalize cursor-pointer transition-all duration-200 ease-in"
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
              <div className="absolute right-0 mt-2 w-full bg-[#54366c] rounded-lg shadow-lg shadow-white/10 z-10">
                {options.map((option) => (
                  <button
                    key={option}
                    className={`block w-full py-2 px-2 text-left capitalize bg-transparent border-0 cursor-pointer text-white opacity-50 transition-all duration-300 ease-in-out ${
                      selected === option
                        ? "bg-purple-500 text font-bold text-white opacity-80"
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

        <div className="line-container w-[100%] h-auto">
          <hr className="border border-white/50" />
        </div>
      </div>

      {/* Content */}
      <div className="box-maincontainer flex flex-col w-[50%]">
        <div className="process-title mb-5">
          <h3 className="capitalize">{selected} Events</h3>
        </div>

        {/* {noEvents && <>No events found.</>} */}

        {/* Latest Design */}
        <div className="cards-container flex flex-col w-full gap-2">
          {filteredEvents.length === 0 ? (
            <div className="text-center w-full text-gray-500">
              No events found in {selected} status
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

                  <div className="flex flex-row gap-4 justify-end">
                    <div className="event-btn flex flex-row gap-4">
                      {/* Button: Pre Approve */}
                      <div className="pre-approve-btn flex items-center gap-2 px-4 py-2 rounded">
                        <Check size={16} />
                        <button
                          className="text-[0.8rem]"
                          onClick={() => handlePreApprove(event.id)}
                          disabled={event.status === "approved"}
                        >
                          Pre-approve
                        </button>
                      </div>
                      {/* Button: Approve */}
                      <div className="approve-btn">
                        <span className="flex items-center">
                          <CheckCheck size={16} />
                        </span>
                        <button
                          className="approve"
                          onClick={() => handleApprove(event.id)}
                          disabled={event.status === "approved"}
                        >
                          Approve
                        </button>
                      </div>

                      {/* Button: Reject */}
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
                        {/* for the reason reject modal button */}
                        {/* <button
                          className="reject"
                          onClick={() => handleReject(event.id)}
                          disabled={event.status === "rejected"}
                        >
                          Reject
                        </button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal with event data passed */}
        <ViewEventModal
          isOpen={viewEventModal}
          onClose={closeEventModal}
          eventData={selectedEvent} // Pass the selected event data
          handleApprove={handleApprove}
          handlePreApprove={handlePreApprove}
          handleReject={handleReject}
          handleFileDownload={handleFileDownload}
        />
        <RejectReasonModal
          isOpen={rejectReasonModal}
          onClose={closeRejectReasonModal}
          eventData={selectedRejectEvent}
          handleReject={handleReject}
        />

        {/* Old Design */}
        {/* <div className="box-container flex flex-col gap-7">
          {filteredEvents.map((event) => (
            <div key={event.id} className="indiv-box flex flex-col">
              <div className="event-image">
                <img
                  src={`http://localhost:5000/api/event/uploads/${event.eventImage}`}
                  alt="Image"
                  width={250}
                  height={150}
                />
              </div>

              <div className="event-details flex flex-col gap-5">
                <div className="event-text">
                  <h4>{event.title}</h4>
                  <p>{event.location}</p>
                  <p>{new Date(event.date).toLocaleDateString()}</p>
                </div>

                <div className="pressable flex flex-row justify-between">
                  <div className="view-details">
                    <button className="view">See Event Details...</button>
                  </div>
                  <div className="event-btn flex flex-row gap-4">
                    <div className="approve-btn">
                      <span className="label-icon">
                        <i className="fa fa-check" aria-hidden="true"></i>
                      </span>
                      <button
                        className="approve"
                        onClick={() => handleApprove(event.id)}
                        disabled={event.status === "approved"}
                      >
                        Approve
                      </button>
                    </div>

                    <div className="reject-btn">
                      <span className="label-icon">
                        <i className="fa fa-times" aria-hidden="true"></i>
                      </span>
                      <button
                        className="reject"
                        onClick={() => handleReject(event.id)}
                        disabled={event.status === "rejected"}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
}

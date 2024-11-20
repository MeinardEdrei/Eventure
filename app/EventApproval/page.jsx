"use client";
import "../css/eventApproval.css";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ChevronDown } from "lucide-react";

export default function EventApproval() {
  const { data: session } = useSession();
  const [selected, setSelected] = useState("pending");
  const [isOpen, setIsOpen] = useState(false);
  // Add state to track events and their status
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "UMak Jammer's Concert for a cause",
      location: "UMak Oval",
      date: "November 5, 2024 - 3:00 PM",
      image: "/heronsNight.jpg",
      status: "pending"
    },
    {
      id: 2,
      title: "UMak Jammer's Concert for a cause",
      location: "UMak Oval",
      date: "November 5, 2024 - 3:00 PM",
      image: "/heronsNight.jpg",
      status: "pending"
    }
  ]);

  const options = ["pending", "approved", "rejected"];

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  // Add handler functions for approve and reject actions
  const handleApprove = async (eventId) => {
    try {
      // Here you would typically make an API call to update the event status
      // For now, we'll just update the local state
      setEvents(events.map(event => {
        if (event.id === eventId) {
          return { ...event, status: 'approved' };
        }
        return event;
      }));

      // You can add a success notification here
    } catch (error) {
      console.error('Error approving event:', error);
      // You can add error handling/notification here
    }
  };

  const handleReject = async (eventId) => {
    try {
      // Here you would typically make an API call to update the event status
      setEvents(events.map(event => {
        if (event.id === eventId) {
          return { ...event, status: 'rejected' };
        }
        return event;
      }));

      // You can add a success notification here
    } catch (error) {
      console.error('Error rejecting event:', error);
      // You can add error handling/notification here
    }
  };

  // Filter events based on selected status
  const filteredEvents = events.filter(event => event.status === selected);

  return (
    <div className="event-maincontainer flex flex-col justify-center items-center mt-5">
      {/* Header */}
      <div className="upper-maincontainer flex flex-col w-[82%] mb-10">
        <div className="text-btn-container flex flex-row justify-between mb-4">
          <div className="header-text-container flex flex-col">
            <h2 className="event-title">Event Approval</h2>
            <p className="event-description">
              Review and approve upcoming events submitted by users.
            </p>
          </div>

          {/* Dropdown Container */}
          <div className="dropdown-container">
            <button
              className="dropdown-button"
              onClick={() => setIsOpen(!isOpen)}
            >
              {selected}
              <i
                className={`fas fa-chevron-down dropdown-icon ${
                  isOpen ? "rotate" : ""
                }`}
              ></i>
            </button>

            {isOpen && (
              <div className="dropdown-menu">
                {options.map((option) => (
                  <button
                    key={option}
                    className={`dropdown-item ${
                      selected === option ? "selected" : ""
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

        <div className="line-container">
          <hr />
        </div>
      </div>

      {/* Content */}
      <div className="box-maincontainer flex flex-col w-[50%]">
        <div className="process-title mb-5">
          <h3 className="capitalize">{selected} Events</h3>
        </div>

        <div className="box-container flex flex-col gap-7">
          {filteredEvents.map((event) => (
            <div key={event.id} className="indiv-box flex flex-col">
              <div className="event-image">
                <img
                  src={event.image}
                  alt="Herons Night"
                  width={250}
                  height={150}
                />
              </div>

              <div className="event-details flex flex-col gap-5">
                <div className="event-text">
                  <h4>{event.title}</h4>
                  <p>{event.location}</p>
                  <p>{event.date}</p>
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
                        disabled={event.status === 'approved'}
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
                        disabled={event.status === 'rejected'}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
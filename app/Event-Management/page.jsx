"use client";
import "../css/eventApproval.css";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ChevronDown } from "lucide-react";
import axios from "axios";
import { fetchData } from "next-auth/client/_utils";

export default function EventApproval() {
  const { data: session } = useSession();
  const [selected, setSelected] = useState("Pending");
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noEvents, setNoEvents] = useState(true);

  const options = ["Pending", "Approved", "Rejected"];

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/event/event-approval');
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

  const filteredEvents = events.filter(event => event.status === selected);

  const handleApprove = async (eventId) => {
    try {
      
      const res = await axios.post(`http://localhost:5000/api/event/approve${eventId}`);

      if (res.status === 200) {
        alert("Event approved successfully"); 
        fetchData();
      }

    } catch (error) {
      console.error('Error approving event:', error);
    }
  };

  const handleReject = async (eventId) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/event/reject${eventId}`);

      if (res.status === 200) {
        alert("Event rejected successfully"); 
        fetchData();
      }

    } catch (error) {
      console.error('Error rejecting event:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="event-maincontainer flex flex-col justify-center items-center mt-5">
      {/* Header */}
      <div className="upper-maincontainer flex flex-col w-[82%] mb-10">
        <div className="text-btn-container flex flex-row justify-between mb-4">
          <div className="header-text-container flex flex-col">
            <h2 className="event-title">Event Management</h2>
            <p className="event-description">
            Create events, review them, and approve upcoming submissions by users.
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
        
        { noEvents && (
          <>
          No events found.
          </>
        )}
        <div className="box-container flex flex-col gap-7">
          {filteredEvents.map((event) => (
            <div key={event.id} className="indiv-box flex flex-col">
              <div className="event-image">
                <img
                  src={`http://localhost:5000/api/event/uploads/${event.event_Image}`}
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
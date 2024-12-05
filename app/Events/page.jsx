"use client";
import "../css/eventNewPage.css";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "react-aria-components";

function EventNewPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [event, setEvent] = useState([]);
  const [noEvents, setNoEvents] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.username,
    email: session?.user?.email,
    schoolId: session?.user?.student_number,
    section: session?.user?.section,
    user_id: "",
    eventId: "",
    eventTitle: "",
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // FETCH EVENTS
      const res = await axios.get("http://localhost:5000/api/event/events");
      setEvent(res?.data);
    } catch (error) {
      if (error.status === 404) {
        setNoEvents(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistration = async () => {
    try {
      // CHECK REGISTRATION
      const registration = await axios.get(
        `http://localhost:5000/api/ticket/${session?.user?.id}/my-ticket`
      );
      if (registration.status === 404) {
        setIsRegistered(false);
      } else {
        setIsRegistered(true);
      }
    } catch (error) {
      if (error.status === 404) {
        setNoEvents(true);
      }
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchRegistration();
  }, [session]);

  // FILTER EVENTS
  const filteredEvents = () => {
    return {
      Upcoming: event.filter(
        (event) => event.dateStart > new Date().toISOString().split("")
      ),
      Curriculum: event.filter((event) => event.eventType === "Curriculum"),
      Organizational: event.filter(
        (event) => event.eventType === "Organizational"
      ),
      College: event.filter((event) => event.eventType === "College"),
    };
  };

  const PopularEvents = () => {
    const currentDate = new Date();

    const topMonthEvent = event
      .filter(
        (event) =>
          new Date(event.dateStart).getMonth() === currentDate.getMonth() &&
          new Date(event.dateStart).getFullYear() === currentDate.getFullYear()
      )
      .sort((a, b) => b.attendeeCount - a.attendeeCount)[0];

    const weekStart = new Date();
    weekStart.setDate(currentDate.getDate() - currentDate.getDay()); // Get the start of the week (Sunday)

    const topWeekEvent = event
      .filter(
        (event) =>
          new Date(event.dateStart) >= weekStart &&
          new Date(event.dateStart) <= currentDate
      )
      .sort((a, b) => b.attendeeCount - a.attendeeCount)[0];

    return {
      TopMonthEvent: topMonthEvent,
      TopWeekEvent: topWeekEvent,
    };
  };

  // HANDLE SESSION FORM DATA
  useEffect(() => {
    if (session && !loading) {
      setFormData((prev) => ({
        ...prev,
        user_id: session?.user?.id,
        eventId: selectedEvent ? parseInt(selectedEvent.id) : "",
        eventTitle: selectedEvent ? selectedEvent.title : "",
      }));
    }
  }, [session, event, selectedEvent]);

  // HANDLE JOIN EVENT
  const handleJoinEvent = async (event) => {
    if (!session) return router.push("/Login");

    if (
      session?.user?.role === "Organizer" ||
      session?.user?.role === "Admin"
    ) {
      alert(
        "You are not allowed to join this event because you're an " +
          session?.user?.role
      );
      return;
    }

    try {
      const formPayload = new FormData();
      formPayload.append("Name", formData.name);
      formPayload.append("Email", formData.email);
      formPayload.append("School_Id", formData.schoolId);
      formPayload.append("Section", formData.section);
      formPayload.append("User_Id", formData.user_id);
      formPayload.append("Event_Id", formData.eventId);
      formPayload.append(
        "Event_Title",
        formData.eventTitle || selectedEvent?.title || ""
      );

      const res = await axios.post(
        "http://localhost:5000/api/registration/join",
        formPayload
      );

      if (res.status === 200) {
        if (res.data.status === "Pending") {
          alert("Event is full. You have been added to the waitlist.");
          return;
        }

        alert("Joined Event Successfully!");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error("Error:", err.response?.data?.message || err.message);
      alert(
        err.response?.data?.message ||
          "An error occurred while joining the event"
      );
    }
  };

  const handleEventClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <>
      <div className="newBody">
        <div className="newContainer">
          <div className="invContainer">
            {/* Header */}
            <div className="newHeader">
              <h1>Discover Events</h1>
              <p>
                Explore popular events inside the campus, browse by category, or
                check out some of the calendars.
              </p>
            </div>

            {/* Popular Events */}
            <div className="newCards">
              {PopularEvents().TopMonthEvent && (
                <div className="newCard">
                  <div className="newImage">
                    <img
                      src={`http://localhost:5000/api/event/uploads/${
                        PopularEvents()?.TopMonthEvent?.eventImage
                      }`}
                      alt="Event Image"
                    />
                  </div>
                  <div className="newDetails">
                    <h6>{PopularEvents()?.TopMonthEvent?.title}</h6>
                    <p>Popular this month</p>
                  </div>
                </div>
              )}
              {PopularEvents().TopWeekEvent && (
                <div className="newCard">
                  <div className="newImage">
                    <img
                      src={`http://localhost:5000/api/event/uploads/${
                        PopularEvents()?.TopWeekEvent?.eventImage
                      }`}
                      alt="Event Image"
                    />
                  </div>
                  <div className="newDetails">
                    <h6>{PopularEvents()?.TopWeekEvent?.title}</h6>
                    <p>Popular this week</p>
                  </div>
                </div>
              )}
            </div>

            <hr />
            <h1 className="newPostEvaluationTitle">Post Evaluation</h1>
            <div className="newPostEvaluation">
              
              <div className="newPostEvaluationDisplay">
                <img src="heronsNight.jpg" alt="" />
                <div className="newPostEvaluationDetails">
                <h1>UMak Jammers: Concert for a cause</h1>
                <p>Answer Post Evaluation</p>
              </div>
              </div>
              
              <div className="newPostEvaluationDisplay">
                <img src="heronsNight.jpg" alt="" />
                <div className="newPostEvaluationDetails">
                <h1>Unite and Ignite: Acquaintance Party 2024</h1>
                <p>Answer Post Evaluation</p>
              </div>
              </div>

              <div className="newPostEvaluationDisplay">
                <img src="heronsNight.jpg" alt="" />
                <div className="newPostEvaluationDetails">
                <h1>UMak Jammers: Concert for a cause</h1>
                <p>Answer Post Evaluation</p>
              </div>
              </div>

            </div>

            <hr />
            {/* Navigation Buttons */}
            <div className="navButtons">
              <ul>
                <div
                  className={activeTab === "Upcoming" ? "active" : ""}
                  onClick={() => setActiveTab("Upcoming")}
                >
                  <li>Upcoming</li>
                </div>
                <div
                  className={activeTab === "Curriculum" ? "active" : ""}
                  onClick={() => setActiveTab("Curriculum")}
                >
                  <li>Curriculum</li>
                </div>
                <div
                  className={activeTab === "Organizational" ? "active" : ""}
                  onClick={() => setActiveTab("Organizational")}
                >
                  <li>Organizational</li>
                </div>
                <div
                  className={activeTab === "College" ? "active" : ""}
                  onClick={() => setActiveTab("College")}
                >
                  <li>College</li>
                </div>
              </ul>
            </div>

            {/* Dynamic Content */}
            <div className="newContent">
              {(() => {
                const eventsToDisplay =
                  activeTab === "Upcoming"
                    ? filteredEvents().Upcoming
                    : activeTab === "Curriculum"
                    ? filteredEvents().Curriculum
                    : activeTab === "Organizational"
                    ? filteredEvents().Organizational
                    : filteredEvents().College;

                if (eventsToDisplay.length === 0 && !loading) {
                  return (
                    <div className="flex place-self-center mt-10 text-white/50">
                      No events available
                    </div>
                  );
                }

                return eventsToDisplay.map((event) => (
                  <div key={event.id} className="newContainerNeto">
                    <div key={event.id} className="newEventContainerContainer">
                    <div className="newEventDisplay">
                      <div className="newEventImage">
                        <img
                          src={`http://localhost:5000/api/event/uploads/${event.eventImage}`}
                          alt="Event Image"
                        />
                      </div>
                      <div className="newEventDetails">
                        <h1>{event.title}</h1>
                        <div className="paragraph">
                          <p className="text-base text-white/40 overflow-hidden text-ellipsis whitespace-nowrap">
                            {event.location}
                          </p>
                          <p className="mt-2 text-base text-white/50">
                            {new Date(event.dateStart).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <button
                          className="text-white text-base font-semibold px-7 py-2 rounded-lg mt-3 border" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
                          onClick={() => {
                            handleEventClick();
                            setSelectedEvent(event);
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                  </div>
                  
                ));
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="newmodalContent" onClick={(e) => e.stopPropagation()}>
            <button className="eventClose" onClick={closeModal}>
              &times;
            </button>
            <img src="heronsNight.jpg" alt="" />
            <div className="newmodalDetails">
              <h2>{selectedEvent.title}</h2>
              <p>
                {new Date(selectedEvent.dateStart).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                {" - "}
                {new Date(selectedEvent.dateEnd).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p>
                {new Date(
                  `${new Date(selectedEvent.dateStart).getFullYear()}-01-01T${
                    selectedEvent.timeStart
                  }`
                ).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}{" "}
                {" - "}
                {new Date(
                  `${new Date(selectedEvent.dateStart).getFullYear()}-01-01T${
                    selectedEvent.timeStart
                  }`
                ).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
              <hr />
              <div className="newmodalDescription">
                <p>{selectedEvent.description}</p>
              </div>
              <hr />
              <div className="hosts">
                <h3>Location</h3>
                <div className="userHosts">
                  <p>{selectedEvent.location}</p>
                </div>
              </div>
              <hr />
              <div className="hosts">
                <h3>Hosted by</h3>
                <div className="userHosts">
                  <img src="/user.jpg" alt="" />
                  <p>UMak Jammers</p>
                </div>
              </div>
              <hr />
              <div className="eventButtons">
                {!isRegistered ? (
                  <button
                    className="requestJoin"
                    onClick={() => handleJoinEvent(selectedEvent.id)}
                  >
                    Request to join
                  </button>
                ) : (
                  <Link href={`/Ticket/${session?.user?.id}`}>
                    <button className="checkTicket">My ticket</button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EventNewPage;

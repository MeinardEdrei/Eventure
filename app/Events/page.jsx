"use client";
import { useSession } from "next-auth/react";
import "../css/newEvents.css";
import { useState, useEffect } from "react";
import { Button } from "react-aria-components";
import { useRouter } from "next/navigation"; 
import axios from "axios";
import { format } from 'date-fns';
import Link from "next/link";

function Events() {
  const router = useRouter();
  const {data: session} = useSession();
  const [activeCategory, setActiveCategory] = useState("Upcoming");
  const [activePopular, setActivePopular] = useState("Weekly");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postPerPage = 6;

  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;

  const [event, setEvent] = useState([]);
  const [noEvents, setNoEvents] = useState(false);
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [shouldRefreshEvents, setShouldRefreshEvents] = useState(false);

  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    schoolId: "",
    section: "",
    user_id: "",
    eventId: "",
    eventTitle: "",
  });

  // EVENTS API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/event/events");
      
      if (session) {
        const filtered = res.data.filter(event => {
          const hostedByDepts = JSON.parse(event.hostedBy);
          return hostedByDepts.some(dept => 
            dept.includes(session.user.department)
          );
        });
        setEvent(filtered);
      } else {
        setEvent(res.data);
      }
    } catch (error) {
      if (error.status === 404) {
        setNoEvents(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // USER EVENTS API
  const fetchUserEvents = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user/userAttendedEvents/${session.user.id}`);
      setAttendedEvents(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  
  // REGISTRATION API
  const fetchRegistration = async (event) => {
    try {
      // CHECK REGISTRATION
      const registration = await axios.get(
        `http://localhost:5000/api/ticket/${session?.user?.id}/${event?.id}/my-ticket`
      );
      if (registration.status === 404) {
        setStatusCode(404);
      } else if (registration.status === 202){
        setStatusCode(202);
      } else {
        setStatusCode(200);
      }
    } catch (error) {
      if (error.status === 404) {
        setNoEvents(true);
        setStatusCode(404);
      }
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchUserEvents();
      setShouldRefreshEvents(false);
    }
  }, [session, shouldRefreshEvents]);

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

    const topAllTime = event
      .filter((event) => event.dateStart < currentDate.toISOString())
      .sort((a, b) => b.attendeeCount - a.attendeeCount)
      .slice(0, 10);

    const topMonthEvent = event
      .filter(
        (event) =>
          new Date(event.dateStart).getMonth() === currentDate.getMonth() &&
          new Date(event.dateStart).getFullYear() === currentDate.getFullYear()
      )
      .sort((a, b) => b.attendeeCount - a.attendeeCount);

    const weekStart = new Date();
    weekStart.setDate(currentDate.getDate() - currentDate.getDay()); // Get the start of the week (Sunday)

    const topWeekEvent = event
      .filter(
        (event) =>
          new Date(event.dateStart) >= weekStart &&
          new Date(event.dateStart) <= currentDate
      )
      .sort((a, b) => b.attendeeCount - a.attendeeCount);

    return {
      TopAllTime: topAllTime,
      TopMonthEvent: topMonthEvent,
      TopWeekEvent: topWeekEvent,
    };
  };

  // HANDLE SESSION FORM DATA
  useEffect(() => {
    if (session && !loading) {
      setFormData((prev) => ({
        ...prev,
        name: session?.user?.username,
        email: session?.user?.email,
        schoolId: session?.user?.student_number,
        section: session?.user?.section,
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
        setIsModalOpen(false);
        setShouldRefreshEvents(true);
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

  // HANDLE CANCEL REGISTRATION
  const handleCancelRegistration = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/registration/${session?.user?.id}/${id}/cancel-registration`);
      if (response.status === 200) alert("Registration cancelled successfully");
      setIsModalOpen(false);
      setShouldRefreshEvents(true);
    } catch (error) {
      console.error(error);
    }
  }

  // Dynamic data for active category
  const eventsToDisplay =
    activeCategory === "Upcoming"
      ? filteredEvents().Upcoming
      : activeCategory === "Organizational"
      ? filteredEvents().Organizational
      : activeCategory === "College"
      ? filteredEvents().College
      : activeCategory === "Curriculum"
      ? filteredEvents().Curriculum
      : [];

  // Pagination logic
  const currentEvents = eventsToDisplay.slice(firstPostIndex, lastPostIndex);
  const totalPages = Math.ceil(eventsToDisplay.length / postPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Modal handling
  const openModal = async (event) => {
    await fetchRegistration(event);
    setIsModalOpen(true);
  }
  const closeModal = () => setIsModalOpen(false);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // const convertDraftToText = (rawContent) => {
  //   if (!rawContent || !rawContent.blocks) return null;
  
  //   return rawContent.blocks.map((block, index) => {
  //     const text = block.text;
  
  //     // Apply inline styles
  //     const styledText = block.inlineStyleRanges.reduce((acc, style) => {
  //       const start = style.offset;
  //       const end = start + style.length;
  //       const styledPart = acc.slice(start, end);
        
  //       switch (style.style) {
  //         case 'BOLD':
  //           return (
  //             acc.slice(0, start) + 
  //             `<strong>${styledPart}</strong>` + 
  //             acc.slice(end)
  //           );
  //         case 'ITALIC':
  //           return (
  //             acc.slice(0, start) + 
  //             `<em>${styledPart}</em>` + 
  //             acc.slice(end)
  //           );
  //         default:
  //           return acc;
  //       }
  //     }, text);
  
  //     // Handle different block types
  //     switch (block.type) {
  //       case 'unstyled':
  //         return <p key={index} dangerouslySetInnerHTML={{__html: styledText}} />;
  //       case 'unordered-list-item':
  //         return <li key={index} dangerouslySetInnerHTML={{__html: styledText}} />;
  //       case 'ordered-list-item':
  //         return <li key={index} dangerouslySetInnerHTML={{__html: styledText}} />;
  //       case 'header-one':
  //         return <h1 key={index} dangerouslySetInnerHTML={{__html: styledText}} />;
  //       case 'header-two':
  //         return <h2 key={index} dangerouslySetInnerHTML={{__html: styledText}} />;
  //       default:
  //         return <p key={index} dangerouslySetInnerHTML={{__html: styledText}} />;
  //     }
  //   });
  // };

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
    <>
      <div className="eventContainers">
        {/* Left Container */}
        <div className="newLeftContainer">

          {session?.user?.role === "Student" && (
            <>
            {/* Recently Joined Events */}
            <h1>Recently Joined Events</h1>
            {attendedEvents.length > 0 && attendedEvents.some(event => event.status === "Ended") ? (
              attendedEvents
                .filter(events => events.status === "Ended")
                .map((events) => (
                  <div key={events.id} className="recentlyJoinedContainer">
                    <div className="recentlyJoinedDisplay" onClick={() => {setSelectedEvent(events); openModal(events);}}>
                      <img src={`http://localhost:5000/api/event/uploads/${events.eventImage}`} alt={events.title} />
                      <div className="recentDetails">
                        <h1>{events.title}</h1>
                        <p>{format(new Date(events.createdAt), "MMMM d, yyyy")}</p>
                        {events.status === "Ended" && (
                          <button className="border border-white/20 mt-4 text-xs p-2 rounded-lg font-semibold">Post-Evaluation</button>
                        )}
                      </div>
                    </div>
                  </div>
              ))
            ) : (
              <div className="recentlyJoinedContainer">
                <div className="recentlyJoinedDisplay">
                  <img src={`/fwvsdv.jpg`} alt={``} />
                  <div className="recentDetails">
                    <p>No events joined this time.</p>
                  </div>
                </div>
              </div>
            )}
            </>
          )}

          {/* Latest Events */}
          <h1>Latest Events</h1>
          <div className="latestEventsContainer">
            {event ? (
              event.slice(0, 2).map((item) => (
                <div key={item.id} className="latestEventsDisplay" onClick={() => {setSelectedEvent(item); openModal(item);}}>
                  <img src={`http://localhost:5000/api/event/uploads/${item.eventImage}`} alt={item.title} />
                  <div className="latestDetails space-y-2">
                    <h1>{item.title}</h1>
                    <p>Added on {format(new Date(item.createdAt), 'MMMM dd, yyyy')}</p>
                  </div>
                </div>
              ))
            ) : (
              <div key={item.id} className="latestEventsDisplay" onClick={() => {setSelectedEvent(item); openModal(item);}}>
                <img src={`/fwvsdv.jpg`} alt={item.title} />
                <div className="latestDetails space-y-2">
                  <h1>No latest events this time.</h1>
                </div>
              </div>
            )}
          </div>

          <hr />
          {/* Navigation Buttons */}
          <ul className="navButtons">
            <Button
              className={activeCategory === "Upcoming" ? "active" : ""}
              onPress={() => {
                setActiveCategory("Upcoming");
                setCurrentPage(1);
              }}
            >
              <li>Upcoming</li>
            </Button>
            <Button
              className={activeCategory === "Organizational" ? "active" : ""}
              onPress={() => {
                setActiveCategory("Organizational");
                setCurrentPage(1);
              }}
            >
              <li>Organizational</li>
            </Button>
            <Button
              className={activeCategory === "College" ? "active" : ""}
              onPress={() => {
                setActiveCategory("College");
                setCurrentPage(1);
              }}
            >
              <li>College</li>
            </Button>
            <Button
              className={activeCategory === "Curriculum" ? "active" : ""}
              onPress={() => {
                setActiveCategory("Curriculum");
                setCurrentPage(1);
              }}
            >
              <li>Curriculum</li>
            </Button>
          </ul>

          {/* Dynamic Content Pagination */}
          <div className="dynamicContent">
            {currentEvents.map((event, index) => (
              <div className="dynamicDisplay" key={index}>
                <img src={`http://localhost:5000/api/event/uploads/${event.eventImage}`} alt={event.title} />
                <div className="dynamicDetails">
                  <h1>{event.title}</h1>
                  <p>{event.location}</p>
                  <p>{event.date}</p>
                  <button
                    className="text-white text-base font-semibold px-7 py-2 rounded-lg mt-3 border" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
                    onClick={() => {
                      setSelectedEvent(event);
                      openModal(event);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
            {currentEvents.length === 0 && <h1>No Current Events</h1>}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <Button onPress={goToPreviousPage} disabled={currentPage === 1}>
            ◄ Previous
            </Button>
            <span className="pageIndicator">Page {currentPage} of {totalPages}</span>
            <Button onPress={goToNextPage} disabled={currentPage === totalPages}>
              Next ►
            </Button>
          </div>
        </div>
            
      
      {/* Right Container */}
      <div className="newRightContainer">
          <h1>Popular</h1>

          {/* Popular Navigation */}
          <ul className="popularNav">
            <Button
              className={activePopular === "Weekly" ? "active" : ""}
              onPress={() => setActivePopular("Weekly")}
            >
              <li>Weekly</li>
            </Button>
            <div>/</div>
            <Button
              className={activePopular === "Monthly" ? "active" : ""}
              onPress={() => setActivePopular("Monthly")}
            >
              <li>Monthly</li>
            </Button>
            <div>/</div>
            <Button
              className={activePopular === "All" ? "active" : ""}
              onPress={() => setActivePopular("All")}
            >
              <li>All</li>
            </Button>
          </ul>

          {/* Dynamic Popular Content */}
          <div className="popularContent">
            {activePopular === "Weekly" && (
              <>
              {PopularEvents().TopWeekEvent && (
                PopularEvents().TopWeekEvent.map((item, index) => (
                  <div key={item.id} className="popularDisplay" onClick={() => {setSelectedEvent(item); openModal(item);}}>
                    <div className="popularCount">
                      <h1>{index + 1}</h1>
                    </div>
                    <img src={`http://localhost:5000/api/event/uploads/${item.eventImage}`} alt={item.title} />
                    <div className="popularDetails">
                      <h1>{item.title}</h1>
                    </div>
                  </div>
                ))
              )}
              </>
            )}
            {activePopular === "Monthly" && (
              <>
              {PopularEvents().TopMonthEvent && (
                PopularEvents().TopMonthEvent.map((item, index) => (
                  <div key={item.id} className="popularDisplay" onClick={() => {setSelectedEvent(item); openModal(item);}}>
                    <div className="popularCount">
                      <h1>{index + 1}</h1>
                    </div>
                    <img src={`http://localhost:5000/api/event/uploads/${item.eventImage}`} alt={item.title} />
                    <div className="popularDetails">
                      <h1>{item.title}</h1>
                    </div>
                  </div>
                ))
              )}
              </>
            )}
            {activePopular === "All" && (
              <>
              {PopularEvents().TopAllTime && (
                PopularEvents().TopAllTime.map((item, index) => (
                  <div key={item.id} className="popularDisplay" onClick={() => {setSelectedEvent(item); openModal(item);}}>
                    <div className="popularCount">
                      <h1>{index + 1}</h1>
                    </div>
                    <img src={`http://localhost:5000/api/event/uploads/${item.eventImage}`} alt={item.title} />
                    <div className="popularDetails">
                      <h1>{item.title}</h1>
                    </div>
                  </div>
                ))
              )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modalContent">
            <div className="closeButtonBox">
              <button onClick={closeModal} className="eventClose">&times;</button>
            </div>
            <img src={`http://localhost:5000/api/event/uploads/${selectedEvent.eventImage}`} alt={selectedEvent.title} />
            <div className="modalTitle">
              <h1>{selectedEvent.title}</h1>
              <p>{selectedEvent.location}</p>
              <p>Date: &nbsp; {format(new Date(selectedEvent.dateStart), 'MMMM dd, yyyy')} &nbsp; - &nbsp;
                {format(new Date(selectedEvent.dateEnd), 'MMMM dd, yyyy')}
              </p>
              <p>Time: &nbsp;
                {new Date(
                    `${new Date(selectedEvent.dateStart).getFullYear()}-01-01T${
                      selectedEvent.timeStart
                    }`
                  ).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}{" "}
                  &nbsp; - &nbsp;
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
            </div>
            <div className="modalDescription">
              <p>{convertDraftToText(selectedEvent.description)}</p>
            </div>
            <hr />
            <div className="userHosts">
              <h1 className="hosts font-bold">Hosted By</h1>
              <div className="hosts">
                {/* <img src="user.jpg" alt="" /> */}
                {JSON.parse(selectedEvent.hostedBy).map((host, index) => (
                  <p key={index}>{host}</p>
                ))}
              </div>
            </div>
            <hr />
            <div className="eventButtons">
              {selectedEvent.status === "Approved" ? (
                statusCode === 404 ? (
                    <button
                      className="requestJoin"
                      onClick={() => handleJoinEvent(selectedEvent.id)}
                    >
                      Request to join
                    </button>
                  ) : statusCode === 202 ? (
                    <>
                    <button onClick={() => handleCancelRegistration(selectedEvent.id)}>Cancel Registration</button>
                    </>
                  ) : (
                    <>
                      <Link href={`/Ticket/${session?.user?.id}/${selectedEvent.id}`}>
                        <button className="bg-purple-950">My ticket</button>
                      </Link>
                      <button onClick={() => handleCancelRegistration(selectedEvent.id)}>Cancel Registration</button>
                    </>
                )
              ) : (
                <Link href={`/UserEvaluation/${selectedEvent.id}`}><button className="bg-purple-950">Answer Survey</button></Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Events;

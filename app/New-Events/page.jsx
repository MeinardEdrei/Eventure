"use client";
import "../css/newEvents.css";
import { useState } from "react";
import { Button } from "react-aria-components";

function NewEvents() {
  const [activeCategory, setActiveCategory] = useState("Upcoming");
  const [activePopular, setActivePopular] = useState("Weekly");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postPerPage = 8;

  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;

  // Event Data
  const upcomingEvents = [
    { title: "Heron's Night", location: "UMak Oval", date: "Dec 25, 2024", image: "heronsNight.jpg" },
    { title: "UMak Jammers", location: "UMak Oval", date: "Jan 15, 2025", image: "heronsNight.jpg" },
    { title: "Tech Expo", location: "Tech Hall", date: "Feb 20, 2025", image: "heronsNight.jpg" },
    { title: "Cultural Fest", location: "Main Hall", date: "Mar 5, 2025", image: "heronsNight.jpg" },
    { title: "Job Fair", location: "Auditorium", date: "Apr 10, 2025", image: "heronsNight.jpg" },
    { title: "Sports Day", location: "Sports Complex", date: "May 3, 2025", image: "heronsNight.jpg" },
    { title: "Art Workshop", location: "Art Center", date: "Jun 15, 2025", image: "heronsNight.jpg" },
    { title: "Film Screening", location: "Cinema Room", date: "Jul 1, 2025", image: "heronsNight.jpg" },
    { title: "Coding Hackathon", location: "Tech Lab", date: "Aug 20, 2025", image: "heronsNight.jpg" },
  ];

  const organizationalEvents = [
    { title: "Team Building", location: "Resort", date: "Jan 10, 2025", image: "heronsNight.jpg" },
  ];

  const collegeEvents = [
    { title: "College Fest", location: "UMak Hall", date: "Feb 15, 2025", image: "heronsNight.jpg" },
  ];

  const curriculumEvents = [
    { title: "AI Seminar", location: "Auditorium", date: "Mar 5, 2025", image: "heronsNight.jpg" },
    { title: "Research Symposium", location: "Main Hall", date: "Mar 20, 2025", image: "heronsNight.jpg" },
  ];

  // Dynamic data for active category
  const activeEvents =
    activeCategory === "Upcoming"
      ? upcomingEvents
      : activeCategory === "Organizational"
      ? organizationalEvents
      : activeCategory === "College"
      ? collegeEvents
      : activeCategory === "Curriculum"
      ? curriculumEvents
      : [];

  // Pagination logic
  const currentEvents = activeEvents.slice(firstPostIndex, lastPostIndex);
  const totalPages = Math.ceil(activeEvents.length / postPerPage);

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
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="eventContainers">
        {/* Left Container */}
        <div className="newLeftContainer">
          <h1>Recently Joined Events</h1>

          <div className="recentlyJoinedContainer">
            <div className="recentlyJoinedDisplay" onClick={openModal}>
              <img src="/heronsNight.jpg" alt="Heron's Night" />
              <div className="recentDetails">
                <h1>Heron's Night</h1>
                <p>December 25, 2024</p>
              </div>
            </div>
            <div className="recentlyJoinedDisplay" onClick={openModal}>
              <img src="/heronsNight.jpg" alt="Heron's Night" />
              <div className="recentDetails">
                <h1>Heron's Night</h1>
                <p>December 25, 2024</p>
              </div>
            </div>
            <div className="recentlyJoinedDisplay" onClick={openModal}>
              <img src="/heronsNight.jpg" alt="Heron's Night" />
              <div className="recentDetails">
                <h1>Heron's Night</h1>
                <p>December 25, 2024</p>
              </div>
            </div>
          </div>

          <h1>Latest Events</h1>
          <div className="latestEventsContainer">
            <div className="latestEventsDisplay" onClick={openModal}>
              <img src="/heronsNight.jpg" alt="Heron's Night" />
              <div className="latestDetails">
                <h1>UMak Jammers: Concert for a cause!</h1>
                <p>Added on December 5, 2024</p>
              </div>
            </div>
            <div className="latestEventsDisplay" onClick={openModal}>
              <img src="/heronsNight.jpg" alt="Heron's Night" />
              <div className="latestDetails">
                <h1>Heron's Night</h1>
                <p>Added on December 5, 2024</p>
              </div>
            </div>
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
              <div className="dynamicDisplay" onClick={openModal} key={index}>
                <img src={event.image} alt={event.title} />
                <div className="dynamicDetails">
                  <h1>{event.title}</h1>
                  <p>{event.location}</p>
                  <p>{event.date}</p>
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
            <Button
              className={activePopular === "Monthly" ? "active" : ""}
              onPress={() => setActivePopular("Monthly")}
            >
              <li>Monthly</li>
            </Button>
            <Button
              className={activePopular === "All Time" ? "active" : ""}
              onPress={() => setActivePopular("All Time")}
            >
              <li>All Time</li>
            </Button>
          </ul>

          {/* Dynamic Popular Content */}
          <div className="popularContent">
            {activePopular === "Weekly" && (
              <>
              <div className="popularDisplay">
                <div className="popularCount">
                  <h1>1</h1>
                </div>
                <img src="heronsNight.jpg" alt="" />
                <div className="popularDetails">
                  <h1>Heron's Night</h1>
                </div>
              </div>

              <div className="popularDisplay">
                <div className="popularCount">
                  <h1>2</h1>
                </div>
                <img src="heronsNight.jpg" alt="" />
                <div className="popularDetails">
                  <h1>UMak Jammers: Concert for a Cause</h1>
                </div>
              </div>

              <div className="popularDisplay">
                <div className="popularCount">
                  <h1>3</h1>
                </div>
                <img src="heronsNight.jpg" alt="" />
                <div className="popularDetails">
                  <h1>Heron's Night</h1>
                </div>
              </div>

              <div className="popularDisplay">
                <div className="popularCount">
                  <h1>4</h1>
                </div>
                <img src="heronsNight.jpg" alt="" />
                <div className="popularDetails">
                  <h1>UMak Jammers: Concert for a Cause</h1>
                </div>
              </div>

              <div className="popularDisplay">
                <div className="popularCount">
                  <h1>5</h1>
                </div>
                <img src="heronsNight.jpg" alt="" />
                <div className="popularDetails">
                  <h1>UMak Jammers: Concert for a Cause</h1>
                </div>
              </div>
              </>
            )}
            {activePopular === "Monthly" && (
              <>
              <div className="popularDisplay">
                <div className="popularCount">
                  <h1>1</h1>
                </div>
                <img src="heronsNight.jpg" alt="" />
                <div className="popularDetails">
                  <h1>Heron's Night</h1>
                </div>
              </div>

              <div className="popularDisplay">
                <div className="popularCount">
                  <h1>2</h1>
                </div>
                <img src="heronsNight.jpg" alt="" />
                <div className="popularDetails">
                  <h1>UMak Jammers: Concert for a Cause</h1>
                </div>
              </div>
              </>
            )}
            {activePopular === "All Time" && (
              <>
              <div className="popularDisplay">
                <div className="popularCount">
                  <h1>1</h1>
                </div>
                <img src="heronsNight.jpg" alt="" />
                <div className="popularDetails">
                  <h1>Heron's Night</h1>
                </div>
              </div>

              <div className="popularDisplay">
                <div className="popularCount">
                  <h1>2</h1>
                </div>
                <img src="heronsNight.jpg" alt="" />
                <div className="popularDetails">
                  <h1>UMak Jammers: Concert for a Cause</h1>
                </div>
              </div>

              <div className="popularDisplay">
                <div className="popularCount">
                  <h1>3</h1>
                </div>
                <img src="heronsNight.jpg" alt="" />
                <div className="popularDetails">
                  <h1>UMak Jammers: Concert for a Cause</h1>
                </div>
              </div>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modalContent">
            <div className="closeButtonBox">
              <button onClick={closeModal} className="eventClose">&times;</button>
            </div>
            <img src="heronsNight.jpg" alt="Event" />
            <div className="modalTitle">
              <h1>UMak Jammer's: Concert for a cause!</h1>
              <p>UMak Oval</p>
              <p>December 25, 2024 - 3:00 PM</p>
            </div>
            <div className="modalDescription">
              <p>Kick off the new year with energy, excitement, and fresh connections at the Unite and Ignite: Acquaintance Party 2024! This electrifying event is designed to bring people together, creating opportunities for meaningful conversations and unforgettable experiences. Whether you're meeting new faces or reconnecting with old friends, this party promises a vibrant atmosphere with music, fun activities, and an unforgettable night of celebration. Let’s ignite the spark of camaraderie and unity as we kick-start 2024 with an unforgettable party!</p>
            </div>
            <hr />
            <div className="userHosts">
              <div className="hosts">
                <img src="user.jpg" alt="" />
                <p>CCIS - College of Computing and Information Sciences</p>
              </div>
              <div className="hosts">
                <img src="user.jpg" alt="" />
                <p>CTHM - College of Tourism and Hotel Management</p>
              </div>
              <div className="hosts">
                <img src="user.jpg" alt="" />
                <p>CITE HSU - College of Innovative Teacher Education - Higher School ng UMak</p>
              </div>
            </div>
            <hr />
            <div className="eventButtons">
              <button>Request to join</button>
              <button>My Ticket</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NewEvents;

'use client';
import '../css/newNotification.css';
import { useState } from 'react';
import { Button } from 'react-aria-components';

function NewNotification() {
  const [activeFilter, setActiveFilter] = useState('Today'); // Default filter is "Today"
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal state

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="notificationBody">
        <div className="notificationContainer">
          {/* HEADER */}
          <div className="notificationHeader">
            <h1>Notifications</h1>
            <p>Receive personalized notifications and reminders for all your events, keeping you informed and on schedule with timely updates right at your fingertips.</p>
          </div>

          <div className="notificationMismo">
            {/* Filter Header */}
            <div className="notificationMismoHeader">
              <h6>Event Notifications</h6>
              <ul>
                <Button onPress={() => setActiveFilter('Today')}><li>Today</li></Button>
                <Button onPress={() => setActiveFilter('This Month')}><li>This Month</li></Button>
                <Button onPress={() => setActiveFilter('All Time')}><li>All Time</li></Button>
              </ul>
            </div>

            {/* Dynamic Content */}
            <div className="notificationMismoMismo">
              {/* TODAY */}
              {activeFilter === 'Today' && (
                <>
                  <div className="notificationMismoContainer" onClick={openModal}>
                    <img src="user.jpg" alt="" />
                    <div className="notificationDetails">
                      <h1>Unite and Ignite: Acquaintance Party 2024</h1>
                      <p>Kick off the new year with energy, excitement, and fresh connections at the Unite and Ignite: Acquaintance Party 2024! This electrifying event is designed to bring people together, creating opportunities for meaningful conversations and unforgettable experiences. Whether you're meeting new faces or reconnecting with old friends, this party promises a vibrant atmosphere with music, fun activities, and an unforgettable night of celebration. Let’s ignite the spark of camaraderie and unity as we kick-start 2024 with an unforgettable party!Kick off the new year with energy, excitement, and fresh connections at the Unite and Ignite: Acquaintance Party 2024! This electrifying event is designed to bring people together, creating opportunities for meaningful conversations and unforgettable experiences. Whether you're meeting new faces or reconnecting with old friends, this party promises a vibrant atmosphere with music, fun activities, and an unforgettable night of celebration. Let’s ignite the spark of camaraderie and unity as we kick-start 2024 with an unforgettable party!</p>
                    </div>
                  </div>
                  <div className="notificationMismoContainer" onClick={openModal}>
                    <img src="user.jpg" alt="" />
                    <div className="notificationDetails">
                      <h1>UMak Jammer’s Concert for a Cause</h1>
                      <p>Attention UMak Jammers! Join us for a night of music and giving...</p>
                    </div>
                  </div>
                </>
              )}
              {/* MONTH */}
              {activeFilter === 'This Month' && (
                <>
                
                </>
              )}

              {/* ALL TIME */}
              {activeFilter === 'All Time' && (
                <>
                
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="notificationModal" onClick={closeModal}>
          <div className="notificationModalContent" onClick={(e) => e.stopPropagation()}>
            <div className="notificationModalUser">
              <img src="user.jpg" alt="" />
              <div className="notificationDetails">
                <h2>UMak Jammers - Unite and Ignite: Acquaintance Party 2024</h2>
                <p>November 31, 2024</p>
              </div>
              
            </div>
            <hr />
            <div className="notificationModalDescription">
                <img src="heronsNight.jpg" alt="" />
                <p>Kick off the new year with energy, excitement, and fresh connections at the Unite and Ignite: Acquaintance Party 2024! This electrifying event is designed to bring people together, creating opportunities for meaningful conversations and unforgettable experiences. Whether you're meeting new faces or reconnecting with old friends, this party promises a vibrant atmosphere with music, fun activities, and an unforgettable night of celebration. Let’s ignite the spark of camaraderie and unity as we kick-start 2024 with an unforgettable party!Kick off the new year with energy, excitement, and fresh connections at the Unite and Ignite: Acquaintance Party 2024! This electrifying event is designed to bring people together, creating opportunities for meaningful conversations and unforgettable experiences. Whether you're meeting new faces or reconnecting with old friends, this party promises a vibrant atmosphere with music, fun activities, and an unforgettable night of celebration. Let’s ignite the spark of camaraderie and unity as we kick-start 2024 with an unforgettable party!</p>
                <button onClick={closeModal}>Close</button>
              </div>
            
          </div>
        </div>
      )}
    </>
  );
}

export default NewNotification;

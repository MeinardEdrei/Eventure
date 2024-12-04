'use client';
import '../css/eventNewPage.css';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from 'react-aria-components';

function EventNewPage () {
  const [activeTab, setActiveTab] = useState('Upcoming'); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEventClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
    <div className="newBody">
      <div className="newContainer">
        <div className="invContainer">
          
          {/* Header */}
          <div className="newHeader">
            <h1>Discover Events</h1>
            <p>Explore popular events inside the campus, browse by category, or check out some of the calendars.</p>
          </div>

          <div class="newCards">
            <div class="newCard">
              <div class="newImage">
                <img src="heronsNight.jpg" alt="" />
              </div>
              <div class="newDetails">
                <h6>Heron's Night 2025</h6>
                <p>Popular this month</p>
              </div>
            </div>
            <div class="newCard">
              <div class="newImage">
                <img src="heronsNight.jpg" alt="" />
              </div>
              <div class="newDetails">
                <h6>General Assembly</h6>
                <p>Popular this week</p>
              </div>
            </div>
          </div>

          <hr />

          {/* Navigation Buttons */}
          <div className="navButtons">
              <ul>
                <Button onPress={() => setActiveTab('Upcoming')}><li>Upcoming</li></Button>
                <Button onPress={() => setActiveTab('Curriculum')}><li>Curriculum</li></Button>
                <Button onPress={() => setActiveTab('Organizational')}><li>Organizational</li></Button>
                <Button onPress={() => setActiveTab('College')}><li>College</li></Button>
              </ul>
            </div>

          {/* Dynamic Content */}
          <div className="newContent">

              {/* UPCOMING */}
              {activeTab === 'Upcoming' && (
                <>
                  <div className="newEventContainer">
                    <div className="newEventDisplay" onClick={handleEventClick}>
                      <div className="newEventImage">
                        <img src="heronsNight.jpg" alt="" />
                      </div>
                      <div className="newEventDetails">
                        <h1>UMak Jammers: Concert for a cause!</h1>
                        <div className="paragraph">
                          <p>UMak Volleyball Court</p>
                          <p>December 25, 2024</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* CURRICULUM */}
              {activeTab === 'Curriculum' && 
              <>
              <div className="newEventContainer">
                <div className="newEventDisplay">
                  <div className="newEventImage">
                    <img src="heronsNight.jpg" alt="" />
                  </div>
                  <div className="newEventDetails">
                    <h1>UMak Jammers: Concert for a cause!</h1>
                    <div className="paragraph">
                      <p>UMak Volleyball Court</p>
                      <p>December 25, 2024</p>
                    </div>
                  </div>
                </div>
              </div>
              </>
              }

              {/* ORGANIZATIONAL */}
              {activeTab === 'Organizational' && 
              <>
              <div className="newEventContainer">
                <div className="newEventDisplay">
                  <div className="newEventImage">
                    <img src="heronsNight.jpg" alt="" />
                  </div>
                  <div className="newEventDetails">
                    <h1>UMak Jammers: Concert for a cause!</h1>
                    <div className="paragraph">
                      <p>UMak Volleyball Court</p>
                      <p>December 25, 2024</p>
                    </div>
                  </div>
                </div>
              </div>
              </>
              }

              {/* COLLEGE */}
              {activeTab === 'College' && 
              <>
              <div className="newEventContainer">
                <div className="newEventDisplay">
                  <div className="newEventImage">
                    <img src="heronsNight.jpg" alt="" />
                  </div>
                  <div className="newEventDetails">
                    <h1>UMak Jammers: Concert for a cause!</h1>
                    <div className="paragraph">
                      <p>UMak Volleyball Court</p>
                      <p>December 25, 2024</p>
                    </div>
                  </div>
                </div>
              </div>
              </>
              }
            </div>
        </div>
      </div>
    </div>
    {/* Modal */}
    {isModalOpen && (
        <div className="modalOverlay" onClick={closeModal}>
          
          <div className="newmodalContent" onClick={(e) => e.stopPropagation()}>
          <button className="eventClose" onClick={closeModal}>&times;</button>
            <img src="heronsNight.jpg" alt="" />
            <div className="newmodalDetails">
              <h2>UMak Jammers: Concert for a cause! TESTININTISN</h2>
              <p>UMak Volleyball Court</p>
              <p>December 25, 2024 - 3:00 PM</p>
              <hr />
              <div className="newmodalDescription">
                <p>Kick off the new year with energy, excitement, and fresh connections at the Unite and Ignite: Acquaintance Party 2024! This electrifying event is designed to bring people together, creating opportunities for meaningful conversations and unforgettable experiences. Whether you're meeting new faces or reconnecting with old friends, this party promises a vibrant atmosphere with music, fun activities, and an unforgettable night of celebration. Let’s ignite the spark of camaraderie and unity as we kick-start 2024 with an unforgettable party!</p>
                <p>Kick off the new year with energy, excitement, and fresh connections at the Unite and Ignite: Acquaintance Party 2024! This electrifying event is designed to bring people together, creating opportunities for meaningful conversations and unforgettable experiences. Whether you're meeting new faces or reconnecting with old friends, this party promises a vibrant atmosphere with music, fun activities, and an unforgettable night of celebration. Let’s ignite the spark of camaraderie and unity as we kick-start 2024 with an unforgettable party!</p>

              </div>
              <hr />
              <div className="hosts">
                <h3>Hosted by</h3>
                <div className="userHosts">
                    <img src="/user.jpg" alt="" />
                    <p>UMak Jammers</p>
                    <img src="/user.jpg" alt="" />
                    <p>UMak Jammers</p>
                </div>
            </div>
            <hr />
            <div className="eventButtons">
                <Link href={'/Event-Post/${selectedEvent.id}'}>
                    <button className='requestJoin'>Request to join</button>
                </Link>
                <Link href={'./Ticket'}> 
                    <button className='checkTicket'>My ticket</button>
                </Link>
                {/* <Link href={`/Event-Post/${selectedEvent.id}`}>
                    <button className="expandButton">Expand</button>
                </Link> */}
            </div>
            </div>
            
          </div>
        </div>
      )}
    </>
  )
}

export default EventNewPage;
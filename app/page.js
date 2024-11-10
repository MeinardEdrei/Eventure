"use client";
import { useSession } from "next-auth/react";
import "./css/Homepage.css";
import { useState } from "react";


export default function Home() {
  const { data: session } = useSession();
  const [selected, setSelected] = useState("upcoming");

  console.log(session);
  return (
    <>
      <div className="main-container">
        <div className="text-container">
          <h1>Explore University Events</h1>
          <p>
            Explore popular events near you, browse by category, or check out
            some of the great community calendars.
          </p>
        </div>
        <div className="popularEvents-container">
          <h1>Popular Events</h1>
          <div className="events-mnc">
            <div className="box-mnc">
              <div className="img-container">
                <img src="https://via.placeholder.com/150" alt="Event Image" />
              </div>
              <div className="PE-text-container">
                <h2>Heron's Night</h2>
                <h6>UMak Oval</h6>
                <h6>November 30, 2024</h6>
              </div>
            </div>

            <div className="box-mnc">
              <div className="img-container">
                <img src="https://via.placeholder.com/150" alt="Event Image" />
              </div>
              <div className="PE-text-container">
                <h2>CCIS Recognition Day 2024</h2>
                <h6>HPSB 1012</h6>
                <h6>November 15, 2024</h6>
              </div>
            </div>
          </div>
        </div>
        <hr className="divider" />

        <div className="events-container">
          <div className="eventsTitleBtn-container">
            <div className="eventsTitle">
              <h2>
                {selected === "upcoming"
                  ? "Upcoming Events"
                  : "Recently Past Events"}
              </h2>
            </div>
            <div className="eventsBtn">
              <div className="toggle-container">
                <button
                  className={`toggle-button ${
                    selected === "upcoming" ? "active" : ""
                  }`}
                  onClick={() => setSelected("upcoming")}
                >
                  Upcoming
                </button>
                <button
                  className={`toggle-button ${
                    selected === "past" ? "active" : ""
                  }`}
                  onClick={() => setSelected("past")}
                >
                  Past
                </button>
              </div>
            </div>
          </div>

          {/* RECENT AND UPCOMING EVENTS */}
          {/* UPCOMING EVENTS */}
          <div className="UP-Events-mnc">
            {selected === "upcoming" && (
              <>
                <div className="UP-Events">
                  <div className="UP-Events-date">
                    <h2>Nov 06</h2>
                  </div>
                  <div className="UP-Events-box">
                    <div className="UP-Events-img-container">
                      <img
                        src="https://via.placeholder.com/150"
                        // src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg/1200px-Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg"
                        alt="Event Image"
                      />
                    </div>
                    <div className="UP-Events-text-container">
                      <h2>UMak Jammer’s Concert for a cause</h2>
                      <h6>UMak Oval</h6>
                      <h6>November 05, 2024</h6>
                      <h6>3:00 PM</h6>
                    </div>
                  </div>
                </div>

                <div className="UP-Events">
                  <div className="UP-Events-date">
                    <h2>Nov 06</h2>
                  </div>
                  <div className="UP-Events-box">
                    <div className="UP-Events-img-container">
                      <img
                        src="https://via.placeholder.com/150"
                        // src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg/1200px-Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg"
                        alt="Event Image"
                      />
                    </div>
                    <div className="UP-Events-text-container">
                      <h2>ION Pinning and Capping Ceremony 2024</h2>
                      <h6>UMak Auditorium</h6>
                      <h6>November 06, 2024</h6>
                      <h6>9:00 AM</h6>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* PAST EVENTS */}
          <div className="UP-Events-mnc">
            {selected === "past" && (
              <>
                <div className="UP-Events">
                  <div className="UP-Events-date">
                    <h2>Oct 30</h2>
                  </div>
                  <div className="UP-Events-box">
                    <div className="UP-Events-img-container">
                      <img
                        src="https://via.placeholder.com/150"
                        // src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg/1200px-Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg"
                        alt="Event Image"
                      />
                    </div>
                    <div className="UP-Events-text-container">
                      <h2>CCIS General Assembly</h2>
                      <h6>UMak Auditorium</h6>
                      <h6>October 20, 2024</h6>
                      <h6>9:00 AM</h6>
                    </div>
                  </div>
                </div>

                <div className="UP-Events">
                  <div className="UP-Events-date">
                    <h2>Oct 30</h2>
                  </div>
                  <div className="UP-Events-box">
                    <div className="UP-Events-img-container">
                      <img
                        src="https://via.placeholder.com/150"
                        // src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg/1200px-Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg"
                        alt="Event Image"
                      />
                    </div>
                    <div className="UP-Events-text-container">
                      <h2>CCIS Hackathon</h2>
                      <h6>UMak HPSB 1012</h6>
                      <h6>October 20, 2024</h6>
                      <h6>9:00 AM</h6>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

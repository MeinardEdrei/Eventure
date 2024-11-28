"use client";
import { useEffect, useState } from "react";
import "../css/organizerList.css";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";
import PDFUploadModal from "./UploadModal";

// Mock event data (replace with actual API call)
const eventData = [
  {
    id: 1,
    title: "UMak Jammers Concert for a Cause",
    location: "UMak Oval",
    date: "November 5, 2024 - 3:00 PM",
    image: "/heronsNight.jpg",
    status: "Pending",
  },
  {
    id: 2,
    title: "UMak Jammers Concert for a Cause",
    location: "UMak Oval",
    date: "November 5, 2024 - 3:00 PM",
    image: "/heronsNight.jpg",
    status: "Approved",
  },
  {
    id: 3,
    title: "UMak Jammers Concert for a Cause",
    location: "UMak Oval",
    date: "November 5, 2024 - 3:00 PM",
    image: "/heronsNight.jpg",
    status: "Modified",
  },
  {
    id: 4,
    title: "UMak Jammers Concert for a Cause",
    location: "UMak Oval",
    date: "November 5, 2024 - 3:00 PM",
    image: "/heronsNight.jpg",
    status: "Rejected",
  },
];

function OrganizerList() {
  const [selected, setSelected] = useState("Pending");
  const progressOptions = ["Pending", "Approved", "Modified", "Rejected"];
  const [isOpen, setIsOpen] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  const handleFileUpload = (files) => {
    console.log("Files to upload:", files);
  };

  useEffect(() => {
    const filtered = eventData.filter((event) => event.status === selected);
    setFilteredEvents(filtered);
  }, [selected]);

  return (
    <div className="org-list-mnc">
      <div>
        <div className="flex flex-row items-end justify-between mb-2">
          <div className="flex flex-col">
            <div className="eventTitle">My Events</div>
            <div className="eventDescription">
              A personalized dashboard to view, manage, and track all your
              upcoming and past events.
            </div>
          </div>

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
                {progressOptions.map((option) => (
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

        <div className="line-container w-[100%] h-auto">
          <hr className="border border-solid border-[#ffffff62]" />
        </div>
      </div>

      <div className="flex flex-col items-center w-[100%]">
        <div className="content-wrapper flex flex-col items-start gap-4">
          <div className="card-status">
            <h3>{selected}</h3>
          </div>

          <div className="cards-container w-full">
            {filteredEvents.length === 0 ? (
              <div className="text-center w-full text-gray-500">
                No events found in {selected} status
              </div>
            ) : (
              filteredEvents.map((event) => (
                <div key={event.id} className="organizerEventCard mb-4">
                  <div className="organizerImage">
                    <img src={event.image} alt={event.title} />
                  </div>

                  <div className="cardDetails">
                    <div className="flex flex-row justify-between items-start gap-10">
                      <div className="flex flex-col mb-4">
                        <div className="cardTitle">{event.title}</div>
                        <div className="cardInfo">
                          <p>{event.location}</p>
                          <p>{event.date}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row gap-4 justify-end">
                      {/* Button: See Details */}
                      <Link href="/OrganizerEvents">
                        <div className="bg-transparent hover:bg-[#ffffff]/50 transition-all border border-[#ffffff]/25 flex items-center gap-2 px-4 py-2 rounded">
                          <i
                            className="fa fa-info-circle text-[0.8rem]"
                            aria-hidden="true"
                          ></i>
                          <button className="text-[0.8rem]">See Details</button>
                        </div>
                      </Link>

                      {/* Button: Upload Requirements */}
                      <div className="bg-[#b6b6b6] hover:bg-[#6a6a6a] text-[#000000] hover:text-white transition-all flex items-center gap-2 px-4 py-2 rounded">
                        <i
                          className="fa fa-plus text-[0.8rem]"
                          aria-hidden="true"
                        ></i>
                        <button
                          className="text-[0.8rem]"
                          onClick={() => setIsUploadModalOpen(true)}
                        >
                          Upload Files
                        </button>
                      </div>
                      <PDFUploadModal
                        isOpen={isUploadModalOpen}
                        onClose={() => setIsUploadModalOpen(false)}
                        onUpload={handleFileUpload}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizerList;

"use client";
import { useEffect, useState } from "react";
import "../css/organizerList.css";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";
import PDFUploadModal from "./UploadModal";
import { useSession } from "next-auth/react";
import axios from "axios";

function MyEvents() {
  const [selected, setSelected] = useState("Pending");
  const progressOptions = ["Pending", "Approved", "Modified", "Rejected"];
  const [isOpen, setIsOpen] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchData = async () => {
    try {
        if (session) {
            const res = await axios.get(`http://localhost:5000/api/organizer/events/${session?.user?.id}`);
            setEvents(res.data);
        }
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(() => {
    fetchData(); 
  }, [session]);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  const handleFileUpload = async (files) => {
    // console.log("Files to upload:", files);
    try {
      const formData = new FormData();
      
      formData.append("id", selectedEvent.id);
      files.forEach((file) => formData.append('files', file));
      const res = await axios.post('http://localhost:5000/api/organizer/upload-requirements', 
        formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      
      if (res.status === 200) {
        alert(res.data.message);
        fetchData();

        const newFileNames = files.map(file => file.name);
        setSelectedEvent((prev) => ({
          ...prev,
          requirementFiles: [...prev.requirementFiles, ...newFileNames], 
          requirementFilesCount: prev.requirementFilesCount + newFileNames.length,
        }));

        setIsUploadModalOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteFile = async (id, eventType, fileName) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/organizer/deleteFile/${id}/${eventType}/${fileName}`);
      if (res.status === 200) {
        // alert("Deleted Successfully");
        fetchData();
        setSelectedEvent((prevEvent) => ({
          ...prevEvent,
          requirementFiles: prevEvent.requirementFiles.filter(file => file !== fileName),
          requirementFilesCount: prevEvent.requirementFilesCount - 1
        }));
      }
    } catch (error) {
      console.error('PDF Deletion Failed', error);
    }
  };

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

  useEffect(() => {
    const filtered = events.filter((event) => event.status === selected);
    setFilteredEvents(filtered);
  }, [selected, events]);

  if (loading) return <div>Loading...</div>;
  

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
        <div className="content-wrapper flex flex-col items-start gap-4 w-[80%]">
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
                    <img src={`http://localhost:5000/api/event/uploads/${event.eventImage}`} alt={event.title} />
                  </div>

                  <div className="cardDetails w-full">
                    <div className="flex flex-row justify-between items-start gap-10">
                      <div className="flex flex-col mb-4">
                        <div className="cardTitle">{event.title}</div>
                        <div className="cardInfo">
                          <p>{event.location}</p>
                          <p>{new Date(event.dateStart).toLocaleDateString('en-us', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row gap-4 justify-end">
                      
                      {/* Button: See Details */}
                      <Link href={`/Event-Details/${event.id}`}>
                        <div className="bg-transparent hover:bg-[#ffffff]/50 transition-all border border-[#ffffff]/25 flex items-center gap-2 px-4 py-2 rounded">
                          <i
                            className="fa fa-info-circle text-[0.8rem]"
                            aria-hidden="true"
                          ></i>
                          <button className="text-[0.8rem]">See Details</button>
                        </div>
                      </Link>

                      {/* Button: Upload Requirements */}
                      { event.status === selected && (selected === 'Pending' || selected === 'Modified') && ( 
                        <button 
                          type="button"
                          onClick={() => {
                            setIsUploadModalOpen(true); 
                            setSelectedEvent(event);
                          }}
                          className="bg-[#b6b6b6] hover:bg-[#6a6a6a] text-[#000000] hover:text-white transition-all flex items-center gap-2 px-4 py-0 rounded">
                          <i
                            className={`fa ${event.requirementFilesCount === 0 ? 'fa-plus' : 'fa-cog'} text-[0.8rem]`}
                            aria-hidden="true"
                          ></i>
                          <p
                            className="text-[0.8rem]"
                          >
                            {event.requirementFilesCount === 0 ? "Upload Requirements" : "Manage Requirements"}
                          </p>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            <PDFUploadModal
              // Modal Functions
              isOpen={isUploadModalOpen}
              onClose={() => setIsUploadModalOpen(false)}

              // Event Related
              onUpload={handleFileUpload}
              event={selectedEvent}
              handleDeleteFile={handleDeleteFile}
              handleFileDownload={handleFileDownload}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyEvents;

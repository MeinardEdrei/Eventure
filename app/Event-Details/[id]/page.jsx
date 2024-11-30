'use client';
import '../../css/organizerEvents.css';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Html5Qrcode } from 'html5-qrcode';

function OrganizerEvents() {
    const { id } = useParams();
    const [activeButton, setActiveButton] = useState('Overview');
    const textareaRef = useRef(null); // Reference to the textarea
    const [selectedSection, setSelectedSection] = useState('waiting');
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState([]);
    const [partners, setPartners] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [isScannerActive, setIsScannerActive] = useState(false);
    const [scanMessage, setScanMessage] = useState("");
    const html5QrCodeRef = useRef(null);
    const hasScannedRef = useRef(false);
    const [isScanning, setIsScanning] = useState(false);

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    const toggleScanner = (e) => {
        e.preventDefault();
        
        // Prevent multiple simultaneous toggle attempts
        if (isScanning) return;

        setScanMessage("");
        setIsScanning(true);

        const handleScannerToggle = async () => {
            try {
                // FOR STOPPING THE SCANNER
                if (html5QrCodeRef.current) {
                    await html5QrCodeRef.current.stop();
                    html5QrCodeRef.current = null;
                }

                // Toggle the active state
                setIsScannerActive(prevState => {
                    const newState = !prevState;
                    
                    if (newState) {
                        initializeScanner();
                    }

                    return newState; // Initialize
                });
            } catch (error) {
                console.error("Error toggling scanner", error);
            } finally {
                setIsScanning(false);
            }
        };

        handleScannerToggle();
    };

    const initializeScanner = async () => {
        if (!html5QrCodeRef.current) {
            try {
                const html5QrCode = new Html5Qrcode("reader");
                html5QrCodeRef.current = html5QrCode;

                const qrCodeSuccessCallback = async (decodedText) => {
                    if (hasScannedRef.current) return;
                    hasScannedRef.current = true;

                    try {
                        const res = await axios.post(`http://localhost:5000/api/organizer/${decodedText}/present`);
                        setScanMessage(
                            res.status === 200 
                            ? `Attendance confirmed for ${decodedText}`
                            : res.status === 409 
                            ? `Ticket has already been scanned for ${decodedText}`
                            : `Error confirming attendance for ${decodedText}`
                        );
                        fetchData();
                    } catch (error) {
                        const statusCode = error?.response?.status; 
                        setScanMessage(
                            statusCode === 409 
                            ? `Ticket has already been scanned for ${decodedText}` 
                            : `Error: ${error.message || 'An unknown error occurred.'}`
                        )
                    } 
                    setTimeout(() => {
                        hasScannedRef.current = false;
                    }, 5000);
                };

                await html5QrCode.start(
                    { facingMode: "environment" }, 
                    { fps: 10, qrbox: { width: 250, height: 250 } }, 
                    qrCodeSuccessCallback
                );
            } catch (err) {
                console.error("Failed to start QR Code scanning", err);
                setIsScannerActive(false);
                setIsScanning(false);
            }
        }
    };

    // Cleanup effect
    useEffect(() => {
        return () => {
            if (html5QrCodeRef.current) {
                html5QrCodeRef.current.stop()
                    .catch(err => console.error("Error in cleanup", err));
                hasScannedRef.current = false;
                html5QrCodeRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const textarea = textareaRef.current;
    
        const adjustHeight = () => {
            textarea.style.height = 'auto'; // Reset the height
            textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on content
        };
    
        if (textarea) {
            adjustHeight(); // Adjust height on component mount
            textarea.addEventListener('input', adjustHeight);
            return () => textarea.removeEventListener('input', adjustHeight); // Cleanup
        }
    }, []);    
    
    // FETCH DATA FROM API
    const fetchData = async () => {
        try {
            const res1 = await axios.get(`http://localhost:5000/api/event/events${id}`);
            const res2 = await axios.get(`http://localhost:5000/api/organizer/${id}/participants`);
            setParticipants(res2.data);
            setEvent(res1.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    // HANDLE PRESENT BUTTON
    const handlePresentButton = async (email) => {
        try {
            const res = await axios.post(`http://localhost:5000/api/organizer/${email}/present`);
            if (res.status === 200) {
                alert(res.data.message);
                fetchData();
            }
        } catch (error) {
            console.log(error);
        }
    }
    // HANDLE UNDO PRESENT BUTTON
    const handleUndoPresent = async (email) => {
        try {
            const res = await axios.post(`http://localhost:5000/api/organizer/${email}/undo-present`);
            if (res.status === 200) {
                alert(res.data.message);
                fetchData();
            }
        } catch (error) {
            console.log(error);
        }
    }
    // HANDLE APPROVE PARTICIPANT BUTTON
    const handleApproveParticipant = async (email) => {
        try {
            const res = await axios.post(`http://localhost:5000/api/organizer/${email}/approve-participant`);
            if (res.status === 200) {
                alert(res.data.message);
                fetchData();
            }
        } catch (error) {
            console.log(error);
        }
    }
    // HANDLE DISAPPROVE PARTICIPANT BUTTON
    const handleDisapproveParticipant = async (email) => {
        try {
            const res = await axios.post(`http://localhost:5000/api/organizer/${email}/disapprove-participant`);
            if (res.status === 200) {
                alert(res.data.message);
                fetchData();
            }
        } catch (error) {
            console.log(error);
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="container">
                <div className="eventTitle">{event.title}</div>
                <div className="dashboardButtons">
                    {['Overview', 'Registration', 'Share', 'More'].map((name) => (
                        <button
                            key={name}
                            className={activeButton === name ? 'active' : ''}
                            onClick={() => handleButtonClick(name)}
                        >
                            {name}
                        </button>
                    ))}
                </div>
                <div className="output">

                    {activeButton === 'Overview' && (
                        <>
                            <hr />
                            <div className="overviewContainer">
                                <img src={`http://localhost:5000/api/event/uploads/${event.eventImage}`} alt="Heron's Night" />
                                <div className="overviewDetails">
                                    <h1>{event.title}</h1>
                                    <p>{event.location}</p>
                                    <p>
                                        {new Date(event.dateStart).toLocaleDateString('en-us', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })} - {new Date(`${event.dateStart.split('T')[0]}T${event.timeStart}`).toLocaleTimeString('en-us', {
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            hour12: true,
                                        })}
                                    </p>
                                    <button>Edit Event</button>
                                </div>
                            </div>
                            <hr />
                            <div className="organizerHeader">
                                <h6>Event Details</h6>
                            </div>
                            <div className="statContainer">
                                <p className="eventStatistic">Waiting: {participants.find(p => p.status === 'Waiting')?.count || 0}</p>
                                
                                <p className="eventStatistic">
                                    {/* PARTICIPANTS WITH STATUS COUNT: ATTENDING = GOING + ATTENDED */}
                                    Attending: {['Going', 'Attended']
                                        .map(status => participants.find(p => p.status === status)?.count || 0)
                                        .reduce((total, count) => total + count, 0)}
                                </p>

                                <p className="eventStatistic">Cancelled: {participants.find(p => p.status === 'Cancelled')?.count || 0}</p>
                            </div>
                            <hr />
                            <div className=''>
                                <div className="organizerHeader">Event Partners</div>
                                <div className="organizerDescription">Add hosts, special guests, and event managers.</div>
                            </div>
                            <div className="guestContainer">
                                { JSON.parse(event.partnerships).map((partner, index) => (
                                    <div key={index}>
                                    <div className="guestRowContainer">
                                        <div className="guestDetails">
                                            <h6>{partner}</h6>
                                        </div>
                                        <div className="guestRowButtons">
                                            <button className='modifyHostButton'>Modify</button>
                                            <button className='removeHostButton'>Remove</button>
                                        </div>
                                        
                                    </div>
                                    { index < JSON.parse(event.partnerships).length - 1 && (
                                        <div className="smallhr">
                                                <hr />
                                        </div> 
                                    )}
                                    </div>
                                ))}
                            </div>
                            <div className="addHostContainer">
                                <input type="text" className='addHostsName' placeholder='Type event partners' />
                                <button className='addHosts'>Add Partners</button>
                            </div>
                        </>
                    )}
                    
                    {activeButton === 'Registration' && (
                        <>
                            <hr />
                            <div className="section">
                                <div className="w-[60%]">
                                    <div className="organizerHeader">Attendees List</div>
                                    <div className="organizerDescription">
                                        Manage and view participant details for streamlined event coordination.
                                    </div>
                                </div>

                                {/* Toggle Button Container */}
                                <div className="toggleButtonContainer">
                                    <button
                                        className={`toggleButton ${selectedSection === 'waiting' ? 'active' : ''}`}
                                        onClick={() => setSelectedSection('waiting')}
                                    >
                                        Waiting
                                    </button>
                                    <button
                                        className={`toggleButton ${selectedSection === 'attending' ? 'active' : ''}`}
                                        onClick={() => setSelectedSection('attending')}
                                    >
                                        Going
                                    </button>
                                    <button
                                        className={`toggleButton ${selectedSection === 'attended' ? 'active' : ''}`}
                                        onClick={() => setSelectedSection('attended')}
                                    >
                                        Attended
                                    </button>
                                </div>
                            </div>
                            {/* search bar section */}
                            <div className="searchBarContainer">
                                <div className="searchBar">
                                    <input type="text" name="" id="searchBar" placeholder='Search by name...'/>
                                </div>
                                <button type="submit">Search</button>
                            </div>
                            {/* Dynamic Content Section */}
                            <div className="contentSection">
                                {selectedSection === 'waiting' && (
                                    <div className="guestContainer">
                                        { participants.find(p => p.status === 'Waiting')?.email.length > 0 ? (
                                          participants.find(p => p.status === 'Waiting')
                                          ?.email.map((email, index) => (
                                            <div key={index}>
                                            <div className="guestDetails">
                                                <h6>{participants.find(p => p.status === 'Waiting').name[index]}</h6>
                                                <p>{email}</p>
                                                <div className="buttons">
                                                    <button onClick={() => handleApproveParticipant(email)}>Approve</button>
                                                    <button onClick={() => handleDisapproveParticipant(email)}>Disapprove</button>
                                                </div>
                                            </div>
                                            { index < participants.find(p => p.status === 'Waiting').email.length - 1 && (
                                                <div className="smallhr">
                                                    <hr />
                                                </div>
                                            )}
                                            </div>
                                        ))) : (
                                            <>
                                            <div>No pending attendees right now.</div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {selectedSection === 'attending' && (
                                    <div className="attendeeList">
                                        <div className="guestContainer">
                                            { participants.find(p => p.status === 'Going')?.email.length > 0 ? (
                                              participants.find(p => p.status === 'Going').email.map((email, index) => (
                                                    <div key={index}>
                                                        <div className="guestDetails">
                                                            <h6>{participants.find(p => p.status === 'Going').name[index]}</h6>
                                                            <p>{email}</p>    
                                                            <div className="buttons">
                                                                <button type='submit' onClick={() => handlePresentButton(email)}>
                                                                    Present
                                                                </button>
                                                            </div>
                                                        </div>
                                                        {index < participants.find(p => p.status === 'Going').email.length - 1 && (
                                                            <div className="smallhr">
                                                                <hr />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div>No attendees right now.</div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {selectedSection === 'attended' && (
                                    <div className="attendeeList">
                                        <div className="guestContainer">
                                            { participants.find(p => p.status === 'Attended')?.email.length > 0 ? (
                                              participants.find(p => p.status === 'Attended')?.email.map((email, index) => (
                                                <div key={index}>
                                                    <div className="guestDetails">
                                                        <h6>{participants.find(p => p.status === 'Attended').name[index]}</h6>
                                                        <p>{email}</p>    
                                                        <div className="buttons">
                                                        <button 
                                                            onClick={() => handleUndoPresent(email)}
                                                        >
                                                            Undo
                                                        </button>
                                                        </div>
                                                    </div>
                                                    { index < participants.find(p => p.status === 'Attended').email.length - 1 && (
                                                        <div className="smallhr">
                                                            <hr />
                                                        </div>
                                                    )}
                                                </div>
                                            ))) : (
                                                <>
                                                <div>Attendees are still in line right now.</div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <hr />
                            <div className="organizerHeader">Event Attendance</div>
                            <div className="organizerDescription">
                                Efficiently track attendee check-ins and monitor participation in real-time during events.
                            </div>
                            
                            <div className='w-full flex flex-col justify-center items-center'>
                                <div className='flex flex-col justify-center items-center w-[80%]'>
                                {/* Scan Result Message */}
                                {scanMessage && (
                                    <div className="scanMessage flex w-full" style={{
                                        backgroundColor: scanMessage.includes('Error') ? 'red' 
                                                        : scanMessage.includes('scanned') ? '#B66503' 
                                                        : 'green',
                                        padding: '10px',
                                        margin: '10px 0',
                                        borderRadius: '5px'
                                    }}>
                                        {scanMessage}
                                    </div>
                                )}

                                {/* QR Code Scanner Container */}
                                <div id="reader" 
                                    className='my-[1vw]'
                                    style={{ 
                                    width: '100%', 
                                    display: isScannerActive ? 'block' : 'none' 
                                }}></div>
                                <style>{`
                                    #reader video {
                                        transform: scaleX(-1);
                                    }
                                `}</style>
                                </div>
                            </div>

                            <div className="attendanceButtons">
                                <div className="eventScanner">
                                    <button
                                 type="button"
                                 onClick={(e) => {
                                    toggleScanner(e); 
                                    setSelectedSection('attending');
                                 }}
                                >
                                    {isScannerActive ? "Stop Scanning" : "Start QR Scanner"}
                                </button>
                                </div>
                                <div className="exportToExcel">
                                    <button>Export to Excel</button>
                                </div>
                            </div>
                            <hr />

                            {/* Toggle Restriction */}
                            <div className="organizerHeader">Toggle Registration</div>
                            <div className="organizerDescription">
                                Enable or disable event registration with a single click for flexible attendee management.
                            </div>
                        </>
                    )}


                    {activeButton === 'Share' && 
                    <>
                    <hr />
                        <div className="organizerHeader">Send Notifications</div>
                            <div className="organizerDescription">Add hosts, special guests, and event managers.</div>
                            <div className="postContainer">
                            <textarea
                                ref={textareaRef}
                                placeholder="Say something meaningful..."
                                onInput={(e) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = `${e.target.scrollHeight}px`; 
                                }}
                                style={{
                                    overflowY: 'auto'
                                }}
                            />
                            <div className="postButtons">
                                <button>Attach an image</button>
                                <button>Send</button>
                            </div>
                            </div>
                            <hr />
                            <div className="organizerHeader">Share Event</div>
                            <div className="organizerDescription">Add hosts, special guests, and event managers.</div>
                            <div className="sharebutton">
                                <button>Facebook</button>
                                <button>Instagram</button>
                                <button>Twitter</button>
                            </div>
                    </>
                    }
                    
                    {activeButton === 'More' && 
                    <>
                    <hr />
                        <div className="organizerHeader">Report Generation</div>
                        <div className="organizerDescription">Generate comprehensive event performance and participation reports effortlessly.</div>
                        <div className="generateReport"><button>Generate Report</button></div>
                    <hr />
                        <div className="organizerHeader">Post Evaluation</div>
                        <div className="organizerDescription">Design and distribute surveys or forms to gather feedback and assess event performance.</div>
                        <div className="postEvaluation">
                            <Link href="/PostEvaluation"><button>Create</button></Link>
                            <button>Edit</button>
                            <Link href="/EvaluationSummary"><button>View Summary</button></Link>
                        </div>
                    <hr />
                        <div className="organizerHeader">Cancel Event</div>
                        <div className="organizerDescription">Cancel and permanently delete this event. This operation cannot
                            be undone. If there are any registered guests, we will notify them that the event has been cancelled.
                        </div>
                        <div className="cancelButton">
                        <button>Cancel</button>
                        </div>
                    </>
                    }
                </div>
            </div>
        </>
    );
}

export default OrganizerEvents;

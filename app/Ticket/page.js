'use client';
import React, { useEffect, useState } from 'react'
import "../css/ticket.css";
import { useSession } from 'next-auth/react';
import axios from 'axios';

function Ticket() {
  const { data: session } = useSession();
  const [ticketDetails, setTicketDetails] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/event/${session?.user?.email}/ticket`);
      setTicketDetails(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [session])

  if (!ticketDetails) return <div>Loading...</div>;

  return (
    <div className='ticket-container mt-[2%]'>
      <div className='ticket-subcontainer'>
        {/* TICKET INFO */}
        <div className='ticket-text'>
          <p>TICKET</p>
        </div>
        <div className='ticket-title'>
          <h1>{ticketDetails.eventTitle}</h1>
        </div>
        <div className='ticket-date'>
          <p>{new Date(ticketDetails.eventDate).toLocaleDateString('en-us', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}, {ticketDetails.eventStart} - {ticketDetails.eventEnd}</p>
        </div>
        <div className='ticket-location'>
          <p>{ticketDetails.eventLocation}</p>
        </div>

        <div className='dotted-line'></div>

        {/* QR CODE */}
        <div className='ticket-qr h-[53%]'>
          <img
            src={`data:image/png;base64,${ticketDetails.ticket}`} 
            alt="Event QR Code"
            width="290"
            height="290"
          />
        </div>

        <div className='dotted-line'></div>

        {/* ATTENDEE DETAILS */}
        <div className='ticket-attendee'>
          <div className='full-name'>
            <h3>Guest</h3>
            <p>{ticketDetails.name}</p>
          </div>
          <div className='student-number'>
            <h3>Student Number</h3>
            <p>{ticketDetails.schoolId}</p>
          </div>
        </div>

        <div className='dotted-line'></div>

        {/* DOWNLOAD BUTTON */}
        <div className='ticket-download'>
          <button>Download</button>
        </div>
      </div>
    </div>
  )
}

export default Ticket
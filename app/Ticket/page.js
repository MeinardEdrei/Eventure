'use client';
import React, { useEffect, useState } from 'react'
import "../css/ticket.css";
import { useSession } from 'next-auth/react';
import axios from 'axios';

function Ticket() {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState([]);
  var id = 4;

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/event/${session?.user?.email}/ticket`);
      setTickets(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [session])

  return (
    <div className='ticket-container mt-[2%]'>
      <div className='ticket-subcontainer'>
        {/* TICKET INFO */}
        <div className='ticket-text'>
          <p>TICKET</p>
        </div>
        <div className='ticket-title'>
          <h1>CCIS Student Council and Computer Science Present: CCIS Night - Dance With Friends and Connect With Others!</h1>
        </div>
        <div className='ticket-date'>
          <p>December 21, 2024, 6:00 PM - 11:00 PM</p>
        </div>
        <div className='ticket-location'>
          <p>Oval, University of Makati, West Rembo, Taguig, Metro Manila, Philipines</p>
        </div>

        <div className='dotted-line'></div>

        {/* QR CODE */}
        <div className='ticket-qr'>
          <img
            src={`data:image/png;base64,${tickets.ticket}`} 
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
            <p>{tickets.name}</p>
          </div>
          <div className='student-number'>
            <h3>Student Number</h3>
            <p>{tickets.school_Id}</p>
          </div>
        </div>

        <div className='dotted-line'></div>

        {/* DOWNLOAD BUTTON */}
        <div className='ticket-download'>
          <button >Download</button>
        </div>
      </div>
    </div>
  )
}

export default Ticket

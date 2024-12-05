'use client';
import React, { useEffect, useState } from 'react'
import "../../../css/ticket.css";
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useParams } from 'next/navigation';

function Ticket() {
  const { userID, eventID } = useParams();
  const { data: session } = useSession();
  const [ticketDetails, setTicketDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/ticket/${userID}/${eventID}/my-ticket`);
      setTicketDetails(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [session])

  const downloadTicket = async (e, userId, eventId) => {
    
    try {
        const response = await axios.post(`http://localhost:5000/api/ticket/download`, 
          { userId: userId, eventId: eventId }, 
          { responseType: 'blob' }
        );

        // Create a Blob URL for the PDF response and trigger download
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        // Create a link element to trigger a download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', response.data.fileName || "ticket.pdf");
        document.body.appendChild(link);

        link.click(); 
        link.remove(); 

        // Revoke the URL after the download starts
        window.URL.revokeObjectURL(url);
        
        // const newWindow = window.open(url, '_blank');
        
        // // Revoke the URL after a longer delay
        // setTimeout(() => {
        //     window.URL.revokeObjectURL(url);
        // }, 1000); 

    } catch (error) {
        console.error("Error generating PDF:", error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
    }
  };

  if (loading) return <div>Loading...</div>;

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
          <p>{new Date(ticketDetails.eventDateStart).toLocaleDateString('en-us', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}, {new Date(`2023-01-01T${ticketDetails.eventTimeStart}`).toLocaleTimeString('en-us', {
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
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
            width="280"
            height="280"
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

        <div className='ticket-attendee section_status'>
          <div className='section'>
            <h3>Section</h3>
            <p>{ticketDetails.section}</p>
          </div>
          <div className='status'>
            <h3>Status</h3>
            <p>{ticketDetails.status}</p>
          </div>
        </div>

        <div className='dotted-line'></div>
          
        {/* DOWNLOAD BUTTON */}
        <div className='ticket-download'>
          <button onClick={(e) => downloadTicket(e, ticketDetails.userId, ticketDetails.eventId)}>Download</button>
        </div>
        
      </div>
    </div>
  )
}

export default Ticket
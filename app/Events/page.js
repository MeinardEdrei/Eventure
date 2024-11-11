'use client';

import axios from 'axios';
import '../css/eventDashboard.css'
import Image from 'next/image'
import Link from 'next/link';
import { useEffect, useState } from 'react';


function eventsDashboard () {
    const [ event, setEvent ] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const res = await axios.get('http://localhost:5000/api/auth/events');
            setEvent(res.data);
          } catch (error) {
            console.error(error);
          }
        }
        
        fetchData();
        
      }, [])

    return (
        <div className="container">
            <div className="eventTitle">Events</div>
            <div className="eventDescription">
                Explore popular events near you, browse by category, or check out some of the great community calendars.
            </div>
            <div className="parentContainer">
                {event.map((event) => (
                    <Link href='\EventPost' key={event.id}>
                        <div className="cardContainer">
                            <div className="cardImage">
                                <img 
                                    src={`http://localhost:5000/api/auth/uploads/${event.event_Image}`}
                                    alt={event.title}
                            />
                            </div>
                            <div className="cardTitle">{event.title}</div>
                            <div className="cardDetails">
                                <p>{event.location}</p>
                                <p>{new Date(event.date).toLocaleDateString()} - {event.start}</p>
                            </div>
                            <hr />
                            <div className="cardDescription">
                                {event.description}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default eventsDashboard
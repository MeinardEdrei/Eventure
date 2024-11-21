'use client';

import axios from 'axios';
import '../css/eventDashboard.css'
import Image from 'next/image'
import Link from 'next/link';
import { useEffect, useState } from 'react';


function eventsDashboard () {
    const [ event, setEvent ] = useState([]);
    const [ noEvents, setNoEvents ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
          try {
            setLoading(true);
            
            const res = await axios.get('http://localhost:5000/api/event/events');
            setEvent(res?.data);
            
            if (res.data.length === 0) {
                setNoEvents(true);
            }
          } catch (error) {
            if (error.status == 404) {
                setNoEvents(true);
            }
          } finally {
            setLoading(false);
          }
        }
        
        fetchData();
        
    }, [])

    if (loading) {
        return <div className='text-white'>Loading...</div>;
    }

    return (
        <div className="container">
            <div className="eventTitle">Events</div>
            <div className="eventDescription">
                Explore popular events near you, browse by category, or check out some of the great community calendars.
            </div>
            <div className="parentContainer">
                {noEvents ? (
                    <div className="noEvents">Message: No events found</div>
                ) : (
                    event.map((event) => (
                        <Link href={`/Event-Post/${event.id}`} key={event.id}>
                            <div className="cardContainer">
                                <div className="cardImage">
                                    <img 
                                        src={`http://localhost:5000/api/event/uploads/${event.event_Image}`}
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
                    ))
                )}
            </div>
        </div>
    );
}

export default eventsDashboard
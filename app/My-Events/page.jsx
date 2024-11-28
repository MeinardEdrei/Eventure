'use client';
import '../css/organizerList.css';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

function MyEvents () {
    const { data: session } = useSession();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                if (session) {
                    const res = await axios.get(`http://localhost:5000/api/event/organizer-events/${session?.user?.id}`)
                    setEvents(res.data);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
       fetchData();
    }, [session]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <div className="container">
            <div className="eventTitle">My Events</div>
            <div className="eventDescription">A personalized dashboard to view, manage, and track all your upcoming and past events.</div>

            { events.map((event) => (
                <Link key={event.id} href={`/Event-Details/${event.id}`}>
                <div className="containerngmgacards">
                    <div className="organizerEventCard">
                        <div className="organizerImage">
                            <img src={`http://localhost:5000/api/event/uploads/${event.eventImage}`} alt="" />
                        </div>
                        <div className="cardDetails">
                            <div className="cardTitle">{event.title}</div>
                            <div className="cardInfo">
                                <p>{event.location}</p>
                                <p>
                                    {new Date(event.dateStart).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })} - {new Date(`${event.dateStart.split('T')[0]}T${event.timeStart}`).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true,
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                </Link>
            ))}
        </div>
        </>
    )
}

export default MyEvents;
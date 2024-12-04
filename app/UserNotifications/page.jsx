'use client';
import '../css/userNotifications.css';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

function UserNotifcations() {
    const { data: session, status } = useSession();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const res = await axios.get('http://localhost:5000/api/event/notification');
                setNotifications(res.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchNotifications();
    }, [])

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <div className="container">
            <div className="eventTitle">Event Notifications</div>
            <div className="eventDescription">Receive personalized notifications and reminders for all your events, keeping you informed and on schedule with timely updates right at your fingertips.</div>

            <div className="notificationContainer bg-zinc-900">
            { notifications.length === 0 ? (
                <div className="noNotifications">No notifications available</div>
            ) : (
                notifications.map((notif) => (
                    <div key={notif.id} className="subcon">
                        <Link 
                            className='flex gap-2 items-center m-0'
                            href={`/ViewNotification/${notif.eventId}`}
                        >
                            <div className='object-cover w-[20%]'>
                                <img 
                                    className='w-[100%] rounded-xl'
                                    src={`http://localhost:5000/api/event/uploads/${notif.eventImage}`} 
                                    alt="Event Image" 
                                />
                            </div>
                            <div className="userPreview w-[100%]">
                                <h6>{notif.userName} created a new event! Check it out before tickets ran out!</h6>
                                <p className='mt-2'>{notif.eventDesc}</p>
                            </div>
                        </Link>
                    </div>
                ))
            )}
            </div>
        </div>
        </>
    )
}

export default UserNotifcations;
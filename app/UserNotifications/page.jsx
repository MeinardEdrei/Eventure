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
            console.log(notifications)
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

            <div className="notificationContainer">
            { notifications.length === 0 ? (
                <div className="noNotifications">No notifications available</div>
            ) : (
                notifications.map((notif) => (
                    <div key={notif.id} className="subcon">
                        <div className="w-[30%] h-[50%]">
                            <img src={`http://localhost:5000/api/event/uploads/${notif.eventImage}`} alt="" />
                        </div>
                        <Link 
                            href={`/ViewNotification/${notif.id}`}
                            >
                            <div className="userPreview">
                                <h6>{notif.userName} Posted a New Event to the Community.</h6>
                                <p>{notif.eventDesc}</p>
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
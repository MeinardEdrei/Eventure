'use client';
import '../../css/viewNotification.css';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

function ViewNotification () {
    const { id } = useParams();
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchNotification = async () => {
            const res = await axios.get(`http://localhost:5000/api/event/events${id}`);
            setNotification(res.data);
            console.log(res.data);
        }
        fetchNotification();
    }, []);

    return (
        <>
        <div className="container">
            <div className="notifContainer">
                <div className="notificationHeader">
                    <img src={`http://localhost:5000/api/event/uploads/${notification?.event_Image}`} alt="" />
                </div>
                <div className="notificationSub">
                    <h6>{notification?.title}</h6>
                    <p>{notification?.location} ,
                        {new Date(notification?.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </p>
                </div>
            </div>
            <hr />
            <div className="notificationBox">
                <div className="notifContainer">
                    <div className="userImage">
                        <img src="/user.jpg" alt="" />
                    </div>
                    <div className="postDetails">
                        <h6>{notification?.hosted_By}</h6>
                        <p>
                            {new Date(notification?.date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </p>
                    </div>
                </div>
                <hr />
                <div className="notifImage">
                    <img src={`http://localhost:5000/api/event/uploads/${notification?.event_Image}`} alt="" />
                </div>
                <div className="notifText">
                    <p>
                        {notification?.description}
                    </p>
                </div>
                <div className="closeButton">
                    <Link href="/UserNotifications">
                        Close
                    </Link>
                </div>
            </div>
        </div>
        </>
    )
}

export default ViewNotification;
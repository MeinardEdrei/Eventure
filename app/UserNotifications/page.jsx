'use client';
import '../css/userNotifications.css';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';

function UserNotifcations() {
    return (
        <>
        <div className="container">
            <div className="eventTitle">Event Notifications</div>
            <div className="eventDescription">Receive personalized notifications and reminders for all your events, keeping you informed and on schedule with timely updates right at your fingertips.</div>
        
            <div className="notificationContainer">
                <div className="subcon">
                    <div className="userImage">
                        <img src="/user.jpg" alt="" />
                    </div>
                    <Link href="/ViewNotification">
                        <div className="userPreview">
                            <h6>UMak Jammer's Concert for a cause posted a message to the community.</h6>
                            <p>Attention UMak Jammers! Join us for  anight of music and giving! Get ready to make a difference with every beat! We're hosting "Jam for a cause,"</p>
                        </div>
                    </Link>
                </div>
                <hr />
                <div className="subcon">
                    <div className="userImage">
                        <img src="/user.jpg" alt="" />
                    </div>
                    <a href="">
                        <div className="userPreview">
                            <h6>UMak Jammer's Concert for a cause posted a message to the community.</h6>
                            <p>Attention UMak Jammers! Join us for  anight of music and giving! Get ready to make a difference with every beat! We're hosting "Jam for a cause,"</p>
                        </div>
                    </a>
                </div>
                <hr />
                <div className="subcon">
                    <div className="userImage">
                        <img src="/user.jpg" alt="" />
                    </div>
                    <a href="">
                        <div className="userPreview">
                            <h6>UMak Jammer's Concert for a cause posted a message to the community.</h6>
                            <p>Attention UMak Jammers! Join us for  anight of music and giving! Get ready to make a difference with every beat! We're hosting "Jam for a cause,"</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
        </>
    )
}

export default UserNotifcations;
'use client';
import '../css/organizerList.css';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';

function OrganizerList () {
    return (
        <>
        <div className="container">
            <div className="eventTitle">My Events</div>
            <div className="eventDescription">A personalized dashboard to view, manage, and track all your upcoming and past events.</div>

            <Link href='/OrganizerEvents'>
            <div className="containerngmgacards">
                <div className="organizerEventCard">
                    <div className="organizerImage">
                        <img src="/heronsNight.jpg" alt="" />
                    </div>
                    <div className="cardDetails">
                        <div className="cardTitle">UMak Jammers Concert for a cause</div>
                        <div className="cardInfo">
                            <p>UMak Oval</p>
                            <p>November 5, 2024 - 3:00 PM</p>
                        </div>
                    </div>
                </div>
                <div className="organizerEventCard">
                    <div className="organizerImage">
                        <img src="/heronsNight.jpg" alt="" />
                    </div>
                    <div className="cardDetails">
                        <div className="cardTitle">UMak Jammers Concert for a cause</div>
                        <div className="cardInfo">
                            <p>UMak Oval</p>
                            <p>November 5, 2024 - 3:00 PM</p>
                        </div>
                    </div>
                </div>
            </div>
            </Link>
        </div>
        </>
    )
}

export default OrganizerList;
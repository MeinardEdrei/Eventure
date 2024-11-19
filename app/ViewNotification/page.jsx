'use client';
import '../css/viewNotification.css';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';

function ViewNotification () {
    return (
        <>
        <div className="container">
            <div className="notifContainer">
                <div className="notificationHeader">
                    <img src="/heronsNight.jpg" alt="" />
                </div>
                <div className="notificationSub">
                    <h6>Heron's Night</h6>
                    <p>UMak Oval, November 30, 2024</p>
                </div>
            </div>
            <hr />
            <div className="notificationBox">
                <div className="notifContainer">
                    <div className="userImage">
                        <img src="/user.jpg" alt="" />
                    </div>
                    <div className="postDetails">
                        <h6>UMak Jammers</h6>
                        <p>November 5, 2024</p>
                    </div>
                </div>
                <hr />
                <div className="notifImage">
                    <img src="/heronsNight.jpg" alt="" />
                </div>
                <div className="notifText">
                    <p>
                    𝐀𝐭𝐭𝐞𝐧𝐭𝐢𝐨𝐧 𝐔𝐌𝐚𝐤 𝐉𝐚𝐦𝐦𝐞𝐫𝐬! 🎶 𝐉𝐨𝐢𝐧 𝐮𝐬 𝐟𝐨𝐫 𝐚 𝐧𝐢𝐠𝐡𝐭 𝐨𝐟 𝐦𝐮𝐬𝐢𝐜 𝐚𝐧𝐝 𝐠𝐢𝐯𝐢𝐧𝐠! 🎸🎤
                    Get ready to make a difference with every beat! We're hosting "Jam for a Cause," where music meets charity to help those in need.
                    <br/><br/>
                    ⋆🌟° Event Details:
                    Date: November 20, 2024
                    Time: 5:00 - 9:00 PM
                    Venue: HPSB, 11th Floor Cafeteria
                    Admission: Donate what you can! All proceeds will go to our chosen charitable foundation, helping provide resources for underserved communities.
                    <br/><br/>
                    ⋆🌟° Highlights: 🎶 Open Stage: UMak’s finest bands and solo artists are invited to perform. 🎶 Audience Participation: Sing along, cheer on your friends, and spread the love! 🎶 Special Raffle: With every donation, get a chance to win cool prizes throughout the night.
                    <br/><br/>
                    Let’s jam, give, and create positive change together. Don’t miss out on the chance to make a meaningful impact while enjoying an unforgettable musical experience. See you there, Jammers! 🎸💖
                    </p>
                </div>
                <div className="closeButton">
                <button>Close</button>
                </div>
            </div>
        </div>
        </>
    )
}

export default ViewNotification;
'use client';
import '../css/userApproval.css';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function userApproval () {
    const { data: session } = useSession();
    const [selected, setSelected] = useState("pending");

    return (
        <div className="container">
            <div className="eventTitle">Organizer Approval</div>
            <div className="eventDescription">Verify and approve new event organizers for platform access.</div>
            <div className="pendingContainer">
                <div className="pendingApproval">Pending Approval</div>
                <div className="eventsBtn">
                    <div className="toggle-container">
                        <button
                            className={`toggle-button ${selected === "pending" ? "active" : ""}`}
                            onClick={() => setSelected("pending")}
                        >
                            Pending
                        </button>
                        <button
                            className={`toggle-button ${selected === "approved" ? "active" : ""}`}
                            onClick={() => setSelected("approved")}
                        >
                            Approved
                        </button>
                    </div>
                </div>
            </div>

            <div className="pending">
            {selected === "pending" && (
                <>
                <div className="pendingHold">
                <div className="pendingBox">
                    <div className="pendingImage"><img src="/heronsNight.jpg" alt="" /></div>
                    <div className="pendingDetails">
                        <h1>UMak Jammer’s</h1>
                        <p>Date registered: Nov 1, 2024</p>
                        <div className="pendingButton"><input type="button" value="Approve" /></div>
                    </div>
                </div>
                <div className="pendingBox">
                <div className="pendingImage"><img src="/heronsNight.jpg" alt="" /></div>
                <div className="pendingDetails">
                    <h1>UMak Jammer’s</h1>
                    <p>Date registered: Nov 1, 2024</p>
                    <div className="pendingButton"><input type="button" value="Approve" /></div>
                </div>
                </div>
            </div>
                </>
            )}
            </div>

            <div className="pending">
            {selected === "approved" && (
                <div className="pendingBox">
                    <div className="pendingImage"><img src="/heronsNight.jpg" alt="" /></div>
                    <div className="pendingDetails">
                        <h1>Approved Test</h1>
                        <p>Date approved: Nov 2, 2024</p>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}


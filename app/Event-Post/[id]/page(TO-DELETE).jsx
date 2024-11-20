"use client";
import "../css/eventApproval.css";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function EventApproval() {
  const { data: session } = useSession();
  const [selected, setSelected] = useState("pending");

  return (
    <div className="event-maincontainer flex flex-col justify-center items-center">
      {/* Header */}
      <div className="upper-maincontainer flex flex-col w-full">
        <div className="text-btn-container flex flex-row">
          <div className="header-text-container">
            <h2>Event Approval</h2>
            <p> Review and approve upcoming events submitted by users.</p>
          </div>
          <div className="toggle-container">
            <button
              className={`toggle-button ${
                selected === "pending" ? "active" : ""
              }`}
              onClick={() => setSelected("pending")}
            >
              Pending
            </button>
            <button
              className={`toggle-button ${
                selected === "approved" ? "active" : ""
              }`}
              onClick={() => setSelected("approved")}
            >
              Approved
            </button>
          </div>
        </div>
        <div className="line-container">
          <hr />
        </div>
      </div>

      {/* Content */}
      <div className="box-maincontainer"></div>
    </div>

    // <div className="container">
    //     <div className="eventTitle">Event Approval</div>
    //     <div className="eventDescription">Review and approve upcoming events submitted by users.</div>
    //     <div className="pendingContainer">
    //         <div className="pendingApproval">Pending Approval</div>
    //         <div className="eventsBtn">
    //             <div className="toggle-container">
    //                 <button
    //                     className={`toggle-button ${selected === "pending" ? "active" : ""}`}
    //                     onClick={() => setSelected("pending")}
    //                 >
    //                     Pending
    //                 </button>
    //                 <button
    //                     className={`toggle-button ${selected === "approved" ? "active" : ""}`}
    //                     onClick={() => setSelected("approved")}
    //                 >
    //                     Approved
    //                 </button>
    //             </div>
    //         </div>
    //     </div>

    //     <div className="pending">
    //     {selected === "pending" && (
    //         <>
    //         <div className="pendingHold">
    //         <div className="pendingBox">
    //             <div className="pendingImage"><img src="/heronsNight.jpg" alt="" /></div>
    //             <div className="pendingDetails">
    //                 <h1>UMak Jammer’s Concert for a cause</h1>
    //                 <p>UMak Oval</p>
    //                 <p>November 5, 2024 - 3:00 PM</p>
    //                 <div className="pendingButton"><input type="button" value="Approve" /></div>
    //             </div>
    //         </div>
    //         <div className="pendingBox">
    //             <div className="pendingImage"><img src="/heronsNight.jpg" alt="" /></div>
    //             <div className="pendingDetails">
    //                 <h1>UMak Jammer’s Concert for a cause</h1>
    //                 <p>UMak Oval</p>
    //                 <p>November 5, 2024 - 3:00 PM</p>
    //                 <div className="pendingButton"><input type="button" value="Approve" /></div>
    //             </div>
    //         </div>
    //         </div>
    //         </>
    //     )}
    //     </div>

    //     <div className="pending">
    //     {selected === "approved" && (
    //         <div className="pendingBox">
    //             <div className="pendingImage"><img src="/heronsNight.jpg" alt="" /></div>
    //             <div className="pendingDetails">
    //                 <h1>Approved Test</h1>
    //                 <p>UMak Oval</p>
    //                 <p>November 5, 2024 - 3:00 PM</p>
    //             </div>
    //         </div>
    //     )}
    //     </div>
    // </div>
  );
}

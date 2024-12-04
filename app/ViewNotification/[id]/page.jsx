"use client";
import "../../css/viewNotification.css";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

function ViewNotification() {
  const { id } = useParams();
  const [notification, setNotification] = useState([]);
  const [organizer, setOrganizer] = useState([]);

  const fetch = async () => {
    const res = await axios.get(`http://localhost:5000/api/event/events${id}`);
    setNotification(res.data);

    if (res.data?.organizerId) {
      const organizer = await axios.get(
        `http://localhost:5000/api/organizer/${res.data.organizerId}/get-organizer`
      );
      setOrganizer(organizer.data);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <>
      <div className="container">
        <div className="notifContainer">
          <div className="notificationHeader">
            <img
              src={`http://localhost:5000/api/event/uploads/${notification?.eventImage}`}
              alt=""
            />
          </div>
          <div className="notificationSub">
            <h6>{notification?.title}</h6>
            <p>{notification?.location}</p>
            <p>
              {new Date(notification?.dateStart).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
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
              <h6>{organizer.username}</h6>
              <p>
                {new Date(notification?.dateStart).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <hr />
          <div className="notifImage flex justify-center">
            <div className="w-[90%]">
            <img
              src={`http://localhost:5000/api/event/uploads/${notification?.eventImage}`}
              alt=""
            />
            </div>
          </div>
          <div className="notifText">
            <p>{notification?.description}</p>
          </div>
          <div className="closeButton">
            <Link href="/UserNotifications">Close</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewNotification;

"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell as faBellRegular } from "@fortawesome/free-regular-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function NotificationDropdown() {
  const{data: session} = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenNotifications = () => {
    if (session) return setIsOpen(true);
    else return router.push("/Login");
  };
  const handleCloseNotifications = () => setIsOpen(false);

  const [notifications, setNotifications] = useState([]);

  function formatTimestampToRelativeTime(timestamp) {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/event/notification"
        );

        const data = res.data;
        let filteredNotifications;

        if (session?.user?.role === "Organizer") {
          filteredNotifications = data.filter((data) => data.status === "Approved" || data.status === "Pre-Approved" || data.status === "Rejected");
        } else {
          filteredNotifications = data.filter((data) => data.status === "Approved");
        }

        filteredNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setNotifications(filteredNotifications);
      } catch (error) {
        console.log(error);
      }
    };
    fetchNotifications();
  }, [session]);

  const convertDraftToText = (rawContent) => {
    // Ensure rawContent is parsed if it's a string
    const content = typeof rawContent === 'string' 
      ? JSON.parse(rawContent) 
      : rawContent;
  
    if (!content || !content.blocks) return null;
  
    return content.blocks.map((block, index) => {
      // Apply inline styles to the text
      const styledText = block.inlineStyleRanges.reduce((acc, style) => {
        const start = style.offset;
        const end = start + style.length;
        const styledPart = acc.slice(start, end);
        
        switch (style.style) {
          case 'BOLD':
            return (
              acc.slice(0, start) + 
              `<strong>${styledPart}</strong>` + 
              acc.slice(end)
            );
          case 'ITALIC':
            return (
              acc.slice(0, start) + 
              `<em>${styledPart}</em>` + 
              acc.slice(end)
            );
          default:
            return acc;
        }
      }, block.text);
  
      // Handle different block types
      switch (block.type) {
        case 'unstyled':
          return styledText ? <p key={index} dangerouslySetInnerHTML={{__html: styledText}} /> : null;
        case 'unordered-list-item':
          return <li key={index} dangerouslySetInnerHTML={{__html: styledText}} />;
        case 'ordered-list-item':
          return <li key={index} dangerouslySetInnerHTML={{__html: styledText}} />;
        case 'header-one':
          return <h1 key={index} dangerouslySetInnerHTML={{__html: styledText}} />;
        case 'header-two':
          return <h2 key={index} dangerouslySetInnerHTML={{__html: styledText}} />;
        default:
          return styledText ? <p key={index} dangerouslySetInnerHTML={{__html: styledText}} /> : null;
      }
    }).filter(Boolean); // Remove any null elements
  };

  return (
    <>
      <div
        className="notification-icon-container group relative cursor-pointer"
        onClick={handleOpenNotifications}
      >
        <FontAwesomeIcon
          icon={faBellRegular}
          className="text-xl text-gray-400 group-hover:text-white transition-colors duration-300"
        />
        {notifications.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            {notifications.length}
          </span>
        )}
        <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-[#2C1E3A] text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Notification
        </span>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center"
          onClick={handleCloseNotifications}
        >
          <div
            className="bg-[#0E0E0E] w-[90%] max-w-2xl rounded-2xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-white/30 pb-4 mb-4">
              <h2 className="text-white text-xl font-semibold">
                Notifications
              </h2>
              <button
                onClick={handleCloseNotifications}
                className="text-white hover:text-gray-300"
              >
                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
              </button>
            </div>

            <div className="max-h-[45vh] overflow-y-auto space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="bg-[#1b1b1b] p-4 rounded-lg hover:bg-[#242324] transition-colors duration-300 cursor-pointer"
                >
                  <div className="flex flex-col justify-center items-start">
                    <div className="flex">
                      {session?.user?.role === "Organizer" ? (
                        <>
                        <div className="object-cover">
                          <img
                            className="w-[7vw] h-[10vh] rounded-xl object-cover"
                            src="/fwvsdv.jpg"
                            alt="Admin Image"
                          />
                        </div>
                        <div className="w-[70%] mx-5">
                          <h3 className="text-white font-semibold">
                            Admin
                          </h3>
                          <span className="text-gray-500 text-xs">
                            {formatTimestampToRelativeTime(
                              notification.createdAt
                            )}
                          </span>
                          <p className="line-clamp-3 text-gray-300 text-sm">
                            {notification.message} Entitled: {notification.eventTitle}
                          </p>
                        </div>
                        </>
                      ) : (
                        <>
                        <div className="object-cover">
                          <img
                            className="w-[7vw] h-[10vh] rounded-xl object-cover"
                            src={`http://localhost:5000/api/event/uploads/${notification.eventImage}`}
                            alt="Event Image"
                          />
                        </div>
                        <div className="w-[70%] mx-5">
                          <h3 className="text-white font-semibold">
                            {notification.userName}
                            &nbsp;created a new event!
                          </h3>
                          <span className="text-gray-500 text-xs">
                            {formatTimestampToRelativeTime(
                              notification.createdAt
                            )}
                          </span>
                          <p className="line-clamp-3 text-gray-300 text-sm">
                            {convertDraftToText(notification.eventDesc)}
                          </p>
                        </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {notifications.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No new notifications
              </div>
            )}
          </div>

          {/* STYLES */}
          <style jsx global>
            {`
              .line-clamp-3 {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
              }
            `}
          </style>
        </div>
      )}
    </>
  );
}

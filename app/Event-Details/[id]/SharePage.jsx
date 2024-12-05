"use client";
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  Send,
  ImageUp,
  Upload,
  Facebook,
  Instagram,
  Mail,
  Link,
} from "lucide-react";

function SharePage() {
  const { data: session } = useSession();
  const { id } = useParams();
  const textareaRef = useRef(null);
  const [message, setMessage] = useState("");
  const [notificationImage, setNotificationImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Auto-adjust textarea height
  useEffect(() => {
    const textarea = textareaRef.current;

    const adjustHeight = () => {
      textarea.style.height = "auto"; // Reset the height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on content
    };

    if (textarea) {
      adjustHeight(); // Adjust height on component mount
      textarea.addEventListener("input", adjustHeight);
      return () => textarea.removeEventListener("input", adjustHeight); // Cleanup
    }
  }, []);

  // Drag and Drop Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith("image/")) {
      setNotificationImage(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files[0] && files[0].type.startsWith("image/")) {
      setNotificationImage(files[0]);
    }
  };

  // Send Notification Handler
  const handleSendNotification = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("UserId", session?.user?.id);
    formData.append("EventId", id);
    formData.append("Type", "All");
    formData.append("Message", message);
    formData.append("NotificationImage", notificationImage);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/organizer/notification`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status === 200) {
        alert("Notification sent successfully!");
        setMessage("");
        setNotificationImage(null);
      }
    } catch (error) {
      console.error(error);
      alert("Error sending notification");
    }
  };

  // Social Media Share Handlers (placeholder functions)
  const handleFacebookShare = () => {
    console.log("Share on Facebook");
  };

  const handleInstagramShare = () => {
    console.log("Share on Instagram");
  };

  const handleTwitterShare = () => {
    console.log("Share on Twitter");
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div>
          <div className="text-[1.3rem] font-semibold">Send Notifications</div>
          <div className="organizerDescription">
            Send important updates to all event participants.
          </div>
        </div>

        {/* Conatiner: Input Image and Textarea */}
        <div className="flex flex-col gap-4">
          {/* Input Image with Drag and Drop */}
          <div className="bg-[#5E5E5E]/80 p-4 rounded-[10px] flex flex-col items-center">
            <div
              className={`dropzone ${isDragging ? "dragging" : ""}`}
              onClick={() =>
                document.getElementById("notification-file-input").click()
              }
              onDragEnter={(e) => {
                handleDrag(e);
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                handleDrag(e);
                setIsDragging(false);
              }}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="notification-file-input"
                onChange={handleFileSelect}
                accept="image/*"
                hidden
              />
              <div className="dropzone-content">
                {notificationImage ? (
                  <>
                    <div className="space-y-2">
                      <p className="selected-file">{notificationImage.name}</p>
                      <div className="w-full flex justify-center">
                        <div className="relative w-full max-w-xs aspect-video">
                          <img
                            src={URL.createObjectURL(notificationImage)}
                            alt="Selected preview"
                            className="absolute inset-0 w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 opacity-70">
                    <Upload size={50} color="#ffffff" strokeWidth={2.5} />
                    <p className="text-[0.8rem]">
                      Upload from files or Drag and Drop
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Input Text */}
          <div className="postContainer">
            <form onSubmit={handleSendNotification}>
              <textarea
                className="overflow-y-auto max-h-[30vh]"
                ref={textareaRef}
                value={message}
                placeholder="Say something meaningful..."
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  overflowY: "auto",
                }}
              />
              <div className="postButtons">
                <button type="submit">
                  <Send size={16} color="#000000d2" />
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div>
          <div className="text-[1.3rem] font-semibold">Share Event</div>
          <div className="organizerDescription">
            Spread the word about your event on social media platforms.
          </div>
        </div>

        <div className="sharebutton">
          <button className="bg-white">
            <Facebook size={22} color="#000000" strokeWidth={1.5} />
          </button>
          <button className="bg-white">
            <Instagram size={22} color="#000000" strokeWidth={1.5} />
          </button>
          <button className="bg-white">
            <Mail size={22} color="#000000" strokeWidth={1.5} />
          </button>
          <button className="bg-white">
            <Link size={22} color="#000000" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SharePage;

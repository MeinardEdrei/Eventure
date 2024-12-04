"use client";

import axios from 'axios';
import '../../css/eventJoin.css'
import Image from 'next/image'
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

function EventPost() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [ post, setPost ] = useState({});
  const [ isLoading, setIsLoading ] = useState(true);
  const [message, setMessage] = useState(""); // Manage message feedback
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [formData, setFormData] = useState({
    name: session?.user?.username,
    email: session?.user?.email,
    schoolId: session?.user?.student_number,
    section: session?.user?.section,
    user_id: '',
    eventId: '',
    eventTitle: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/event/events${id}`
        );
        setPost(res.data);
        console.log(formData)
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (session && !isLoading) {
      setFormData(prev => ({
        ...prev,
        user_id: session.user.id, 
        eventId: parseInt(id), 
        eventTitle: post.title || ''
      }));
    }
  }, [session, id, post]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (session?.user?.role === 'Organizer' || session?.user?.role === 'Admin') {
      setMessage("You are not allowed to join this event because you're an " + session?.user?.role);
      setShowModal(true);
      return;
    }

    try {
        const formPayload = new FormData();
        formPayload.append('Name', formData.name);
        formPayload.append('Email', formData.email);
        formPayload.append('School_Id', formData.schoolId);
        formPayload.append('Section', formData.section);
        formPayload.append('User_Id', formData.user_id);
        formPayload.append('Event_Id', formData.eventId)
        formPayload.append('Event_Title', formData.eventTitle || post.title || '')

        const res = await axios.post('http://localhost:5000/api/registration/join', formPayload);

        if (res.status === 200) {
            if (res.data.status === 'Pending') {
              setMessage('Event is full. You have been added to the waitlist.');
              setShowModal(true);
              return;
            }

            alert('Joined Event Successfully!');
        }else{
          alert(res.data.message);
        }
    } catch (err) {
        console.error('Error:', err.response?.data?.message || err.message);
        setMessage(err.response?.data?.message || 'An error occurred while joining the event');
        setShowModal(true);
    }
  }

  return (
    <>
      <div className="container">
        <div className="eventContainer">
          <div className="leftContainer">
            <div className="eventImage">
              <img
                src={`http://localhost:5000/api/event/uploads/${post.eventImage}`}
                alt={post.title}
              />
            </div>
            <div className="hostContainer">
              <h3>Hosted by</h3>
              <div className="hosts">
                <img src="/user.jpg" alt="" />
                <p>UMak Jammers</p>
              </div>
              <div className="hosts">
                <img src="/user.jpg" alt="" />
                <p>UMak Jammers</p>
              </div>
            </div>
          </div>

          <div className="rightContainer">
            <div className="event">
              <div className="eventHeader">{post.title}</div>
              <div className="eventDate">
                {/* <img src="/Date.png" width={25} alt="Date" /> */}
                <p>
                    {new Date(post.dateStart).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                    })} - {new Date(`${post.dateStart.split('T')[0]}T${post.timeStart}`).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    })}
                </p>
              </div>
              <div className="eventPlace">
                {/* <img src="/Location.png" width={25} alt="Location" /> */}
                <p>{post.location}</p>
              </div>
              <button
                onClick={handleSubmit}
                className="eventRegister"
              >
                Join Event
              </button>
              
              <div className="aboutEvent">
                <h1>About the Event</h1>
                <p>{post.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modalMessage">
          <div className="modalContentMessage">
            <p>{message}</p>
            <button onClick={() => setShowModal(false)} className="closeButton">Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default EventPost;

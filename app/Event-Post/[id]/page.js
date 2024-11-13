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
  const [ post, setPost ] = useState([]);
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    schoolId: '',
    section: '',
    userId: '',
    eventId: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/auth/events${id}`
        );
        setPost(res.data);
        console.log(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (session) {
      setFormData(prev => ({
        ...prev,
        userId: session.user.id, 
        eventId: parseInt(id) 
      }));
    }
  }, [session, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const formPayload = new FormData();
        formPayload.append('Name', formData.name);
        formPayload.append('Email', formData.email);
        formPayload.append('School_Id', formData.schoolId);
        formPayload.append('Section', formData.section);
        formPayload.append('User_Id', formData.userId);
        formPayload.append('Event_Id', formData.eventId)

        const res = await axios.post('http://localhost:5000/api/auth/join', formPayload);

        if (res.status === 200) {
            alert('Joined Event!');
            setIsModalOpen(false);
            setFormData({
              name: '',
              email: '',
              schoolId: '',
              section: ''
            });
        }
    } catch (err) {
        console.error('Error:', err.response?.data?.message || err.message);
        alert(err.response?.data?.message || 'An error occurred while joining the event');
    }
}

  const handleJoinEvent = async (e) => {
    e.preventDefault();

    if (session?.user?.role === 'Student') {
        setIsModalOpen(true);
    }else if (session?.user?.role === 'Organizer') {
        // THIS USER CANT JOIN EVENT
    }else if (session?.user?.role === 'Admin') {
        // THIS USER CANT JOIN EVENT
    }else{
        router.push(`/Login`);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <div className="container">
        <div className="user">
          <div className="userImage">
            <Image src="/profile.png" width={35} height={35} alt="logo" />
          </div>
          <div className="userDetails">
            <div className="userName">
              <p>UMak Jammers</p>
            </div>
            <div className="userPublished">
              <p>{post.created_At}</p>
            </div>
          </div>
        </div>

        <div className="eventContainer">
          <div className="eventImage">
            <img
              src={`http://localhost:5000/api/auth/uploads/${post.event_Image}`}
              alt={post.title}
            />
          </div>
          <div className="event">
            <div className="eventHeader">{post.title}</div>
            <div className="eventDate">
              <img src="/Date.png" width={25} alt="Date" />
              <p>
                {new Date(post.date).toLocaleDateString()} - {post.start}
              </p>
            </div>
            <div className="eventPlace">
              <img src="/Location.png" width={25} alt="Location" />
              <p>{post.location}</p>
            </div>
            <button
              onClick={handleJoinEvent}
              className="eventRegister"
            >
              Join Event
            </button>
          </div>
        </div>

        <hr />

        <div className="aboutEvent">
          <h1>About the Event</h1>
          <p>{post.description}</p>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Event Registration</h2>
              <button
                className="close-button"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="formHeader">
                  <div className="form">
                    <div className="formImage">
                      <img
                        src={`http://localhost:5000/api/auth/uploads/${post.event_Image}`}
                        alt="Event Image"
                      />
                    </div>
                    <div className="formDetails">
                      <h1>{post.title}</h1>
                      <p>{post.location}</p>
                      <p>{new Date(post.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="formContainer">
                  <h1>Register</h1>
                  <div className="form-group">
                    <p>Name</p>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Juan Dela Cruz"
                    />
                  </div>
                  <div className="form-group">
                    <p>Email</p>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="jdelacruz.k12135002@umak.edu.ph"
                    />
                  </div>
                </div>
                <div className="doubleColumn">
                  <div className="col">
                    <p>School ID</p>
                    <input
                      type="text"
                      name="schoolId"
                      value={formData.schoolId}
                      onChange={handleInputChange}
                      placeholder="K12135002"
                    />
                  </div>
                  <div className="col">
                    <p>Program and Section</p>
                    <input
                      type="text"
                      name="section"
                      value={formData.section}
                      onChange={handleInputChange}
                      placeholder="II - BCSAD"
                    />
                  </div>
                </div>
                <input type="submit" className="submitButton" />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EventPost;

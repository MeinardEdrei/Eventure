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
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    schoolId: '',
    section: '',
    userId: '',
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
        console.log(res.data);
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
        userId: session.user.id, 
        eventId: parseInt(id), 
        eventTitle: post.title || ''
      }));
    }
  }, [session, id, post]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  function Clear() {
    // Reset form and close modal
    setIsModalOpen(false);
    setFormData({
        name: '',
        email: '',
        schoolId: '',
        section: '',
        eventId: '',
        eventTitle: ''
    });
  }

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
        formPayload.append('Event_Title', formData.eventTitle || post.title || '')

        const res = await axios.post('http://localhost:5000/api/registration/join', formPayload);

        if (res.status === 200) {
            if (res.data.status === 'Pending') {
              alert('Event is full. You have been added to the waitlist.');
              Clear();
              return;
            }
            
            // Google Sheets
            const registrationForm = await axios.get('http://localhost:5000/registration/auth/form');
          
            if (registrationForm.data.length > 0) { // Only process if there is Approved Attendees
              const lastEntry = registrationForm.data[registrationForm.data.length - 1];
              
              const sheetsData = [{
                name: lastEntry.name || 'N/A',
                email: lastEntry.email || 'N/A',
                schoolId: lastEntry.school_Id || 'N/A',
                section: lastEntry.section || 'N/A',
                eventId: (lastEntry.event_Id || lastEntry.event_id || '').toString(),
                eventTitle: lastEntry.event_Title || lastEntry.event_title || 'N/A'
              }];

              try {
                const response = await axios.post(
                  'http://localhost:5000/api/registration/sheets',
                  sheetsData,  
                  {
                      headers: {
                          'Content-Type': 'application/json'
                      },
                      timeout: 10000
                  }
                );
              } catch (error) {
                  console.error('Google Sheets Error:', error);
                  alert('Failed to update Google Sheets: ' + error.message);
              }

              alert('Joined Event Successfully!');
              Clear();
            }
        }else{
          alert('An error occured.');
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
              src={`http://localhost:5000/api/event/uploads/${post.event_Image}`}
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
                        src={`http://localhost:5000/api/event/uploads/${post.event_Image}`}
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

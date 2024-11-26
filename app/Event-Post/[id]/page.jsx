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
      alert("You are not allowed to join this event because you're an " + session?.user?.role);
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
              alert('Event is full. You have been added to the waitlist.');
              return;
            }
            
            const registrationForm = await axios.get('http://localhost:5000/api/registration/form');
          
            if (registrationForm.data.length > 0) { // Only process if there is Approved Attendees
              const lastEntry = registrationForm.data[registrationForm.data.length - 1];
              
              const sheetsData = [{
                name: lastEntry.name || 'N/A',
                email: lastEntry.email || 'N/A',
                schoolId: lastEntry.school_Id || 'N/A',
                section: lastEntry.section || 'N/A',
                eventId: (lastEntry.event_Id || lastEntry.event_id || '').toString(),
                eventTitle: lastEntry.event_Title || lastEntry.event_title || 'N/A',
                registeredTime: lastEntry.registered_time || lastEntry.registered_Time || 'N/A',
              }];

              // try {
              //   const response = await axios.post(
              //     'http://localhost:5000/api/registration/sheets',
              //     sheetsData,  
              //     {
              //         headers: {
              //             'Content-Type': 'application/json'
              //         },
              //         timeout: 10000
              //     }
              //   );
              // } catch (error) {
              //     console.error('Google Sheets Error:', error);
              //     alert('Failed to update Google Sheets: ' + error.message);
              // }

              alert('Joined Event Successfully!');
              
            }
        }else{
          alert('An error occured.');
        }
    } catch (err) {
        console.error('Error:', err.response?.data?.message || err.message);
        alert(err.response?.data?.message || 'An error occurred while joining the event');
    }
  }

  return (
    <>
      <div className="container">
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
              {/* <img src="/Date.png" width={25} alt="Date" /> */}
              <p>
                  {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                  })} - {new Date(post.date).toLocaleTimeString('en-US', {
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
    </>
  );
}

export default EventPost;

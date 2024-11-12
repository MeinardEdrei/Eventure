'use client';

import axios from 'axios';
import '../../css/eventJoin.css'
import Image from 'next/image'
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

function eventPost () {
    const router = useRouter();
    const { data: session } = useSession();
    const { id } = useParams();
    const [ post, setPost ] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const res = await axios.get(`http://localhost:5000/api/auth/events${id}`);
            setPost(res.data);
            console.log(res.data);
          } catch (error) {
            console.error(error);
          }
        }
        
        fetchData();
        
      }, [])

    const handleJoinEvent = async (e) => {
        e.preventDefault();

        if (session?.user?.role === 'Student') {
            router.push(`/Event-Form/${post.id}`);
        }else if (session?.user?.role === 'Organizer') {
            // THIS USER CANT JOIN EVENT
        }else if (session?.user?.role === 'Admin') {
            // THIS USER CANT JOIN EVENT
        }else{
            router.push(`/Login`);
        }
    }

    return (
        <>
        <div className="container">
            <div className="user">
                <div className="userImage"><Image src='/profile.png' width={35} height={35} alt='logo' /></div>
                <div className="userDetails">
                    <div className="userName"><p>UMak Jammers</p></div>
                    <div className="userPublished"><p>{post.created_At}</p></div>
                </div>
            </div>
            
            <div className="eventContainer">
                <div className="eventImage"><img src={`http://localhost:5000/api/auth/uploads/${post.event_Image}`} alt={post.title} /></div>
                <div className="event">
                    <div className="eventHeader">{post.title}</div>
                    <div className="eventDate">
                        <img src="/Date.png" width={25} alt="Date" />
                        <p>{new Date(post.date).toLocaleDateString()} - {post.start}</p>
                    </div>
                    <div className="eventPlace">
                        <img src="/Location.png" width={25}alt="Location" />
                        <p>{post.location}</p>
                    </div>
                    <div className="eventRegister" onClick={handleJoinEvent}>
                        <button>Join Event</button>
                    </div>
                </div>
            </div>

            <hr />

            <div className="aboutEvent">
                <h1>About the Event</h1>
                <p>{post.description}</p>
            </div>
        </div>
        </>
    );
}

export default eventPost
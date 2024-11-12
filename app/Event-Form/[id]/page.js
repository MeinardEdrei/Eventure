'use client';

import axios from 'axios';
import '../../css/eventForm.css'
import Image from 'next/image'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

function eventForm () {
    const { id } = useParams();
    const [ event, setEvent ] = useState([]);
    const [ name, setName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ schoolId, setSchoolId ] = useState('');
    const [ section, setSection ] = useState('');
    const [ userId, setUserId ] = useState('');
    const [ eventId, setEventId ] = useState('');
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios(`http://localhost:5000/api/auth/events${id}`);
                setEvent(res.data);
            } catch (err) {
                console.error(err);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        setUserId(session?.user?.id);
        setEventId(parseInt(id));
    }, [session])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('Name', name);
            formData.append('Email', email);
            formData.append('School_Id', schoolId);
            formData.append('Section', section);
            formData.append('User_Id', userId);
            formData.append('Event_Id', eventId);

            const res = await axios.post('http://localhost:5000/api/auth/join', formData);

            if (res.status === 200) {
                alert('Joined Event!');
            }
        } catch (err) {
            console.error('Error:', err.response?.data?.message || err.message);
            alert(err.response?.data?.message || 'An error occurred while joining the event');
        }
    }

    return (
        <>
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="formHeader">
                    <div className="form">
                        <div className="formImage"><img src={`http://localhost:5000/api/auth/uploads/${event.event_Image}`} alt="Event Image" /></div>
                        <div className="formDetails">
                            <h1>{event.title}</h1>
                            <p>{event.location}</p>
                            <p>{new Date(event.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="formContainer">
                    <h1>Register</h1>
                    <p>Name</p>
                    <input type="text" name="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder='Juan Dela Cruiz'/>
                    <p>Email</p>
                    <input type="text" name="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='jdelacruz.k12135002@umak.edu.ph'/>
                    
                </div>
                <div className="doubleColumn">
                    <div className="col">
                        <p>School ID</p>
                        <input type="text" name="School_Id" value={schoolId} onChange={(e) => setSchoolId(e.target.value)} placeholder='K12135002'/>
                    </div>
                    <div className="col">
                        <p>Program and Section</p>
                        <input type="text" name="Section" value={section} onChange={(e) => setSection(e.target.value)} placeholder='II - BCSAD'/>
                    </div>
                </div>
                <button type="submit" className='submitButton'>Submit</button>
            </form>
        </div>
        </>
    );
}

export default eventForm    
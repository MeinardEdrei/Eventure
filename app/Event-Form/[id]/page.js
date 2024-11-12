'use client';

import axios from 'axios';
import '../../css/eventForm.css'
import Image from 'next/image'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

function eventForm () {
    const { id } = useParams();
    const [ event, setEvent ] = useState([]);
    const [ name, setName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ schoolId, setSchoolId ] = useState('');
    const [ section, setSection ] = useState('');

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:5000/api/auth/form', {
                Name: name,
                Email: email,
                School_Id: schoolId,
                Section: section
            });
        } catch (err) {
            console.error(err.message);
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
                    <input type="text" name="Name" id="" placeholder='Juan Dela Cruiz'/>
                    <p>Email</p>
                    <input type="text" name="Email" id="" placeholder='jdelacruz.k12135002@umak.edu.ph'/>
                    
                </div>
                <div className="doubleColumn">
                    <div className="col">
                        <p>School ID</p>
                        <input type="text" name="School_Id" id="" placeholder='K12135002'/>
                    </div>
                    <div className="col">
                        <p>Program and Section</p>
                        <input type="text" name="Section" id="" placeholder='II - BCSAD'/>
                    </div>
                </div>
                <input type="submit" value="Submit" className='submitButton'/>
            </form>
        </div>
        </>
    );
}

export default eventForm    
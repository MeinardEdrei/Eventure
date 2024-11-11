import '../css/eventForm.css'
import Image from 'next/image'
import Link from 'next/link';

function eventForm () {
    return (
        <>
        <div className="container">
            <div className="formHeader">
                <div className="form">
                    <div className="formImage"><img src="/heronsNight.jpg" alt="" /></div>
                    <div className="formDetails">
                        <h1>Heron's Night</h1>
                        <p>UMak Oval</p>
                        <p>November 30, 2024</p>
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
                    <input type="text" name="Email" id="" placeholder='K12135002'/>
                </div>
                <div className="col">
                    <p>Program and Section</p>
                    <input type="text" name="Email" id="" placeholder='II - BCSAD'/>
                </div>
            </div>
            <input type="submit" value="Submit" className='submitButton'/>
        </div>
        </>
    );
}

export default eventForm    
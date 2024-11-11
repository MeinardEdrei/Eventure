import '../css/eventJoin.css'
import Image from 'next/image'
import Link from 'next/link';


function eventPost () {
    return (
        <>
        <div className="container">
            <div className="user">
                <div className="userImage"><Image src='/profile.png' width={35} height={35} alt='logo' /></div>
                <div className="userDetails">
                    <div className="userName"><p>UMak Jammers</p></div>
                    <div className="userPublished"><p>Nov 15, 2024</p></div>
                </div>
            </div>
            
            <div className="eventContainer">
                <div className="eventImage"><img src="/heronsNight.jpg" alt="Heron's Night Event" /></div>
                <div className="event">
                    <div className="eventHeader">Heron's Night</div>
                    <div className="eventDate">
                        <img src="/Date.png" width={25} alt="Date" />
                        <p>November 30, 2024 - 3:00 PM</p>
                    </div>
                    <div className="eventPlace">
                        <img src="/Location.png" width={25}alt="Location" />
                        <p>UMak Oval</p>
                    </div>
                    <div className="eventRegister">
                    <Link href='\EventForm'><button>Join Event</button></Link>
                    </div>
                </div>
            </div>

            <hr />

            <div className="aboutEvent">
                <h1>About the Event</h1>
                <p>𝐀𝐭𝐭𝐞𝐧𝐭𝐢𝐨𝐧 𝐔𝐌𝐚𝐤 𝐉𝐚𝐦𝐦𝐞𝐫𝐬! 🎶 𝐉𝐨𝐢𝐧 𝐮𝐬 𝐟𝐨𝐫 𝐚 𝐧𝐢𝐠𝐡𝐭 𝐨𝐟 𝐦𝐮𝐬𝐢𝐜 𝐚𝐧𝐝 𝐠𝐢𝐯𝐢𝐧𝐠! 🎸🎤
                Get ready to make a difference with every beat! We're hosting "Jam for a Cause," where music meets charity to help those in need.
                <br/><br/>
                ⋆🌟° Event Details:
                Date: November 20, 2024
                Time: 5:00 - 9:00 PM
                Venue: HPSB, 11th Floor Cafeteria
                Admission: Donate what you can! All proceeds will go to our chosen charitable foundation, helping provide resources for underserved communities.
                <br/><br/>
                ⋆🌟° Highlights: 🎶 Open Stage: UMak’s finest bands and solo artists are invited to perform. 🎶 Audience Participation: Sing along, cheer on your friends, and spread the love! 🎶 Special Raffle: With every donation, get a chance to win cool prizes throughout the night.
                <br/><br/>
                Let’s jam, give, and create positive change together. Don’t miss out on the chance to make a meaningful impact while enjoying an unforgettable musical experience. See you there, Jammers! 🎸💖</p>
            </div>
        </div>
        </>
    );
}

export default eventPost
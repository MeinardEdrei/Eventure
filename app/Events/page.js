import '../css/eventDashboard.css'
import Image from 'next/image'
import Link from 'next/link';


function eventsDashboard () {
    return (
        <>
        <div className="container">
            <div className="eventTitle">Events</div>
            <div className="eventDescription">
                Explore popular events near you, browse by category, or check out some of the great community calendars.
            </div>
            <div className="parentContainer">
            <Link href='\EventPost'>
                <div className="cardContainer">
                    <div className="cardImage">
                        <img src="/heronsNight.jpg" alt="Heron's Night Event" />
                    </div>
                    <div className="cardTitle">UMak Jammers' Concert for a Cause</div>
                    <div className="cardDetails">
                        <p>UMak Oval</p>
                        <p>November 5, 2024 - 3:00 PM</p>
                    </div>
                    <hr />
                    <div className="cardDescription">
                        Get ready to make a difference with every beat! We're hosting "Jam for a Cause," where music meets charity to help those in need.
                    </div>
                </div>
            </Link>
            <Link href='\EventPost'>
                <div className="cardContainer">
                    <div className="cardImage">
                        <img src="/heronsNight.jpg" alt="Heron's Night Event" />
                    </div>
                    <div className="cardTitle">UMak Jammers' Concert for a Cause</div>
                    <div className="cardDetails">
                        <p>UMak Oval</p>
                        <p>November 5, 2024 - 3:00 PM</p>
                    </div>
                    <hr />
                    <div className="cardDescription">
                        Get ready to make a difference with every beat! We're hosting "Jam for a Cause," where music meets charity to help those in need.
                    </div>
                </div>
            </Link>
            <Link href='\EventPost'>
                <div className="cardContainer">
                    <div className="cardImage">
                        <img src="/heronsNight.jpg" alt="Heron's Night Event" />
                    </div>
                    <div className="cardTitle">UMak Jammers' Concert for a Cause</div>
                    <div className="cardDetails">
                        <p>UMak Oval</p>
                        <p>November 5, 2024 - 3:00 PM</p>
                    </div>
                    <hr />
                    <div className="cardDescription">
                        Get ready to make a difference with every beat! We're hosting "Jam for a Cause," where music meets charity to help those in need.
                    </div>
                </div>
            </Link>
            <Link href='\EventPost'>
                <div className="cardContainer">
                    <div className="cardImage">
                        <img src="/heronsNight.jpg" alt="Heron's Night Event" />
                    </div>
                    <div className="cardTitle">UMak Jammers' Concert for a Cause</div>
                    <div className="cardDetails">
                        <p>UMak Oval</p>
                        <p>November 5, 2024 - 3:00 PM</p>
                    </div>
                    <hr />
                    <div className="cardDescription">
                        Get ready to make a difference with every beat! We're hosting "Jam for a Cause," where music meets charity to help those in need.
                    </div>
                </div>
            </Link>
            </div>
        </div>

        
        </>
    );
}

export default eventsDashboard
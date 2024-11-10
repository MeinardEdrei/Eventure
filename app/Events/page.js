import '../globalCSS/index.css'
import photo from '/heronsNight.jpg'

function eventsDashboard () {
    return (
        <>
                <div className="bodyContainer">
                    <div className="title">
                        <h1>Events</h1>
                        <p>Explore popular events near you, browse by category, or check out some of the great community calendars.</p>
                    </div>
                    <hr />
                    <div className="cards">
                        <div className="cardContainer">
                            <div className="cardImage">
                                <img src={photo} alt="" />
                            </div>
                            <div className="cardTitle">
                                <h1>UMak Jammer’s Concert for a cause</h1>
                            </div>
                            <div className="cardDetails">
                                <p>UMak Oval</p>
                                <p>November 5, 2024 - 3:00 PM</p>
                            </div>
                            <hr />
                            <div className="cardDescription">
                                <p>𝐀𝐭𝐭𝐞𝐧𝐭𝐢𝐨𝐧 𝐔𝐌𝐚𝐤 𝐉𝐚𝐦𝐦𝐞𝐫𝐬! 🎶 𝐉𝐨𝐢𝐧 𝐮𝐬 𝐟𝐨𝐫 𝐚 𝐧𝐢𝐠𝐡𝐭 𝐨𝐟 𝐦𝐮𝐬𝐢𝐜 𝐚𝐧𝐝 𝐠𝐢𝐯𝐢𝐧𝐠! 🎸🎤
                                Get ready to make a difference with every beat! We're hosting "Jam for a Cause," where music meets charity to help those in need.</p>
                            </div>
                        </div>
                        <div className="cardContainer">
                            <div className="cardImage">
                                <img src={photo} alt="" />
                            </div>
                            <div className="cardTitle">
                                <h1>UMak Jammer’s Concert for a cause</h1>
                            </div>
                            <div className="cardDetails">
                                <p>UMak Oval</p>
                                <p>November 5, 2024 - 3:00 PM</p>
                            </div>
                            <hr />
                            <div className="cardDescription">
                                <p>𝐀𝐭𝐭𝐞𝐧𝐭𝐢𝐨𝐧 𝐔𝐌𝐚𝐤 𝐉𝐚𝐦𝐦𝐞𝐫𝐬! 🎶 𝐉𝐨𝐢𝐧 𝐮𝐬 𝐟𝐨𝐫 𝐚 𝐧𝐢𝐠𝐡𝐭 𝐨𝐟 𝐦𝐮𝐬𝐢𝐜 𝐚𝐧𝐝 𝐠𝐢𝐯𝐢𝐧𝐠! 🎸🎤
                                Get ready to make a difference with every beat! We're hosting "Jam for a Cause," where music meets charity to help those in need.</p>
                            </div>
                        </div>
                    </div>
                </div>
        </>
    );
}

export default eventsDashboard
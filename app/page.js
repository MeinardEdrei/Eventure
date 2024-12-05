"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./css/Homepage.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const { data: session, status } = useSession();
  const [isLoaded, setIsLoaded] = useState(false); 
  const router = useRouter();
  const [event, setEvent] = useState([]);

  useEffect(() => {
    const updateEvents = async () => {
      try {
        await axios.post("http://localhost:5000/api/event/update-status");
      } catch (error) {
        if (error.status === 404) {
          alert("No events found");
        }
      }
    }
    updateEvents();
  }, []);

  useEffect(() => {
    if (status !== "loading") {
      setIsLoaded(true);
      if (session?.user?.role == "Admin") {
        router.push("/AdminDashboard");
      } else if (session?.user?.role == "Organizer") {
        router.push("/OrganizerDashboard");
      }
    }
  }, [status, session, router]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/event/events");
      setEvent(res?.data);
      console.log(res.data)
    } catch (error) {
      if (error.status === 404) {
        alert("No events found");
      }
    }
  };
  useEffect(() => {
    fetchEvents();
  }, [session])

  const popularEvents = () => {
    const currentDate = new Date();

    const topEvents = event
      .filter(
        (events) =>
        new Date(events.dateStart).getFullYear() === currentDate.getFullYear()
      ).sort((a, b) => b.attendeeCount - a.attendeeCount);
      return {
        Highlights: topEvents
      }
  }
  useEffect(() => {
    popularEvents();
  }, [event]);

  // MAIN EVENT IMAGE
  const renderMainEventImage = () => {
    const highlights = popularEvents()?.Highlights;
    
    // If no events or no highlights
    if (!highlights || highlights.length === 0) {
      return (
        <div 
          className="rounded-[70px] h-[585px] w-full flex items-center justify-center bg-black"
        >
          <p className="text-white text-2xl text-center">
            No highlights available at the moment
          </p>
        </div>
      );
    }

    // If events exist but first event has no image
    if (!highlights[0]?.eventImage) {
      return (
        <div 
          className="rounded-[70px] h-[585px] w-full flex items-center justify-center bg-black"
        >
          <p className="text-white text-2xl text-center">
            No image available for this event
          </p>
        </div>
      );
    }

    // Render event image
    return (
      <div
        className="rounded-[70px] h-[585px] w-full object-cover"
        style={{ 
          backgroundImage: `url(http://localhost:5000/api/event/uploads/${highlights[0]?.eventImage})`, 
          backgroundSize: 'auto', 
          backgroundPosition: 'center'
        }} 
        alt="Event Image" 
      />
    );
  };

  // SECOND EVENT IMAGE
  const renderSecondaryEventImage = () => {
    const highlights = popularEvents()?.Highlights;
    
    // If no events or highlights less than 2
    if (!highlights || highlights.length < 2) {
      return (
        <img 
          className="absolute z-10 top-0 right-0 w-[350px] h-[305px] object-cover
          rounded-[50px] bg-black"
          src="/fwvsdv.jpg"
          alt="No second event"
        />
      );
    }

    // If second event has no image
    if (!highlights[1]?.eventImage) {
      return (
        <img 
          className="absolute z-10 top-0 right-0 w-[350px] h-[305px] object-cover
          rounded-[50px] bg-black"
          src="/fwvsdv.jpg"
          alt="No image for second event"
        />
      );
    }

    // Render second event image
    return (
      <img 
        className="absolute z-10 top-0 right-0 w-[350px] h-[305px] object-cover
        rounded-[50px] bg-black"
        src={`http://localhost:5000/api/event/uploads/${highlights[1]?.eventImage}`}
        alt="Second Highlight"
      />
    );
  };

  if (!isLoaded || status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <>
    {(session?.user?.role == "Student" || !session) && (
    <div className="flex flex-col items-center h-auto w-[100vw] relative">
      <div className="w-[86%] mr-2 mt-[2%]">
        <div className="mb-9 sm:ml-[1%] ml-[5%]">
          <h1 className="text-2xl font-[900] pb-4
            sm:text-3xl md:text-4xl lg:text-5xl">Your next Eventure starts here. 
          </h1>
          <p className="text-white/50 font-semibold">
            Explore events that educate, entertain, and empower students like you. 🚀
          </p>
        </div>
        <section className="relative">
          {renderMainEventImage()}
          <div className="absolute inset-0 rounded-[70px] bg-gradient-to-b from-[#000000] to-transparent opacity-80"
                style={{ rotate: '180deg'}} />
          <div 
            name="gap"
            className="absolute top-0 right-0 w-[372px] h-[330px] object-cover
            rounded-[50px] bg-[#0C0C0C]"
          />
          {renderSecondaryEventImage()}
          <div
            name="top-left"
            className="absolute xl:top-[-1.9%] xl:right-[24%] lg:top-[-2%] lg:right-[36%]
              md:right-[48.4%] md:top-[-2%] max-sm:hidden"
            style={{
              width: '0',
              height: '0', 
              borderLeft: '0em solid transparent',
              borderRight: '3.29em solid transparent',
              borderTop: '5em solid #0C0C0C',
              rotate: '-6deg',
            }}
          />
          <div
            name="top-left2"
            className="absolute xl:right-[28%] lg:right-[42%] lg:top-[-.2%]
              md:right-[56%] md:top-[-2%] max-sm:hidden"
            style={{
              width: '0',
              height: '0', 
              borderLeft: '3em solid transparent',
              borderRight: '0em solid transparent',
              borderTop: '3em solid #0C0C0C',
              rotate: '-3deg',
            }}
          />
          <div
            name="bottom-right"
            className="absolute bottom-[38%] right-[-3%]
            max-sm:hidden"
            style={{
              width: '0',
              height: '0', 
              borderLeft: '3.1em solid transparent', 
              borderRight: '3.5em solid transparent', 
              borderTop: '5em solid #0C0C0C', 
              rotate: '90deg',
            }}
          />
          
          {/* ---------OVERLAY TEXTS AND BUTTONS--------- */}
          
          <div className="flex justify-center absolute bg-white/80 px-4 py-2 w-52 lg:top-[7%] left-[7%] rounded-full
            lg:w-64 lg:left-[7%] md:top-[7%] max-sm:bottom-[6%] max-sm:w-40 max-sm:left-[10%] z-10">
            <p className="text-black text-sm font-medium
            lg:text-lg max-sm:text-xs"
            >
              {popularEvents()?.Highlights[0] 
                ? new Date(popularEvents()?.Highlights[0]?.dateStart).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                : 'No Date'}
            </p>
          </div>
          <Link href='/Events' className="z-10 flex items-center text-center justify-center absolute top-[40%] lg:right-[10%] max-sm:left-[10%] bg-slate-300 w-48 rounded-full 
            lg:px-3 lg:py-1 md:right-[5%] max-sm:w-36 max-sm:top-[42%]">
            <div className="text-black text-sm font-medium mx-3
            lg:text-sm max-sm:text-xs"
            >
              See all events
            </div>
            <p className="text-black lg:text-lg text-3xl max-sm:text-lg">→</p>
          </Link>
          <div className="flex absolute px-4 py-2 w-[50%] rounded-full bottom-[14%] left-[3%] md:left-[6%] max-sm:left-[7%]
          text-lg font-bold lg:text-3xl md:text-2xl max-sm:text-sm"
          >
              {popularEvents()?.Highlights[0]?.title || 'No Event Title'}
          </div>
        </section>
      </div>
    </div>
    )}
    </>
  );
}
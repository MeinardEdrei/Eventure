"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./css/Homepage.css";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const [isLoaded, setIsLoaded] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading") {
      setIsLoaded(true);
      if (session?.user?.role == "Admin" || session?.user?.role == "Organizer") {
        router.push("/Dashboard");
      }
    }
  }, [status, session, router]);

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
            sm:text-3xl md:text-4xl lg:text-5xl">The 'Eras' Highlights
          </h1>
          <p>
            Explore popular events near you, browse by category, or check out
            some of the great community calendars.
          </p>
        </div>
        <section className="relative">
          <div
            className="rounded-[70px] h-[585px] w-full object-cover"
            style={{ 
              backgroundImage: 'url(/heronsNight.jpg)', 
              backgroundSize: 'cover', 
              backgroundPosition: 'center'}} 
            alt="Image" 
          />
          <div className="absolute inset-0 rounded-[70px] bg-gradient-to-b from-[#000000] to-transparent opacity-70"
                style={{ rotate: '180deg'}} />
          <div 
            name="gap"
            className="absolute top-0 right-0 w-[372px] h-[330px] object-cover
            rounded-[50px] bg-[#0C0C0C]"
          />
          <img 
            className="absolute z-10 top-0 right-0 w-[350px] h-[305px] object-cover
            rounded-[50px]"
            src="/kokoko.jpg"
          />
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
              November 30, 2023
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
              The long awaited concert this 2023 with UMAK Jammers
          </div>
        </section>
      </div>
    </div>
    )}
    </>
  );
}

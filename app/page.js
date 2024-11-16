"use client";
import { useSession } from "next-auth/react";
import "./css/Homepage.css";
import { useState } from "react";


export default function Home() {
  const { data: session } = useSession();
  const [selected, setSelected] = useState("upcoming");
  
  return (
    <>
      <div className="main-container">
        <div className="w-[86%] mr-2 mt-6">
          <div className="text-container">
            <h1>The 'Eras' Highlights</h1>
            <p>
              Explore popular events near you, browse by category, or check out
              some of the great community calendars.
            </p>
          </div>
          <div className="relative">
            <div
              className="rounded-[70px] h-[585px] w-full object-cover"
              style={{ 
                backgroundImage: 'url(/heronsNight.jpg)', 
                backgroundSize: 'cover', 
                backgroundPosition: 'center'}} 
              alt="Image" 
            />
            <div 
              name="gap"
              className="absolute top-0 right-0 w-[372px] h-[330px] object-cover
              rounded-[50px] bg-[#0C0C0C]"
            />
            <img 
              className="absolute top-0 right-0 w-[350px] h-[305px] object-cover
              rounded-[50px]"
              src="/kokoko.jpg"
            />
            <div
              name="top-left"
              className="absolute top-[-2%] right-[24.2%]"
              style={{
                width: '0',
                height: '0', 
                borderLeft: '0em solid transparent',
                borderRight: '3.29em solid transparent',
                borderTop: '5em solid #0C0C0C',
              }}
            />
            <div
              name="top-left2"
              className="absolute top-[-2%] right-[28%]"
              style={{
                width: '0',
                height: '0', 
                borderLeft: '3em solid transparent',
                borderRight: '0em solid transparent',
                borderTop: '3em solid #0C0C0C',
                rotate: '-5deg',
              }}
            />
            <div
              name="bottom-right"
              className="absolute bottom-[38%] right-[-3%]"
              style={{
                width: '0',
                height: '0', 
                borderLeft: '3.1em solid transparent', 
                borderRight: '3.5em solid transparent', 
                borderTop: '5em solid #0C0C0C', 
                rotate: '90deg',
              }}
            />
            <div 
              name="cover"
              className="bg-transparent absolute w-[6em] h-[6.1em] top-[0%] right-[28%]
              rounded-[50%]"
            />
            <div className="flex justify-center absolute top-[7%] left-[3%] bg-white px-4 py-2 w-64 rounded-full">
              <p className="text-black text-lg font-medium">November 30, 2023</p>
            </div>
            <div className="flex justify-center absolute bottom-[7%] left-[3%] px-4 py-2 w-[50%] rounded-full">
              <p className="text-white text-3xl font-bold">The long awaited concert this 2023 with UMAK Jammers</p>
            </div>
            <div className="flex items-center text-center justify-center absolute top-[40%] right-[10%] bg-white px-3 py-2 w-48 rounded-full">
              <p className="text-black text-base font-medium mx-3">See all events</p>
              <p className="text-black text-3xl">→</p>
            </div>
            {/* <div className="absolute bg-white bottom-[8%] right-[4%] rounded-full w-12 h-12 
            flex items-center justify-center place-self-center overflow-hidden">
              <p className="text-black text-3xl font-extrabold" style={{ transform: 'rotate(-30deg)' }}>→</p>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

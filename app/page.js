"use client";
import { useSession } from "next-auth/react";
import "./css/Homepage.css";
import { useEffect, useState } from "react";
import Link from "next/link";


export default function Home() {
  const { data: session } = useSession();
  const [selected, setSelected] = useState("upcoming");
  
  return (
    <>
      <div className="main-container">
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
            <div className="absolute inset-0 rounded-[70px] bg-gradient-to-b from-[#000000] to-transparent opacity-70" />
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
            {/* <div 
              name="cover"
              className="bg-transparent absolute w-[6em] h-[6.1em] top-[0%] right-[28%]
              rounded-[50%]"
            /> */}
            
            {/* ---------OVERLAY TEXTS AND BUTTONS--------- */}
            
            <div className="flex justify-center absolute bg-white px-4 py-2 w-52 lg:top-[7%] left-[7%] rounded-full
              lg:w-64 lg:left-[7%] md:top-[7%] max-sm:bottom-[6%] max-sm:w-40 max-sm:left-[10%]">
              <p className="text-black text-sm font-medium
              lg:text-lg max-sm:text-xs">November 30, 2023</p>
            </div>
            <div className="flex absolute px-4 py-2 w-[50%] rounded-full bottom-[14%] left-[3%] md:left-[6%] max-sm:left-[7%]">
              <p className="text-white text-lg font-bold w-[80%] rounded-xl
              lg:text-3xl lg:bottom-[7%] lg:left-[3%] md:text-2xl max-sm:text-sm"
              >The long awaited concert this 2023 with UMAK Jammers</p>
            </div>
            <div className="z-10 flex items-center text-center justify-center absolute top-[40%] lg:right-[10%] max-sm:left-[10%] bg-white w-48 rounded-full 
              lg:px-3 lg:py-1 md:right-[5%] max-sm:w-36 max-sm:top-[42%]">
              <Link href='/Events' className="text-black text-sm font-medium mx-3
              lg:text-sm max-sm:text-xs">See all events</Link>
              <p className="text-black lg:text-lg text-3xl max-sm:text-lg">→</p>
            </div>
            {/* <div className="absolute bg-white bottom-[8%] right-[4%] rounded-full w-12 h-12 
            flex items-center justify-center place-self-center overflow-hidden">
              <p className="text-black text-3xl font-extrabold" style={{ transform: 'rotate(-30deg)' }}>→</p>
            </div> */}
          </section>
        </div>
      </div>
    </>
  );
}

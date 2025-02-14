"use client";
import Image from "next/image";
import { Button, ButtonGroup } from "@mui/material";
import * as ToggleGroup from "@radix-ui/react-toggle-group";

export default function Timeline() {

  const mockDataEvents = [
    {
      date: "Jan 31",
      day: "Friday",
      time: "1:30 PM",
      title: "TechCon 2025: Shaping the Future of Innovation",
      location: "UMak Oval",
      attendees: 45,
      imageUrl: "/event-image.jpg",
      status: "upcoming",
    },
    {
      date: "Feb 14",
      day: "Friday",
      time: "1:30 PM",
      title: "TechCon 2025: Shaping the Future of Innovation",
      location: "UMak Oval",
      attendees: 45,
      imageUrl: "/event-image.jpg",
      status: "ongoing",
    },
    {
      date: "Mar 4",
      day: "Tuesday",
      time: "1:30 PM",
      title: "TechCon 2025: Shaping the Future of Innovation",
      location: "UMak Oval",
      attendees: 45,
      imageUrl: "/event-image.jpg",
      status: "attended",
    },
  ];

  return (
    <div className="ml-[130px] mr-[132px]">
      <div className="flex w-[100%] items-center justify-between">
        <h1 className="text-[23px] font-semibold">Events</h1>
        <ToggleGroup.Root type="single" className="flex ">
          <ToggleGroup.Item
            value="1"
            className="px-5 py-2 border text-[13px] font-semibold border-[#2e2f2e] rounded-tl-[8px] rounded-bl-[8px]"
          >
            Upcoming
          </ToggleGroup.Item>
          <ToggleGroup.Item
            value="2"
            className="px-5 py-2 text-[13px] font-semibold  border border-[#2e2f2e] "
          >
            Ongoing
          </ToggleGroup.Item>
          <ToggleGroup.Item
            value="2"
            className="px-5 py-2 rounded-tl-[8px] text-[13px] font-semibold border border-[#2e2f2e] rounded-tr-[8px] rounded-br-[8px]"
          >
            Attended
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
      <div className="mt-5">
        {mockDataEvents.map((event, index) => (
          <div key={index} className="flex gap-5 h-[175px]">
            {/* Date Section */}
            <div className="flex gap-2">
              <div className="w-[80px]">
                <p className="text-[17px] font-bold">{event.date}</p>
                <p className="text-gray-400">{event.day}</p>
              </div>
              <div className="h-[175px] w-[0.5px] bg-[#2e2f2e]"></div>
            </div>

            {/* Event Card */}
            <div className="w-[100%] h-[150px] flex items-center gap-4">
              <div className="w-[375px] h-[150px] rounded-[10px] flex gap-5 justify-between pl-4 pr-1 py-1 border border-[#2e2f2e]">
                <div>
                  <p className="text-[#868484] mb-3 text-[12px] font-semibold">
                    {event.time}
                  </p>
                  <p className="font-semibold mb-5 leading-tight text-[15px]">
                    {event.title}
                  </p>
                  <div className="flex gap-1 items-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="13"
                      fill="#868484"
                      className="bi bi-geo-alt-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
                    </svg>
                    <p className="text-[#868484] text-[11px] font-semibold">
                      {event.location}
                    </p>
                  </div>
                  <p className="text-[11px] text-[#868484]">
                    {event.attendees} Attendees
                  </p>
                </div>
                <Image
                  src="/heronsNight.jpg"
                  alt="image"
                  width={145}
                  height={100}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
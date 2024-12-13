"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { faBars, faCalendarPlus, faGear, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faTicket } from "@fortawesome/free-solid-svg-icons";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import SearchModal from './SearchModal';
import NotificationDropdown from './NotificationDropdown';

const Header = () => {
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [settingsDropDownOpen, setSettingsDropDownOpen] = useState(false);
  const dropDownRef = useRef(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const barsButtonRef = useRef(null);
  const profileButtonRef = useRef(null);
  const settingsButtonRef = useRef(null);
  const settingsDropDownRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const[loading, setLoading] = useState(true);

  // Toggle hover state
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const toggleDropDown = () => {
    setDropDownOpen((prev) => !prev);
  };

  const toggleSettingsDropDown = (e) => {
    e.stopPropagation();
    setSettingsDropDownOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!session) {
        setLoading(true);
        const timeoutId = setTimeout(() => {
            setLoading(false);
        }, 3000); 

        return () => clearTimeout(timeoutId);
    } else {
        setLoading(false);
    }
  }, [session, status]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target) &&
        !barsButtonRef.current.contains(event.target) &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setDropDownOpen(false); // Close dropdown if click is outside and if user clicks again on the button
      }
      if (
        settingsDropDownRef.current &&
        !settingsDropDownRef.current.contains(event.target) &&
        !settingsButtonRef?.current?.contains(event.target)
      ) {
        setSettingsDropDownOpen(false);
      }
    };

    // Attach event listener on mount
    document.addEventListener("mousedown", handleClickOutside); // mousedoen for every click anywhere on the dom

    // Before a re-run, return to remove the event to cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <section className="p-5 flex justify-center">
        <div
          className="w-[90%] p-3 bg-[#190E1E] bg-opacity-50"
          style={{
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "20px",
          }}
        >
          <div className="flex justify-between items-center">
            <Link className="ml-5 mr-0 xl:mr-[2%] lg:mr-[2%]" href="/">
              <Image src="/logo.png" width={38} height={38} alt="logo" />
            </Link>
            
            {loading === false && (
            <div className="justify-between w-[35%] max-md:w-[60%] md:ml-5 md:hidden max-sm:hidden lg:flex 2xl:flex">
              {session?.user?.role === "Organizer" ? (
                <>
                  <Link href="/OrganizerDashboard" className={`nav-link ${pathname === "/OrganizerDashboard" ? 'active' : ''}`}>
                    <FontAwesomeIcon 
                      className="text-sm mr-1" 
                      icon={faChartLine} /> 
                      Dashboard
                  </Link>
                  <Link href="/My-Events" className={`nav-link ${pathname === "/My-Events" ? 'active' : ''}`}>
                  <FontAwesomeIcon 
                    className="text-sm mr-1" 
                    icon={faLayerGroup} /> 
                    My Events
                  </Link>
                  <Link href="/Create-Event" className={`nav-link ${pathname === "/Create-Event" ? 'active' : ''}`}>
                  <FontAwesomeIcon 
                    className="text-sm mr-1" 
                    icon={faCalendarPlus} /> 
                    Create Event
                  </Link>
                  {/* <div className="w-40"></div> */}
                </>
              ) : (session?.user?.role === "Admin" || session?.user?.role === "Staff") ? ( 
                <>
                  <div className="justify-between w-[80%] md:w-[65%] md:hidden max-sm:hidden lg:flex 2xl:flex">
                    <Link href="/AdminDashboard">
                    <FontAwesomeIcon className="text-sm mr-1" icon={faChartLine} /> Dashboard
                    </Link>
                    <button
                      ref={settingsButtonRef}
                      onClick={toggleSettingsDropDown}
                      onMouseEnter={handleMouseEnter}
                    >
                      <FontAwesomeIcon
                        className="mr-2"
                        icon={faGear} /> 
                        Settings
                      <FontAwesomeIcon
                        icon={faAngleDown}
                        style={{ color: "gray", marginLeft: ".5em" }}
                      />
                    </button>
                    {settingsDropDownOpen ||
                      (isHovered && (
                        <div
                          ref={settingsDropDownRef}
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                          className="absolute bg-[#070505] z-10 border border-[#343434] p-4 rounded-md xl:top-[10%] lg:top-[11.5%] lg:left-[24%] md:top-[13%] top-[11%]"
                        >
                          <div className="flex flex-col gap-2">
                            <Link
                              href="/Event-Management"
                              className="hover:bg-white/10 hover:rounded-md px-7 py-3"
                            >
                              <div>
                                <h1 className="font-bold text-sm">
                                  Event Management
                                </h1>
                                <p className="text-sm">
                                  create events, review, approve, or reject
                                  event submissions from organizers.
                                </p>
                              </div>
                            </Link>
                            <Link
                              href="/User-Management"
                              className="hover:bg-white/10 hover:rounded-md px-7 py-3"
                            >
                              <div>
                                <h1 className="font-bold text-sm">
                                  User Management
                                </h1>
                                <p className="text-sm">
                                  manage user accounts for students, organizers,
                                  and other admins.
                                </p>
                              </div>
                            </Link>
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              ) : ( // REGULAR NAV
                <>
                  <Link href="/Events" className={`nav-link items-center gap-2 mr-8 xl:flex lg:flex ${pathname === '/Events' ? 'active' : ''}`}>
                      <FontAwesomeIcon icon={faTicket} className="text-base mt-0"></FontAwesomeIcon>Discover
                    </Link>
                    <Link href="/Calendar" className={`nav-link items-center gap-2 xl:flex lg:flex ${pathname === '/Calendar' ? 'active' : ''}`}>
                      <FontAwesomeIcon icon={faCalendarDays} className="text-base mt-0"></FontAwesomeIcon>Calendar
                    </Link>
                  {/* <Link className='xl:flex lg:flex' href='/Notification'>Notifications</Link> */}
                  <div className="w-40"></div>
                </>
              )}
            </div>
            )}

            {loading === false && (
            <div className="relative xl:w-[75%] lg:w-[50%] flex justify-end mr-5 items-center">
              {session?.user?.role === "Student" || !session ? (
                <>
                <div className="w-[10%] flex justify-evenly items-center h-full mx-3">
                  <SearchModal />
                  <NotificationDropdown />
                </div>
                </>
              ) : session?.user?.role === "Organizer" ? (
                <>
                <div className="w-[10%] flex justify-evenly items-center h-full mx-3">
                  {/* <Link className="text-sm w-[6vw]" href="/Create-Event">Create Event</Link> */}
                  <SearchModal />
                  <NotificationDropdown />
                </div>
                </>
              ) : (
                <></>
              )}
              <button
                className="hidden md:hidden lg:flex"
                ref={profileButtonRef}
                onClick={() => {
                  if (session) {
                    toggleDropDown();
                  } else {
                    router.push("/Login");
                  }
                }}
              >
                <Image src="/profile.png" width={30} height={30} alt="logo" />
              </button>
              <button onClick={toggleDropDown} ref={barsButtonRef}>
                <FontAwesomeIcon
                  className="text-2xl lg:hidden sm:flex"
                  icon={faBars}
                />
              </button>

              {dropDownOpen && (
                <div
                  ref={dropDownRef}
                  className="z-50 absolute lg:right-[0%] md:right-[2%] right-[-5%] w-72 bg-slate-950 mt-2 rounded-md border-white/30 border xl:top-[3vw] lg:top-[5vw] md:top-[4vw] top-[12vw]"
                >
                  {session ? (
                    <>
                      <div className="flex mb-2 p-2">
                        <div className="flex justify-center items-center mr-2 ml-2 min-w-[20%]">
                          <Image
                            src="/profile.png"
                            width={35}
                            height={35}
                            alt="logo"
                          />
                        </div>
                        <div className="flex flex-col justify-center">
                          <div className=" font-normal text-white text-base overflow-hidden whitespace-nowrap overflow-ellipsis max-w-[200px]">
                            {session?.user?.username}
                          </div>
                          <div className=" text-white/30 text-sm overflow-hidden whitespace-nowrap text-ellipsis max-w-[200px]">
                            {session?.user?.email}
                          </div>
                        </div>
                      </div>
                      <hr className="border-t border-white/30 my-0" />
                      <div className="p-2">
                        {session?.user?.role != "Admin" && session?.user?.role != "Staff" && (
                          <>
                            <Link
                              onClick={() => setDropDownOpen(false)}
                              href="/Profile"
                              className="flex justify-start w-full font-normal max-h-[3em] text-white text-sm transition-colors duration-200 ease-in-out hover:bg-slate-900 hover:text-white px-4 py-2 hover:rounded-md mt-2"
                            >
                              Profile
                            </Link>
                            <div className="pb-2 md:block lg:hidden">
                              <Link
                                className="block text-white text-sm hover:bg-gray-100 hover:text-black px-4 py-2 hover:rounded-md"
                                href="/Events"
                              >
                                Events
                              </Link>
                              <Link
                                className="block text-white text-sm hover:bg-gray-100 hover:text-black px-4 py-2 hover:rounded-md"
                                href="/Calendar"
                              >
                                Calendar
                              </Link>
                              <Link
                                className="block text-white text-sm hover:bg-gray-100 hover:text-black px-4 py-2 hover:rounded-md"
                                href=""
                              >
                                Notification
                              </Link>
                            </div>
                          </>
                        )}
                        <div className="pb-2 md:block lg:hidden">
                          <Link
                            className="block text-white text-sm hover:bg-gray-100 hover:text-black px-4 py-2 hover:rounded-md"
                            href="/Dashboard"
                          >
                            Dashboard
                          </Link>
                          <Link
                            className="block text-white text-sm hover:bg-gray-100 hover:text-black px-4 py-2 hover:rounded-md"
                            href="/User-Management"
                          >
                            User Management
                          </Link>
                          <Link
                            className="block text-white text-sm hover:bg-gray-100 hover:text-black px-4 py-2 hover:rounded-md"
                            href="/Event-Management"
                          >
                            Event Management
                          </Link>
                        </div>
                        <hr className="lg:hidden border-t border-white/30 my-0" />
                        <button
                          onClick={() => {
                            signOut({ callbackUrl: "/" });
                            setDropDownOpen(false);
                          }}
                          className="flex font-normal text-white text-sm transition-colors duration-200 ease-in-out hover:bg-slate-900 hover:text-white px-4 py-2 hover:rounded-md w-full"
                        >
                          Sign out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col p-2">
                      <div className="pb-2">
                        <Link
                          className="block text-white text-sm hover:bg-gray-100 hover:text-black px-4 py-2 hover:rounded-md"
                          href="/Events"
                        >
                          Events
                        </Link>
                        <Link
                          className="block text-white text-sm hover:bg-gray-100 hover:text-black px-4 py-2 hover:rounded-md"
                          href="/Calendar"
                        >
                          Calendar
                        </Link>
                      </div>
                      <hr className="border-t border-white/30 my-0" />
                      <Link
                        onClick={() => setDropDownOpen(false)}
                        href="/Login"
                        className="block text-white text-sm hover:bg-gray-100 hover:text-black px-4 py-2 hover:rounded-md font-semibold"
                      >
                        Login
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
            )}
          </div>
        </div>
      </section>

      {/* STYLES */}
      <style jsx global>{`
        .nav-link {
            color: gray; 
            font-weight: 500;
            transition: color 0.3s ease;
        }

        .nav-link.active {
            color: white; 
            font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default Header;

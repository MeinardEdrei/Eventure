'use client';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react'
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Header = () => {
    const [dropDownOpen, setDropDownOpen] = useState(false);
    const dropDownRef = useRef(null);
    const { data: session } = useSession();
    const router = useRouter();
    const barsButtonRef = useRef(null);
    const profileButtonRef = useRef(null);

    const toggleDropDown = () => {
        // setDropDownOpen(!dropDownOpen);
        setDropDownOpen((prev) => !prev);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropDownRef.current && !dropDownRef.current.contains(event.target)
                && !barsButtonRef.current.contains(event.target)
                && !profileButtonRef.current.contains(event.target)) {
                setDropDownOpen(false); // Close dropdown if click is outside and if user clicks again on the button
            }
        };

        // Attach event listener on mount
        document.addEventListener('mousedown', handleClickOutside); // mousedoen for every click anywhere on the dom

        // Before a re-run, return to remove the event to cleanup
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

  return (
    <div>
      <section className='p-5 flex justify-center'>
        <div className='w-[90%] p-5 bg-[#190E1E] bg-opacity-50' style={{ border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '20px' }}>
        <div className='flex justify-between items-center'>
            <div className='w-[10%] ml-5'>
                <Link href='/'><Image src='/logo.png' width={30} height={30} alt='logo' /></Link>
            </div>
            <div className='justify-between w-[40%] md:ml-5 md:hidden max-sm:hidden lg:flex 2xl:flex'>
                <Link className='xl:flex lg:flex' href='\Events'>Events</Link>
                {session?.user?.role === 'Organizer' ? (
                <>
                    <Link href='/Create-Event'>Create Event</Link>
                    <Link href=''>My Events</Link>
                </>
                ) : session?.user?.role === 'Admin' ? (
                    <>
                        <Link href='/EventApproval'>Event Approval</Link>
                        <Link href='/UserApproval'>User Approval</Link>
                    </>
                ) : (
                    <>
                        <Link className='xl:flex lg:flex' href=''>Calendar</Link>
                        <Link className='xl:flex lg:flex' href=''>Notifications</Link>
                    </>
                )}

            </div>
            
            <div className='relative w-[75%] flex justify-end mr-5'>
                <button
                    className='hidden md:hidden lg:flex'
                    ref={profileButtonRef}
                    onClick={() => { if(session) {toggleDropDown();} else{router.push('/Login');} }}>
                    <Image src='/profile.png' width={30} height={30} alt='logo' />
                </button>
                <button
                    onClick={toggleDropDown}
                    ref={barsButtonRef}>
                    <FontAwesomeIcon className='text-2xl lg:hidden sm:flex' icon={faBars} />
                </button>
            {dropDownOpen && (
                <div ref={dropDownRef} className='absolute lg:right-[2%] md:right-[2%] right-[-5%] w-72 bg-slate-950 mt-2 rounded-md border-white/30 border xl:top-[2vw] lg:top-[5vw] md:top-[4vw] top-[12vw] z-20'>
                    {session ? (
                        <>
                            <div className='flex justify-center items-center mb-2 p-2'>
                                <div className='flex justify-center w-14'>
                                    <Image src='/profile.png' width={35} height={35} alt='logo' />
                                </div>
                                <div className='flex flex-col overflow-hidden'>
                                    <span className='text-white text-base'>{session?.user?.username}</span>
                                    <p className='text-white/30 text-sm overflow-hidden whitespace-nowrap text-ellipsis'>
                                        {session?.user?.email}
                                    </p>
                                </div>
                            </div>
                            <hr className='border-t border-white/30 my-0' />
                            <div className='p-2'>
                                <Link onClick={() => setDropDownOpen(false)} href='' className='block text-white text-sm transition-colors duration-200 ease-in-out hover:bg-slate-900 hover:text-white px-4 py-2 hover:rounded-md mt-2'>Profile</Link>
                                <div className='pb-2 md:block lg:hidden'>
                                    <Link className='block text-white text-sm hover:bg-gray-100 hover:text-black px-4 py-2 hover:rounded-md' href='\Events'>Events</Link>
                                    <Link className='block text-white text-sm hover:bg-gray-100 hover:text-black px-4 py-2 hover:rounded-md' href=''>Calendar</Link>
                                    <Link className='block text-white text-sm hover:bg-gray-100 hover:text-black px-4 py-2 hover:rounded-md' href=''>Notification</Link>
                                </div>
                                <hr className='lg:hidden border-t border-white/30 my-0' />
                                <button onClick={() => { signOut(); setDropDownOpen(false) }} className='flex text-white text-sm transition-colors duration-200 ease-in-out hover:bg-slate-900 hover:text-white px-4 py-2 hover:rounded-md w-full'>Sign out</button>
                            </div>
                        </>
                    ) : (
                        <div className='flex flex-col p-2'>
                            <div className='pb-2'>
                                <Link className='block text-white text-sm hover:bg-gray-100 hover:text-black px-4 py-2 hover:rounded-md' href='\Events'>Events</Link>
                                <Link className='block text-white text-sm hover:bg-gray-100 hover:text-black px-4 py-2 hover:rounded-md' href=''>Calendar</Link>
                            </div>
                            <hr className='border-t border-white/30 my-0' />
                            <Link onClick={() => setDropDownOpen(false)} href='/Login' className='block text-white text-sm hover:bg-gray-100 hover:text-black px-4 py-2 hover:rounded-md font-semibold'>Login</Link>
                        </div>
                    )}
                </div>
            )}
            </div>
        </div>
        </div>
      </section>
    </div>
  )
}

export default Header
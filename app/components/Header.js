'use client';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState, useRef } from 'react'

const Header = () => {
    const [dropDownOpen, setDropDownOpen] = useState(false);
    const dropDownRef = useRef(null);
    const { data: session } = useSession();

    // console.log("session header: ", session);

    const toggleDropDown = () => {
        setDropDownOpen(!dropDownOpen);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
                setDropDownOpen(false); // Close dropdown if click is outside
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
            <div className='justify-between w-[40%] hidden lg:flex 2xl:flex'>
                <Link href='\Events'>Events</Link>
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
                        <Link href=''>Calendar</Link>
                        <Link href=''>Notifications</Link>
                    </>
                )}

            </div>
            
            <div className='relative w-[75%] flex justify-end mr-5'>
                <button
                    onClick={toggleDropDown}>
                    <Image src='/profile.png' width={30} height={30} alt='logo' />
                </button>

            {dropDownOpen && (
                <div ref={dropDownRef} className='absolute right-0 w-48 bg-white z-10 mt-2 rounded-md'>
                    <Link href='' className='block text-gray-700 text-sm hover:bg-gray-100 px-4 py-2 hover:rounded-md'>Profile</Link>
                    {session ? (
                        <>
                        <button onClick={() => signOut()} className='block text-gray-700 text-sm hover:bg-gray-100 px-4 py-2 hover:rounded-md'>Sign out</button>
                        </>
                    ) : (
                        <Link href='/Login' className='block text-gray-700 text-sm hover:bg-gray-100 px-4 py-2 hover:rounded-md'>Login</Link>
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
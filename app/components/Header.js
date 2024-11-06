'use client';
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

const Header = () => {
    const [dropDownOpen, setDropDownOpen] = useState(false);

    const toggleDropDown = () => {
        setDropDownOpen(!dropDownOpen);
    }

  return (
    <div>
      <section className='p-5' style={{ boxShadow: '0px 1px 1px rgba(255, 255, 255, 0.3)' }}>
        <div className='flex justify-between'>
            <div><Image src='/logo.png' width={30} height={30} alt='logo' /></div>
            <div className='flex justify-between w-[40%]'>
                <Link href=''>Events</Link>
                <Link href=''>Calendar</Link>
                <Link href=''>Notifications</Link>
            </div>
            <div className='relative'>
                <button
                    onClick={toggleDropDown}>
                    <Image src='/profile.png' width={30} height={30} alt='logo' />
                </button>
            {dropDownOpen && (
                <div className='absolute right-0 w-48 bg-white z-10 mt-2 rounded-md'>
                    <Link href='' className='block text-gray-700 text-sm hover:bg-gray-100 px-4 py-2 hover:rounded-md'>Profile</Link>
                    <Link href='' className='block text-gray-700 text-sm hover:bg-gray-100 px-4 py-2 hover:rounded-md'>Login</Link>
                </div>
            )}
                
            </div>
        </div>
      </section>
    </div>
  )
}

export default Header

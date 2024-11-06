import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Header = () => {
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
            <div><Image src='/profile.png' width={30} height={30} alt='logo' /></div>
        </div>
      </section>
    </div>
  )
}

export default Header

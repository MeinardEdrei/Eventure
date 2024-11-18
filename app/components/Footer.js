'use client';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import React from 'react'

const Footer = () => {
  return (
    <div className=''>
        <div className='flex flex-col mx-[9%] my-[5%] mb-[15%]'>
            {/* <hr className='border-neutral-700' /> */}
            <div className='flex my-2 justify-between items-center border border-neutral-700 p-4 rounded-lg'>
                <Link className='text-sm underline' href=''>ABOUT US</Link>
                <Link className='text-sm' href=''>JOIN AN EVENT <FontAwesomeIcon
                className='text-xs' icon={faUpRightFromSquare} /></Link>
                <Link className='text-sm' href=''>DEVOPS</Link>
            </div>
        </div>
    </div>
  )
}

export default Footer

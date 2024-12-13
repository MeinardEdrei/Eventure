"use client";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { usePathname } from 'next/navigation';

export default function Template({ children }) {
  const pathname = usePathname();
  
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {pathname !== '/Login' && pathname !== '/Register' && pathname !== '/Forgot-Password' && pathname !== '/Reset-Password' &&<Header />}
        {children}
      </main>
      <div className="mt-auto mb-[5%]">
        <Footer/>
      </div>
    </div>
  );
}
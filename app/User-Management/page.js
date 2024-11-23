"use client";
import React, { useCallback, useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../css/User-Management.css";
import UserManagementTable from "./UserManagementTable";
import AddUserModal from "./AddUserModal";
import axios from "axios";

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [userCount, setUserCount] = useState([]);

  const refreshData = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, [])

  useEffect(() => {
    async function fetchUserCount() {
      try {
        const response = await axios.get("http://localhost:5000/api/user/count");
        console.log(response.data);
        setUserCount(response.data);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    }

    fetchUserCount();
  }, [refreshTrigger]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="event-maincontainer flex flex-col justify-center items-center mt-5">
      {/* Header */}
      <div className="upper-maincontainer flex flex-col w-[82%] gap-4 mb-10">
        <div className="header-text-container flex flex-col">
          <h2 className="event-title">User Management</h2>
          <p className="event-description">
            Manage all organizations and students account here.
          </p>
        </div>

        <div className="line-container">
          <hr />
        </div>
      </div>

      {/* Content Section */}
      <div className="content-main-container flex flex-col w-[78%] gap-5">
        <div className="upper-mnc flex flex-row items-end justify-between">
          {/* Text Container */}
          <div className="text-container flex flex-row gap-[0.5rem]">
            <h3 className="text-xl font-bold text-white">All users</h3>
            <h4 className="text-xl font-extrabold text-white opacity-50">
              {userCount !== null ? userCount.count : "Loading..."}</h4>
          </div>

          {/* Search and Add User Container */}
          <div className="search-add-container flex flex-row gap-4 items-center">
            {/* Search Container */}
            <div className="search-container">
              <div className="relative group w-full">
                <i
                  className="fa fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#F7F0FF]/80"
                  aria-hidden="true"
                ></i>
                <input
                  className="w-full h-9 pl-11 pr-5 py-[1.1rem] text-large bg-[#463951]/50 text-[#F7F0FF] border border-[#fff0f0b3]/25 rounded-[8px] outline-none focus:border-[#F7F0FF]/30 transition-all duration-300"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <div
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/30 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ zIndex: -1 }}
                />
              </div>
            </div>

            {/* Add User Container */}
            <div
              className="addUser-container relative group flex flex-row gap-2 items-center bg-[#463951]/70 px-4 py-[0.4rem] rounded-lg cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <i
                className="fa fa-user-plus text-[#F7F0FF]"
                aria-hidden="true"
              ></i>
              <button className="add-user-btn text-[1rem] text-[#F7F0FF]">
                Add
              </button>
              <div
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/50 to-pink-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ zIndex: -1 }}
              />
            </div>
          </div>
        </div>

        <UserManagementTable 
          searchQuery={searchQuery} 
          refreshTrigger={refreshTrigger}/>
      </div>

      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refreshData}
      />
    </div>
  );
};

export default Page;

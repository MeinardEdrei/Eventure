import React, { useState } from "react";

const AddUserModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [showAddUsertModal, setshowAddUsertModal] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000] bg-opacity-70">
      <div className="bg-[#ffffff] rounded-lg p-10 w-[500px] relative">
        <button onClick={onClose} className="absolute top-3 right-5">
          <i
            className="fa fa-times text-[#a8a8a8] text-[0.8rem] hover:text-red-600"
            aria-hidden="true"
          ></i>
        </button>

        <h2 className="text-[#000000] text-[1.3rem] font-bold mb-4 text-center">
          Add New User
        </h2>

        <div className="text-black">
          <div className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-[#cccccc] rounded-lg"
              />
            </div>
            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-[#cccccc] rounded-lg"
              />
            </div>
            {/* Student Number */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Student Number
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-[#cccccc] rounded-lg"
              />
            </div>
            {/* Role */}
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select className="w-full px-3 py-2 border border-[#cccccc] rounded-lg">
                <option value="Student">Student</option>
                <option value="Organizer">Organizer</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            {/* Department */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Department
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-[#cccccc] rounded-lg"
              />
            </div>
          </div>
          {/* Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            <button className="flex flex-row items-center gap-2 text-[1rem] px-5 py-2 bg-[#463951] hover:bg-[#6e4293] text-white rounded-lg ">
              <i
                className="fa fa-user-plus text-[#F7F0FF]"
                aria-hidden="true"
              ></i>
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;

"use client";
import React, { useState } from "react";

const UserManagementTable = ({ searchQuery }) => {
  const [users, setUsers] = useState([
    {
      id: 1,
      email: "meinardsantoss@gmail.com",
      password: "Secret123",
      studentNumber: "K123445678",
      role: "Student",
      department: "CCIS - College of Computing and Information Sciences",
      dateCreated: "November 08, 2024",
    },
    {
      id: 2,
      email: "CCIS@umak.edu.ph",
      password: "Secret123",
      studentNumber: "K123445678",
      role: "Organizer",
      department: "CCIS - College of Computing and Information Sciences",
      dateCreated: "November 21, 2024",
    },
  ]);

  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchLower) ||
      user.studentNumber.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower) ||
      user.department.toLowerCase().includes(searchLower) ||
      user.dateCreated.toLowerCase().includes(searchLower)
    );
  });

  const handleEdit = (user) => {
    setEditingUser({ ...user });
    setShowEditModal(true);
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const saveEdit = () => {
    setUsers(
      users.map((user) => (user.id === editingUser.id ? editingUser : user))
    );
    setShowEditModal(false);
    setEditingUser(null);
  };

  const confirmDelete = () => {
    setUsers(users.filter((user) => user.id !== userToDelete.id));
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto border rounded-lg shadow-lg">
        <table className="w-full table-auto">
          <thead className="bg-transparent border-b text-[0.8rem] text-white">
            <tr>
              <th className="p-5 text-center">Email</th>
              <th className="p-5 text-center">Password</th>
              <th className="p-5 text-center">Student ID</th>
              <th className="p-5 text-center">Role</th>
              <th className="p-5 text-center">Department</th>
              <th className="p-5 text-center">Date Created</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b hover:bg-white/10 text-sm">
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">{user.password}</td>
                <td className="py-3 px-4">{user.studentNumber}</td>
                <td className="py-3 px-4">{user.role}</td>
                <td className="py-3 px-4">{user.department}</td>
                <td className="py-3 px-4">{user.dateCreated}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-2 bg-transparent text-white rounded hover:text-[#68ff70]"
                    >
                      <i className="fa fa-pencil" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="p-2 bg-transparent text-white rounded hover:text-[#ff5d5d]"
                    >
                      <i className="fa fa-trash" aria-hidden="true"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-[#000000] bg-opacity-70 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-[30rem] text-black   ">
            <h2 className="text-xl font-semibold mb-6">Edit User</h2>
            <div className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-[#cccccc] rounded-lg"
                  value={editingUser?.email || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                />
              </div>
              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-[#cccccc] rounded-lg"
                  value={editingUser?.password || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, password: e.target.value })
                  }
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
                  value={editingUser?.studentNumber || ""}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      studentNumber: e.target.value,
                    })
                  }
                />
              </div>
              {/* Role */}
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <select
                  className="w-full px-3 py-2 border border-[#cccccc] rounded-lg"
                  value={editingUser?.role || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                >
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
                  value={editingUser?.department || ""}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      department: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            {/* Buttons */}
            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-5 py-2 border border-gray-400 rounded-lg hover:bg-gray-200 text-black"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-5 py-2 bg-[#8d46c7] hover:bg-[#6e4293] text-white rounded-lg"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-[#000000] bg-opacity-70 flex items-center justify-center">
          <div className="bg-white p-7 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-2 text-black">
              Confirm Delete
            </h2>
            <p className="text-sm mb-7 text-black text-center">
              Are you sure you want to delete this user?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2 border border-gray-400 rounded-lg hover:bg-gray-200 text-black"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementTable;

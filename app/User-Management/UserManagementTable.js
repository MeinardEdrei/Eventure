import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const UserManagementTable = ({ searchQuery, refreshTrigger, dateRange }) => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/api/user/users');
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [refreshTrigger, fetchUsers]);

  const filteredUsers = users.filter((user) => {
    if (!searchQuery && !dateRange?.from && !dateRange?.to) return true;
    const searchLower = searchQuery?.toLowerCase() || "";

    // Date range filter
    let matchesDateRange = true;
    if (dateRange?.from && dateRange?.to && user.created_At) {
      try {
        const userDate = parseISO(user.created_At);
        matchesDateRange = isWithinInterval(userDate, {
          start: startOfDay(dateRange.from),
          end: endOfDay(dateRange.to)
        });
      } catch (error) {
        console.error("Error parsing date:", error);
        matchesDateRange = false;
      }
    }

    // Search query filter
    const matchesSearch = !searchQuery || (
      user.email?.toLowerCase().includes(searchLower) ||
      user.student_Number?.toLowerCase().includes(searchLower) ||
      user.role?.toLowerCase().includes(searchLower) ||
      user.department?.toLowerCase().includes(searchLower) ||
      (new Date(user.created_At)).toLocaleDateString().toLowerCase().includes(searchLower)
    );

    return matchesSearch && matchesDateRange;
  });

  const handleEdit = (user) => {
    setEditingUser({ ...user });
    setShowEditModal(true);
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const saveEdit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(`http://localhost:5000/api/user/update/${editingUser.id}`, editingUser)
      if (res.status === 200) {
        alert(res.data.message);
        setShowEditModal(false);
        setEditingUser(null);
        fetchUsers();
      }
    } catch (error) {
      console.log(error)
    }
  };

  const confirmDelete = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.delete(`http://localhost:5000/api/user/delete/${userToDelete.id}`, userToDelete)
      if (res.status === 200) {
        alert(res.data.message);
        setShowDeleteModal(false);
        setUserToDelete(null);
        fetchUsers();
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto border border-[#fff0f0b3]/50 rounded-lg shadow-lg">
        <table className="w-full table-fixed">
          <thead className="bg-transparent border-b border-[#fff0f0b3]/50 text-[0.8rem] text-white">
            <tr>
              <th className="w-1/4 p-5 text-center">Email</th>
              <th className="w-1/6 p-5 text-center">Student ID</th>
              <th className="w-1/6 p-5 text-center">Role</th>
              <th className="w-1/6 p-5 text-center">Department</th>
              <th className="w-1/6 p-5 text-center">Date Created</th>
              <th className="w-1/12 p-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-[#fff0f0b3]/25 hover:bg-white/10 text-sm">
                <td className="py-3 px-4 truncate">
                  {user.email || '-'}
                </td>
                <td className="py-3 px-4 text-center">
                  {user.student_Number || '-'}
                </td>
                <td className="py-3 px-4 text-center">
                  {user.role || '-'}
                </td>
                <td className="py-3 px-4 text-center">
                  {user.department || '-'}
                </td>
                <td className="py-3 px-4 text-center">
                  {user.created_At ? new Date(user.created_At).toLocaleString() : '-'}
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2 justify-center">
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
          <div className="bg-white p-8 rounded-lg w-[30rem] text-black">
            <h2 className="text-xl font-semibold mb-6">Edit User</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-[#cccccc] rounded-lg"
                  value={editingUser?.email || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <select
                  className="w-full px-3 py-2 border border-[#cccccc] rounded-lg"
                  value={editingUser?.role || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                >
                  <option value="Student">Student</option>
                  <option value="Organizer">Organizer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              {editingUser?.role === "Student" && (
                <>
                <div>
                  <label className="block text-sm font-medium mb-2">Student Number</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-[#cccccc] rounded-lg"
                    value={editingUser?.student_Number || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, student_Number: e.target.value })}
                    placeholder="e.g. K12345678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Section</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-[#cccccc] rounded-lg"
                    value={editingUser?.section || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, section: e.target.value })}
                    placeholder="e.g. II - BCSAD"
                  />
                </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium mb-2">Department</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-[#cccccc] rounded-lg"
                  value={editingUser?.department || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                />
              </div>
            </div>
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
            <h2 className="text-xl font-semibold mb-2 text-black">Confirm Delete</h2>
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

export function DatePickerWithRange({ className, onDateChange, selectedRange }) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            // variant={"outline"}
            className={cn(
              "w-[100%] justify-start text-left font-normal bg-[#463951]/50 border border-[#fff0f0b3]/25",
              !selectedRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedRange?.from ? (
              selectedRange.to ? (
                <>
                  {format(selectedRange.from, "LLL dd, y")} -{" "}
                  {format(selectedRange.to, "LLL dd, y")}
                </>
              ) : (
                format(selectedRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-transparent border-none" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={selectedRange?.from}
            selected={selectedRange}
            onSelect={onDateChange}
            numberOfMonths={2}
            className="bg-[#0e0811] rounded-md border border-[#fff0f0b3]/25"
            modifiersStyles={{
              selected: {
                backgroundColor: "#5F3284",
                color: "white",
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
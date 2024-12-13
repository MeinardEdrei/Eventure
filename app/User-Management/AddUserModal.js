import axios from "axios";
import React, { useState } from "react";

const AddUserModal = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  const [selectedRole, setSelectedRole] = useState("Organizer");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [error, setError] = useState("");

  const showStudentFields = selectedRole === "Student";
  const hideFields = selectedRole === "Admin" || selectedRole === "Staff";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userData = {
        email,
        password,
        username: name,
        student_number: studentId,
        department,
        section,
        role: selectedRole,
      };

      const res = await axios.post(
        "http://localhost:5000/api/user/admin-register",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        alert(res.data.message || "User added successfully!");
        setEmail("");
        setPassword("");
        setName("");
        setStudentId("");
        setDepartment("");
        setSection("");
        setSelectedRole("Organizer");
        onSuccess();
        onClose();
      }
    } catch (error) {
      setError(
        error.response?.data?.message || error.message || "An error occurred"
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white rounded-lg p-10 w-[500px] max-h-[85vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-5 text-gray-400 hover:text-red-600"
        >
          <i className="fa fa-times text-[0.8rem]" aria-hidden="true"></i>
        </button>

        <h2 className="text-black text-[1.3rem] font-bold mb-4 text-center">
          Add New User
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="text-black">
            <div className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. @umak.edu.ph"
                  required
                />
              </div>
              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  // type="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-14 top-[50.5%] transform -translate-y-1/2 text-[#bcbcbc] hover:text-[#000000] transition-colors duration-200"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {/* Role */}
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  onChange={(e) => setSelectedRole(e.target.value)}
                  value={selectedRole}
                  required
                >
                  <option value="Organizer">Organizer</option>
                  <option value="Admin">Admin</option>
                  <option value="Staff">Staff</option>
                  <option value="Student">Student</option>
                </select>
              </div>
              {/* Student Fields */}
              {showStudentFields && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Student Number
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Section
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      placeholder="e.g. II - BCSAD"
                      required
                    />
                  </div>
                </>
              )}
              {/* Department */}
              {!hideFields && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. CCIS"
                    required
                  />
                </div>
              )}
            </div>
            {/* Submit Button */}
            <div className="mt-8 flex justify-end gap-4">
              <button
                type="submit"
                className="flex flex-row items-center gap-2 text-[1rem] px-5 py-2 bg-[#463951] hover:bg-[#6e4293] text-white rounded-lg"
              >
                <i
                  className="fa fa-user-plus text-white"
                  aria-hidden="true"
                ></i>
                Add
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;

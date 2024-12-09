import React, { useState } from 'react'
import axios from 'axios';

const AddSchoolYearModal = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  const [newSchoolYear, setNewSchoolYear] = useState(''); // For the New School Year
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Regular expression for the format YYYY - YYYY
    const regex = /^\d{4} - \d{4}$/;

    if (!newSchoolYear) {
      setError('Please enter a valid school year');
      return;
    }

    if (!regex.test(newSchoolYear)) {
      setError('Please enter the school year in the format "YYYY - YYYY"');
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    try {
      // const res = await axios.post(
      //   'http://localhost:5000/api/user/admin-register',
      //   userData,
      //   {
      //     headers: {
      //       'Content-Type': 'application/json',
      //     }
      //   }
      // );

      // Simulating success response
      alert('School year added successfully!');
      onSuccess();
      onClose();
      setShowConfirmation(false); // Close confirmation modal
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'An error occurred');
      setShowConfirmation(false);
    }
  };

  return (
    <div>
      {/* School Year Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
        <div className="bg-[#1b1423] text-white rounded-lg p-10 w-[500px] relative">
          <button 
            onClick={onClose} 
            className="absolute top-3 right-5 text-gray-400 hover:text-red-600"
          >
            <i className="fa fa-times text-[0.8rem]" aria-hidden="true"></i>
          </button>
          
          <h2 className="text-lg font-semibold mb-4">Add New School Year</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="schoolYear" className="block text-sm font-medium">School Year</label>
              <input 
                type="text" 
                id="schoolYear"
                value={newSchoolYear}
                onChange={(e) => setNewSchoolYear(e.target.value)}
                className="mt-2 p-2 w-full border border-gray-300 rounded text-black"
                required 
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end">
              <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600">Cancel</button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add</button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-[#1b1423] text-white rounded-lg p-10 w-[400px] relative">
            <button 
              onClick={() => setShowConfirmation(false)} 
              className="absolute top-3 right-5 text-gray-400 hover:text-red-600"
            >
              <i className="fa fa-times text-[0.8rem]" aria-hidden="true"></i>
            </button>
            
            <h2 className="text-lg font-semibold mb-4">Confirm School Year</h2>
            <p className="mb-4">You are about to add <strong>{newSchoolYear}</strong> as the new school year. Do you confirm?</p>

            <div className="flex justify-end">
              <button 
                  onClick={() => setShowConfirmation(false)} 
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
                >
                  Cancel
              </button>
              <button 
                onClick={handleConfirm} 
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddSchoolYearModal;

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import axios from 'axios';

const AddSchoolYearModal = ({ isOpen, onClose, onSuccess }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validate dates
    if (!startDate) {
      setError('Please select a start date');
      return;
    }

    if (!endDate) {
      setError('Please select an end date');
      return;
    }

    if (endDate <= startDate) {
      setError('End date must be after start date');
      return;
    }

    // If validation passes, show confirmation
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    const formData = new FormData();

    // Format the dates as YYYY-MM-DD
    formData.append('DateStart', format(startDate, 'yyyy-MM-dd'));
    formData.append('DateEnd', format(endDate, 'yyyy-MM-dd'));

    try {
      const response = await axios.post(`http://localhost:5000/api/event/new-school-year`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        }
      );
      
      if (response.status === 200) {alert(response.data.message);}
      resetForm();
      
      onSuccess();
      onClose();
      setShowConfirmation(false);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          setError(error.response.data || 'Conflict: Unable to create school year');
          setShowConfirmation(false);
        } else {
          setError(error.response.data.message || 'An error occurred');
        }
      } else if (error.request) {
        setError('No response from server');
      } else {
        setError(error.message || 'An error occurred');
      }
    }
  };

  const resetForm = () => {
    setStartDate(null);
    setEndDate(null);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4 overflow-auto">
      <div className="bg-[#1b1423] text-white rounded-lg shadow-2xl w-full max-w-[800px] p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Add New School Year</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-red-500 text-2xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-300">Start Date</label>
              <div className="rounded overflow-hidden">
                <Calendar
                  date={startDate}
                  onChange={handleStartDateChange}
                  color="#3b82f6"
                  className="w-full dark-calendar rounded-lg"
                  maxDate={endDate || undefined}
                />
              </div>
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-300">End Date</label>
              <div className="rounded overflow-hidden">
                <Calendar
                  date={endDate}
                  onChange={handleEndDateChange}
                  color="#3b82f6"
                  className="w-full dark-calendar rounded-lg"
                  minDate={startDate || undefined}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-900 bg-opacity-50 border border-red-700 text-red-300 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-600"
            >
              Add School Year
            </button>
          </div>
        </form>

        {showConfirmation && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-70 p-4 z-10">
            <div className="bg-[#1b1423] text-white rounded-lg shadow-2xl w-full max-w-[400px] p-6">
              <h2 className="text-xl font-semibold mb-4">Confirm School Year</h2>
              <p className="mb-4">
                Are you sure you want to add the school year from{' '}
                <strong className="text-blue-400">{startDate ? format(startDate, 'PP') : ''}</strong>{' '}
                to <strong className="text-blue-400">{endDate ? format(endDate, 'PP') : ''}</strong>?
              </p>
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for dark-themed date range calendar */}
      <style jsx global>{`
        // .dark-calendar .rdrMonthAndYearWrapper {
        //   background-color: #1b1423;
        //   color: white;
        // }
        // .dark-calendar .rdrMonthAndYearPickers select {
        //   background-color: #1b1423;
        //   color: white;
        // }
        .dark-calendar .rdrDayNumber {
          color: white;
        }
        .dark-calendar .rdrDayToday .rdrDayNumber {
          color: #3b82f6;
        }
        .dark-calendar .rdrDayInPreview {
          background-color: rgba(59, 130, 246, 0.2);
        }
        .dark-calendar .rdrSelected,
        .dark-calendar .rdrInRange {
          background-color: #3b82f6;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default AddSchoolYearModal;
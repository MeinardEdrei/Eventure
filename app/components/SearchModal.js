"use client";

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const handleOpenSearch = () => setIsOpen(true);
  const handleCloseSearch = () => {
    setIsOpen(false);
    setSearchResults([]);
    setSearchQuery('');
    setError(null);
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() !== '') {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`http://localhost:5000/api/event/search`, {
          params: { query }
        });

        setSearchResults(response.data);
      } catch (error) {
        console.log('Search error:', error);
        
        if (error.response?.status === 404) {
          setSearchResults([]);
          setError('No events found');
        } else {
          setError('An error occurred while searching');
        }
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
      setSearchQuery('');
      setError(null);
    }
  };

  return (
    <>
      <div 
        className="search-icon-container group relative cursor-pointer"
        onClick={handleOpenSearch}
      >
        <FontAwesomeIcon
          icon={faSearch}
          className="text-lg text-gray-400 group-hover:text-white transition-colors duration-300"
        />
        <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-[#0E0E0E] text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Search
        </span>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
          <div className="bg-[#0E0E0E] w-[90%] max-w-2xl rounded-2xl p-6 relative">
            <button 
              onClick={handleCloseSearch}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <FontAwesomeIcon icon={faTimes} className="text-2xl" />
            </button>

            <div className="flex items-center border-b border-white/30 pb-4">
              <FontAwesomeIcon 
                icon={faSearch} 
                className="text-white mr-4" 
              />
              <input 
                type="text"
                placeholder="Search and find what resonates..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-transparent text-white outline-none text-xl placeholder-gray-500"
              />
            </div>

            {/* Search Results Section */}
            <div className="mt-6">
              {loading ? (
                <p className="text-white">Searching...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : searchResults.length > 0 ? (
                <div>
                  <h3 className="text-white text-lg mb-4">Search Results</h3>
                  <div className="space-y-4">
                    {searchResults.map((event) => (
                      <div 
                        key={event.id} 
                        className="bg-[#1b1b1b] text-white p-4 rounded-lg hover:bg-[#242324] transition-colors duration-300"
                      >
                        <h4 className="font-bold">{event.title}</h4>
                        <p className="text-gray-400">{event.location}</p>
                        <p className="text-sm">
                          {new Date(event.dateStart).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : searchQuery.trim() !== '' ? (
                <p className="text-white">No events found</p>
              ) : (
                <div>
                  {/* SET ASIDE FOR NOW */}
                  {/* <h3 className="text-white text-lg mb-4">Popular Searches</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {['Tech Conferences', 'Music Festivals', 'Workshops'].map((item) => (
                      <button 
                        key={item}
                        className="bg-[#1b1b1b] text-white px-4 py-2 rounded-lg hover:bg-[#242324] transition-colors duration-300"
                      >
                        {item}
                      </button>
                    ))}
                  </div> */}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
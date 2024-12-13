"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export default function SearchModal() {
  const {data:session} = useSession();
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

  const [searchResultsWithEventsCount, setSearchResultsWithEventsCount] = useState([]);

  useEffect(() => {
    const fetchEventsCount = async (results) => {
      console.log(results)
      const resultsWithEventsCount = await Promise.all(results.map(async (result) => {
        if (result?.role === "Student") {
          const response = await fetchAttendedEvents(result.id);
          return { ...result, attendedEventsCount: response };
        } else {
          const response = await fetchCreatedEvents(result.id);
          return { ...result, createdEventsCount: response };
        }
      }));
      setSearchResultsWithEventsCount(resultsWithEventsCount);
    };

    if (searchResults.length > 0) {
      fetchEventsCount(searchResults);
    }
  }, [searchResults]);

  // HANDLE API EVENTS
  const fetchAttendedEvents = async (id) => {
      const response = await axios.get(`http://localhost:5000/api/user/userAttendedEvents/${id}`);
      return response.data.length;
  };
  const fetchCreatedEvents = async (id) => {
      const response = await axios.get(`http://localhost:5000/api/user/userCreatedEvents/${id}`);
      return response.data.length;
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() !== '') {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        
        if (session?.user?.role === "Student" || !session) {
          response = await axios.get(`http://localhost:5000/api/event/search-all`, {
            params: { query }
          });
        } else if (session?.user?.role === "Organizer") {
          response = await axios.get(`http://localhost:5000/api/event/search-for-organizer`, {
            params: { query }
          });
        } 

        setSearchResults(response?.data || []);
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
                autoFocus={true}
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
              ) : searchResultsWithEventsCount !== null && searchResultsWithEventsCount.length > 0 ? (
                <div>
                  <h3 className="text-white text-lg mb-4">Search Results</h3>
                  <div className="space-y-4">
                    {searchResultsWithEventsCount.map((result, index) => (
                      <div 
                        key={index} 
                        className="bg-[#1b1b1b] text-white p-4 rounded-lg hover:bg-[#242324] transition-colors duration-300"
                      >
                        {result.type === 'Event' ? (
                          <>
                          <h4 className="font-bold">{result.title}</h4>
                          <p className="text-gray-400">{result.location}</p>
                          <p className="text-sm">
                            {new Date(result.dateStart).toLocaleDateString()}
                          </p>
                          </>
                        ) : result.type === 'User' ? (
                          <>
                            <div className="flex items-center space-x-4">
                              {result.profile_Image ? (
                                <img 
                                  src={`http://localhost:5000/api/event/uploads/${result.profile_Image}`} 
                                  alt={result.username} 
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                                  <span className="text-white">
                                    {result.username?.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-bold">{result.username}</h4>
                                  <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">{result.role}</span>
                                </div>
                                <p className="text-gray-400">
                                  {result.department || 'No department'}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 flex justify-end text-sm text-gray-500">
                              {result?.role === "Student" ? (
                                <span>Attended Events: {result.attendedEventsCount}</span>
                              ) : (
                                <span>Created Events: {result.createdEventsCount}</span>
                              )}
                            </div>
                          </>
                        ) : (<></>)}
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
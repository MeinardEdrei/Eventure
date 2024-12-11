'use client';
import { useEffect, useState, useRef } from 'react';
import '../css/newUserProfile.css';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import AttendedEvents from './AttendedEvents';
import CreatedEvents from './CreatedEvents';

function Profile() {
  const {data: session} = useSession();
  const [activeView, setActiveView] = useState('upcoming'); // Default to 'upcoming'
  const [isEditModalOpen, setEditModalOpen] = useState(false); // Modal visibility state
  const [user, setUser] = useState([]);
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [username, setUsername] = useState('');
  const fileInputRef = useRef(null);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // HANDLE PROFILE UPDATE 
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    
    formData.append('username', username || user.username);

    if (selectedImage) {
      formData.append('profileImage', selectedImage);
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/user/${session.user.id}/update-profile`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setUser(prevUser => ({
        ...prevUser,
        ...(response.data.profile_Image && { profile_Image: response.data.profile_Image }),
        username: response.data.username
      }));

      toggleEditModal();
      setSelectedImage(null);
      setPreviewImage(null);
    } catch (error) {
      console.error('Profile update error:', error);
      if (error.response && error.response.data) {
        alert(error.response.data.message || 'Failed to update profile');
      } else {
        alert('Failed to update profile');
      }
    }
  };

  // Trigger file input when image is clicked
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/${session?.user?.id}/get-user`);
        setUser(response.data);
        setUsername(response.data.username);
      } catch (error) {
        console.log(error);
      }
    }

    if (session) fetchUser();
  }, [session])

  // HANDLE API
  useEffect(() => {
    const fetchAttendedEvents = async () => {
        const response = await axios.get(`http://localhost:5000/api/user/userAttendedEvents/${session.user.id}`);
        setAttendedEvents(response.data);
        console.log(attendedEvents.length);
    };
    const fetchCreatedEvents = async () => {
        const response = await axios.get(`http://localhost:5000/api/user/userCreatedEvents/${session.user.id}`);
        setCreatedEvents(response.data);
        console.log(attendedEvents.length)
    };
    if (session?.user?.role === "Student") {
      fetchAttendedEvents();
    } else if (session?.user?.role === "Organizer") {
      fetchCreatedEvents();
    }
  }, [session]);

  // Function to handle view change
  const handleViewChange = (view) => {
    setActiveView(view);
  };

  // Function to toggle the modal
  const toggleEditModal = () => {
    setEditModalOpen(!isEditModalOpen);
  };

  return (
    <>
      <div className="newProfileBody">
        <div className="newProfileContainer">
          <div className="newProfileHeader">
            <img src="fwvsdv.jpg" alt="" />
          </div>

          <div className="newProfileInformation">
            {user.profile_Image ? (
              <img className='object-cover' src={`http://localhost:5000/api/event/uploads/${user.profile_Image}`} alt="" />
            ) : (
              <img src="profile.png" alt="No User Image" />
            )}
            <div className="newProfileDetails">
              <h1>{user.username}</h1>
              {session?.user?.role === "Student" ? (
                <p>Attended Events: {attendedEvents.length}</p>
              ) : (
                <p>Created Events: {createdEvents.length}</p>
              )}
            </div>
            <div className="newProfileEdit">
              <button onClick={toggleEditModal}>Edit Profile</button>
            </div>
          </div>

          <hr />

          <div className="newEventFunctions">
            <h1>Events</h1>
            <div className="newEventButtons">
              <button
                className={activeView === 'upcoming' ? 'active' : ''}
                onClick={() => handleViewChange('upcoming')}
              >
                Upcoming
              </button>
              <button
                className={activeView === 'ongoing' ? 'active' : ''}
                onClick={() => handleViewChange('ongoing')}
              >
                Ongoing
              </button>
              <button
                className={activeView === 'past' ? 'active' : ''}
                onClick={() => handleViewChange('past')}
              >
                Attended
              </button>
            </div>
          </div>

          <div className="newEventContent">
            {session?.user?.role === "Student" ? (
              <AttendedEvents 
                attendedEvents={attendedEvents}
                activeView={activeView}
              />
            ) : (
              <CreatedEvents 
                createdEvents={createdEvents}
                activeView={activeView}
              />
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="userModal">
          <div className="editModal">
            <h2>Edit Profile</h2>
            <hr />
            <form onSubmit={handleProfileUpdate}>
              <div className="profile-image-upload">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <div 
                  className="profile-image-container" 
                  onClick={triggerFileInput}
                >
                  <img 
                    src={
                      previewImage || 
                      (user.profile_Image 
                        ? `http://localhost:5000/api/event/uploads/${user.profile_Image}` 
                        : "profile.png")
                    } 
                    alt="Profile" 
                    className="profile-image"
                  />
                  <div className="overlay">
                    <span>Change Image</span>
                  </div>
                </div>
              </div>

              <label>
                Username
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>

              <div className="editProfileButtonModal">
                <button 
                  type="button" 
                  onClick={toggleEditModal}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
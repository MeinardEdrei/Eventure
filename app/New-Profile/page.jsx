'use client';
import { useState } from 'react';
import '../css/newUserProfile.css';

function NewProfile() {
  const [activeView, setActiveView] = useState('upcoming'); // Default to 'upcoming'
  const [isEditModalOpen, setEditModalOpen] = useState(false); // Modal visibility state

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
            <img src="heronsNight.jpg" alt="" />
          </div>

          <div className="newProfileInformation">
            <img src="user.jpg" alt="" />
            <div className="newProfileDetails">
              <h1>Jayson Huub Partido</h1>
              <p>Attended Events: 25</p>
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
                className={activeView === 'past' ? 'active' : ''}
                onClick={() => handleViewChange('past')}
              >
                Past
              </button>
            </div>
          </div>

          <div className="newEventContent">
            {activeView === 'upcoming' ? (
              <>
                <div className="newEventDisplay">
                  <img src="heronsNight.jpg" alt="" />
                  <div className="newEventContentDetails">
                    <h1>Herons Night</h1>
                    <p>UMak Volleyball Court</p>
                    <p>December 25, 2024</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="newEventDisplay">
                  <img src="heronsNight.jpg" alt="" />
                  <div className="newEventContentDetails">
                    <h1>Event Name</h1>
                    <p>Event Location</p>
                    <p>Event Date</p>
                  </div>
                </div>
              </>
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
            <form>
              <label>
                Username
                <input type="text" defaultValue="Jayson Huub Partido" />
              </label>
              <label>
                Profile Picture:
                <input type="file"/>
              </label>
              {/* <label>
                Background Picture:
                <input type="file"/>
              </label> */}
              <div className="editProfileButtonModal">
                <button type="button" onClick={toggleEditModal}>
                  Cancel
                </button>
                <button type="button" onClick={toggleEditModal}>
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

export default NewProfile;

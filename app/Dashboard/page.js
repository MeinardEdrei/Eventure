import React from 'react'
import "../css/dashboard.css";

function AdminDashboard() {
  return (
    <div className='dashboard-container'>
      <div className='dashboard-subcontainer'>
        <div className='overview-text'>
          {/* General Overview */}
          <h1>General Overview</h1>
          <p>A centralized dashboard providing a comprehensive view of event activities and system management.</p>
        </div>

        <div className='information-summary'>
          {/* Events Summary */}
          <div className='event-summary-container'>
            <div className='event-summary-text'>
              <h2>Events Summary</h2>
            </div>
            <div className='event-status'>
              <div className='summary pending'>
                <h3>Pending</h3>
                <span>0</span>
              </div>
              <div className='summary withhold'>
                <h3>Withhold</h3>
                <span>0</span>
              </div>
              <div className='summary pre-approved'>
                <h3>Pre-Approved</h3>
                <span>0</span>
              </div>
              <div className='summary approved'>
                <h3>Approved</h3>
                <span>0</span>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className='additional-info-container'>
            <div className='additional-info-text'>
              <h2>Additional Information</h2>
            </div>
            <div className='activities-container'>
              <div className='additional created'>
                <h3>Created</h3>
                <span>0</span>
              </div>
              <div className='additional upcoming'>
                <h3>Upcoming</h3>
                <span>0</span>
              </div>
              <div className='additional organizations'>
                <h3>Organizations</h3>
                <span>0</span>
              </div>
            </div>
          </div>
          <div className='additional-info'></div>
        </div>
        
        {/* Statistics */}
        <div className='activity-overview'>
          <div className='date-picker'>
            <h2>Statistics</h2>
            <div>
              <input type="date" className="statistics-date" />
            </div>
          </div>
          <div className='graph-container'>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
            <div className='graph'></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

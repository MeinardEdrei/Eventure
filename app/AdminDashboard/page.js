"use client";

import React, { useEffect, useState } from 'react'
import "../css/dashboard.css";
import axios from 'axios';
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale,  LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

function AdminDashboard() {
  const [statusCounts, setStatusCounts] = useState([]);
  const [upcomingCounts, setUpcomingCounts] = useState([]);
  const [activeCounts, setActiveCounts] = useState([]);
  const [eventsCounts, setEventCounts] = useState([]);
  const [onCampusCounts, setOnCampusCounts] = useState([]);
  const [offCampusCounts, setOffCampusCounts] = useState([]);

  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        const [statusResponse, upcomingResponse, activeResponse, eventResponse, onCampusResponse, offCampusResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/admindashboard/status'),
          axios.get('http://localhost:5000/api/admindashboard/upcoming'),
          axios.get('http://localhost:5000/api/admindashboard/active'),
          axios.get('http://localhost:5000/api/admindashboard/event'),
          axios.get('http://localhost:5000/api/admindashboard/on-campus'),
          axios.get('http://localhost:5000/api/admindashboard/off-campus'),
        ]);

        setStatusCounts(statusResponse.data);
        setUpcomingCounts(upcomingResponse.data);
        setActiveCounts(activeResponse.data);
        setEventCounts(eventResponse.data);
        setOnCampusCounts(onCampusResponse.data);
        setOffCampusCounts(offCampusResponse.data);
      } catch (error) {
        console.error('Error fetching status counts:', error);
      }
    };

    fetchStatusCounts();
  }, []);

  const exportPdf = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/adminreport/export`, 
        { responseType: 'blob' }
      );

      // Create a Blob URL for the PDF response and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      // Create a link element to trigger a download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', "EventReport.pdf");
      document.body.appendChild(link);

      link.click(); 
      link.remove(); 

      // Revoke the URL after the download starts
      window.URL.revokeObjectURL(url);
    } catch(error) {
      console.log(error);
    }
  }

  // Mock data
  const data = {
    labels: [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ], // Months of the year
    datasets: [
      {
        label: "Events",
        data: eventsCounts,
        backgroundColor: "rgba(219,183,254,255)", 
        borderColor: "rgba(219,183,254,255)", 
        borderWidth: 1, 
        tension: 0.4, 
        fill: true, 
      },
      {
        label: "In Campus",
        data: onCampusCounts, 
        backgroundColor: "rgba(54, 162, 235, 0.2)", 
        borderColor: "rgba(54, 162, 235, 1)", 
        borderWidth: 1,
        tension: 0.4,
        fill: true,
      },
      {
        label: "Off Campus",
        data: offCampusCounts, 
        backgroundColor: "rgba(255, 159, 64, 0.2)", 
        borderColor: "rgba(255, 159, 64, 1)", 
        borderWidth: 1,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "end", 
      },
    },
    scales: {
      y: {
        beginAtZero: true, 
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', 
        },
      },
      x: {
        grid: {
          display: false, 
        },
        ticks: {
          font: {
            size: 9, 
          }
        },
      }
    },
  };

  const DashboardCard = ({ label, count, icon1, icon2 }) => (
    <div className={`events-summary ${label.toLowerCase()}`}>
      <div className="components">
        {icon1}
        {icon2}
      </div>
      <h2>{count}</h2>
      <p className="text">{label} Events</p>
    </div>
  );

  const eventCounts = [
    { label: 'Pending', icon1: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-clock" viewBox="0 0 16 16"><path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/></svg>, icon2: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg> },
    { label: 'Pre-Approved', icon1: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/></svg>, icon2: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg> },
    { label: 'Approved', icon1: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>, icon2: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg> },
    { label: 'Modified', icon1: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/></svg>, icon2: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg> },
    { label: 'Disapproved', icon1: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/></svg>, icon2: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg> },
  ];

  return (
    <div className='dashboard-container'>
      <div className='dashboard-subcontainer'>
        {/* Greetings */}
        <div className='greetings'>
          <h1>Good day, Admin!</h1>
        </div>

        {/* Events Summary */}
        <div className="events-summary-container">

          {eventCounts.map((event, index) => (
            <DashboardCard key={index} label={event.label} count={statusCounts[index]} icon1={event.icon1} icon2={event.icon2} />
          ))}
        </div>
        

        {/* Statistics */}
        <div className='statistics-container'>
          <div className='additionals'>
            <div className='events-summary upcoming-events'>
              <h3>Upcoming Events</h3>
              <h2>{upcomingCounts}</h2>
            </div>
            <div className='events-summary active-organizations'>
              <div className='components'>
                <h3>Active Organizations</h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-add" viewBox="0 0 16 16">
                  <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                  <path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
                </svg>
              </div>
              <h2>{activeCounts}</h2>
            </div>
          </div>
          <div className='events-overview'>
            <div className='export'>
              <h3>Events Overview</h3>
              <button onClick={() => exportPdf()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-download" viewBox="0 0 16 16">
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
                </svg>
              </button>
            </div>
            <div className="statistics">
              <Line data={data} options={options} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

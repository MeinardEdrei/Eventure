"use client";

import React, { useCallback, useEffect, useState } from 'react'
import "../css/dashboard.css";
import axios from 'axios';
import AddSchoolYearModal from "./app/AdminDashboard/AddSchoolYearModal";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale,  LinearScale, LineElement, BarElement, PointElement, Title, Tooltip, Legend);

function AdminDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schoolYear, setSchoolYear] = useState([]);
  const [semester, setSemester] = useState("");
  const [department, setDepartment] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [adminData, setAdminData] = useState({
    eventStatus: [],
    eventsCount: [],
    onCampusCounts: [],
    offCampusCounts: [],
  });

  const refreshData = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, [])


  // DASHBOARD DATA
  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        const adminDataResponse = await axios.get('http://localhost:5000/api/admindashboard/admin-data');
      
        setAdminData(adminDataResponse.data);
        alert(JSON.stringify(adminDataResponse.data)); // See the full object structure

        // Default
        setSchoolYear("2023-2024"); 
        setSemester("1st-2nd sem");
      } catch (error) {
        console.error('Error fetching status counts:', error);
      }
    };

    fetchStatusCounts();
  }, []);

  // REPORT GENERATION
  const exportPdf = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/adminreport/export`, 
        { responseType: 'blob' }
      );
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', "EventReport.pdf");
      document.body.appendChild(link);

      link.click(); 
      link.remove(); 

      window.URL.revokeObjectURL(url);
    } catch(error) {
      console.log(error);
    }
  }

  // Function to send the selected values to the backend
  const sendType = async (dropdownValues) => {
    try {
      const response = await axios.post('http://localhost:5000/api/admindashboard/type', dropdownValues);
      setSchoolYear(response.data.SchoolYear);
      setSemester(response.data.Semester);
      setDepartment(response.data.Department);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        console.error('Validation Errors:', error.response.data.errors);
        console.error('Full error response:', error.response.data);
      } else {
        console.error('Error submitting data:', error);
      }
    }
  };

   // Handlers for each dropdown
   const handleSchoolYearChange = (e) => {
    setSchoolYear(e.target.value);
    sendType({ schoolYear: e.target.value, semester, department });
  };

  const handleSemesterChange = (e) => {
    const value = e.target.value;
    setSemester(value);
    sendType({ schoolYear, semester: value, department });
  };

  const handleDepartmentChange = (e) => {
    const value = e.target.value;
    setDepartment(value);
    sendType({ schoolYear, semester, department: value });
  };

  // Reorder from August to July
  const filterDataBySemester = (semester, labels, ...dataArrays) => {
    let filteredLabels = [];
    let filteredData = dataArrays.map(() => []);
  
    if (semester === "First") {
      // For 1st semester: August to January
      filteredLabels = labels.slice(7, 12).concat(labels.slice(0, 1)); // August to January
      filteredData = dataArrays.map(dataArray => dataArray.slice(7, 12).concat(dataArray.slice(0, 1)));
    } else if (semester === "Second") {
      // For 2nd semester: January to July
      filteredLabels = labels.slice(0, 7); // January to July
      filteredData = dataArrays.map(dataArray => dataArray.slice(0, 7));
    } else if (semester === "FirstAndSecond") {
      // For 1st - 2nd semester: August to July
      filteredLabels = labels.slice(7).concat(labels.slice(0, 7)); // August to July
      filteredData = dataArrays.map(dataArray => dataArray.slice(7).concat(dataArray.slice(0, 7)));
    }
  
    return { filteredLabels, filteredData };
  };
  
  // Start of Line Chart
  const lineData = (() => {
    const originalLabels = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
  
    // Use the filterDataBySemester function to get the filtered labels and data based on the selected semester
    const { filteredLabels, filteredData } = filterDataBySemester(
      semester, 
      originalLabels, 
      adminData.eventsCount, 
      adminData.onCampusCounts, 
      adminData.offCampusCounts
    );


    return {
      labels: filteredLabels,
      datasets: [
        {
          label: "Events",
          data: filteredData[0],
          backgroundColor: "rgba(219,183,254,255)", 
          borderColor: "rgba(219,183,254,255)", 
          borderWidth: 1, 
          tension: 0.4, 
          fill: true, 
        },
        {
          label: "In Campus",
          data: filteredData[1], 
          backgroundColor: "rgba(54, 162, 235, 0.2)", 
          borderColor: "rgba(54, 162, 235, 1)", 
          borderWidth: 1,
          tension: 0.4,
          fill: true,
        },
        {
          label: "Off Campus",
          data: filteredData[2], 
          backgroundColor: "rgba(255, 159, 64, 0.2)", 
          borderColor: "rgba(255, 159, 64, 1)", 
          borderWidth: 1,
          tension: 0.4,
          fill: true,
        },
      ],
    };
  })();

  const lineOptions = {
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
  // End of Line Chart

  // Start of Bar Chart
  const barData = {
    labels: [""], 
    datasets: [
      {
        data: [adminData.registeredStudents], 
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
  
          if (!chartArea) {
            return null; // Avoid issues when chart is initializing
          }
  
          const gradient = ctx.createLinearGradient(
            0, chartArea.bottom, // Start at bottom
            0, chartArea.top    // End at top
          );
          gradient.addColorStop(0.05, "rgba(250, 253, 255, 1)");  
          gradient.addColorStop(0.25, "rgba(192, 214, 250, 1)"); 
          gradient.addColorStop(0.5, "rgba(225, 211, 250, 1)");  
          gradient.addColorStop(0.75, "rgba(196, 232, 166, 1)"); 
          gradient.addColorStop(0.95, "rgba(250, 236, 183, 1)");   
  
          return gradient;
        },
        borderWidth: 1,
        borderRadius: 10,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Simplify display for smaller chart
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const DashboardCard = ({ label, count, icon1, icon2 }) => (
    <div className={`events-summary ${label.toLowerCase()}`}>
      <div className="components">
        {icon1}
      </div>
      <div className='events-summary-label'>
        <p className="text">{label}</p>
        <h2>{count}</h2>
      </div>
    </div>
  );
  // End of Bar Chart

  // For conciseness
  const eventCounts = [
    { label: 'Pending', icon1: <svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" fill="currentColor" className="bi bi-clock" viewBox="0 0 16 16"><path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/></svg>, icon2: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg> },
    { label: 'Pre-Approved', icon1: <svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/></svg>, icon2: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg> },
    { label: 'Approved', icon1: <svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>, icon2: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg> },
    { label: 'Modified', icon1: <svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/></svg>, icon2: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg> },
    { label: 'Disapproved', icon1: <svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/></svg>, icon2: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg> },
  ];

  return (
    <div className='dashboard-container'>
      <div className='dashboard-subcontainer'>
        
        {/* Dashboard Text & Dropdowns */}
        <div className='dashboard-text'>
          <h1>School Year {schoolYear} {semester} {department}</h1>
          <div className='dashboard-type'>
            <div className='export-sy'>
              <div className='type'></div>
              <div className='type'></div>
              <div className='type add-school-year' onClick={() => setIsModalOpen(true)}>
                <button>
                  School Year 
                </button>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                </svg>
              </div>
            </div>
            <div className='dashboard-type-dropdown'>
              <select id="school-year" name="school-year" className='type school-year' onChange={handleSchoolYearChange}>
                <option value="2024-2025">2024-2025</option>
                <option value="2023-2024">2023-2024</option>
                <option value="2022-2023">2022-2023</option>
              </select>
              <select id="semester" name="semester" className='type semester' onChange={handleSemesterChange}>
                <option value="FirstAndSecond">1st - 2nd</option>
                <option value="First">1st sem</option>
                <option value="Second">2nd sem</option>
              </select>
              <select id="department" name="department" className='type department' onChange={handleDepartmentChange}>
                <option value="All">All</option>
                <option value="CCIS">CCIS</option>
                <option value="CLAS">CLAS</option>
                <option value="CBFAS">CBFS</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Statuses */}
        {eventCounts.map((event, index) => (
          <DashboardCard key={index} label={event.label} count={adminData.eventStatus[index]} icon1={event.icon1} icon2={event.icon2} />
        ))}  

        {/* Event Overview */}
        <div className='events-chart'>
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
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>

        {/* Registered Students */}
        <div className='registered-students'>
          <div className='registered-students-text'>
            <h3>Registered Students</h3>
            <h2>{adminData.registeredStudents}</h2>
          </div>
          <div className='barStats'>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
        
        {/* Upcoming Events */}
        <div className='events-summary upcoming-events'>
          <h3>Upcoming Events</h3>
          <h2>{adminData.upcomingEvents}</h2>
        </div>

        {/* Active Organizations */}
        <div className='events-summary active-organizations'>
          <div className='components'>
            <h3>Active Organizations</h3>
          </div>
          <h2>{adminData.activeCounts}</h2>
        </div>

        {/* Quick Links */}
        <div className='events-summary quick-links'>
          <h3>Quick Links</h3>
          <div className='quick-icons'>
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-calendar2" viewBox="0 0 16 16">
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"/>
                <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5z"/>
              </svg>
            </button>
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-person-fill-add" viewBox="0 0 16 16">
                <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
              </svg>
            </button>
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-calendar-plus" viewBox="0 0 16 16">
                <path d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7"/>
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <AddSchoolYearModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refreshData}
      />
    </div>
  )
}

export default AdminDashboard

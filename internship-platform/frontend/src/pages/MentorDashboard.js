import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/MentorDashboard.css';
import axios from 'axios';

const MentorDashboard = () => {
  const [user, setUser] = useState(null);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('internships');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // Fetch data for the logged-in mentor
    const fetchData = async () => {
      try {
        // Get auth token for API requests
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        
        // Base API URL with fallback
        const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        
        // Get all data in parallel for better performance
        // IMPORTANT: Updated endpoints to match backend implementation
        const [internshipsRes, applicationsRes, tasksRes] = await Promise.all([
          // Updated to use the correct endpoint that matches your backend
          axios.get(`${apiBaseUrl}/api/internships/mentor`, config),
          axios.get(`${apiBaseUrl}/api/applications/mentor`, config).catch(err => ({ data: [] })),
          axios.get(`${apiBaseUrl}/api/tasks/mentor`, config).catch(err => ({ data: [] }))
        ]);

        console.log('Internships response:', internshipsRes);
        
        // Set state with the fetched data
        setInternships(internshipsRes.data);
        setApplications(applicationsRes.data);
        setTasks(tasksRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        // If there's an authentication error, redirect to login
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          navigate('/login');
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return <div className="loading-spinner">Loading mentor dashboard...</div>;
  }

  return (
    <div className="mentor-dashboard-page">
      <div className="mentor-dashboard-header">
        <h1>Mentor Dashboard</h1>
        <p>Welcome back, {user?.name || 'Mentor'}!</p>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'internships' ? 'active' : ''}`}
          onClick={() => handleTabChange('internships')}
        >
          My Internships
        </button>
        <button
          className={`tab-button ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => handleTabChange('applications')}
        >
          Applications
        </button>
        <button
          className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => handleTabChange('tasks')}
        >
          Tasks
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'internships' && (
          <div className="internships-section">
            <div className="section-header">
              <Link to="/CreateInternship" className="btn btn-primary">Create New Internship</Link>
            </div>
            
            {internships.length > 0 ? (
              <div className="internship-list">
                {internships.map((internship) => (
                  <div key={internship._id} className="internship-item">
                    <div className="internship-details">
                      <h3>{internship.title}</h3>
                      <p>{internship.company} • {internship.location}</p>
                      <div className="internship-meta">
                        <span className={`internship-status status-${internship.status}`}>
                          {internship.status.charAt(0).toUpperCase() + internship.status.slice(1)}
                        </span>
                        <span className="applications-count">
                          {internship.applicationsCount || 0} Application(s)
                        </span>
                      </div>
                    </div>
                    <div className="internship-actions">
                      <Link to={`/internships/${internship._id}`} className="btn btn-sm btn-secondary">
                        View Details
                      </Link>
                      <Link to={`/internships/${internship._id}/edit`} className="btn btn-sm">
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>You haven't created any internships yet.</p>
                <Link to="/CreateInternship" className="btn btn-primary">
                  Create Your First Internship
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="applications-section">
            <div className="section-header">
              <h2>Applications</h2>
              <div className="filter-controls">
                <select className="filter-select">
                  <option value="all">All Applications</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            
            {applications.length > 0 ? (
              <div className="application-list">
                {applications.map((application) => (
                  <div key={application._id} className="application-item">
                    <div className="application-details">
                      <h3>{application.student?.name || 'Unknown Student'}</h3>
                      <p>Applied for: {application.internship?.title || 'Unknown Internship'}</p>
                      <div className="application-meta">
                        <span className="application-date">
                          Applied on {new Date(application.createdAt).toLocaleDateString()}
                        </span>
                        <span className={`application-status status-${application.status}`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="application-actions">
                      <Link to={`/applications/${application._id}`} className="btn btn-sm btn-primary">
                        Review
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No applications received yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="tasks-section">
            <div className="section-header">
              <Link to="/tasks/create" className="btn btn-primary">
                Create New Task
              </Link>
            </div>
            
            {tasks.length > 0 ? (
              <div className="task-list">
                {tasks.map((task) => (
                  <div key={task._id} className="task-item">
                    <div className="task-details">
                      <h3>{task.title}</h3>
                      <p>Assigned to: {task.student?.name || 'Unknown'} • {task.internship?.title || 'Unknown'}</p>
                      <div className="task-meta">
                        <span className="task-deadline">
                          Due: {new Date(task.deadline).toLocaleDateString()}
                        </span>
                        <span className={`task-status status-${task.status}`}>
                          {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className="task-actions">
                      <Link to={`/tasks/${task._id}`} className="btn btn-sm btn-primary">
                        {task.status === 'submitted' ? 'Review Submission' : 'View Details'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No tasks assigned yet.</p>
                <Link to="/tasks/create" className="btn btn-primary">
                  Create Your First Task
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorDashboard;
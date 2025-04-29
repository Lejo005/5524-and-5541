import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';

// Set default base URL for axios
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const checkAuthAndFetchData = async () => {
      try {
        // Try to get user from localStorage
        const userString = localStorage.getItem('user');
        const tokenString = localStorage.getItem('token');
        
        if (!userString && !tokenString) {
          navigate('/login');
          return;
        }

        let currentUser;
        let token;

        if (userString) {
          try {
            currentUser = JSON.parse(userString);
            setUser(currentUser);
          } catch (e) {
            console.error("Error parsing user data:", e);
          }
        }

        // Get token - could be from user object or directly stored
        token = tokenString || currentUser?.token;
        
        if (!token) {
          setError('Authentication token not found. Please login again.');
          setLoading(false);
          return;
        }

        // Set up auth header for all requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Get user ID
        let userId;
        if (currentUser && (currentUser.id || currentUser._id)) {
          userId = currentUser.id || currentUser._id;
        } else {
          // If we don't have user ID but have token, try to get current user
          const userResponse = await axios.get('/api/auth');
          currentUser = userResponse.data;
          setUser(currentUser);
          userId = currentUser._id || currentUser.id;
        }

        if (!userId) {
          throw new Error('User ID not available');
        }

        // Now fetch applications and tasks
        try {
          const applicationsResponse = await axios.get(`/api/applications/student/${userId}`);
          setApplications(applicationsResponse.data || []);
          
          // If you have a tasks endpoint, uncomment this:
          try {
            const tasksResponse = await axios.get(`/api/tasks/student/${userId}`);
            setTasks(tasksResponse.data || []);
          } catch (taskErr) {
            console.warn('Could not fetch tasks:', taskErr);
            // Don't fail if tasks can't be fetched
            setTasks([]);
          }
          
          setLoading(false);
        } catch (dataErr) {
          console.error('Error fetching data:', dataErr);
          if (dataErr.response && dataErr.response.status === 404) {
            setError('API endpoint not found. Please check your server configuration.');
          } else {
            setError(dataErr.response?.data?.message || dataErr.message || 'Error fetching data');
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Authentication error:', err);
        setError('Authentication failed. Please login again.');
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [navigate]);

  // Function to handle retry
  const handleRetry = () => {
    setLoading(true);
    setError('');
    window.location.reload();
  };

  if (loading) {
    return <div className="loading-spinner">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={handleRetry} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <p>Welcome back, {user?.name || 'Student'}!</p>
        
        {location.state?.success && (
          <div className="alert alert-success">{location.state.success}</div>
        )}
      </div>

      <div className="dashboard-sections">
        <section className="dashboard-section">
          <div className="section-header">
            <h2>My Applications</h2>
            <Link to="/internships" className="btn btn-sm">
              Browse More Internships
            </Link>
          </div>
          
          {applications && applications.length > 0 ? (
            <div className="application-list">
              {applications.map((application) => (
                <div key={application._id} className="application-item">
                  <div className="application-details">
                    <h3>{application.internship?.title || 'Untitled Internship'}</h3>
                    <p>{application.internship?.company || 'Unknown Company'}</p>
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
                    {application.internship?._id && (
                      <Link to={`/TaskDetail/${application.internship._id}`} className="btn btn-sm btn-secondary">
                        View Internship
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>You haven't applied to any internships yet.</p>
              <Link to="/internships" className="btn btn-primary">
                Browse Internships
              </Link>
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h2>My Tasks</h2>
            <Link to="/TaskDetail" className="btn btn-sm">
              View All Tasks
            </Link>
          </div>
          
          {tasks && tasks.length > 0 ? (
            <div className="task-list">
              {tasks.map((task) => (
                <div key={task._id} className="task-item">
                  <div className="task-details">
                    <h3>{task.title}</h3>
                    <p>{task.internship?.title || 'Untitled Internship'} at {task.internship?.company || 'Unknown Company'}</p>
                    <div className="task-meta">
                      <span className="task-deadline">
                        Due: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                      </span>
                      <span className={`task-status status-${task.status}`}>
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="task-actions">
                    <Link to={`/tasks/${task._id}`} className="btn btn-sm btn-primary">
                      {task.status === 'submitted' ? 'View Submission' : 'Work on Task'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>You don't have any assigned tasks yet.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/TaskList.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }

    // This would be replaced with a call to your backend API
    const fetchTasks = async () => {
      // Simulate API call
      setTimeout(() => {
        const dummyTasks = [
          {
            _id: '1',
            title: 'Create a Responsive Landing Page',
            description: 'Design and implement a responsive landing page using HTML, CSS, and JavaScript.',
            internship: {
              _id: '101',
              title: 'Frontend Developer Intern',
              company: 'TechCorp'
            },
            deadline: '2025-05-10T00:00:00.000Z',
            status: 'in-progress',
            createdAt: '2025-04-01T00:00:00.000Z'
          },
          {
            _id: '2',
            title: 'Implement User Authentication',
            description: 'Implement user authentication functionality using JWT and secure storage.',
            internship: {
              _id: '101',
              title: 'Frontend Developer Intern',
              company: 'TechCorp'
            },
            deadline: '2025-05-15T00:00:00.000Z',
            status: 'assigned',
            createdAt: '2025-04-05T00:00:00.000Z'
          },
          {
            _id: '3',
            title: 'Develop API Integration',
            description: 'Integrate the frontend application with the backend REST API.',
            internship: {
              _id: '101',
              title: 'Frontend Developer Intern',
              company: 'TechCorp'
            },
            deadline: '2025-05-20T00:00:00.000Z',
            status: 'assigned',
            createdAt: '2025-04-10T00:00:00.000Z'
          },
          {
            _id: '4',
            title: 'Create Unit Tests',
            description: 'Write unit tests for the core components using Jest and React Testing Library.',
            internship: {
              _id: '101',
              title: 'Frontend Developer Intern',
              company: 'TechCorp'
            },
            deadline: '2025-05-25T00:00:00.000Z',
            status: 'assigned',
            createdAt: '2025-04-15T00:00:00.000Z'
          },
          {
            _id: '5',
            title: 'Optimize Performance',
            description: 'Analyze and optimize the application performance, focusing on load times and rendering efficiency.',
            internship: {
              _id: '101',
              title: 'Frontend Developer Intern',
              company: 'TechCorp'
            },
            deadline: '2025-05-30T00:00:00.000Z',
            status: 'assigned',
            createdAt: '2025-04-20T00:00:00.000Z'
          }
        ];
        setTasks(dummyTasks);
        setLoading(false);
      }, 1000);
    };

    fetchTasks();
  }, [navigate]);

  const handleFilterChange = e => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const getStatusClass = status => {
    switch (status) {
      case 'assigned':
        return 'status-assigned';
      case 'in-progress':
        return 'status-in-progress';
      case 'submitted':
        return 'status-submitted';
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  };

  const filteredTasks = tasks.filter(task => {
    return (
      task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.status === '' || task.status === filters.status)
    );
  });

  const formatDate = dateString => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="task-list-page">
      <div className="task-header">
        <h1>My Tasks</h1>
        <p>Manage and track your internship tasks</p>
      </div>

      <div className="task-filters">
        <div className="filter-group">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search tasks"
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="assigned">Assigned</option>
            <option value="in-progress">In Progress</option>
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading tasks...</div>
      ) : (
        <div className="task-container">
          {filteredTasks.length > 0 ? (
            <div className="task-list">
              {filteredTasks.map(task => (
                <div key={task._id} className="task-card">
                  <div className="task-card-header">
                    <h3>{task.title}</h3>
                    <span className={`task-status ${getStatusClass(task.status)}`}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                  </div>
                  <div className="task-card-details">
                    <div className="task-card-internship">
                      <i className="fas fa-briefcase"></i>
                      <span>{task.internship.title} - {task.internship.company}</span>
                    </div>
                    <div className="task-card-deadline">
                      <i className="fas fa-clock"></i>
                      <span>Deadline: {formatDate(task.deadline)}</span>
                    </div>
                  </div>
                  <div className="task-card-description">
                    <p>{task.description}</p>
                  </div>
                  <div className="task-card-actions">
                    <Link to={`/tasks/${task._id}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-tasks">
              <p>No tasks found matching your criteria. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskList;
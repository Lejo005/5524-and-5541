import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../../styles/Navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('student');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication status when component mounts or when location changes
  useEffect(() => {
    checkAuthStatus();
  }, [location]);

  // Function to check authentication status
  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setIsLoggedIn(true);
        setUserRole(user.role || 'student');
        setUserName(user.name || '');
      } catch (error) {
        // If JSON parsing fails, clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserRole('student');
    setUserName('');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          VirtualIntern <i className="fas fa-laptop-code"></i>
        </Link>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/internships" className="nav-link">Internships</Link>
          </li>
          
          {isLoggedIn ? (
            <>
              {/* Only show Dashboard link for non-mentor users */}
              {userRole !== 'mentor' && userRole !== 'employer' && (
                <li className="nav-item">
                  <Link to="/dashboard" className="nav-link">Dashboard</Link>
                </li>
              )}
              
              {/* Show Mentor Area for mentors and employers */}
              {(userRole === 'mentor' || userRole === 'employer') && (
                <li className="nav-item">
                  <Link to="/mentor/dashboard" className="nav-link">Mentor Area</Link>
                </li>
              )}
              
              <li className="nav-item">
                <button className="nav-link btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link btn-primary">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
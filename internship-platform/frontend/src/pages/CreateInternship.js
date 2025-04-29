import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/CreateInternship.css';

const CreateInternship = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [tokenStatus, setTokenStatus] = useState('unchecked');
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    deadline: '',
    status: 'open',
    duration: '',
    mentor: ''
  });

  // Configure axios defaults - Apply for all requests
  useEffect(() => {
    // Set up request interceptor
    const interceptor = axios.interceptors.request.use(
      config => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    // Clean up interceptor when component unmounts
    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  // Check if user is logged in and is a mentor
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        navigate('/login');
        return;
      }
      
      try {
        const user = JSON.parse(userStr);
        
        console.log("Current token:", token);
        console.log("Current user:", user);
        
        setTokenStatus('assumed-valid');
        
        if (user.role !== 'mentor' && user.role !== 'employer') {
          navigate('/dashboard');
          return;
        }
        
        // Store current user and set mentor field
        setCurrentUser(user);
        setFormData(prevData => ({
          ...prevData,
          mentor: user._id || user.id // Handle both possible ID formats
        }));
        
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    };

    checkAuthStatus();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    // Create submission data
    const submissionData = {
      ...formData,
      mentor: currentUser?._id || currentUser?.id || formData.mentor
    };

    try {
      // Get token directly before request
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setIsSubmitting(false);
        setTimeout(() => navigate('/login'), 1500);
        return;
      }
      
      console.log('Sending request with token:', token);
      console.log('Submission data:', submissionData);

      // Create API URL with environment variable fallback
      const apiUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/internships`;
      
      // Try setting header directly (don't rely on interceptor)
      const response = await axios({
        method: 'post',
        url: apiUrl,
        data: submissionData,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('API Response:', response);
      
      setSuccess('Internship created successfully!');
      // Reset form data
      setFormData({
        title: '',
        company: '',
        location: '',
        description: '',
        requirements: '',
        responsibilities: '',
        benefits: '',
        deadline: '',
        status: 'open',
        duration: '',
        mentor: currentUser ? (currentUser._id || currentUser.id) : '' // Keep mentor ID
      });
      
      // Redirect to mentor dashboard after 2 seconds
      setTimeout(() => {
        navigate('/mentor/dashboard');
      }, 2000);
      
    } catch (err) {
      console.error("API Error Details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      // Special handling for 401 errors
      if (err.response && err.response.status === 401) {
        setError('Your session has expired. Redirecting to login...');
        
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login', { state: { message: 'Session expired. Please login again.' } });
        }, 1500);
      } else {
        setError(err.response?.data?.message || 'Failed to create internship. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Debug display for token information
  const debugToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return "No token found";
      
      // Only log the first and last few characters of the token for security
      const tokenPreview = `${token.substring(0, 10)}...${token.substring(token.length - 10)}`;
      return `Token found (starts with ${token.substring(0, 10)}...)`;
    } catch (e) {
      return "Error reading token";
    }
  };

  return (
    <div className="create-internship-page">
      <div className="create-internship-container">
        <h1>Create Internship Opportunity</h1>
        <p className="subtitle">Fill in the details to create a new internship opportunity</p>

        {/* Debug info - remove in production */}
        <div style={{ backgroundColor: "#f8f9fa", padding: "10px", marginBottom: "15px", borderRadius: "4px", fontSize: "12px" }}>
          <div><strong>Auth Status:</strong> {tokenStatus}</div>
          <div><strong>Token:</strong> {debugToken()}</div>
          <div><strong>User:</strong> {currentUser ? `${currentUser.name} (${currentUser.role})` : 'Not set'}</div>
          <div><strong>Mentor ID:</strong> {formData.mentor || 'Not set'}</div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="internship-form">
          <div className="form-group">
            <label htmlFor="title">Internship Title*</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Frontend Development Intern"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="company">Company Name*</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your company name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location*</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Remote, On-site, or Hybrid"
                required
              />
            </div>
          </div>

          {/* Added duration field */}
          <div className="form-group">
            <label htmlFor="duration">Duration (weeks/months)*</label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 3 months, 12 weeks"
              required
            />
          </div>

          {/* Hidden mentor field - populated automatically */}
          <input
            type="hidden"
            name="mentor"
            value={formData.mentor}
          />

          <div className="form-group">
            <label htmlFor="description">Description*</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a detailed description of the internship..."
              rows="4"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="requirements">Requirements* (one per line)</label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="List the skills and qualifications required (one per line)..."
              rows="4"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="responsibilities">Responsibilities* (one per line)</label>
            <textarea
              id="responsibilities"
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              placeholder="Outline the key responsibilities and tasks (one per line)..."
              rows="4"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="benefits">Benefits (one per line)</label>
            <textarea
              id="benefits"
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              placeholder="Describe the benefits offered (stipend, mentorship, etc.), one per line..."
              rows="3"
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="deadline">Application Deadline*</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/mentor/dashboard')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Internship'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInternship;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/ApplicationForm.css';

// Set default base URL for axios
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const ApplicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    resume: '',
    coverLetter: '',
    education: '',
    experience: '',
    skills: '',
    availability: '',
    additionalInfo: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in - handle multiple possible storage formats
    const checkAuthentication = () => {
      try {
        // Try different possible user storage methods
        const userString = localStorage.getItem('user');
        const tokenString = localStorage.getItem('token');
        const authString = localStorage.getItem('auth');
        
        if (userString) {
          try {
            // Try to parse as JSON
            const parsedUser = JSON.parse(userString);
            setUser(parsedUser);
            return parsedUser;
          } catch (e) {
            // If not JSON, use as is
            setUser({ id: userString });
            return { id: userString };
          }
        } else if (tokenString) {
          // Some apps store just the token
          setUser({ token: tokenString });
          return { token: tokenString };
        } else if (authString) {
          try {
            const auth = JSON.parse(authString);
            setUser(auth.user || auth);
            return auth.user || auth;
          } catch (e) {
            return null;
          }
        }
        return null;
      } catch (error) {
        console.error("Error checking authentication:", error);
        return null;
      }
    };

    const currentUser = checkAuthentication();
    
    if (!currentUser) {
      setError('User not logged in or user ID not available');
      setLoading(false);
      return;
    }
    
    // Fetch internship data
    const fetchInternship = async () => {
      try {
        const response = await axios.get(`/api/internships/${id}`, {
          timeout: 10000,
          headers: {
            // Include auth token if available
            ...(currentUser.token && { Authorization: `Bearer ${currentUser.token}` }),
            ...(localStorage.getItem('token') && { Authorization: `Bearer ${localStorage.getItem('token')}` })
          }
        });
        
        if (!response.data) {
          throw new Error('Internship not found');
        }
        
        setInternship(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching internship:', err);
        setError(
          err.response?.data?.message || 
          err.message || 
          'Failed to load internship details. Please try again later.'
        );
        setLoading(false);
      }
    };
    
    fetchInternship();
    
    return () => {
      // Cleanup function
    };
  }, [id, navigate]);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      if (!user) {
        throw new Error('User not logged in or user ID not available');
      }
      
      // Determine the user ID based on your data structure
      const userId = user._id || user.id || user.userId;
      
      if (!userId) {
        throw new Error('Cannot find user ID in stored data');
      }
      
      // Create the application data object
      const applicationData = {
        internship: id,
        student: userId,
        resume: formData.resume,
        coverLetter: formData.coverLetter,
        education: formData.education,
        experience: formData.experience,
        skills: formData.skills,
        availability: formData.availability,
        additionalInfo: formData.additionalInfo
      };
      
      // Get auth token if available
      const token = user.token || localStorage.getItem('token');
      
      // Make API call
      const response = await axios.post('/api/applications', applicationData, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });
      
      setSubmitting(false);
      navigate('/dashboard', { state: { success: 'Application submitted successfully!' } });
    } catch (err) {
      console.error('Error submitting application:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Error submitting application. Please try again.'
      );
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading application form...</div>;
  }

  if (error && !internship) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => navigate('/login')} className="btn btn-primary">
            Go to Login
          </button>
          <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{marginLeft: '10px'}}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!internship) {
    return <div className="not-found">Internship not found</div>;
  }

  return (
    <div className="application-form-page">
      <div className="application-header">
        <div className="back-link">
          <Link to={`/internships/${id}`}>
            <i className="fas fa-arrow-left"></i> Back to Internship Details
          </Link>
        </div>
        <h1>Apply for {internship.title}</h1>
        <div className="company-info">
          <span className="company-name">{internship.company}</span>
        </div>
        {internship.deadline && (
          <div className="application-deadline">
            <i className="fas fa-hourglass-end"></i>
            <span>Application Deadline: {new Date(internship.deadline).toLocaleDateString()}</span>
          </div>
        )}
      </div>
      
      <div className="application-form-container">
        {error && <div className="alert alert-danger">{error}</div>}
        <form className="application-form" onSubmit={onSubmit}>
          {/* Form content remains the same */}
          <div className="form-section">
            <h3>Personal Information</h3>
            <p>We'll use the information from your profile. Make sure your profile is up-to-date.</p>
          </div>
          
          <div className="form-section">
            <h3>Resume</h3>
            <div className="form-group">
              <label htmlFor="resume">Paste your resume or provide a link</label>
              <textarea
                id="resume"
                name="resume"
                value={formData.resume}
                onChange={onChange}
                required
                rows="4"
                placeholder="Paste the content of your resume or provide a link to your resume"
              ></textarea>
            </div>
          </div>
          
          {/* Rest of form fields remain the same */}
          <div className="form-section">
            <h3>Cover Letter</h3>
            <div className="form-group">
              <label htmlFor="coverLetter">Why are you interested in this internship?</label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                value={formData.coverLetter}
                onChange={onChange}
                required
                rows="6"
                placeholder="Explain why you're interested in this internship and why you're a good fit for the role"
              ></textarea>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Education</h3>
            <div className="form-group">
              <label htmlFor="education">Your educational background</label>
              <textarea
                id="education"
                name="education"
                value={formData.education}
                onChange={onChange}
                required
                rows="4"
                placeholder="List your relevant education, including institutions, degrees, and dates"
              ></textarea>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Experience</h3>
            <div className="form-group">
              <label htmlFor="experience">Your relevant work experience</label>
              <textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={onChange}
                rows="4"
                placeholder="List your relevant work experience, including companies, positions, and dates"
              ></textarea>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Skills</h3>
            <div className="form-group">
              <label htmlFor="skills">Your relevant skills</label>
              <textarea
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={onChange}
                required
                rows="4"
                placeholder="List your relevant skills and proficiency levels"
              ></textarea>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Availability</h3>
            <div className="form-group">
              <label htmlFor="availability">When can you start and how many hours per week can you commit?</label>
              <textarea
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={onChange}
                required
                rows="2"
                placeholder="Indicate your availability for this internship"
              ></textarea>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Additional Information</h3>
            <div className="form-group">
              <label htmlFor="additionalInfo">Anything else you'd like to share?</label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={onChange}
                rows="4"
                placeholder="Add any additional information that might be relevant to your application"
              ></textarea>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate(`/internships/${id}`)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
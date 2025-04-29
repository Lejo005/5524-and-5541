import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/InternshipDetail.css';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const InternshipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`/api/internships/${id}`, {
          timeout: 10000
        });
        
        if (!response.data) {
          throw new Error('Internship not found');
        }
        
        setInternship(response.data);
      } catch (err) {
        console.error('Fetch internship error:', err);
        setError(
          err.response?.data?.message || 
          err.message || 
          'Failed to load internship details. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInternship();

    return () => {
      axios.CancelToken.source().cancel('Component unmounted');
    };
  }, [id]);

  const handleApply = () => {
    navigate(`/apply/${id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading internship details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Error Loading Internship</h3>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={() => navigate('/internships')} className="btn-back">
              Back to Internships
            </button>
            <button onClick={() => window.location.reload()} className="btn-retry">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="not-found-container">
        <h3>Internship Not Found</h3>
        <p>The internship you're looking for doesn't exist or may have been removed.</p>
        <Link to="/internships" className="btn-back">
          Browse Available Internships
        </Link>
      </div>
    );
  }

  return (
    <div className="internship-detail-container">
      <div className="detail-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <i className="fas fa-arrow-left"></i> Back
        </button>
        
        <div className="header-content">
          <h1>{internship.title}</h1>
          <div className="company-info">
            <span className="company">{internship.company}</span>
            <span className="location">
              <i className="fas fa-map-marker-alt"></i> {internship.location}
            </span>
          </div>
          
          <div className="status-badge">
            {internship.status === 'open' ? (
              <span className="open">Accepting Applications</span>
            ) : (
              <span className="closed">Closed</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="detail-content">
        <div className="main-content">
          <section className="detail-section">
            <h2>About the Internship</h2>
            <p>{internship.description}</p>
          </section>
          
          {internship.responsibilities && internship.responsibilities.length > 0 && (
            <section className="detail-section">
              <h2>Responsibilities</h2>
              <ul className="detail-list">
                {internship.responsibilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}
          
          {internship.requirements && internship.requirements.length > 0 && (
            <section className="detail-section">
              <h2>Requirements</h2>
              <ul className="detail-list">
                {internship.requirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}
          
          {internship.benefits && internship.benefits.length > 0 && (
            <section className="detail-section">
              <h2>Benefits</h2>
              <ul className="detail-list">
                {internship.benefits.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
        
        <div className="sidebar">
          <div className="application-card">
            <h3>Application Details</h3>
            <div className="detail-item">
              <i className="fas fa-calendar-alt"></i>
              <div>
                <span className="label">Start Date:</span>
                <span>{formatDate(internship.startDate)}</span>
              </div>
            </div>
            <div className="detail-item">
              <i className="fas fa-hourglass-end"></i>
              <div>
                <span className="label">Application Deadline:</span>
                <span>{formatDate(internship.deadline)}</span>
              </div>
            </div>
            <div className="detail-item">
              <i className="fas fa-clock"></i>
              <div>
                <span className="label">Duration:</span>
                <span>{internship.duration || 'Flexible'}</span>
              </div>
            </div>
            
            <button 
              onClick={handleApply}
              disabled={internship.status !== 'open' || applied}
              className={`apply-button ${applied ? 'applied' : ''}`}
            >
              {applied ? 'Application Submitted' : 'Apply Now'}
            </button>
            
            {internship.status !== 'open' && (
              <p className="closed-notice">
                This internship is no longer accepting applications.
              </p>
            )}
          </div>
          
          {internship.mentor && (
            <div className="mentor-card">
              <h3>Mentor</h3>
              <div className="mentor-profile">
                <div className="mentor-avatar">
                  <i className="fas fa-user-tie"></i>
                </div>
                <div className="mentor-info">
                  <h4>{internship.mentor.name}</h4>
                  <p className="mentor-email">{internship.mentor.email}</p>
                  <button className="btn-mentor">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InternshipDetail;
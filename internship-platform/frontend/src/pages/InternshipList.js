import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/InternshipList.css';

// Set default base URL for axios
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const InternshipList = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    location: 'All',
    category: 'All'
  });

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get('/api/internships', {
          params: {
            status: 'open'
          },
          timeout: 10000 // 10 second timeout
        });
        
        setInternships(response.data);
      } catch (err) {
        console.error('Fetch internships error:', err);
        setError(
          err.response?.data?.message || 
          err.message || 
          'Failed to load internships. Please check your connection and try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
    
    // Cleanup function
    return () => {
      // Cancel any pending requests
      axios.CancelToken.source().cancel('Component unmounted');
    };
  }, []);

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         internship.company.toLowerCase().includes(filters.search.toLowerCase()) ||
                         internship.description.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesLocation = filters.location === 'All' || 
                          internship.location === filters.location;
    
    const matchesCategory = filters.category === 'All' || 
                          internship.requirements.some(req => 
                            req.toLowerCase().includes(filters.category.toLowerCase()));
    
    return matchesSearch && matchesLocation && matchesCategory;
  });

  const locations = ['All', 'Remote', ...new Set(internships.map(i => i.location))];
  const categories = ['All', 'React', 'Python', 'JavaScript', 'Node.js', 'UI/UX', 'Data Analysis'];

  return (
    <div className="internship-list-page">
      <div className="internship-header">
        <h1>Available Internships</h1>
        <p>Browse through our curated list of internship opportunities</p>
      </div>

      <div className="internship-filters">
        <div className="filter-group">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search by title, company or keyword"
            className="filter-input"
            aria-label="Search internships"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="location-filter">Location:</label>
          <select
            id="location-filter"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            className="filter-select"
          >
            {locations.map((loc, index) => (
              <option key={index} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="category-filter">Category:</label>
          <select
            id="category-filter"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="filter-select"
          >
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading internships...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-retry"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="internship-cards-container">
          {filteredInternships.length > 0 ? (
            <div className="internship-cards">
              {filteredInternships.map(internship => (
                <div key={internship._id} className="internship-card">
                  <div className="card-header">
                    <h3>{internship.title}</h3>
                    <span className="company">{internship.company}</span>
                  </div>
                  
                  <div className="card-details">
                    <div className="detail">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{internship.location}</span>
                    </div>
                    <div className="detail">
                      <i className="fas fa-clock"></i>
                      <span>{internship.duration || 'Flexible duration'}</span>
                    </div>
                    {internship.deadline && (
                      <div className="detail">
                        <i className="fas fa-calendar-times"></i>
                        <span>Apply by: {new Date(internship.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="card-description">
                    <p>{internship.description.substring(0, 150)}...</p>
                  </div>
                  
                  <div className="card-skills">
                    <h4>Requirements:</h4>
                    <div className="skills">
                      {internship.requirements.slice(0, 3).map((skill, index) => (
                        <span key={index} className="skill">{skill}</span>
                      ))}
                      {internship.requirements.length > 3 && (
                        <span className="skill-more">+{internship.requirements.length - 3} more</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <Link 
                      to={`/internships/${internship._id}`} 
                      className="btn btn-details"
                    >
                      View Details
                    </Link>
                    <Link 
                      to={`/apply/${internship._id}`} 
                      className="btn btn-apply"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No internships found matching your criteria.</p>
              <button 
                onClick={() => setFilters({ search: '', location: 'All', category: 'All' })}
                className="btn-clear-filters"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InternshipList;
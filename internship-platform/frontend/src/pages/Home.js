import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Launch Your Career with Virtual Internships</h1>
          <p>
            Gain real-world experience, connect with industry mentors, and build your professional
            portfolio through our virtual internship platform.
          </p>
          <div className="hero-buttons">
            <Link to="/internships" className="btn btn-primary">
              Explore Internships
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Sign Up Now
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">
            <i className="fas fa-search"></i>
          </div>
          <h3>Find Opportunities</h3>
          <p>
            Browse through a wide range of internship opportunities from various industries and
            companies.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <i className="fas fa-user-tie"></i>
          </div>
          <h3>Connect with Mentors</h3>
          <p>
            Learn directly from industry experts who provide guidance and feedback throughout your
            internship.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <i className="fas fa-tasks"></i>
          </div>
          <h3>Complete Tasks</h3>
          <p>
            Work on real-world projects and tasks to build your skills and enhance your portfolio.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <i className="fas fa-certificate"></i>
          </div>
          <h3>Earn Certificates</h3>
          <p>
            Get recognized for your hard work with certificates upon successful completion of
            internships.
          </p>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create an Account</h3>
            <p>Sign up and create your profile with your skills and interests.</p>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <h3>Browse Internships</h3>
            <p>Explore available internships that match your interests and skills.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Apply</h3>
            <p>Submit your application with your resume and cover letter.</p>
          </div>

          <div className="step">
            <div className="step-number">4</div>
            <h3>Complete Tasks</h3>
            <p>Once accepted, complete assigned tasks and receive feedback from mentors.</p>
          </div>

          <div className="step">
            <div className="step-number">5</div>
            <h3>Get Certified</h3>
            <p>Successfully complete your internship and receive certification.</p>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2>Success Stories</h2>
        <div className="testimonial-container">
          <div className="testimonial">
            <div className="testimonial-image">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYjs5vSDwWiV2zr_4UFwyPOaOtNh3OS16mKA&s" alt="Student 1" />
            </div>
            <p className="testimonial-text">
              "The virtual internship program helped me gain valuable industry experience while
              studying. I'm now employed full-time at a top tech company!"
            </p>
            <p className="testimonial-author">- Amanpreet Pandey, Web Developer</p>
          </div>

          <div className="testimonial">
            <div className="testimonial-image">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRiy_RFJl5SrZQkUX8aQwfgPlOAwI91mBCRQ&s" alt="Student 2" />
            </div>
            <p className="testimonial-text">
              "Working with experienced mentors gave me insights that I couldn't have gained from
              classroom learning alone. Highly recommended!"
            </p>
            <p className="testimonial-author">- Saurabh Singh, Data Analyst</p>
          </div>

          <div className="testimonial">
            <div className="testimonial-image">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZSJbewf0xtGSwFopMJjyO2dGrTg9d44dfYQ&s" alt="Student 3" />
            </div>
            <p className="testimonial-text">
              "The flexibility of virtual internships allowed me to gain experience while balancing
              my studies. It was the perfect solution for me!"
            </p>
            <p className="testimonial-author">- Anshul Dubey, Marketing Specialist</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Start Your Professional Journey?</h2>
        <p>Join thousands of students who have launched their careers through our platform.</p>
        <Link to="/register" className="btn btn-large">
          Get Started Today
        </Link>
      </section>
    </div>
  );
};

export default Home;


import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../styles/TaskDetail.css';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }

    // This would be replaced with a call to your backend API
    const fetchTask = async () => {
      // Simulate API call
      setTimeout(() => {
        const dummyTask = {
          _id: id,
          title: 'Create a Responsive Landing Page',
          description: 'Design and implement a responsive landing page using HTML, CSS, and JavaScript. The landing page should include a navigation menu, hero section, features section, testimonials, and contact form. Ensure that the design is mobile-friendly and adheres to modern web design principles.',
          requirements: [
            'Use semantic HTML5 elements',
            'Implement responsive design using CSS media queries',
            'Add interactive elements using JavaScript',
            'Ensure cross-browser compatibility',
            'Optimize for page load speed'
          ],
          resources: [
            'Figma design mockups: [Link]',
            'Style guide: [Link]',
            'Example websites for inspiration: [Links]'
          ],
          internship: {
            _id: '101',
            title: 'Frontend Developer Intern',
            company: 'TechCorp'
          },
          mentor: {
            _id: '201',
            name: 'John Smith',
            position: 'Senior Frontend Developer'
          },
          deadline: '2025-05-10T00:00:00.000Z',
          status: 'in-progress',
          submission: {
            content: '',
            submittedAt: null
          },
          feedback: {
            content: '',
            providedAt: null
          },
          createdAt: '2025-04-01T00:00:00.000Z'
        };
        setTask(dummyTask);
        
        // If there's existing submission content, set it
        if (dummyTask.submission && dummyTask.submission.content) {
          setSubmission(dummyTask.submission.content);
        }
        
        setLoading(false);
      }, 1000);
    };

    fetchTask();
  }, [id, navigate]);

  const handleSubmissionChange = (e) => {
    setSubmission(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!submission.trim()) {
      setError('Please enter your submission before submitting');
      return;
    }
    
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      // This would be replaced with a call to your backend API
      console.log('Submitting task:', submission);
      
      // Simulate API call
      setTimeout(() => {
        // Update the task with the submission
        setTask({
          ...task,
          status: 'submitted',
          submission: {
            content: submission,
            submittedAt: new Date().toISOString()
          }
        });
        
        setSubmitting(false);
        setSuccess('Task submitted successfully!');
      }, 1500);
    } catch (err) {
      setError('Error submitting task');
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      // This would be replaced with a call to your backend API
      console.log('Updating task status to:', newStatus);
      
      // Simulate API call
      setTimeout(() => {
        // Update the task with the new status
        setTask({
          ...task,
          status: newStatus
        });
        
        setSubmitting(false);
        setSuccess(`Task status updated to ${newStatus}!`);
      }, 1000);
    } catch (err) {
      setError('Error updating task status');
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusClass = (status) => {
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

  if (loading) {
    return <div className="loading-spinner">Loading task details...</div>;
  }

  if (!task) {
    return <div className="not-found">Task not found</div>;
  }

  return (
    <div className="task-detail-page">
      <div className="task-detail-header">
        <div className="back-link">
          <Link to="/tasks">
            <i className="fas fa-arrow-left"></i> Back to Tasks
          </Link>
        </div>
        <h1>{task.title}</h1>
        <div className="task-internship-info">
          <i className="fas fa-briefcase"></i>
          <span>{task.internship.title} - {task.internship.company}</span>
        </div>
        <div className="task-status-container">
          <span className={`task-status ${getStatusClass(task.status)}`}>
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
          <div className="task-deadline">
            <i className="fas fa-clock"></i>
            <span>Deadline: {formatDate(task.deadline)}</span>
          </div>
        </div>
      </div>

      <div className="task-detail-content">
        <div className="task-detail-main">
          <section className="task-section">
            <h2>Description</h2>
            <p>{task.description}</p>
          </section>

          <section className="task-section">
            <h2>Requirements</h2>
            <ul className="requirements-list">
              {task.requirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </section>

          <section className="task-section">
            <h2>Resources</h2>
            <ul className="resources-list">
              {task.resources.map((resource, index) => (
                <li key={index}>{resource}</li>
              ))}
            </ul>
          </section>

          {task.submission && task.submission.submittedAt && (
            <section className="task-section submission-section">
              <h2>Your Submission</h2>
              <div className="submission-timestamp">
                Submitted on: {formatDate(task.submission.submittedAt)}
              </div>
              <div className="submission-content">
                {task.submission.content}
              </div>
            </section>
          )}

          {task.feedback && task.feedback.content && (
            <section className="task-section feedback-section">
              <h2>Mentor Feedback</h2>
              <div className="feedback-timestamp">
                Provided on: {formatDate(task.feedback.providedAt)}
              </div>
              <div className="feedback-content">
                {task.feedback.content}
              </div>
            </section>
          )}

          {(task.status === 'assigned' || task.status === 'in-progress') && (
            <section className="task-section">
              <h2>Submit Your Work</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="submission">Your submission</label>
                  <textarea
                    id="submission"
                    name="submission"
                    value={submission}
                    onChange={handleSubmissionChange}
                    required
                    rows="8"
                    placeholder="Enter your submission here. Include links to your work if applicable."
                  ></textarea>
                </div>
                <div className="submission-buttons">
                  {task.status === 'assigned' && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleUpdateStatus('in-progress')}
                      disabled={submitting}
                    >
                      Mark as In Progress
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Task'}
                  </button>
                </div>
              </form>
            </section>
          )}
        </div>

        <div className="task-detail-sidebar">
          <div className="mentor-card">
            <h3>Your Mentor</h3>
            <div className="mentor-profile">
              <div className="mentor-image">
                <img src="/api/placeholder/80/80" alt={task.mentor.name} />
              </div>
              <div className="mentor-info">
                <h4>{task.mentor.name}</h4>
                <p>{task.mentor.position}</p>
              </div>
            </div>
          </div>

          <div className="task-timeline">
            <h3>Task Timeline</h3>
            <ul className="timeline-list">
              <li className="timeline-item completed">
                <div className="timeline-indicator"></div>
                <div className="timeline-content">
                  <h4>Task Assigned</h4>
                  <p>{formatDate(task.createdAt)}</p>
                </div>
              </li>
              <li className={`timeline-item ${task.status !== 'assigned' ? 'completed' : ''}`}>
                <div className="timeline-indicator"></div>
                <div className="timeline-content">
                  <h4>In Progress</h4>
                  <p>{task.status !== 'assigned' ? 'Started working on task' : 'Not started yet'}</p>
                </div>
              </li>
              <li className={`timeline-item ${task.status === 'submitted' || task.status === 'approved' || task.status === 'rejected' ? 'completed' : ''}`}>
                <div className="timeline-indicator"></div>
                <div className="timeline-content">
                  <h4>Submitted</h4>
                  <p>
                    {task.submission && task.submission.submittedAt
                      ? formatDate(task.submission.submittedAt)
                      : 'Not submitted yet'}
                  </p>
                </div>
              </li>
              <li className={`timeline-item ${task.status === 'approved' || task.status === 'rejected' ? 'completed' : ''}`}>
                <div className="timeline-indicator"></div>
                <div className="timeline-content">
                  <h4>Reviewed</h4>
                  <p>
                    {task.feedback && task.feedback.providedAt
                      ? formatDate(task.feedback.providedAt)
                      : 'Pending review'}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
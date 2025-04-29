import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import InternshipList from './pages/InternshipList';
import InternshipDetail from './pages/InternshipDetail';
import ApplicationForm from './pages/ApplicationForm';
import TaskList from './pages/TaskList';
import TaskDetail from './pages/TaskDetail';
import MentorDashboard from './pages/MentorDashboard';
import CreateInternship from './pages/CreateInternship';


// Import styles
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/internships" element={<InternshipList />} />
            <Route path="/internships/:id" element={<InternshipDetail />} />
            <Route path="/apply/:id" element={<ApplicationForm />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/tasks/:id" element={<TaskDetail />} />
            <Route path="/mentor/dashboard" element={<MentorDashboard />} />
            <Route path="/CreateInternship" element={<CreateInternship />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

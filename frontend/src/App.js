import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserRegistration from './components/UserRegistration';
import FaceRecognition from './components/FaceRecognition';
import UserList from './components/UserList';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('register');

  const tabs = [
    { id: 'register', label: 'Register User', component: UserRegistration },
    { id: 'recognize', label: 'Face Recognition', component: FaceRecognition },
    { id: 'users', label: 'User List', component: UserList }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: 'white', fontSize: '3rem', marginBottom: '10px' }}>
          Facial Recognition System
        </h1>
        <p style={{ color: 'white', fontSize: '1.2rem', opacity: 0.9 }}>
          Register users and recognize faces with AI-powered technology
        </p>
      </header>

      <nav className="nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main>
        {ActiveComponent && (
          <ActiveComponent 
            onRegistrationSuccess={() => setActiveTab('users')}
          />
        )}
      </main>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;

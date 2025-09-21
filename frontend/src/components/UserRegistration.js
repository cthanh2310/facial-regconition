import React, { useState } from 'react';
import WebcamCapture from './WebcamCapture';
import { userAPI } from '../services/api';
import { toast } from 'react-toastify';

const UserRegistration = ({ onRegistrationSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageCapture = (imageData) => {
    setCapturedImage(imageData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!capturedImage) {
      toast.error('Please capture or upload a photo');
      return;
    }

    setIsLoading(true);
    
    try {
      await userAPI.register(formData.name, formData.email, capturedImage);
      toast.success('User registered successfully!');
      
      // Reset form
      setFormData({ name: '', email: '' });
      setCapturedImage(null);
      
      if (onRegistrationSuccess) {
        onRegistrationSuccess();
      }
    } catch (error) {
      const message = error.response?.data?.detail || 'Registration failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>User Registration</h2>
      <p>Register a new user by capturing their face and providing basic information.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            required
          />
        </div>

        <WebcamCapture
          onCapture={handleImageCapture}
          onFileUpload={handleImageCapture}
          capturedImage={capturedImage}
        />

        <button 
          type="submit" 
          className="btn"
          disabled={isLoading || !capturedImage}
        >
          {isLoading ? (
            <>
              <span className="loading"></span> Registering...
            </>
          ) : (
            'Register User'
          )}
        </button>
      </form>
    </div>
  );
};

export default UserRegistration;

import React, { useState } from 'react';
import WebcamCapture from './WebcamCapture';
import { userAPI } from '../services/api';
import { toast } from 'react-toastify';

const FaceRecognition = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageCapture = (imageData) => {
    setCapturedImage(imageData);
    setRecognitionResult(null);
  };

  const handleRecognize = async () => {
    if (!capturedImage) {
      toast.error('Please capture or upload a photo first');
      return;
    }

    setIsLoading(true);
    setRecognitionResult(null);

    try {
      const result = await userAPI.recognize(capturedImage);
      setRecognitionResult(result);
      
      if (result.user) {
        toast.success(`Face recognized as ${result.user.name}!`);
      } else {
        toast.warning('No matching face found');
      }
    } catch (error) {
      const message = error.response?.data?.detail || 'Recognition failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetRecognition = () => {
    setCapturedImage(null);
    setRecognitionResult(null);
  };

  return (
    <div className="card">
      <h2>Face Recognition</h2>
      <p>Capture or upload a photo to recognize a face from the registered users.</p>
      
      <WebcamCapture
        onCapture={handleImageCapture}
        onFileUpload={handleImageCapture}
        capturedImage={capturedImage}
      />

      {capturedImage && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button 
            className="btn"
            onClick={handleRecognize}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading"></span> Recognizing...
              </>
            ) : (
              'Recognize Face'
            )}
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={resetRecognition}
            disabled={isLoading}
          >
            Reset
          </button>
        </div>
      )}

      {recognitionResult && (
        <div className={`result-container ${recognitionResult.user ? 'result-success' : 'result-error'}`}>
          <h3>Recognition Result</h3>
          {recognitionResult.user ? (
            <div>
              <p><strong>Name:</strong> {recognitionResult.user.name}</p>
              <p><strong>Email:</strong> {recognitionResult.user.email}</p>
              <p><strong>Confidence:</strong> {(recognitionResult.confidence * 100).toFixed(1)}%</p>
              <p><strong>Message:</strong> {recognitionResult.message}</p>
            </div>
          ) : (
            <div>
              <p><strong>Message:</strong> {recognitionResult.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FaceRecognition;

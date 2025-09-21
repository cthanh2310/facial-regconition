import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';

const WebcamCapture = ({ onCapture, onFileUpload, capturedImage }) => {
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      setIsCapturing(true);
      const imageSrc = webcamRef.current.getScreenshot();
      onCapture(imageSrc);
      setTimeout(() => setIsCapturing(false), 1000);
    }
  }, [onCapture]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onFileUpload(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user"
  };

  return (
    <div className="webcam-container">
      <h3>Capture Your Face</h3>
      
      {!capturedImage ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={640}
            height={480}
            videoConstraints={videoConstraints}
            className="webcam"
          />
          
          <div style={{ marginTop: '20px' }}>
            <button 
              className="btn" 
              onClick={capture}
              disabled={isCapturing}
            >
              {isCapturing ? 'Capturing...' : 'Capture Photo'}
            </button>
            
            <button 
              className="btn btn-secondary" 
              onClick={() => fileInputRef.current.click()}
            >
              Upload File
            </button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
        </>
      ) : (
        <div>
          <img 
            src={capturedImage} 
            alt="Captured" 
            className="captured-image"
          />
          <div style={{ marginTop: '20px' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => onCapture(null)}
            >
              Retake Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;

import React, { useState } from 'react';
import axiosInstance from '../utils/AxiosInstance';
import toast from 'react-hot-toast';
import "./imageUpload.css";

const ImageUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await axiosInstance.post('/api/exams/upload-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Images uploaded successfully');
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    }
  };

  return (
    <div className="image-upload">
      <h2>Upload Images</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" multiple onChange={handleFileChange}
          className='imageBrowseBtn'
        />
        <button type="submit" className='imageUploadBtn'>
          Upload
        </button>
      </form>
      <div className="preview">
        {previewImages.map((src, index) => (
          <img key={index} src={src} alt={`Preview ${index}`} className="preview-image" />
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;

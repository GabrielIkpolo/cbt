import axios from 'axios';

//const baseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL; // no need for this

const axiosInstance = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`, // assuming you store your token in localStorage
  },
});

export default axiosInstance;

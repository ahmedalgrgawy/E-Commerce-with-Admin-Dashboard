import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true // for cookies
});



export default axiosInstance;
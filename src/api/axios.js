import axios from 'axios';

const API = axios.create({
  baseURL: 'https://cmsback.sampaarsh.cloud',
 
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');

    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;

});


export const settoken = (token) => { 
    localStorage.setItem('token', token);
   }

export const gettoken = () => {
    return localStorage.getItem('token');
}

export const removetoken = () => {
    localStorage.removeItem('token');
}



export default API;

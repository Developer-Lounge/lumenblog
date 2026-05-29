import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 5000,

    headers:{
        'content-type':'application/json',
    }
});

export default api;

export const getPosts = async () => {
    try{
        const response = await api.get('/posts')
        return response.data;
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
    }
}
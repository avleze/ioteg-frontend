import axios from 'axios';
import { SERVER_BASE_URL } from "./api-endpoints";
import notify from '../lib/notifier';

const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = SERVER_BASE_URL;

const setupAxiosInterceptors = onUnauthenticated => {
    const onRequestSuccess = config => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    };
    const onResponseSuccess = response => response;
    const onResponseError = err => {
        if(!err.status)
        {
            notify({content: "Failed when connecting to the server.", variant:"error"})
            return Promise.reject(err);
        }

        const status = err.status || err.response.status;
        if (status === 401) {
            onUnauthenticated();
        }
        return Promise.reject(err);
    };
    axios.interceptors.request.use(onRequestSuccess);
    axios.interceptors.response.use(onResponseSuccess, onResponseError);
};

export default setupAxiosInterceptors;
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
    if (config.baseURL === process.env.REACT_APP_API_BASE_URL as string) {
        const token = localStorage.getItem('token');
        config.headers ? config.headers.Authorization = `Bearer ${token}` : console.log('error');
    }
    return config;
}

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
    console.error(`[request error] [${JSON.stringify(error)}]`);
    return Promise.reject(error);
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
    if (typeof response.data.token !== 'undefined')
        localStorage.setItem("token", response.data.token);
    return response;
}

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
    console.error(`[response error] [${JSON.stringify(error)}]`);
    return Promise.reject(error);
}

export const setupInterceptorsTo = (axiosInstance: AxiosInstance): AxiosInstance => {
    axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL as string;
    axiosInstance.interceptors.request.use(onRequest, onRequestError);
    axiosInstance.interceptors.response.use(onResponse, onResponseError);
    return axiosInstance;
}
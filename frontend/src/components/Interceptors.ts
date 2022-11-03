import axios,{ AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
    const token = localStorage.getItem('token');
    config.headers ? config.headers.Authorization  = `Bearer ${token}`: console.log('error');
    return config;
}

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
    console.error(`[request error] [${JSON.stringify(error)}]`);
    return Promise.reject(error);
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
    if(typeof response.data.jwt !== 'undefined')
    localStorage.setItem("token", response.data.jwt);
    return response;
}

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
    console.error(`[response error] [${JSON.stringify(error)}]`);
    return Promise.reject(error);
}

export const setupInterceptorsTo = (axiosInstance: AxiosInstance): AxiosInstance => {
    axios.defaults.baseURL = "http://localhost:8000/api/v0.1/";
    axiosInstance.interceptors.request.use(onRequest, onRequestError);
    axiosInstance.interceptors.response.use(onResponse, onResponseError);
    return axiosInstance;
}
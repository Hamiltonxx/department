import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://dc.lookingedu.com:9000',
    timeout: 600 * 1000,
});

// 请求拦截器
axiosInstance.interceptors.request.use(request => {
    // console.log(request);
    // TODO add token
    return request;
});

// 响应拦截器
axiosInstance.interceptors.response.use(response => {
    // console.log(response);
    return response.data;
});

export function GET(url, headers = {}) {
    return axiosInstance.get(url);
}

export function POST(url, data, headers = {}) {
    return axiosInstance.post(url, data, headers);
}
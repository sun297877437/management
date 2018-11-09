import axios from "axios";
import qs from "qs";

//添加请求拦截器
// axios.interceptors.request.use(
//   config => {
//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   }
// );

//添加响应拦截器
// axios.interceptors.response.use(
//   response => {
//     return response;
//   },
//   error => {
//     return Promise.resolve(error.response);
//   }
// );
// axios.defaults.headers.post["Content-Type"] = "application/json";
// axios.defaults.headers.post["X-Requested-With"] = "XMLHttpRequest";
// axios.defaults.timeout = 10000;
// axios.defaults.baseURL = 'http://tfb.appsd.cn/index.php'
axios.defaults.baseURL = '/api';
export default {
    post: (url, params) => {
        params = qs.stringify(params);
        return axios.post('/' + url, params);
    },
    get: (url) => {
        return axios.get('/' + url);
    },
};
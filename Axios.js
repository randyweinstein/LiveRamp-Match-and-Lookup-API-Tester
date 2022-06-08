const clientCredentials = require("./data/ClientCredentials");
const axios = require('axios');
const oauth = require('axios-oauth-client');
const tokenProvider = require('axios-token-interceptor');

const AxiosInstance = axios.create();
AxiosInstance.interceptors.request.use(
    oauth.interceptor(tokenProvider, clientCredentials)
);
AxiosInstance.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
module.exports = AxiosInstance


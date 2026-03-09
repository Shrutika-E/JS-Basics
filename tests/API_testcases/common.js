// common.js
// Common utility functions for API tests

const axios = require('axios');
const http = require('http');
const https = require('https');

const BASE_URL = 'https://automationexercise.com/api';
const httpAgent = new http.Agent({ keepAlive: false });
const httpsAgent = new https.Agent({ keepAlive: false });

function navigateToUrl(endpoint) {
    return `${BASE_URL}${endpoint}`;
}

async function sendRequest({ method, url, data = {}, params = {} }) {
    try {
        const response = await axios({
            method,
            url,
            data,
            params,
            timeout: 15000,
            httpAgent,
            httpsAgent
        });
        return response;
    } catch (error) {
        return error.response;
    }
}

module.exports = {
    navigateToUrl,
    sendRequest,
    BASE_URL
};

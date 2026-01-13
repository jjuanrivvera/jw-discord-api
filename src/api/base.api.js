const querystring = require('querystring');
const fetch = require('node-fetch');

class Api {
    constructor(basePath, headers) {
        this.basePath = basePath;
        this.headers = headers;
    }

    async request(endpoint = '', options = {}) {
        const url = this.basePath + endpoint;
        
        const headers =  {
            headers: this.headers
        };
        
        const config = {
            ...options,
            ...headers
        };
        
        const response = await fetch(url, config);

        if (response.ok) {
            return response.json();
        }

        // Parse the error response properly
        let errorMessage;
        try {
            const errorBody = await response.json();
            errorMessage = errorBody.message || errorBody.error || JSON.stringify(errorBody);
        } catch {
            errorMessage = `${response.status} ${response.statusText}`;
        }

        const error = new Error(errorMessage);
        error.status = response.status;
        throw error;
    }

    async get(uri, params) {
        const queryParams = params ? `?${querystring.stringify(params)}` : '';

        uri = uri + queryParams;

        const options = {
            method: 'GET'
        };

        return await this.request(uri, options);
    }

    async post(uri, body) {
        const options = {
            method: 'POST',
            body: JSON.stringify(body)
        };

        return await this.request(uri, options);
    }

    async put(uri, body) {
        const options = {
            method: 'PUT',
            body: JSON.stringify(body)
        };

        return await this.request(uri, options);
    }

    async delete(uri) {
        const options = {
            method: 'DELETE',
        };

        return await this.request(uri, options);
    }
}

module.exports = Api;
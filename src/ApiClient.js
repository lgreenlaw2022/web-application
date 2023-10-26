const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

export default class ApiClient {
    constructor() {
        this.base_url =  BASE_API_URL;
    }

    async request(options) {
        let query = new URLSearchParams(options.query || {}).toString();
        if (query !== '') {
        query = '?' + query;
        }

    let response;
    try {
        response = await fetch(this.base_url + options.url + query, {
            method: options.method,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
              ...options.headers,
            },
            body: options.body ? JSON.stringify(options.body) : null,
          });
    }
    catch (error) {
        response = {
            ok: false,
            status: 500,
            json: async () => { return {
            code: 500,
            message: 'The server is unresponsive',
            description: error.toString(),
            }; }
        };
    }

    return {
        ok: response.ok,
        status: response.status,
        body: response.status !== 204 ? await response.json() : null
    };
    }
    
    async login(username, password) {
        // console.log(username, password)
        console.log("login api client ##########################################")
        const response = await this.post('/auth/login', JSON.stringify({
            userData: username,
            password
        }));
        if (!response.ok) {
        return response.status === 401 ? 'fail' : 'error';
        }
        // localStorage.setItem('accessToken', response.body.access_token);
        console.log("api client returns response.body", response.body)
        return (response.body)
    }

    // async logout() {
    //     await this.delete('/tokens');
    //     localStorage.removeItem('accessToken');
    // }

    isAuthenticated() {
        return localStorage.getItem('accessToken') !== null;
    }

    async get(url, query, options) {
        return this.request({method: 'GET', url, query, ...options});
    }

    async post(url, body, options) {
        return this.request({method: 'POST', url, body, ...options});
    }

    async put(url, body, options) {
        return this.request({method: 'PUT', url, body, ...options});
    }

    async delete(url, options) {
        return this.request({method: 'DELETE', url, ...options});
    }
}
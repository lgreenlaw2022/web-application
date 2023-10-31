const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

export default class ApiClient {
	// Constructor for the ApiClient class
	constructor() {
		// Set the base URL for the API
		this.base_url = BASE_API_URL;
	}

	// Make a request to the API
	async request(options) {
		// Create a query string from the options object
		let query = new URLSearchParams(options.query || {}).toString();
		if (query !== "") {
			query = "?" + query;
		}

		let response;
		try {
			// Make the request to the API
			response = await fetch(this.base_url + options.url + query, {
				// Set the request method
				method: options.method,
				// Set the request headers
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
					...options.headers,
				},
				// Set the request body
				body: options.body ? JSON.stringify(options.body) : null,
				credentials: "include",
			});
		} catch (error) {
			// Return an error response if the request fails
			response = {
				ok: false,
				status: 500,
				json: async () => {
					return {
						code: 500,
						message: "The server is unresponsive",
						description: error.toString(),
					};
				},
			};
		}

		// Return the response
		return {
			ok: response.ok,
			status: response.status,
			body: response.status !== 204 ? await response.json() : null,
		};
	}

	// Make a login request to the API
	async login(username, password) {
		const response = await this.post(
			"/auth/login",
			JSON.stringify({
				userData: username,
				password,
			})
		);
		// Return the response
		if (!response.ok) {
			return response.status === 401 ? "fail" : "error";
		}
		return response.body;
	}

	// Make a GET request to the API
	async get(url, query, options) {
		return this.request({ method: "GET", url, query, ...options });
	}

	// Make a POST request to the API
	async post(url, body, options) {
		return this.request({ method: "POST", url, body, ...options });
	}

	// Make a PUT request to the API
	async put(url, body, options) {
		return this.request({ method: "PUT", url, body, ...options });
	}

	// Make a DELETE request to the API
	async delete(url, options) {
		return this.request({ method: "DELETE", url, ...options });
	}
}

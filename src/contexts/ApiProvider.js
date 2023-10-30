import { createContext, useContext } from "react";
import ApiClient from "../ApiClient";

// Create a context for API
const ApiContext = createContext();

// Export a function to provide API
export default function ApiProvider({ children }) {
	// Create a new API client
	const api = new ApiClient();

	// Return the API client in the context
	return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

// Export a function to use the API
export function useApi() {
	// Return the API from the context
	return useContext(ApiContext);
}

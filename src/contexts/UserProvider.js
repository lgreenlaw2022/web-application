import { createContext, useContext, useState, useEffect } from "react";
import { useApi } from "./ApiProvider";

// Create a context for the user data.
const UserContext = createContext();

export default function UserProvider({ children }) {
	const [user, setUser] = useState(null);
	// Get the API.
	const api = useApi();

	// double check if session storage is available.
	const isSessionStorageAvailable = () => {
		try {
			sessionStorage.setItem("test", "test");
			sessionStorage.removeItem("test");
			return true;
		} catch (error) {
			return false;
		}
	};

	// Login function.
	const login = async (userData, password) => {
		// Perform an API call to validate credentials and retrieve user data.
		const response = await api.login(userData, password);

		const user_id = response.user;
		const message = response.message;

		// If the login is successful, set the user in the state.
		if (response.success) {
			// If the login is successful, set the user in the state.

			setUser(response.user);
			sessionStorage.setItem("user", JSON.stringify(response.user));
		} else {
			// Handle authentication errors here.
			console.error("Login failed:", message);
		}
		return response;
	};

	const logout = () => {
		// Log out the user by removing the user from the state.
		setUser(null);
		sessionStorage.removeItem("user");
	};

	// Check if the user is already logged in.
	useEffect(() => {
		const storedUser = sessionStorage.getItem("user");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
	}, []);

	// Return the user data.
	return (
		<UserContext.Provider value={{ user, login, logout }}>
			{children}
		</UserContext.Provider>
	);
}

// Export a function that will return the user data.
export function useUser() {
	return useContext(UserContext);
}

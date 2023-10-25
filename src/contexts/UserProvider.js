import { createContext, useContext, useState, useEffect } from 'react';
import { useApi } from './ApiProvider';

const UserContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const api = useApi();

  const login = async (userData, password) => {
    try {
      // Perform an API call to validate credentials and retrieve user data.
      // Replace this with your actual API call.
      const response = await api.login(userData, password);
      console.log("api login response", response, response.message, response.user)

      if (response.success) {
        // If the login is successful, set the user in the state.
        console.log("login success", response.user)
        setUser(response.user);
      } else {
        // Handle authentication errors here.
        console.error('Login failed:', response.error);
      }
    } catch (error) {
      // Handle API call errors.
      console.error('API error:', error);
    }
  };

  const logout = () => {
    // Log out the user by removing the user from the state.
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  return useContext(UserContext);
}
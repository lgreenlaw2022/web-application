import { createContext, useContext, useState, useEffect } from 'react';
import { useApi } from './ApiProvider';

const UserContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const api = useApi();

  const isSessionStorageAvailable = () => {
    try {
      sessionStorage.setItem('test', 'test');
      sessionStorage.removeItem('test');
      return true;
    } catch (error) {
      return false;
    }
  };

  const login = async (userData, password) => {
    try {
      // Perform an API call to validate credentials and retrieve user data.
      // Replace this with your actual API call.
      const response = await api.login(userData, password);

      const user_id = response.user;
      const message = response.message;
      console.log("api login response", response, message, user_id);

      if (response.success) {
        // If the login is successful, set the user in the state.
        console.log("login success", response.user);
        setUser(response.user);
        sessionStorage.setItem('user', JSON.stringify(response.user));
        console.log('user stored in session storage:', response.user);
        return response;
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
    sessionStorage.removeItem('user');
  };

  // useEffect(() => {
  //   console.log("user state updated", user);
  // }, [user]);

  useEffect(() => {
    console.log(isSessionStorageAvailable())
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      console.log('Stored User Data:', storedUser);
    }
  }, []);
  console.log("UserProvider user", user);

  
  

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  return useContext(UserContext);
}
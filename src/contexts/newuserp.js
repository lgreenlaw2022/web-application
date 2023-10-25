import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export default function UserProvider({ children, user }) {
  const [currentUser, setCurrentUser] = useState(user);

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider value={{ currentUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}



import { createContext, useContext, useState, useEffect } from 'react';
import { useApi } from './ApiProvider';

const UserContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUser] = useState();
  const api = useApi();

  useEffect(() => {
    (async () => {
      if (user) {
        const response = await api.get('/me'); 
        setUser(response.ok ? response.body : null);
      }
      else {
        setUser(null);
      }
    })();
  }, [api, user]);

  const login = async (username, password) => {
    console.log(username, password)
    const result = await api.login(username, password);
    console.log(result)
    if (result === 'ok') {
      const response = await api.get('/user');
      setUser(response.ok ? response.body : null);
    }
    return result;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
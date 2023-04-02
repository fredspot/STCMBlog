import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );
  const [username, setUsername] = useState(localStorage.getItem('username')); // Add this line

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
    localStorage.setItem('username', username); // Add this line
  }, [isLoggedIn, username]); // Add username to the dependency array

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, username, setUsername }}>
      {console.log('AuthProvider values:', { isLoggedIn, setIsLoggedIn, username, setUsername })}
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };

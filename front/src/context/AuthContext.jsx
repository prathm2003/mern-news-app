import React, { createContext, useState } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check if session is older than 30 mins (1800000 ms)
      if (new Date().getTime() - parsed.timestamp > 1800000) {
        localStorage.removeItem('user');
        return null;
      }
      return parsed;
    }
    return null;
  });

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const login = (data) => {
    const userWithTime = { ...data, timestamp: new Date().getTime() };
    setUser(userWithTime);
    localStorage.setItem('user', JSON.stringify(userWithTime));
    // Auto logout after 30 mins
    setTimeout(logout, 1800000);
  };

  // Set timeout on load if user exists
  React.useEffect(() => {
    if (user) {
      const timeLeft = 1800000 - (new Date().getTime() - user.timestamp);
      if (timeLeft > 0) {
        const timer = setTimeout(logout, timeLeft);
        return () => clearTimeout(timer);
      } else {
        logout();
      }
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

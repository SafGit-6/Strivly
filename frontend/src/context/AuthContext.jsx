import { createContext, useState, useContext, useEffect, useCallback } from 'react'; // ✅ 1. Import useCallback
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Use lazy initializer for performance: it only reads from localStorage on the initial render.
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  // Memoize the logout function with useCallback.
  // This ensures the function's identity remains stable across re-renders unless its dependencies change.
  // Since it has no dependencies, it will never be recreated.
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  // This effect synchronizes the user state with the token.
  useEffect(() => {
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        // Check if the token is expired
        if (decodedUser.exp * 1000 < Date.now()) {
          logout(); // Token is expired
        } else {
          setUser(decodedUser);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout(); // Token is invalid
      }
    } else {
      setUser(null);
    }
  }, [token, logout]); // This effect correctly depends on token and the stable logout function.

  // Memoize the login function. This is crucial for preventing infinite loops
  // in components that depend on this function in their useEffect hooks.
  const login = useCallback((newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    const decodedUser = jwtDecode(newToken);
    setUser(decodedUser);
  }, []); // Has no dependencies, so it will never be recreated.


  const value = {
    user,
    token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


export const useAuth = () => {
  return useContext(AuthContext);
};


import { useCallback } from 'react'; // ✅ 1. Import useCallback
import { useAuth } from '../context/AuthContext';

// This custom hook creates a fetch function that automatically includes the auth token.
export const useAuthenticatedFetch = () => {
  const { token, logout } = useAuth();

  // ✅ 2. Wrap the entire function in useCallback
  // This ensures the function identity is stable across re-renders.
  const authenticatedFetch = useCallback(async (url, options = {}) => {
    if (!token) {
      throw new Error('User is not authenticated.');
    }

    // Prepare the headers
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': token, // The token from AuthContext already includes "Bearer "
    };

    // Merge default headers with any custom headers from the options
    const finalOptions = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    // Make the request
    const response = await fetch(url, finalOptions);

    // If the token is expired or invalid, the server will respond with 401 Unauthorized
    if (response.status === 401) {
      // Automatically log the user out
      logout();
      throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
        // Handle other HTTP errors
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong with the request.');
    }

    // If the response has content, parse it as JSON
    if (response.status !== 204) { // 204 No Content
        return response.json();
    }
  }, [token, logout]);// ✅ 3. Add dependencies: the function will only change if token or logout change

  return authenticatedFetch;
};


 
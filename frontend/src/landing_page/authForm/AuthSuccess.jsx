import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AuthSuccess = () => {
  // 1. Get both `login` and the `user` object from the context.
  const { user, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Effect #1: This runs ONLY ONCE when the component first loads.
  // Its only job is to find the token and START the login process.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // This queues the state update in AuthContext but doesn't wait for it.
      login(token);
    } else {
      console.error("Google authentication failed: No token received.");
      navigate('/'); // Redirect to login page on failure
    }
    // We use an empty dependency array to ensure this effect runs only one time.
    // We disable the lint warning because this is intentional.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect #2: This effect runs whenever the 'user' object from the context changes.
  useEffect(() => {
    // THE GOLDEN RULE: We only navigate AFTER we have confirmation that the user object is set.
    if (user) {
      // Now that the user state is updated, it is safe to redirect.
      navigate('/dashboard');
    }
  }, [user, navigate]); // This effect depends on the user object.

  // Display a loading message to the user while the effects are running.
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', color: 'white' }}>
      <h2>Authenticating... Please wait.</h2>
    </div>
  );
};

export default AuthSuccess;

import { useState } from 'react';
import { toast } from 'react-toastify';
 
import { useAuth } from "../../context/AuthContext";// 1. Import the useAuth hook

const API_URL = import.meta.env.VITE_SERVER_API_URL

function AuthForm() {
  const { login } = useAuth(); // 2. Get the login function from context
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin ? { email, password } : { displayName: name, email, password };

    try {

        const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        });


      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      if (isLogin) {
        // 3. Call the context's login function with the token
        login(data.token);
        toast.success('Login successful!');
        // Now you can redirect. We'll handle this in the App component later.
      } else {
        toast.success('Account created! Please log in.');
        setIsLogin(true);
        setEmail('');
        setPassword('');
        setName('');
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center">
    
    <div className="darkGreyCard text-center p-4" style={{width:"33%"}}>
      
        <div >
          
           <h1 className="gradient-text">Welcome to Strivly</h1> 
          
          <p style={{color:"lightGray"}} className='mb-4'>
            {isLogin ? 'Sign in to your account' : 'Create your account'} 
          </p>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="" style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
                  {!isLogin && (
                      <>
                          <input
                              className="lightGreyCard AuthInput"
                              type="text"
                              placeholder="Full Name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required />
                      </>
                  )}
            <input
              className="lightGreyCard AuthInput"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <input
              className="lightGreyCard AuthInput"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <button  
              className="btn btn-primary purpleBtn" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>
 
            <a 
            href={`${API_URL}/api/auth/google`} 
            className="google-btn mt-4"
            >
            <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="Google logo" 
                className="google-icon"
            />
            <span>Sign in with Google</span>
            </a>

            <button
              className='mt-3'
              onClick={() => setIsLogin(!isLogin)}
              style={{color:"var(--purple)",background: "none", border: "none"}}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          
        </div>
      
    </div>
    </div>
  );
};



export default AuthForm;
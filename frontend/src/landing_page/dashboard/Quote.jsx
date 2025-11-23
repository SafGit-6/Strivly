import { useEffect, useState } from 'react';
import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch'; //  Import the custom hook
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_SERVER_API_URL;

function Quote() {
  const { user } = useAuth();
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(true);
  const authenticatedFetch = useAuthenticatedFetch();

  const motivationalQuotes = [
    "The way to get started is to quit talking and begin doing.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "Don't be afraid to give up the good to go for the great.",
    "Innovation distinguishes between a leader and a follower.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Push yourself, because no one else is going to do it for you."
  ];

  useEffect(() => {
    async function fetchQuote() {
      setLoading(true);
      try {
        const data = await authenticatedFetch(`${API_URL}/api/external/quote`);
        
        if (data && data[0].q!== 'Too many requests. Obtain an auth key for unlimited access.' ) {
          setQuote(data[0].q);
        } else if (data && data[0] && data[0].q === 'Too many requests. Obtain an auth key for unlimited access.') {
          throw new Error('API limit reached');
        } else {
          throw new Error('Invalid quote format received');
        }

      } catch (err) {
        console.error('Error fetching quote:', err.message);
        const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
        setQuote(randomQuote);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchQuote();
    } else {
      setLoading(false);
      setQuote('');
    }
  }, [user, authenticatedFetch]);

  return (
    <div className="container motivationCard" style={{ width: "80%", marginBottom: "2rem" }}>
      <div className="row text-center">
        {loading ? (
          <p style={{ color: "var(--quoteText)" }}>Loading motivational quote...</p>
        ) : (
          <p style={{ color: "var(--quoteText)" }}>"{quote}"</p>
        )}
      </div>
    </div>
  );
}

export default Quote;



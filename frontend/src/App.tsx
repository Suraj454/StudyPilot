import { useEffect, useState } from 'react';

type Health = { status: string; database: string };

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then((res) => res.json())
      .then((data: Health) => setHealth(data))
      .catch((err) => {
        console.error('Health check failed:', err);
        setError('Cannot reach the API');
      });
  }, []);

  if (error) return <p>{error}</p>;
  if (!health) return <p>Checking...</p>;

  return (
    <p>
      API: {health.status} · Database: {health.database}
    </p>
  );
}

export default App;
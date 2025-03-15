import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navigation from './Nav';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = ({ className, ...props }) => {
  const [ip, setIp] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get('http://127.0.0.1:8000/api/ip', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setIp(response.data.ip);
      })
      .catch((error) => {
        setError("Impossible de récupérer l'IP.");
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post(
        'http://127.0.0.1:8000/api/logout',
        {}, // Pas besoin d'envoyer de données
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Suppression des données de l'utilisateur
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      // Redirection vers la page de connexion
      navigate('/login');
    } catch (error) {
      console.error('Échec de la déconnexion :', error);
      setError('Impossible de se déconnecter.');
    }
  };

  if (loading)
    return <p className="text-center text-secondary fs-5">Loading...</p>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-6 md:p-10">
      <Navigation />
      <div className="w-full max-w-sm md:max-w-3xl mt-24 flex justify-center">
        <Card className={`w-[380px] ${className}`} {...props}>
          <CardHeader>
            <CardTitle> Welcome to Your Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <h1 className="text-2xl font-bold">Votre Adresse IP</h1>
              {loading ? (
                <p className="text-gray-500">Chargement...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <p className="text-lg text-blue-500 mt-2">{ip}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleLogout}>
              Logout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

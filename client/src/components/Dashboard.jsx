import { Button } from '@/components/ui/button';
import Navigation from './Nav';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import { IoLogOut } from 'react-icons/io5';
import Table from './Table';

const Dashboard = () => {
  const [ip, setIp] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [stocks, setStocks] = useState([]);
  // const [openPopup, setOpenPopup] = useState(false);
  // const [openAddPopup, setOpenAddPopup] = useState(false);
  // const [editId, setEditId] = useState(null);
  // const [editName, setEditName] = useState('');
  // const [editQuantity, setEditQuantity] = useState('');
  // const [editStatus, setEditStatus] = useState('');
  // const [name, setName] = useState('');
  // const [quantity, setQuantity] = useState('');
  // const [status, setStatus] = useState('');
  const navigate = useNavigate();

  // Fonction pour récupérer l'IP et les stocks
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get('http://127.0.0.1:8000/api/check-auth', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // fetchStocks();
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
      })
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, [navigate]);

  // const fetchStocks = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await axios.get('http://127.0.0.1:8000/api/stocks', {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setStocks(response.data);
  //   } catch (error) {
  //     console.error('Impossible de récupérer les stocks.', error);
  //   }
  // };

  // // Ajouter un stock
  // const handleAddStock = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const token = localStorage.getItem('token');

  //     await axios.post(
  //       'http://127.0.0.1:8000/api/stocks',
  //       { name, quantity, status },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     fetchStocks();
  //     setOpenAddPopup(false);
  //     setName('');
  //     setQuantity('');
  //     setStatus('');
  //   } catch (error) {
  //     console.error("Erreur lors de l'ajout du stock :", error);
  //   }
  // };

  // // Gérer la suppression d'un stock
  // const handleDeleteStock = async (id) => {
  //   try {
  //     const token = localStorage.getItem('token');

  //     await axios.delete(`http://127.0.0.1:8000/api/stocks/${id}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     fetchStocks();
  //   } catch (error) {
  //     console.error('Erreur lors de la suppression du stock :', error);
  //   }
  // };

  // const handleEditClick = (stock) => {
  //   setEditId(stock.id);
  //   setEditName(stock.name);
  //   setEditQuantity(stock.quantity);
  //   setEditStatus(stock.status);
  //   setOpenPopup(true);
  // };

  // // Gérer la mise à jour d'un stock
  // const editStock = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const token = localStorage.getItem('token');

  //     await axios.put(
  //       `http://127.0.0.1:8000/api/stocks/${editId}`,
  //       {
  //         name: editName,
  //         quantity: editQuantity,
  //         status: editStatus,
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     fetchStocks();
  //     setOpenPopup(false);
  //     setEditId(null);
  //     setEditName('');
  //     setEditQuantity('');
  //     setEditStatus('');
  //   } catch (error) {
  //     console.error('Erreur lors de la mise à jour du stock :', error);
  //   }
  // };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post(
        'http://127.0.0.1:8000/api/logout',
        {},
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
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-muted p-6 md:p-10">
      <Navigation />
      <div className="w-full max-w-sm md:max-w-3xl mt-24 flex justify-center">
        <div className="flex absolute top-0 p-4 rounded z-10 gap-x-16 ">
          <div className="w-[380px] p-4 rounded border border-stone-300 mt-0">
            <div className="grid gap-4">
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
            </div>
          </div>
          <div className="w-[380px] p-4 rounded border border-stone-300 mt-0">
            <div className="grid gap-4">
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
            </div>
          </div>
        </div>
        <Table />
        <div className="absolute top-0 right-0 m-4">
          {' '}
          {/* <-- Ici est le problème */}
          <Button onClick={handleLogout}>
            <IoLogOut />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

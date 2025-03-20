import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Navigation from './Nav';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';

const Dashboard = ({ className, ...props }) => {
  const [ip, setIp] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stocks, setStocks] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [openAddPopup, setOpenAddPopup] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  // Fonction pour récupérer l'IP et les stocks
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

    fetchStocks(); // Récupérer les stocks lors du chargement
  }, [navigate]);

  const fetchStocks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/stocks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStocks(response.data);
    } catch (error) {
      console.error('Impossible de récupérer les stocks.', error);
    }
  };

  // Ajouter un stock
  const handleAddStock = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      await axios.post(
        'http://127.0.0.1:8000/api/stocks',
        { name, quantity, status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchStocks();
      setOpenAddPopup(false);
      setName('');
      setQuantity('');
      setStatus('');
    } catch (error) {
      console.error("Erreur lors de l'ajout du stock :", error);
    }
  };

  // Gérer la suppression d'un stock
  const handleDeleteStock = async (id) => {
    try {
      const token = localStorage.getItem('token');

      await axios.delete(`http://127.0.0.1:8000/api/stocks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStocks();
    } catch (error) {
      console.error('Erreur lors de la suppression du stock :', error);
    }
  };

  const handleEditClick = (stock) => {
    setEditId(stock.id);
    setEditName(stock.name);
    setEditQuantity(stock.quantity);
    setEditStatus(stock.status);
    setOpenPopup(true);
  };

  // Gérer la mise à jour d'un stock
  const editStock = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      await axios.put(
        `http://127.0.0.1:8000/api/stocks/${editId}`,
        {
          name: editName,
          quantity: editQuantity,
          status: editStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchStocks();
      setOpenPopup(false);
      setEditId(null);
      setEditName('');
      setEditQuantity('');
      setEditStatus('');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du stock :', error);
    }
  };

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-6 md:p-10">
      <Navigation />
      <div className="w-full max-w-sm md:max-w-3xl mt-24 flex justify-center">
        <Card className={`w-[380px] ${className}`} {...props}>
          <CardHeader>
            <CardTitle>Welcome to Your Dashboard</CardTitle>
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

            {/* Tableau des stocks */}
            <div className="mt-4">
              <Table>
                <TableCaption>Liste de vos stocks.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stocks.map((stock) => (
                    <TableRow key={stock.id}>
                      <TableCell className="font-medium">
                        {stock.name}
                      </TableCell>
                      <TableCell>{stock.quantity}</TableCell>
                      <TableCell>{stock.status}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleDeleteStock(stock.id)}>
                          <MdDelete />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => handleEditClick(stock)}>
                          <FaEdit />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => setOpenAddPopup(true)}>
              Add
            </Button>
          </CardFooter>
          <CardFooter>
            <Button className="w-full" onClick={handleLogout}>
              Logout
            </Button>
          </CardFooter>
        </Card>
      </div>

      {openPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">Edit Stock</h2>
            <form onSubmit={editStock} className="flex flex-col gap-4">
              <input
                type="text"
                className="py-2 px-4 border rounded-lg"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <input
                type="number"
                className="py-2 px-4 border rounded-lg"
                value={editQuantity}
                onChange={(e) => setEditQuantity(e.target.value)}
              />
              <input
                className="py-2 px-4 border rounded-lg"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                  onClick={() => setOpenPopup(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {openAddPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 mt-20">
          <div className="bg-white p-6 rounded-xl shadow-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">Add New Stock</h2>
            <form onSubmit={handleAddStock} className="flex flex-col gap-4">
              <input
                type="text"
                className="py-2 px-4 border rounded-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Stock Name"
              />
              <input
                type="number"
                className="py-2 px-4 border rounded-lg"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Quantity"
              />
              <input
                type="text"
                className="py-2 px-4 border rounded-lg"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="Status"
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                  onClick={() => setOpenAddPopup(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import axios from 'axios';
import { IoIosAddCircle } from 'react-icons/io';

// Composant principal pour afficher les stocks
const Table = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [openAddPopup, setOpenAddPopup] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [status, setStatus] = useState('');
  const [localStocks, setLocalStocks] = useState([]); // Initialiser avec un tableau vide

  useEffect(() => {
    fetchStocks(); // Chargement initial des stocks
  }, []);

  const fetchStocks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/stocks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLocalStocks(response.data); // Mettre à jour l'état des stocks locaux
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
      await fetchStocks(); // Attendre la récupération des stocks
      setOpenAddPopup(false);
      resetAddStockFields();
    } catch (error) {
      console.error("Erreur lors de l'ajout du stock :", error);
    }
  };

  const resetAddStockFields = () => {
    setName('');
    setQuantity('');
    setStatus('');
  };

  // Gérer la suppression d'un stock
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');

      await axios.delete(`http://127.0.0.1:8000/api/stocks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchStocks(); // Attendre la récupération des stocks
    } catch (error) {
      console.error('Erreur lors de la suppression du stock :', error);
    }
  };

  // Gérer l'édition d'un stock
  const handleEdit = (stock) => {
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

      await fetchStocks(); // Attendre la récupération des stocks
      setOpenPopup(false);
      resetEditStockFields();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du stock :', error);
    }
  };

  const resetEditStockFields = () => {
    setEditId(null);
    setEditName('');
    setEditQuantity('');
    setEditStatus('');
  };

  return (
    <div className="mt-4 w-full">
      <div className="overflow-x-auto rounded-2xl -mt-39">
        <div className="mb-4 flex items-center justify-between">
          <Button className="w-full" onClick={() => setOpenAddPopup(true)}>
            <IoIosAddCircle size={19} />
          </Button>
        </div>
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <TableHeader />
          <TableBody
            stocks={localStocks}
            handleDeleteStock={handleDelete}
            handleEditClick={handleEdit}
          />
        </table>
      </div>

      {/* Popup pour éditer un stock */}
      {openPopup && (
        <Popup
          title="Edit Stock"
          onSubmit={editStock}
          onCancel={() => setOpenPopup(false)}
          fields={[
            { label: 'Name', value: editName, setter: setEditName },
            {
              label: 'Quantity',
              type: 'number',
              value: editQuantity,
              setter: setEditQuantity,
            },
            { label: 'Status', value: editStatus, setter: setEditStatus },
          ]}
        />
      )}

      {/* Popup pour ajouter un stock */}
      {openAddPopup && (
        <Popup
          title="Add New Stock"
          onSubmit={handleAddStock}
          onCancel={() => setOpenAddPopup(false)}
          fields={[
            { label: 'Name', value: name, setter: setName },
            {
              label: 'Quantity',
              type: 'number',
              value: quantity,
              setter: setQuantity,
            },
            { label: 'Status', value: status, setter: setStatus },
          ]}
        />
      )}
    </div>
  );
};

// Composant pour l'en-tête du tableau
const TableHeader = () => {
  return (
    <thead>
      <tr className="bg-gray-200 text-sm font-normal text-stone-500">
        <th className="text-start p-4 border border-gray-300">Name</th>
        <th className="text-start p-4 border border-gray-300">Quantity</th>
        <th className="text-start p-4 border border-gray-300">Status</th>
        <th className="text-start p-4 border border-gray-300">Action</th>
      </tr>
    </thead>
  );
};

// Composant pour le corps du tableau
const TableBody = ({ stocks, handleDeleteStock, handleEditClick }) => {
  return (
    <tbody>
      {stocks.map((stock, index) => (
        <TableRow
          key={stock.id}
          stock={stock}
          handleDeleteStock={handleDeleteStock}
          handleEditClick={handleEditClick}
          isEven={index % 2 === 0} // Pour appliquer le style d'alternance
        />
      ))}
    </tbody>
  );
};

// Composant pour chaque ligne du tableau
const TableRow = ({ stock, handleDeleteStock, handleEditClick }) => {
  return (
    <tr className="text-sm bg-white hover:bg-gray-100">
      <td className="p-4 border border-gray-300 text-center">{stock.name}</td>
      <td className="p-4 border border-gray-300 text-center">
        {stock.quantity}
      </td>
      <td className="p-4 border border-gray-300 text-center">{stock.status}</td>
      <td className="p-4 border border-gray-300 flex gap-2 justify-center items-center">
        <Button onClick={() => handleDeleteStock(stock.id)}>
          <MdDelete size={19} />
        </Button>
        <Button onClick={() => handleEditClick(stock)}>
          <FaEdit size={19} />
        </Button>
      </td>
    </tr>
  );
};

// Composant bouton générique
const Button = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="text-violet-600 hover:bg-stone-200 transition-colors rounded p-2"
    >
      {children}
    </button>
  );
};

// Composant pour les popups
const Popup = ({ title, onSubmit, onCancel, fields }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-cyan-950">
      <div className="bg-white p-6 rounded-xl shadow-lg w-1/3 backdrop-blur-xl relative z-10">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {fields.map(({ label, value, setter, type = 'text' }, index) => (
            <div key={index}>
              <label className="block mb-1">{label}</label>
              <input
                type={type}
                className="py-2 px-4 border rounded-lg w-full"
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={label}
              />
            </div>
          ))}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded-lg"
              onClick={onCancel}
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
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>{' '}
      {/* Couche d'arrière-plan translucide */}
    </div>
  );
};

export default Table;

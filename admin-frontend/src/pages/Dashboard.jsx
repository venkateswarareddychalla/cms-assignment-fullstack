import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Edit, Trash2, Plus } from 'lucide-react';

const Dashboard = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPages = async () => {
    try {
      const res = await api.get('/content');
      setPages(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      try {
        await api.delete(`/content/${id}`);
        fetchPages();
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) return <div>Loading pages...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
        <Link to="/pages/new" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Page
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {pages.length === 0 ? (
            <li className="px-6 py-4 text-gray-500 text-center">No pages found. Create one!</li>
          ) : (
            pages.map((page) => (
              <li key={page._id}>
                <div className="px-4 py-4 flex items-center justify-between sm:px-6 hover:bg-gray-50">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-blue-600 truncate">{page.title}</p>
                    <p className="mt-2 flex items-center text-sm text-gray-500">
                      /{page.slug}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/pages/edit/${page._id}`} className="p-2 text-gray-400 hover:text-blue-500">
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button onClick={() => handleDelete(page._id)} className="p-2 text-gray-400 hover:text-red-500">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

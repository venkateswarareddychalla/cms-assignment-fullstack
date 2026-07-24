import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuth } from './store/slices/authSlice';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PageEditor from './pages/PageEditor';
import Sidebar from './components/Sidebar';
import { useUI } from './context/UIContext';
import { Menu } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AdminLayout = ({ children }) => {
  const { sidebarOpen, toggleSidebar } = useUI();
  
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white shadow-sm ring-1 ring-black ring-opacity-5 h-16 flex items-center px-4 justify-between">
          <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-100 text-gray-500">
            <Menu className="w-6 h-6" />
          </button>
          <div className="font-semibold text-gray-700">CMS Admin</div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/pages/new" element={<PageEditor />} />
                <Route path="/pages/edit/:id" element={<PageEditor />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;

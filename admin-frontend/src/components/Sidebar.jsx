import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { LayoutDashboard, FileText, LogOut } from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const dispatch = useDispatch();

  return (
    <div className={`${isOpen ? 'w-64' : 'w-0'} transition-all duration-300 ease-in-out bg-gray-900 text-white flex flex-col`}>
      <div className="h-16 flex items-center px-6 font-bold text-xl border-b border-gray-800 whitespace-nowrap overflow-hidden">
        CMS Panel
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboard
          </NavLink>
          <NavLink
            to="/pages/new"
            className={({ isActive }) =>
              `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <FileText className="mr-3 h-5 w-5" />
            New Page
          </NavLink>
        </nav>
      </div>
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => dispatch(logout())}
          className="flex items-center w-full px-2 py-2 text-sm font-medium rounded-md text-red-400 hover:bg-gray-800 hover:text-red-300"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

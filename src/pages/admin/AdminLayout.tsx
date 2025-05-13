import React, { useState } from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LayoutDashboard, Layers, Tag, FileType, Menu, X } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAdmin } = useAuthStore();
  const location = useLocation();
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  const navItems = [
    {
      title: 'Dashboard',
      path: '/admin',
      icon: <LayoutDashboard size={20} />,
      exact: true
    },
    {
      title: 'Prompts',
      path: '/admin/prompts',
      icon: <Layers size={20} />
    },
    {
      title: 'Nichos',
      path: '/admin/niches',
      icon: <Tag size={20} />
    },
    {
      title: 'Áreas & Tipos',
      path: '/admin/categories',
      icon: <FileType size={20} />
    }
  ];
  
  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-20 left-4 z-30">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-md"
          aria-label="Toggle Sidebar"
        >
          <Menu size={24} />
        </button>
      </div>
      
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold font-barlow text-gray-800 dark:text-white">
            Admin Dashboard
          </h2>
          <button
            onClick={closeSidebar}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
            aria-label="Close Sidebar"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="mt-6">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={closeSidebar}
                  className={`flex items-center px-6 py-3 text-gray-700 dark:text-gray-200 transition-colors ${
                    isActive(item.path, item.exact) 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-400 border-r-4 border-blue-900 dark:border-blue-400' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <main className="flex-1 overflow-y-auto pt-20 pb-20">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
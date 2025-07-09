import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Code, User, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-40 font-sans">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center">
            <a href="/dashboard" className="flex items-center space-x-2 sm:space-x-3 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:from-blue-600 group-hover:to-indigo-700 transition-all duration-200">
                <Code className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  CodeCollab
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Collaborative Coding</p>
              </div>
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-3 sm:space-x-4">
            {user ? (
              <>
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 sm:space-x-3 p-1 sm:p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <div className="hidden lg:block text-left">
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-50 animate-fadeIn">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </div>
                      <a
                        href="/dashboard"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Code className="w-4 h-4" />
                        <span>Dashboard</span>
                      </a>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <a
                  href="/login"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-1 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {showMobileMenu ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg animate-fadeIn">
          <div className="px-4 py-3 space-y-3">
            {user ? (
              <>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.username}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <a
                    href="/dashboard"
                    className="flex items-center space-x-3 p-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Code className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Dashboard</span>
                  </a>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full text-left p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <a
                  href="/login"
                  className="block w-full text-center px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="block w-full text-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-lg transition-all duration-200"
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-30 md:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {showUserMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
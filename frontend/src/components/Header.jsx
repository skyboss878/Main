// src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react'; // ADDED useState
import { Link, NavLink, useNavigate } from 'react-router-dom'; // ADDED NavLink
import { useAuth } from '../contexts/AuthContext'; // Correct path to AuthContext

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false); // Declared useState for profileOpen

  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Nav link styles with active highlight
  const activeClass = 'text-purple-400 font-semibold';

  return (
    <header className="bg-gray-900 bg-opacity-30 backdrop-blur-lg sticky top-0 z-50 text-white">
      <nav
        className="container mx-auto flex items-center justify-between p-4"
        aria-label="Primary Navigation"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" aria-label="Go to homepage">
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            ✨ AI Marketing Creator
          </span>
        </Link>

        {/* Hamburger for mobile */}
        <button
          onClick={toggleMenu}
          className="sm:hidden p-2 rounded-md hover:bg-gray-700"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              // Close icon
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              // Hamburger icon
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Links and Profile for Desktop/Tablet */}
        <div
          className={`${
            menuOpen ? 'block absolute top-full left-0 w-full bg-gray-900 bg-opacity-90 py-4 shadow-lg sm:relative sm:top-auto sm:left-auto sm:w-auto sm:bg-transparent sm:py-0 sm:shadow-none' : 'hidden'
          } sm:flex sm:items-center sm:gap-6 text-sm font-medium flex-col sm:flex-row space-y-4 sm:space-y-0`}
        >
          {/* Common Links (visible always or based on general state) */}
          <NavLink
            to="/pricing" // Link to the new pricing page
            className={({ isActive }) =>
              isActive ? activeClass : 'hover:text-purple-300 transition-colors'
            }
            onClick={() => setMenuOpen(false)}
          >
            Pricing
          </NavLink>
          {/* Add more common links here if needed */}

          {isAuthenticated ? (
            <>
              <span className="hidden sm:block text-gray-300">Welcome, {user?.username || 'Creator'}!</span> {/* Corrected user.name to user.username */}

              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? activeClass : 'hover:text-purple-300 transition-colors'
                }
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </NavLink>

              {/* Profile dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((open) => !open)}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700 transition-colors" // Added className for the button
                >
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-600 text-white font-bold">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </span> {/* Corrected user.name to user.username */}
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      profileOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {profileOpen && (
                  <ul
                    role="menu"
                    className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-md shadow-lg py-1 text-sm z-50 origin-top-right transform scale-y-100 transition-transform duration-200 ease-out"
                  >
                    <li>
                      <Link
                        to="/settings"
                        role="menuitem"
                        className="block px-4 py-2 hover:bg-gray-700"
                        onClick={() => {
                          setProfileOpen(false);
                          setMenuOpen(false);
                        }}
                      >
                        Settings
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        role="menuitem"
                        className="w-full text-left px-4 py-2 hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
              {/* Display Credits */}
              {user?.credits !== undefined && (
                <span className="text-lg font-semibold text-green-400 sm:ml-4">
                    Credits: {user.credits}
                </span>
              )}
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? activeClass : 'hover:text-purple-300 transition-colors'
                }
                onClick={() => setMenuOpen(false)}
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-lg font-semibold transition-transform'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 py-2 rounded-lg font-semibold transition-transform'
                }
                onClick={() => setMenuOpen(false)}
              >
                Get Started
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;

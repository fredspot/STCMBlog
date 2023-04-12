import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import Search from './Search';

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const closeMenu = () => {
      setMenuOpen(false);
    };

    if (menuOpen) {
      document.addEventListener('click', closeMenu);
    } else {
      document.removeEventListener('click', closeMenu);
    }

    return () => {
      document.removeEventListener('click', closeMenu);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark large-navbar">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          <img src="logo.png" alt="Logo" className="d-inline-block align-text-top me-2" />
        </NavLink>
        <Search />
        <div className="menu-container" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="menu-dot"></div>
          <div className="menu-dot"></div>
          <div className="menu-dot"></div>
        </div>
        {menuOpen && (
          <div className="menu-dropdown">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="/create-article" exact>
                  Create Article
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/about" exact>
                  About
                </NavLink>
              </li>
              <li className="nav-item">
                {isLoggedIn ? (
                  <NavLink className="nav-link" to="/" onClick={handleLogout} exact>
                    Logout
                  </NavLink>
                ) : (
                  <NavLink className="nav-link" to="/login" exact>
                    Login
                  </NavLink>
                )}
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

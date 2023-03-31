import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark large-navbar">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          <img src="logo.png" alt="Logo" className="d-inline-block align-text-top me-2" />
        </NavLink>
        <div className="menu-container" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="menu-dot"></div>
          <div className="menu-dot"></div>
          <div className="menu-dot"></div>
        </div>
        {menuOpen && (
          <div className="menu-dropdown">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="#" exact>
                  Link
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/create-article" exact>
                  Create Article
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="#" exact>
                  Link
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );  
};

export default NavBar;

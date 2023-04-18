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
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-dark"
      style={{ height: "70px", fontSize: "1.25rem", backgroundColor: "#343a40" }}
    >
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          <img
            src="/logo.png"
            alt="Logo"
            className="d-inline-block align-text-top"
            style={{ height: "40px", width: "auto", marginRight: "8px" }}
          />
        </NavLink>
        <Search />
        <div
          className="menu-container"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "30px",
            cursor: "pointer",
            position: "relative",
            marginRight: "16px",
          }}
        >
          <div
            className="menu-dot"
            style={{ width: "5px", height: "5px", backgroundColor: "#fff", borderRadius: "50%" }}
          ></div>
          <div
            className="menu-dot"
            style={{ width: "5px", height: "5px", backgroundColor: "#fff", borderRadius: "50%" }}
          ></div>
          <div
            className="menu-dot"
            style={{ width: "5px", height: "5px", backgroundColor: "#fff", borderRadius: "50%" }}
          ></div>
        </div>
        {menuOpen && (
          <div
            className="menu-dropdown"
            style={{
              position: "absolute",
              right: "20px",
              top: "70px",
              backgroundColor: "#343a40",
              borderRadius: "5px",
              padding: "10px",
              zIndex: 999,
            }}
          >
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/create-article"
                  exact
                  style={{ color: "white" }}
                  onMouseEnter={(e) => (e.target.style.color = "#ccc")}
                  onMouseLeave={(e) => (e.target.style.color = "white")}
                >
                  Create Article
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/about"
                  exact
                  style={{ color: "white" }}
                  onMouseEnter={(e) => (e.target.style.color = "#ccc")}
                  onMouseLeave={(e) => (e.target.style.color = "white")}
                >
                  About
                </NavLink>
              </li>
              <li className="nav-item">
                {isLoggedIn ? (
                  <NavLink
                    className="nav-link"
                    to="/"
                    onClick={handleLogout}
                    exact
                    style={{ color: "white" }}
                    onMouseEnter={(e) => (e.target.style.color = "#ccc")}
                    onMouseLeave={(e) => (e.target.style.color = "white")}
                  >
                    Logout
                  </NavLink>
                ) : (
                  <NavLink
                    className="nav-link"
                    to="/login"
                    exact
                    style={{ color: "white" }}
                    onMouseEnter={(e) => (e.target.style.color = "#ccc")}
                    onMouseLeave={(e) => (e.target.style.color = "white")}
                  >
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

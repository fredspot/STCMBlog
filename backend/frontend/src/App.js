import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, Outlet } from 'react-router-dom';
import Article from './Article';
import CreateArticle from './CreateArticle';
import NavBar from './NavBar'; // Add this import
import { useParams } from 'react-router-dom';

const App = () => {
  const [latestIds, setLatestIds] = useState([]);
  const ArticleWrapper = () => {
    const { id } = useParams();
    return <Article id={id} />;
  };

  useEffect(() => {
    const fetchLatestIds = async () => {
      const response = await fetch('http://localhost:8080/api/articles/latest?count=10');
      const data = await response.json();
      setLatestIds(data);
    };
    fetchLatestIds();
  }, []);

  return (
    <Router>
      <NavBar /> {/* Add the Navbar component */}
      <div>
        {/* The existing navigation links are already present in the index.html file, so you don't need to repeat them here. */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<div>{latestIds.map(id => <Article key={id} id={id} />)}</div>} />
            <Route path="/article/:id" element={<ArticleWrapper />} />
            <Route path="/create-article" element={<CreateArticle />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
